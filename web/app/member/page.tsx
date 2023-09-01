'use client';

import { useEffect, useState } from "react";
import { MemberVo } from "./MemberVo";
import { client } from "../todo/fetchHelper";
import Loadding from "@/components/Loadding";

export default function Member() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [list, setList] = useState<MemberVo[] | undefined>();

    function getMemberList() {
        setLoading(true);
        client("/member").then((data) => {
            setList(data);
            setLoading(false);
        });
    };

    useEffect(() => {
        getMemberList();
    }, []);

    function saveMember() {
        setLoading(true);
        client("/member", {
            method: 'POST',
            body: {
                name
            }
        }).then((r) => {
            setName("");
            setLoading(false);
            getMemberList();
        }).catch((e) => {
            alert(e)
        });
    }

    function updateMember(memberVo: MemberVo) {
        if (confirm('If you update a member name, todo also update. Do you want update member?')) {
            setLoading(true);
            client("/member", {
                method: 'PUT',
                body: {
                    ...memberVo
                }
            }).then((r) => {
                setLoading(false);
                getMemberList();
            }).catch((e) => {
                alert(e)
            });
        }
    }

    function deleteMember(memberVo: MemberVo) {
        if (confirm('If you delete a member, todo is retained. Do you want remove member?')) {
            setLoading(true);
            client("/member", {
                method: 'DELETE',
                body: {
                    ...memberVo
                }
            }).then((r) => {
                setLoading(false);
                getMemberList();
            }).catch((e) => {
                alert(e)
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
        return x && x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || 0;
    }

    return (
        <>
            {loading && (
                <Loadding />
            )}

            <div className="justify-center h-screen  ">
                <div className="w-full px-4 py-8 mx-auto shadow lg:w-1/3">
                    <div className="flex ">
                        <input
                            value={name}
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
                            type="text"
                            placeholder="Write new name and hit Enter."
                            className="w-9/12 px-2 py-3 border rounded outline-none border-grey-600"
                        />
                    </div>
                    <ul className="list-reset">
                        {list &&
                            list.map((todo, idx) => (
                                <li
                                    key={idx}
                                    className="relative flex items-center justify-between px-2 py-6 border-b"
                                >
                                    <input
                                        type="text"
                                        className="w-6/12 px-2 py-3 border rounded outline-none border-grey-600"
                                        id={`member-${todo.seq}`}
                                        value={`${todo.name}`}
                                        onChange={(e) => handleListChange(idx, { ...todo, name: e.target.value })}
                                    />
                                    <label
                                        className={`w-4/12 inline-block mt-1 text-gray-600 `}
                                    >
                                         <span className={todo.totalPoint === 0 ? '' : todo.totalPoint > 0 ? 'text-blue-600' : 'text-red-600'}>{numberWithCommas(todo.totalPoint)}</span>
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