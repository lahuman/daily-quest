"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { MemberVo } from "../../member/MemberVo";
import { client } from "../../todo/fetchHelper";
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
  const [tab, setTab] = useState<TABS>(TABS.RES);
  const [list, setList] = useState<MemberReqVo[] | undefined>();

  function getManagerReqList() {
    setLoading(true);
    client("/member/res").then((data) => {
      setList(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    getManagerReqList();
  }, []);

  function updateMemberReq(memberReqVo: MemberReqVo) {
    if (
      confirm(
        (memberReqVo.acceptYn === "Y" &&
          "요청을 수락시 회원 메뉴에서 관리합니다.\n수락하시나요?") ||
          "반려시 목록에서 삭제됩니다.\n반려하시나요?"
      )
    ) {
      setLoading(true);
      client("/member/req", {
        method: "PUT",
        body: {
          ...memberReqVo,
        },
      })
        .then((r) => {})
        .catch((e) => {
          alert("오류가 발생했습니다. 관리자에게 문의해주세요\n" + e.error);
        })
        .finally(() => {
          setLoading(false);
          setTimeout(() => getManagerReqList(), 300);
        });
    }
  }

  function deleteMember(memberReqVo: MemberReqVo) {
    if (confirm(`${memberReqVo.userEmail}님의 관리를 그만 두시겠습니까?`)) {
      setLoading(true);
      client(`/member/res/${memberReqVo.seq}`, {
        method: "DELETE",
      })
        .then((r) => {})
        .catch((e) => {
          alert("오류가 발생했습니다. 관리자에게 문의해주세요\n" + e.error);
        })
        .finally(() => {
          setLoading(false);
          setTimeout(() => getManagerReqList(), 300);
        });
    }
  }

  return (
    <>
      {loading && <Loading />}
      <ManagerContainer>
        <TabContainer>
          <ul className="flex border-b">
            <li className="mr-2">
              <Link href="/manager/req" className="inline-block p-4 border-b-2 border-transparent hover:text-gray-600">
                요청내역
              </Link>
            </li>
            <li className="mr-2">
              <a href="#" className={`inline-block p-4 border-b-2 ${
                tab === TABS.RES ? "text-indigo-600 border-indigo-600" : "border-transparent"
              }`}>
                응답내역
              </a>
            </li>
          </ul>
        </TabContainer>

        <div className="space-y-3">
          {list?.map((myReq, idx) => (
            <ManagerItem key={idx}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="flex-1 text-gray-700">{myReq.userEmail}</span>
                <div className="flex gap-2">
                  {myReq.acceptYn !== "Y" ? (
                    <>
                      <button 
                        onClick={() => updateMemberReq({ ...myReq, acceptYn: "Y" })}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        승인
                      </button>
                      <button 
                        onClick={() => updateMemberReq({ ...myReq, acceptYn: "N" })}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        반려
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => deleteMember(myReq)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      삭제
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
