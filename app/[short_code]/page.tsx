"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as Icons from "solar-icon-set";
import type { Snippet } from "@/lib/types/snippet";
import { CgSpinner } from "react-icons/cg";
import { Button } from "@/components/button";
import Link from "next/link";
import Title from "@/components/title";

function PublicSnippetPage() {
  const pathname = usePathname();
  const shortCode = pathname?.slice(1, 7) || "";
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shortCode || shortCode.length !== 6) return;
    setLoading(true);
    fetch(`/api/snippets/${shortCode}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Not found");
        }
        return res.json();
      })
      .then((data) => {
        setSnippet(data.snippet);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        setSnippet(null);
      })
      .finally(() => setLoading(false));
  }, [shortCode]);

  if (!shortCode || shortCode.length !== 6) {
    return null;
  }

  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 h-[80vh] items-center justify-center">
        <CgSpinner className="animate-spin text-gray-500" size={24} />
        <p className="text-sm">Loading snippet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 h-[80vh] items-center justify-center">
        <Icons.InfoCircle size={60} iconStyle="BoldDuotone" />
        <div className="text-center">
          <h2 className="text-xl font-medium text-white mb-2">
            Snippet Not Found
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!snippet) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-5 px-4">
      <Title
        title={snippet.title ? snippet.title + " | Dropp" : "Snippet | Dropp"}
      />
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Icons.Programming size={16} />
        <span>{snippet.language}</span>
        <span className="mx-2">•</span>
        <Icons.Calendar size={16} />
        <span>{new Date(snippet.createdAt).toLocaleString()}</span>
      </div>
      {snippet.description && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Description</h3>
          <p className="text-gray-300 leading-relaxed">{snippet.description}</p>
        </div>
      )}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-white">Code</h3>
          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(snippet.code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? (
              <Icons.CheckCircle size={16} className="mr-2 !text-green-400" />
            ) : (
              <Icons.Copy size={16} className="mr-2" />
            )}
            <span className={copied ? "text-green-400" : undefined}>
              {copied ? "Copied!" : "Copy"}
            </span>
          </Button>
        </div>
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6">
          <pre className="text-sm text-white/90 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
            <code>{snippet.code}</code>
          </pre>
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center">
        <Link href="/" className="font-semibold text-sm text-center">
          Dropp
        </Link>
      </div>
    </div>
  );
}

export default PublicSnippetPage;
