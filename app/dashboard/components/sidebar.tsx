"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import * as Icons from "solar-icon-set";

const Sidebar = () => {
  const links = [
    {
      label: "Snippets",
      href: "/dashboard/snippets",
      icon: Icons.Programming,
    },
  ];

  const pathname = usePathname();

  return (
    <div className="bg-[#0f0f0f] h-[calc(100vh-16px)] w-72 rounded-2xl border border-gray-50/5 p-3 fixed">
      <p className="font-semibold text-lg">Dropp</p>
      <div className="mt-10">
        {links.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className={`flex items-center gap-x-2 p-2 rounded-lg hover:bg-gray-50/5 transition-colors ${
              pathname === link.href
                ? "bg-gray-50/5 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <link.icon size={18} />
            <span className="text-sm">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
