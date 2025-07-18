"use client";

import { Button } from "@/components/button";
import { FlickeringGrid } from "@/components/flickering-grid";
import Link from "next/link";
import React from "react";
import { useSession } from "@/lib/client/session";
import Title from "@/components/title";

const Home = () => {
  const { user, loading } = useSession();

  return (
    <div className="lg:p-10 p-3 flex items-center justify-center">
      <Title title="Dropp" />
      <div className="bg-[#0f0f0f] max-w-7xl h-[calc(100vh-80px)] w-full mx-auto flex flex-col p-5 rounded-2xl border border-gray-50/5 gap-y-10 relative overflow-hidden">
        <FlickeringGrid
          className="absolute inset-0 z-0 size-full opacity-30"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.5}
          flickerChance={0.1}
          height={2000}
          width={2000}
        />

        <div className="flex items-center justify-between z-10">
          <h2 className="text-2xl font-medium">Dropp</h2>
          {!loading && !user && (
            <Link href="/auth">
              <Button>Sign in</Button>
            </Link>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-y-4 text-center mt-40 z-10">
          <h1 className="lg:text-7xl text-5xl">Your personal code vault.</h1>
          <p className="text-white/50 lg:text-2xl text-lg">
            Save, organize, reuse and share the snippets that power your
            workflow.
          </p>
          {!loading &&
            (user ? (
              <Link href="/dashboard/snippets">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button>Create an Account</Button>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
