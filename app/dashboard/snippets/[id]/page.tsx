"use client";

import { Button } from "@/components/button";
import { useSnippet, snippetKeys } from "@/lib/client/snippet-queries";
import { deleteSnippet } from "@/lib/client/snippets";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import * as Icons from "solar-icon-set";
import Link from "next/link";
import Modal from "@/components/modal";
import { useQueryClient } from "@tanstack/react-query";
import { RiFileCopyLine } from "react-icons/ri";

const languageLabels: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  csharp: "C#",
  cpp: "C++",
  c: "C",
  php: "PHP",
  ruby: "Ruby",
  go: "Go",
  rust: "Rust",
  swift: "Swift",
  kotlin: "Kotlin",
  scala: "Scala",
  html: "HTML",
  css: "CSS",
  sql: "SQL",
  bash: "Bash",
  powershell: "PowerShell",
  json: "JSON",
  yaml: "YAML",
  markdown: "Markdown",
  xml: "XML",
  other: "Other",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface SnippetPageProps {
  params: Promise<{ id: string }>;
}

const SnippetPage: React.FC<SnippetPageProps> = ({ params }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = React.use(params);
  const { data, isLoading, error } = useSnippet(id);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedPublic, setCopiedPublic] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSnippet(id);
      await queryClient.invalidateQueries({ queryKey: snippetKeys.lists() });
      router.push("/dashboard/snippets");
    } catch (error) {
      console.error("Failed to delete snippet:", error);
      alert("Failed to delete snippet. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCopyPublicLink = async () => {
    const publicLink = `${process.env.NEXT_PUBLIC_APP_URL}/${data?.snippet?.short_code}`;
    await navigator.clipboard.writeText(publicLink);
    setCopiedPublic(true);
    setTimeout(() => setCopiedPublic(false), 1500);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 h-[80vh] items-center justify-center">
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
            Error Loading Snippet
          </h2>
          <p className="text-gray-400 mb-4">{error.message}</p>
          <Link href="/dashboard/snippets">
            <Button>Back to Snippets</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!data?.snippet) {
    return (
      <div className="flex flex-col gap-4 h-[80vh] items-center justify-center">
        <Icons.Document size={60} iconStyle="BoldDuotone" />
        <div className="text-center">
          <h2 className="text-xl font-medium text-white mb-2">
            Snippet Not Found
          </h2>
          <p className="text-gray-400 mb-4">
            The snippet you're looking for doesn't exist.
          </p>
          <Link href="/dashboard/snippets">
            <Button>Back to Snippets</Button>
          </Link>
        </div>
      </div>
    );
  }

  const snippet = data.snippet;

  const publicLink = `${process.env.NEXT_PUBLIC_APP_URL}/${snippet.short_code}`;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/snippets"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition mb-4"
        >
          <Icons.ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Snippets</span>
        </Link>

        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-x-2">
              <h1 className="text-3xl font-medium text-white">
                {snippet.title}
              </h1>
              <div className="flex items-center gap-x-0.5">
                <Link
                  href={publicLink}
                  target="_blank"
                  className="font-mono bg-white/10 hover:bg-white/15 transition-colors text-gray-200 px-1 py-0.5 rounded text-xs"
                >
                  {publicLink}
                </Link>
                <button onClick={handleCopyPublicLink} className="mt-1">
                  {copiedPublic ? (
                    <Icons.CheckCircle iconStyle="LineDuotone" size={18} />
                  ) : (
                    <Icons.Copy iconStyle="LineDuotone" size={18} />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Icons.Programming size={16} />
                <span>
                  {languageLabels[snippet.language] || snippet.language}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.Calendar size={16} />
                <span>{formatDate(snippet.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                {snippet.is_public ? (
                  <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                    <Icons.Lock size={14} className="text-green-400" /> Public
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-400/10 px-2 py-0.5 rounded">
                    <Icons.Lock size={14} /> Private
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/dashboard/snippets/${snippet._id}/edit`}>
              <Button>
                <Icons.Pen size={16} className="mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
            >
              <Icons.TrashBinTrash size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {snippet.description && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Description</h3>
          <p className="text-gray-300 leading-relaxed">{snippet.description}</p>
        </div>
      )}

      {/* Code */}
      <div>
        <div className="flex items-center justify-between mb-3">
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Snippet"
        size="sm"
      >
        <div className="text-center">
          <Icons.TrashBinTrash
            size={48}
            className="mx-auto mb-4 text-red-400"
          />
          <h3 className="text-lg font-medium text-white mb-2">Are you sure?</h3>
          <p className="text-gray-400 mb-6">
            This action cannot be undone. This will permanently delete the
            snippet.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={isDeleting}
              disabled={isDeleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SnippetPage;
