"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format, parse, subDays, addDays } from "date-fns";
import { TodoVo } from "./TodoVo";
import { client } from "./fetchHelper";
import Loading from "@/components/Loading";
import { MemberVo } from "../member/MemberVo";
import styled from "styled-components";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

enum TODO_TYPE {
  OC = "OC",
  ED = "ED",
  HD = "HD",
  WE = "WE",
  WD = "WD",
}
enum TODO_TYPE_STRING {
  OC = "한번",
  ED = "매일",
  HD = "휴일",
  WE = "주말",
  WD = "평일",
}

const getTodoTypeString = (value: string): string => {
  switch (value) {
    case "OC":
      return "한번";
    case "ED":
      return "매일";
    case "HD":
      return "휴일";
    case "WE":
      return "주말";
    case "WD":
      return "평일";
    default:
      return "기타";
  }
};

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
};
function MemberTag(prop: any) {
  const member = prop.member;
  const userSeq = prop.userSeq;
  return member ? (
    <span style={{ color: member.color }}>
      @{userSeq === member.managerSeq ? member.name : member.managerName}
    </span>
  ) : (
    <></>
  );
}

const TodoContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    max-width: 480px;
    padding: 2rem;
  }
`;

const TodoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;

  @media (min-width: 768px) {
    padding: 0;
    margin-bottom: 2rem;
    border-bottom: none;
  }
`;

const DateNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #6366f1;
`;

const TodoInput = styled.div`
  background: #f3f4f6;
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const TodoItem = styled.div<{ completed: boolean }>`
  background: ${(props) => (props.completed ? "#f8fafc" : "#ffffff")};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export default function Todo() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isHoliday, setIsHoliday] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [memberSeq, setMemberSeq] = useState("");
  const [newPoint, setNewPoint] = useState<number | string>(0);
  const [type, setType] = useState<TODO_TYPE>(TODO_TYPE.OC);
  const [dateStr, setDateStr] = useState(
    params.get("today") || format(new Date(), "yyyyMMdd")
  );

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
    client(`/todo/isHoliday/${dateStr}`).then((data) => {
      setIsHoliday(data);
    });
  }, [dateStr]);

  function changeDate(isNext: boolean) {
    const fun = isNext ? addDays : subDays;

    setDateStr(
      format(fun(parse(dateStr, "yyyyMMdd", new Date()), 1), "yyyyMMdd")
    );
  }

  function saveNewTodo() {
    if (newTodo.trim() === "") {
      alert("할일을 작성해주세요.");
      return;
    }
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
      })
      .catch((e) => {
        alert("오류가 발생했습니다. 관리자에게 문의해주세요\n" + e.error);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => getTodoList(), 300);
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
      .then((r) => {})
      .catch((e) => {
        console.log(e);
        alert("오류가 발생했습니다. 관리자에게 문의해주세요\n" + e.error);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => getTodoList(), 300);
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
      .then((r) => {})
      .catch((e) => {
        console.log(e);
        alert("오류가 발생했습니다. 관리자에게 문의해주세요\n" + e.error);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => getTodoList(), 300);
      });
  }

  return (
    <>
      {loading && <Loading />}
      <TodoContainer className="md:mx-auto">
        <TodoHeader>
          <DateNavigator>
            <button
              onClick={() => changeDate(false)}
              className="p-2 rounded-full hover:bg-indigo-100"
            >
              <ChevronLeftIcon className="w-6 h-6 text-indigo-600" />
            </button>
            <span>
              {format(parse(dateStr, "yyyyMMdd", new Date()), "MMM d, yyyy")}
            </span>
            <button
              onClick={() => changeDate(true)}
              className="p-2 rounded-full hover:bg-indigo-100"
            >
              <ChevronRightIcon className="w-6 h-6 text-indigo-600" />
            </button>
          </DateNavigator>
        </TodoHeader>

        <TodoInput>
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <select
              value={type}
              onChange={(e) => setType(getTodoType(e.target.value))}
              className="w-full sm:w-auto px-3 py-2 rounded-lg bg-white border-0 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="OC">한번</option>
              <option value="ED">매일</option>
              {(isHoliday && <option value="HD">휴일</option>) || (
                <option value="WD">평일</option>
              )}
            </select>
            <select
              value={memberSeq}
              onChange={(e) => setMemberSeq(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-lg bg-white border-0 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="0">None</option>
              {memberList?.map((m) => (
                <option key={m.seq} value={m.seq}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="새로운 할 일을 입력하세요"
              className="w-full px-4 py-2 rounded-lg bg-white border-0 focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <input
                value={newPoint}
                onChange={(e) => setNewPoint(e.target.value)}
                onFocus={(e) => {
                  if (e.target.value === "0") {
                    setNewPoint("");
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    setNewPoint("0");
                  }
                }}
                type="number"
                placeholder="포인트"
                className="flex-1 sm:w-24 min-w-[80px] px-4 py-2 rounded-lg bg-white border-0 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={saveNewTodo}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
              >
                추가
              </button>
            </div>
          </div>
        </TodoInput>

        <div className="space-y-3">
          {list?.map((todo, idx) => (
            <TodoItem key={idx} completed={todo.completeYn === "Y"}>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completeYn === "Y"}
                  onChange={(e) => {
                    if (todo.userSeq === userSeq)
                      updateTodoCompleted({
                        ...todo,
                        completeYn: e.target.checked ? "Y" : "N",
                      });
                  }}
                  className="w-5 h-5 rounded-full border-2 border-indigo-500 text-indigo-600 focus:ring-indigo-500"
                />
                <span
                  className={`flex-1 ${
                    todo.completeYn === "Y" ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.content}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {numberWithCommas(todo.point)} pts
                </span>
                {(!todo.member || userSeq === todo.member.managerSeq) && (
                  <button
                    onClick={() => deleteTodo(todo)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <span>{getTodoTypeString(todo.type)}</span>
                {todo.member && (
                  <>
                    <span>•</span>
                    <MemberTag userSeq={userSeq} member={todo.member} />
                  </>
                )}
              </div>
            </TodoItem>
          ))}
        </div>
      </TodoContainer>
    </>
  );
}
