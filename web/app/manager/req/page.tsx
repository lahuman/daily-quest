"use client";

import { useEffect, useState } from "react";
import { MemberVo } from "../../member/MemberVo";
import { client } from "../../todo/fetchHelper";
import Loading from "@/components/Loading";
import { MemberReqVo } from "../MemberReqVo";
import { TABS } from "../constants";
import Link from "next/link";
import styled from "styled-components";

const ManagerContainer = styled.div`
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

const TabContainer = styled.div`
  margin-bottom: 2rem;
`;

const InputSection = styled.div`
  background: #f3f4f6;
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const ManagerItem = styled.div`
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
  const [tab, setTab] = useState<TABS>(TABS.REQ);
  const [color, setColor] = useState("#000000");
  const [list, setList] = useState<MemberReqVo[] | undefined>();

  function getManagerReqList() {
    setLoading(true);
    client("/member/req").then((data) => {
      setList(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    getManagerReqList();
  }, []);



  function updateName(req: MemberReqVo) {
    if (req.managerName?.trim() === "") {
      alert("이름을 입력해주세요.");
      return;
    }
    setLoading(true);

    client(`/member/req/${req.seq}`, {
      method: "PUT",
      body: {
        name: req.managerName,
      },
    })
      .catch((e) => {
        alert("오류가 발생했습니다. 관리자에게 문의해주세요\n" + e.error);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => getManagerReqList(), 300);
      });

  }
  function requestManager() {
    if (name.trim() === "") {
      alert("이메일을 입력해주세요.");
      return;
    }
    setLoading(true);
    client(`/user/searchEmail?email=${name}`, {
      method: "GET",
    })
      .then((r) => {
        client(`/member/req`, {
          method: "POST",
          body: {
            managerSeq: r.seq,
          },
        })
          .then((r2) => {
            setName("");
          })
          .catch((e) => {
            alert("오류가 발생했습니다. 관리자에게 문의해주세요\n" + e.error);
          });
      })
      .catch((e) => {
        alert("오류가 발생했습니다. 관리자에게 문의해주세요\n" + e.error);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => getManagerReqList(), 300);
      });
  }

  function deleteMember(memberVo: MemberReqVo) {
    if (
      confirm(
        "요청을 취소 하겠습니까?"
      )
    ) {
      setLoading(true);
      client(`/member/req/${memberVo.seq}`, {
        method: "DELETE",
        body: {
          ...memberVo,
        },
      })
        .then((r) => { })
        .catch((e) => {
          alert("오류가 발생했습니다. 관리자에게 문의해주세요\n" + e.error);
        })
        .finally(() => {
          setLoading(false);
          setTimeout(() => getManagerReqList(), 300);
        });
    }
  }

  const handleListChange = (index: number, memberVo: MemberReqVo) => {
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
      <ManagerContainer>
        <TabContainer>
          <ul className="flex border-b">
            <li className="mr-2">
              <a href="#" className={`inline-block p-4 border-b-2 ${
                tab === TABS.REQ ? "text-indigo-600 border-indigo-600" : "border-transparent"
              }`}>
                요청내역
              </a>
            </li>
            <li className="mr-2">
              <Link href="/manager/res" className="inline-block p-4 border-b-2 border-transparent hover:text-gray-600">
                응답내역
              </Link>
            </li>
          </ul>
        </TabContainer>

        <InputSection>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && name.trim() !== "") {
                  e.preventDefault();
                  requestManager();
                }
              }}
              placeholder="이메일을 입력하세요"
              className="flex-1 px-4 py-2 rounded-lg bg-white border-0 focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={requestManager}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              등록
            </button>
          </div>
        </InputSection>

        <div className="space-y-3">
          {list?.map((myReq, idx) => (
            <ManagerItem key={idx}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex-1">
                  {myReq.acceptYn === "Y" && (
                    <input
                      type="text"
                      value={myReq.managerName}
                      onChange={e => handleListChange(idx, { ...myReq, managerName: e.target.value })}
                      className="w-full px-3 py-2 mb-2 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                  <span className="text-sm text-gray-500">{myReq.email}</span>
                </div>
                <div className="flex gap-2">
                  {myReq.acceptYn === "N" ? (
                    <>
                      <span className="text-sm font-medium text-gray-500 mr-2">요청중</span>
                      <button 
                        onClick={() => deleteMember(myReq)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => updateName(myReq)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      수정
                    </button>
                  )}
                </div>
              </div>
            </ManagerItem>
          ))}
          {list && list.length === 0 && (
            <div className="text-center text-gray-500">내역이 없습니다.</div>
          )}
        </div>
      </ManagerContainer>
    </>
  );
}
