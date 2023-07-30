"use client";

import React, { useEffect, useRef, useState } from "react";
import { format, parse, subDays, addDays } from "date-fns";
import { TodoVo } from "./TodoVo";
import { client } from "./fetchHelper";

enum TODO_TYPE {
  T = 'T',
  DT = 'DT',
}


export default function Todo() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [type, setType] = useState<TODO_TYPE>(TODO_TYPE.DT);
  const [dateStr, setDateStr] = useState(format(new Date(), "yyyyMMdd"));
  const [list, setList] = useState<TodoVo[] | undefined>();

  function getTodoList() {
    setLoading(true);
    client(`/todo/${dateStr}`).then((data) => {
      setList(data);
      setLoading(false);
    });
  }
  useEffect(() => {
    getTodoList();
  }, [dateStr]);

  function changeDate(isNext: boolean) {
    const fun = isNext ? addDays : subDays;

     setDateStr(
      format(
        fun(parse(dateStr, "yyyyMMdd", new Date()), 1),
        "yyyyMMdd"
      )
    )
  }

  function saveNewTodo(){
    setLoading(true);
    client("/todo", {
      method: "POST",
      body: {
        type, 
        content: newTodo,
        todoDay: dateStr
      }
    }).then(r => {
      setNewTodo("");
      setLoading(false);
      getTodoList();
    }).catch(e => {
      alert(e);
    })
  }

  function updateTodoCompleted(row){
    setLoading(true);

    client("/todo", {
      method: "PUT",
      body: {
        ...row
      }
    }).then(r => {
      setLoading(false);
      getTodoList();
    }).catch(e => {
      alert(e);
    });
  }

  function deleteTodo(row) {
    setLoading(true);

    client("/todo", {
      method: "DELETE",
      body: {
        ...row
      }
    }).then(r => {
      setLoading(false);
      getTodoList();
    }).catch(e => {
      alert(e);
    })
  }
  return (
    <>
    {loading && <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <svg
      className="animate-spin h-8 w-8 text-gray-800"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="5"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
              </svg><h2 className="text-center text-white text-xl font-semibold">Loading...</h2>
      
      <p className="w-1/3 text-center text-white">This may take a few seconds, please don't close this page.</p>
    </div>}

      <div className="justify-center h-screen">
        <div className="w-full px-4 py-8 mx-auto shadow lg:w-1/3">
          <div className="flex justify-center  mb-6">
            <h1 className="text-2xl font-bold text-purple-600">
              {" "}
              <button
                className="bg-purple-300 hover:bg-purple-400 text-gray-800 rounded-l"
                onClick={(e) => changeDate(false)} 
              >
                {"<<"}
              </button>{" "}
              {format(parse(dateStr, "yyyyMMdd", new Date()), "yyyy-MM-dd")}{" "}
              <button
                className="bg-purple-300 hover:bg-purple-400 text-gray-800 rounded-r"
                onClick={(e) => changeDate(true)}
              >
                {">>"}
              </button>
            </h1>
          </div>
          <div className="flex flex-row">
            <select className="basis-3/12 px-2 py-3 border rounded outline-none border-grey-600 mr-2" value={type} onChange={e => setType(e.target.value === "DT"? TODO_TYPE.DT : TODO_TYPE.T)}>
              <option value="DT">EVERY DAY</option>
              <option value="T">Once</option>
            </select>
            <input
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              onKeyDown={e => {
                if( e.key === 'Enter' && newTodo.trim() !== "") {
                  saveNewTodo();
                }}}
              type="text"
              placeholder="What needs to be done today?"
              className="basis-7/12 px-2 py-3 border rounded outline-none border-grey-600"
            />
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
                        updateTodoCompleted({...todo, completeYn : checked ? "Y" : "N"});
                      }}
                      checked={todo.completeYn === "Y"}
                    />
                    <label
                      className={`inline-block mt-1 text-gray-600  cursor-pointer ${
                        todo.completeYn === "Y" ? "line-through" : ""
                      }`}
                      htmlFor={`todo${idx}`}
                    >
                      {todo.content}
                    </label>
                  </div>
                  <button
                    type="button"
                    className="absolute right-0 flex items-center"
                    onClick={e => deleteTodo(todo)}
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
