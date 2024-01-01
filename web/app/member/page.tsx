"use client";

import { useEffect, useState } from "react";
import { MemberVo } from "./MemberVo";
import { client } from "../todo/fetchHelper";
import Loading from "@/components/Loading";
import { BlockPicker } from "react-color";
import { useAuth } from "@/contexts/AuthContext";

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
        alert("오류가 발생했습니다. 관리자에게 문의해주세요\n"+e.message);
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
          alert("오류가 발생했습니다. 관리자에게 문의해주세요\n"+e.message);
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
          alert("오류가 발생했습니다. 관리자에게 문의해주세요\n"+e.message);
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

      <div className="justify-center h-screen  ">
        <div className="w-full px-4 py-8 mx-auto shadow lg:w-1/3">
          <div className="flex items-center justify-center">
            <div
              className="cursor-pointer	rounded-lg w-10 h-10 mr-5"
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
                    saveMember();
                  }
                }}
                type="search"
                placeholder="이름을 입력하세요."
                className="w-9/12 px-2 py-3 border rounded outline-none border-grey-600"
              />
            </form>
          </div>
          <ul className="list-reset">
            {list &&
              list.map((todo, idx) => (
                <li
                  key={idx}
                  className="relative flex items-center justify-between px-2 py-6 border-b"
                >
                  <div
                    className="cursor-pointer rounded-lg w-8 h-8 mr-1"
                    style={{ backgroundColor: todo.color }}
                    onClick={(e) =>
                      handleListChange(idx, { ...todo, showColor: true })
                    }
                  >
                    {todo.showColor && (
                      <div className="absolute z-10">
                        <BlockPicker
                          color={todo.color}
                          onChangeComplete={(e) => {
                            handleListChange(idx, {
                              ...todo,
                              color: e.hex,
                              showColor: false,
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-7/12 mr-1 leading-3	">
                  <input
                    type="text"
                    className={`${currentUser && todo?.user?.email === currentUser.email && "px-2 py-3" || "px-1 py-1"} border rounded outline-none border-grey-600`}
                    id={`member-${todo.seq}`}
                    value={`${todo.name}`}
                    style={{ color: todo.color }}
                    onChange={(e) =>
                      handleListChange(idx, { ...todo, name: e.target.value })
                    }
                  />
                  {currentUser && todo?.user?.email !== currentUser.email && <><br /><span   className="text-xs mr-1">{todo?.user?.email}</span></>}
                  </div>
                  
                  <label className={`w-3/12 inline-block mt-1 text-gray-600 `}>
                    <span
                      className={
                        todo.totalPoint === 0
                          ? ""
                          : todo.totalPoint > 0
                          ? "text-blue-600"
                          : "text-red-600"
                      }
                    >
                      {numberWithCommas(todo.totalPoint)}
                    </span>
                  </label>
                  <button
                    type="button"
                    className="absolute right-5 flex items-center"
                    onClick={(e) => updateMember(todo)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-red-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="green"
                      strokeWidth="1"
                    >
                      <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
                    </svg>
                  </button>
                  {/* <button
                                        type="button"
                                        className="absolute right-0 flex items-center"
                                        onClick={(e) => deleteMember(todo)}
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
                                    </button> */}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
