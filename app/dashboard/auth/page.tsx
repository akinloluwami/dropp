import React, { useEffect, useState } from "react";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/button";
import Link from "next/link";
import { CgSpinner } from "react-icons/cg";
import Title from "@/components/title";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setError(params.get("error"));
    }
  }, []);

  const handleGitHubLogin = () => {
    setLoading(true);
    window.location.href = "/api/auth/github";
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-4 flex flex-col items-center">
        <Link href="/" className="font-semibold text-2xl">
          <h2 className="text-2xl font-medium">Dropp</h2>
        </Link>

        <Title title="Sign In | Dropp" />

        {error && (
          <div className="bg-red-500/5 border border-red-500 text-red-700 px-10 text-sm py-3 rounded-2xl">
            {error}
          </div>
        )}

        <Button onClick={handleGitHubLogin} disabled={loading}>
          {loading ? (
            <CgSpinner className="animate-spin mr-2" />
          ) : (
            <SiGithub className="mr-2" />
          )}
          Continue with GitHub
        </Button>
      </div>
    </div>
  );
};

export default Login;
