"use client";

import { Button } from "@/components/button";
import { useSnippets } from "@/lib/client/snippet-queries";
import React from "react";
import { CgSpinner } from "react-icons/cg";
import * as Icons from "solar-icon-set";

const Dashboard = () => {
  const { data, isLoading, error } = useSnippets({
    page: 1,
    limit: 10,
  });

  return (
    <div className="">
      {isLoading && (
        <div className="flex flex-col gap-1 h-[80vh] items-center justify-center">
          <CgSpinner className="animate-spin text-gray-500" size={24} />
          <p className="text-sm">Loading snippets...</p>
        </div>
      )}
      {error && <p>Error: {error.message}</p>}
      {!isLoading && !error && (!data || data.snippets.length === 0) && (
        <div className="flex flex-col gap-4 h-[80vh] items-center justify-center">
          <Icons.Programming size={60} iconStyle="BoldDuotone" />
          <div className="text-center">
            <Button>Create your first snippet</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
