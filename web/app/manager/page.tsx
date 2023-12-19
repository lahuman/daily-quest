"use client";

import { useEffect, useState } from "react";
import { MemberVo } from "../member/MemberVo";
import { client } from "../todo/fetchHelper";
import Loadding from "@/components/Loadding";
import { BlockPicker } from "react-color";
import { MemberReqVo } from "./MemberReqVo";
enum TABS {
  REQ, RES
}
export default function Member() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [tab, setTab] = useState<TABS>(TABS.REQ);
  const [color, setColor] = useState("#000000");
  const [showColor, setShowColor] = useState(false);
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

  function requestManager() {
    setLoading(true);
    client(`/user/searchEmail?email=${name}`, {
      method: "GET",
    })
      .then((r) => {
        client(`/member/req`, {
          method: 'POST',
          body: {
            managerSeq: r.seq
          }
        }).then(r2 => {
          setName("");
        }).catch(e => {
          alert(e.error);
        });
      })
      .catch((e) => {
        alert(e.error);
      }).finally(() => {
        setLoading(false);
        setTimeout(() => getManagerReqList(), 300);
      });
  }

  function updateMember(memberVo: MemberVo) {
    if (
      confirm(
        "If you update a member name, todo also update. Do you want update member?"
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
          setLoading(false);
          getManagerReqList();
        })
        .catch((e) => {
          alert(e);
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
          setLoading(false);
          getManagerReqList();
        })
        .catch((e) => {
          alert(e);
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
            <a href="#" className={`inline-block p-4 border-b-2 ${tab === TABS.REQ ? 'text-blue-600  border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>요청내역</a>
          </li>
          <li className="me-2">
            <a href="#" className={`inline-block p-4 border-b-2 ${tab === TABS.RES ? 'text-blue-600  border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>응답내역</a>
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
          <div className="flex items-center justify-center">
            <form>
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
                placeholder="Write new name and hit Enter."
                className="w-9/12 px-2 py-3 border rounded outline-none border-grey-600"
              />
            </form>
          </div>
          <ul className="list-reset">
            {list &&
              list.map((myReq, idx) => (
                <li
                  key={idx}
                  className="relative flex items-center justify-between px-2 py-6 border-b"
                >
                  <input
                    type="text"
                    className="w-5/12 mr-1 px-2 py-3 border rounded outline-none border-grey-600"
                    defaultValue={`${myReq.email}`}
                  />
                  <button
                    type="button"
                    className="absolute right-0 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-red-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
