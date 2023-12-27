"use client";

import { useEffect, useState } from "react";
import Loadding from "@/components/Loadding";
import { BlockPicker } from "react-color";
import { MemberVo } from "../../member/MemberVo";
import { client } from "../../todo/fetchHelper";
import { MemberReqVo } from "../MemberReqVo";
import { TABS } from "../constants";
import Link from "next/link";

export default function Member() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const [tab, setTab] = useState<TABS>(TABS.RES);
  const [color, setColor] = useState("#000000");
  const [showColor, setShowColor] = useState(false);
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
        "If you update a member name, todo also update. Do you want update member?"
      )
    ) {
      setLoading(true);
      client("/member/req", {
        method: "PUT",
        body: {
          ...memberReqVo,
        },
      })
        .then((r) => {
        })
        .catch((e) => {
          alert("오류가 발생했습니다. 관리자에게 문의해주세요\n"+e.message);
        }).finally(() => {
          setLoading(false);
          setTimeout(() => getManagerReqList(), 300);
        });
    }
  }

  function deleteMember(memberVo: MemberVo) {
    if (
      confirm(
        "If you delete a member, todo is retained. Do you want remove member?"
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
          alert("오류가 발생했습니다. 관리자에게 문의해주세요\n"+e.message);
        }).finally(() => {
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
  console.log(tab === TABS.REQ ? 'border-blue-500' : 'text-gray-300')
  return (
    <>
      {loading && <Loadding />}

      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <Link href="/manager/req" className={`inline-block p-4 border-b-2 ${tab === TABS.REQ ? 'text-blue-600  border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>요청내역</Link>
          </li>
          <li className="me-2">
            <a href="#" className={`inline-block p-4 border-b-2 ${tab === TABS.RES ? 'text-blue-600  border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>대기내역</a>
          </li>
          {
            /**
           <li>
            <a className="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">Disabled</a>
          </li>
             */
          }

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
                    {myReq.email}
                  </span>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={e => updateMemberReq({...myReq, acceptYn: 'Y'})}>
                    승인
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={e => updateMemberReq({...myReq, acceptYn: 'N'})}>
                    반려
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
