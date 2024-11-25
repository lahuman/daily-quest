// components/ClientNavLink.tsx

"use client";

import React from 'react';

const ClientNavLink = ({ href, isPc, children }: { href: string, isPc: boolean, children: React.ReactNode }) => {
  const isActive = window.location.pathname === href;

  return (
    <a
      href={href}
      className={`${isPc?'flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-all':'flex flex-col items-center py-2 px-4'} ${
        isActive ? 'text-indigo-600' : 'text-gray-600'
      }`}
    >
      {children}
    </a>
  );
};

export default ClientNavLink;
