"use client";

import React, { useEffect, useState } from "react";
import { SiGithub } from "react-icons/si";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/button";
import Link from "next/link";

const Login = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(searchParams.get("error"));
  }, [searchParams]);

  const handleGitHubLogin = () => {
    window.location.href = "/api/auth/github";
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-4 flex flex-col items-center">
        <Link href="/" className="font-semibold text-2xl">
          <h2 className="text-2xl font-medium">Dropp</h2>
        </Link>

        <h2 className="text-center text-lg font-medium">
          Login or Create an Account
        </h2>

        {error && (
          <div className="bg-red-500/5 border border-red-500 text-red-700 px-10 text-sm py-3 rounded-2xl">
            {error}
          </div>
        )}

        <Button onClick={handleGitHubLogin}>
          <SiGithub className="mr-2" /> Continue with GitHub
        </Button>
      </div>
    </div>
  );
};

export default Login;
