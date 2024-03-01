"use client";

import { useEffect, useState } from "react";
import { MemberVo } from "../../member/MemberVo";
import { client } from "../../todo/fetchHelper";
import Loading from "@/components/Loading";
import { MemberReqVo } from "../MemberReqVo";
import { TABS } from "../constants";
import Link from "next/link";

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

      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <a
              href="#"
              className={`inline-block p-4 border-b-2 ${tab === TABS.REQ
                ? "text-blue-600  border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                : "border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
            >
              요청내역
            </a>
          </li>
          <li className="me-2">
            <Link
              href="/manager/res"
              className={`inline-block p-4 border-b-2 ${tab === TABS.RES
                ? "text-blue-600  border-blue-600 runded-t-lg active dark:text-blue-500 dark:border-blue-500"
                : "border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
            >
              응답내역
            </Link>
          </li>
        </ul>
      </div>

      <div className="justify-center h-screen  ">
        <div className="w-full px-4 py-8 mx-auto shadow lg:w-1/3">
          <div className="flex items-center justify-center border-dashed border-2 border-indigo-600 p-1">
            <form className="w-9/12 pr-3">
              <input
                value={name}
                style={{ color: color }}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    e.nativeEvent.isComposing === false &&
                    name.trim() !== ""
                  ) {
                    e.preventDefault();
                    requestManager();
                  }
                }}
                type="search"
                placeholder="이메일을 입력하세요."
                className="w-full px-2 py-3 border rounded outline-none border-grey-600"
              />
            </form>
            <button className="w-3/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={e => requestManager()}>
              등록
            </button>
          </div>
          <hr className="mt-5" />
          <ul className="list-reset">
            {list &&
              list.map((myReq, idx) => (
                <li
                  key={idx}
                  className="relative flex items-center justify-between px-2 py-6 border-b"
                >
                  <div className="w-5/12 mr-1 leading-3	">
                    {myReq.acceptYn === "Y" && <><input
                      type="text"
                      value={myReq.managerName}
                      onChange={e => handleListChange(idx, { ...myReq, managerName: e.target.value })}
                      className={`px-1 py-1 border rounded outline-none border-grey-600 w-full`}
                    /> <br /></>}
                    <span className="text-xs mr-1">{myReq.email}</span>
                  </div>
                  <div className="w-4/12 flex items-center justify-between">
                    {myReq.acceptYn === "N" && (
                      <><span className="text-xs mr-1 font-semibold">요청중</span>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={e => deleteMember(myReq)}>
                          취소
                        </button></>
                    )}
                    {myReq.acceptYn === "Y" && (
                      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={e => updateName(myReq)}>
                        수정
                      </button>
                    )}
                  </div>
                </li>
              ))}
            {list && list.length === 0 && <span className="text-gray-400">내역이 없습니다.</span>}
          </ul>
        </div>
      </div>
    </>
  );
}
