import React from "react";
import Sidebar from "./components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex p-2 gap-x-10">
      <Sidebar />
      <div className="w-full ml-72 px-16 py-3">{children}</div>
    </div>
  );
};

export default DashboardLayout;
