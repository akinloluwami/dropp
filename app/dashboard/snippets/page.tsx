"use client";

import { Button } from "@/components/button";
import { useSnippets } from "@/lib/client/snippet-queries";
import Link from "next/link";
import React from "react";
import { CgSpinner } from "react-icons/cg";
import * as Icons from "solar-icon-set";
import SnippetCard from "../components/snippet-card";
import Title from "@/components/title";

const Dashboard = () => {
  const { data, isLoading, error } = useSnippets({
    page: 1,
    limit: 10,
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-0">
      <Title title="Snippets | Dropp" />
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-medium">Snippets</h2>
        <Link href="/dashboard/snippets/new">
          <Button>Create Snippet</Button>
        </Link>
      </div>
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
            <Link href="/dashboard/snippets/new">
              <Button>Create your first snippet</Button>
            </Link>
          </div>
        </div>
      )}
      {!isLoading && !error && data && data.snippets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {data.snippets.map((snippet) => (
            <SnippetCard key={snippet._id} snippet={snippet} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
