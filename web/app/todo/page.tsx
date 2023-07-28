"use client";

import React, { useEffect, useRef, useState } from "react";
import { format, parse } from "date-fns";
import { TodoVo } from "./TodoVo";
import { client } from "./fetchHelper";

export default function Todo() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateStr, setDateStr] = useState(format(new Date(), "yyyyMMdd"));
  const [list, setList] = useState<TodoVo[] | undefined>();


  useEffect(() => {
    client(`/todo/${dateStr}`).then((data) => {
      setList(data);
    });
  }, [dateStr]);

  return (
    <>
      <div className="justify-center h-screen">
        <div className="w-full px-4 py-8 mx-auto shadow lg:w-1/3">
          <div className="flex items-center mb-6">
            <h1 className="mr-6 text-4xl font-bold text-purple-600">
              {" "}
              {format(parse(dateStr, "yyyyMMdd", new Date()), "yyyy-MM-dd")} TO DO
            </h1>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="What needs to be done today?"
              className="w-full px-2 py-3 border rounded outline-none border-grey-600"
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
                        list[idx].completeYn = checked ? "Y" : "N";
                        setList([...list]);
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
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-red-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
