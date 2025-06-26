"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import * as Icons from "solar-icon-set";
import LogoutButton from "./logout-button";
import { HiX } from "react-icons/hi";
import { Button } from "@/components/button";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open = false, onClose }) => {
  const links = [
    {
      label: "Snippets",
      href: "/dashboard/snippets",
      icon: Icons.Programming,
    },
  ];

  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <div className="bg-[#0f0f0f] h-[calc(100vh-16px)] w-72 rounded-2xl border border-gray-50/5 p-3 fixed justify-between flex-col z-20 hidden lg:flex">
        <div>
          <p className="font-medium text-2xl">Dropp</p>
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
        <div>
          <LogoutButton />
        </div>
      </div>
      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-40 flex lg:hidden pointer-events-none`}>
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0"
          }`}
          onClick={onClose}
        />
        <div
          className={`relative bg-[#0f0f0f] h-full w-64 p-4 flex flex-col border-r border-gray-50/5 z-50 transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          } pointer-events-auto`}
        >
          <div className="mt-2">
            <div className="flex justify-between items-center mb-8">
              <p className="font-medium text-xl">Dropp</p>
              <Button
                className="!p-0 size-8"
                onClick={onClose}
                aria-label="Close sidebar"
              >
                <HiX size={16} />
              </Button>
            </div>
            <div>
              {links.map((link) => (
                <Link
                  href={link.href}
                  key={link.href}
                  className={`flex items-center gap-x-2 p-2 rounded-lg hover:bg-gray-50/5 transition-colors ${
                    pathname === link.href
                      ? "bg-gray-50/5 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={onClose}
                >
                  <link.icon size={18} />
                  <span className="text-sm">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-auto">
            <LogoutButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
