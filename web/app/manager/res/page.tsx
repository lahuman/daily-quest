"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { MemberVo } from "../../member/MemberVo";
import { client } from "../../todo/fetchHelper";
import { MemberReqVo } from "../MemberReqVo";
import { TABS } from "../constants";
import Link from "next/link";

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

      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <Link
              href="/manager/req"
              className={`inline-block p-4 border-b-2 ${
                tab === TABS.REQ
                  ? "text-blue-600  border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                  : "border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              요청내역
            </Link>
          </li>
          <li className="me-2">
            <a
              href="#"
              className={`inline-block p-4 border-b-2 ${
                tab === TABS.RES
                  ? "text-blue-600  border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                  : "border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              응답내역
            </a>
          </li>
          {/**
           <li>
            <a className="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">Disabled</a>
          </li>
             */}
        </ul>
      </div>

      <div className="justify-center h-screen  ">
        <div className="w-full px-4 py-8 mx-auto shadow lg:w-1/3">
          <ul className="list-reset">
            {list &&
              list.map((myReq, idx) => (
                <li
                  key={idx}
                  className="relative flex items-center justify-between px-2 py-6 border-b"
                >
                  <span className="w-5/12 mr-1 px-2 py-3">
                    {myReq.acceptYn !== "Y" ? myReq.email : myReq.userEmail}
                  </span>
                  {(myReq.acceptYn !== "Y" && (
                    <>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={(e) =>
                          updateMemberReq({ ...myReq, acceptYn: "Y" })
                        }
                      >
                        승인
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={(e) =>
                          updateMemberReq({ ...myReq, acceptYn: "N" })
                        }
                      >
                        반려
                      </button>
                    </>
                  )) || (
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={(e) => deleteMember(myReq)}
                    >
                      삭제
                    </button>
                  )}
                </li>
              ))}
            {list && list.length === 0 && (
              <span className="text-gray-400">내역이 없습니다.</span>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
