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

      <div className="justify-center h-screen  ">
        <div className="w-full px-4 py-8 mx-auto shadow lg:w-1/3">
          <div className="flex items-center justify-center border-dashed border-2 border-indigo-600 p-1">

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
                    saveMember();
                  }
                }}
                type="search"
                placeholder="이름을 입력하세요."
                className="w-full px-2 py-3 border rounded outline-none border-grey-600"
              />
            </form>
            <button className="w-3/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={e => saveMember()}>
              등록
            </button>
          </div>
          <hr className="mt-5" />
          <ul className="list-reset">
            {list && list.length === 0 && <span className="text-gray-400">내역이 없습니다.</span>}
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
                  <div className="w-5/12 mr-1 leading-3	">
                    <input
                      type="text"
                      className={`${currentUser && todo?.user?.email === currentUser.email && "px-2 py-3" || "px-1 py-1"} border rounded outline-none border-grey-600 w-full`}
                      id={`member-${todo.seq}`}
                      value={`${todo.name}`}
                      style={{ color: todo.color }}
                      onChange={(e) =>
                        handleListChange(idx, { ...todo, name: e.target.value })
                      }
                    />
                    {currentUser && todo?.user?.email !== currentUser.email && <><br /><span className="text-xs mr-1">{todo?.user?.email}</span></>}
                  </div>

                  <label className={`w-2/12 inline-block mt-1 text-gray-600 text-right`}>
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
                  <button className="w-3/12 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={(e) => updateMember(todo)}>
                    수정
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
