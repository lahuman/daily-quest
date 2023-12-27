"use client";

import React, { useEffect, useRef, useState } from "react";
import { format, parse, subDays, addDays } from "date-fns";
import { TodoVo } from "./TodoVo";
import { client } from "./fetchHelper";
import Loadding from "@/components/Loadding";
import { MemberVo } from "../member/MemberVo";

enum TODO_TYPE {
  OC = 'OC',
  ED = 'ED',
  HD = 'HD',
  WE = 'WE',
  WD = 'WD'
}

const getTodoType = (value: string): TODO_TYPE => {
  switch (value) {
    case "OC":
      return TODO_TYPE.OC;
    case "ED":
      return TODO_TYPE.ED;
    case "HD":
      return TODO_TYPE.HD;
    case "WE":
      return TODO_TYPE.WE;
    case "WD":
      return TODO_TYPE.WD;
    default:
      return TODO_TYPE.OC;
  }
}
function MemberTag(prop: any) {
  const member = prop.member;
  return member ? (
    <span style={{ color: member.color }}>@{member.name}</span>
  ) : (
    <></>
  );
}

export default function Todo() {
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [memberSeq, setMemberSeq] = useState("");
  const [newPoint, setNewPoint] = useState<number | string>(0);
  const [type, setType] = useState<TODO_TYPE>(TODO_TYPE.OC);
  const [dateStr, setDateStr] = useState(format(new Date(), "yyyyMMdd"));
  const [list, setList] = useState<TodoVo[] | undefined>();
  const [memberList, setMemberList] = useState<MemberVo[] | undefined>();
  const userSeq = parseInt(window.localStorage.getItem("userSeq") || "0");

  function numberWithCommas(x: number) {
    return (
      (x && x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")) || 0
    );
  }
  function getTodoList() {
    setLoading(true);
    client(`/todo/${dateStr}`).then((data) => {
      setList(data);
      setLoading(false);
    });
  }
  function getMemberList() {
    client("/member").then((data) => {
      setMemberList(data);
    });
  }

  useEffect(() => {
    getMemberList();
  }, []);

  useEffect(() => {
    getTodoList();
  }, [dateStr]);

  function changeDate(isNext: boolean) {
    const fun = isNext ? addDays : subDays;

    setDateStr(
      format(fun(parse(dateStr, "yyyyMMdd", new Date()), 1), "yyyyMMdd")
    );
  }

  function saveNewTodo() {
    setLoading(true);
    client("/todo", {
      method: "POST",
      body: {
        type,
        content: newTodo,
        todoDay: dateStr,
        memberSeq: memberSeq,
        point: newPoint,
      },
    })
      .then((r) => {
        setNewTodo("");
        setNewPoint(0);
        setLoading(false);
        getTodoList();
      })
      .catch((e) => {
        console.log(e);
        alert("Contact your administrator");
      });
  }

  function updateTodoCompleted(row: TodoVo) {
    setLoading(true);

    client("/todo", {
      method: "PUT",
      body: {
        ...row,
      },
    })
      .then((r) => {
        setLoading(false);
        getTodoList();
      })
      .catch((e) => {
        console.log(e);
        alert("Contact your administrator");
      });
  }

  function deleteTodo(row: TodoVo) {
    setLoading(true);

    client("/todo", {
      method: "DELETE",
      body: {
        ...row,
      },
    })
      .then((r) => {
        setLoading(false);
        getTodoList();
      })
      .catch((e) => {
        console.log(e);
        alert("Contact your administrator");
      });
  }

  return (
    <>
      {loading && <Loadding />}

      {/* bg-fixed bg-center bg-cover bg-no-repeat bg-[url('https://lahuman.github.io/assets/img/logo.png')] */}
      <div className="justify-center h-screen  ">
        <div className="w-full px-4 py-8 mx-auto shadow lg:w-1/3">
          <div className="flex justify-center  mb-6">
            <h1 className="text-2xl font-bold text-purple-600">
              {" "}
              <button
                type="button"
                onClick={(e) => changeDate(false)}
                className="bg-purple-300 text-white rounded-l-md border-r border-gray-100 py-2 hover:bg-purple-400 hover:text-white px-3"
              >
                <div className="flex flex-row align-middle">
                  <svg
                    className="w-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <p className="ml-2"></p>
                </div>
              </button>{" "}
              {format(parse(dateStr, "yyyyMMdd", new Date()), "yyyy-MM-dd EEE")}{" "}
              <button
                type="button"
                onClick={(e) => changeDate(true)}
                className="bg-purple-300 text-white rounded-r-md py-2 border-l border-gray-200 hover:bg-purple-400 hover:text-white px-3"
              >
                <div className="flex flex-row align-middle">
                  <span className="mr-2"></span>
                  <svg
                    className="w-5 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </button>
            </h1>
          </div>
          <div className="border-dashed border-2 border-indigo-600 p-1">
            <div className="flex items-center justify-between mb-2">
              <select
                className="w-5/12 px-2 py-3 border rounded outline-none border-grey-600 mr-2"
                value={type}
                onChange={(e) =>
                  setType(getTodoType(e.target.value))
                }
              >
                <option value="OC">한번</option>
                <option value="WD">평일</option>
                <option value="ED">매일</option>
                <option value="HD">휴일</option>
                <option value="WE">주말</option>
              </select>
              <select
                className="w-5/12 px-2 py-3 border rounded outline-none border-grey-600 mr-2"
                value={memberSeq}
                onChange={(e) => setMemberSeq(e.target.value)}
              >
                <option value="0">None</option>
                {memberList?.map((m) => (
                  <option key={m.seq} value={m.seq}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    e.nativeEvent.isComposing === false &&
                    newTodo.trim() !== ""
                  ) {
                    e.preventDefault();
                    saveNewTodo();
                  }
                }}
                type="text"
                placeholder="Write a Quest and hit Enter."
                className="w-8/12 px-2 py-3 border rounded outline-none border-grey-600"
              />
              <input
                value={newPoint}
                onChange={(e) => {
                  setNewPoint(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    e.nativeEvent.isComposing === false &&
                    newTodo.trim() !== ""
                  ) {
                    e.preventDefault();
                    saveNewTodo();
                  }
                }}
                type="number"
                placeholder="Write Point and hit Enter."
                className="w-3/12 px-2 py-3 border rounded outline-none border-grey-600"
              />
            </div>
          </div>
          <ul className="list-reset">
            {list &&
              list.map((todo, idx) => (
                <li
                  key={idx}
                  className="relative flex items-center justify-between px-2 py-6 border-b"
                >
                  <div>
                    <input
                      className="relative float-left mr-[6px] mt-[0.3rem] h-[1.125rem] w-[1.125rem] "
                      type="checkbox"
                      id={`todo${idx}`}
                      onChange={({ target: { checked } }) => {
                        if (todo.userSeq === userSeq) updateTodoCompleted({
                          ...todo,
                          completeYn: checked ? "Y" : "N",
                        });
                      }}
                      checked={todo.completeYn === "Y"}
                    />
                    <label
                      className={`inline-block mt-1 text-gray-600  cursor-pointer ${todo.completeYn === "Y" ? "line-through" : ""
                        }`}
                      htmlFor={`todo${idx}`}
                    >
                      {
                        <MemberTag
                          member={todo.member}
                        />
                        // eslint-disable-next-line react/jsx-no-comment-textnodes
                      }{" "}{todo.content} {todo.point !== 0  && <>//{" "}
                      <span
                        className={
                          todo.point === 0
                            ? ""
                            : todo.point > 0
                              ? "text-blue-600"
                              : "text-red-600"
                        }
                      >
                        {numberWithCommas(todo.point)}
                      </span>{" "} </>}
                    </label>
                  </div>
                  {todo.managerSeq === userSeq && <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={(e) => deleteTodo(todo)}>
                    삭제
                  </button>}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
