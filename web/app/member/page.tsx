"use client";

import { useEffect, useState } from "react";
import { MemberVo } from "./MemberVo";
import { client } from "../todo/fetchHelper";
import Loading from "@/components/Loading";
import { BlockPicker } from "react-color";
import { useAuth } from "@/contexts/AuthContext";
import styled from "styled-components";

const MemberContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  
  @media (min-width: 768px) {
    max-width: 480px;
    padding: 2rem;
  }
`;

const MemberInput = styled.div`
  background: #f3f4f6;
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const MemberItem = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
`;

export default function Member() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [showColor, setShowColor] = useState(false);
  const [list, setList] = useState<MemberVo[] | undefined>();
  const { currentUser } = useAuth();

  function getMemberList() {
    setLoading(true);
    client("/member").then((data) => {
      setList(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    getMemberList();
  }, []);

  function saveMember() {
    if (name.trim() === "") {
      alert("내용을 입력하세요.");
      return;
    }
    setLoading(true);
    client("/member", {
      method: "POST",
      body: {
        name,
        color,
      },
    })
      .then((r) => {
        setName("");
      })
      .catch((e) => {
        alert("오류가 발생했습니다. 관리자에게 문의해주세요\n" + e.error);
      }).finally(() => {
        setLoading(false);
        setTimeout(() => getMemberList(), 300);
      });
  }

  function updateMember(memberVo: MemberVo) {
    if (
      confirm(
        "이름과 색상을 변경하면, TODO 목록에 반영됩니다.\n변경하시겠습니까?"
      )
    ) {
      setLoading(true);
      client("/member", {
        method: "PUT",
        body: {
          ...memberVo,
        },
      })
        .then((r) => {
        })
        .catch((e) => {
          alert("오류가 발생했습니다. 관리자에게 문의해주세요\n" + e.error);
        }).finally(() => {
          setLoading(false);
          setTimeout(() => getMemberList(), 300);
        });
    }
  }

  function deleteMember(memberVo: MemberVo) {
    if (
      confirm(
        "삭제하시면, 기존 todo의 멤버만 삭제 됩니다.\n삭제하시겠습니까?"
      )
    ) {
      setLoading(true);
      client("/member", {
        method: "DELETE",
        body: {
          ...memberVo,
        },
      })
        .then((r) => {
        })
        .catch((e) => {
          alert("오류가 발생했습니다. 관리자에게 문의해주세요\n" + e.error);
        }).finally(() => {
          setLoading(false);
          setTimeout(() => getMemberList(), 300);
        });
    }
  }

  const handleListChange = (index: number, memberVo: MemberVo) => {
    if (list) {
      const updatedValues = [...list];
      updatedValues[index] = memberVo;
      setList(updatedValues);
    }
  };

  function numberWithCommas(x: number) {
    return (
      (x && x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")) || 0
    );
  }

  return (
    <>
      {loading && <Loading />}
      <MemberContainer>
        <MemberInput>
          <div className="flex flex-col items-start gap-3">
            <div
              className="cursor-pointer rounded-lg w-10 h-10 flex-shrink-0"
              style={{ backgroundColor: color }}
              onClick={(e) => setShowColor(true)}
            >
              {showColor && (
                <div className="absolute z-10">
                  <BlockPicker
                    color={color}
                    onChangeComplete={(e) => {
                      setColor(e.hex);
                      setShowColor(false);
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-row items-end gap-3">
              <input
                value={name}
                style={{ color: color }}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing && name.trim() !== "") {
                    e.preventDefault();
                    saveMember();
                  }
                }}
                placeholder="이름을 입력하세요"
                className="flex-1 px-4 py-2 rounded-lg bg-white border-0 focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={saveMember}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
              >
                등록
              </button>
            </div>
          </div>
        </MemberInput>

        <div className="space-y-3">
          {list && list.length === 0 && (
            <div className="text-center text-gray-500">내역이 없습니다.</div>
          )}
          {list?.map((member, idx) => (
            <MemberItem key={idx}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div
                  className="cursor-pointer rounded-lg w-8 h-8 flex-shrink-0"
                  style={{ backgroundColor: member.color }}
                  onClick={() => handleListChange(idx, { ...member, showColor: true })}
                >
                  {member.showColor && (
                    <div className="absolute z-10">
                      <BlockPicker
                        color={member.color}
                        onChangeComplete={(e) => {
                          handleListChange(idx, {
                            ...member,
                            color: e.hex,
                            showColor: false,
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  className="w-full sm:w-auto flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                  value={member.name}
                  style={{ color: member.color }}
                  onChange={(e) => handleListChange(idx, { ...member, name: e.target.value })}
                />
                <span className={`whitespace-nowrap text-sm font-medium ${
                  member.totalPoint === 0 ? 'text-gray-500' :
                  member.totalPoint > 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {numberWithCommas(member.totalPoint)} pts
                </span>
                <button 
                  onClick={() => updateMember(member)}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  수정
                </button>
              </div>
              {currentUser && member?.user?.email !== currentUser.email && (
                <div className="mt-2 text-sm text-gray-500">
                  {member?.user?.email}
                </div>
              )}
            </MemberItem>
          ))}
        </div>
      </MemberContainer>
    </>
  );
}
