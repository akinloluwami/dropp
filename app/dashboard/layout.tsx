"use client";
import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import { Button } from "@/components/button";
import { HiMenu } from "react-icons/hi";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex p-2 gap-x-10 relative">
      {/* Mobile menu button */}
      <Button
        className="lg:hidden fixed top-4 left-4 z-30 !p-0 size-8"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <HiMenu size={18} />
      </Button>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="w-full lg:ml-72 lg:px-16 px-2 py-3 transition-all duration-300 mt-10 lg:mt-0">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
