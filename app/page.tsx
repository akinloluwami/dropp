import { Button } from "@/components/button";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="p-10 flex items-center justify-center">
      <div className="bg-[#0f0f0f] max-w-7xl h-[calc(100vh-80px)] w-full mx-auto flex flex-col p-5 rounded-2xl border border-gray-50/5 gap-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Dropp</h2>
          <Link href="/auth">
            <Button>Sign in</Button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center gap-y-4 text-center mt-40">
          <h1 className="text-7xl">Your personal code vault.</h1>
          <p className="text-white/50 text-2xl">
            Save, organize, reuse and share the snippets that power your
            workflow.
          </p>
          <Link href="/auth">
            <Button>Create an Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
