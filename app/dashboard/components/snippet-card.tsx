import React from "react";
import * as Icons from "solar-icon-set";
import { Snippet } from "@/lib/types/snippet";
import Link from "next/link";

interface SnippetCardProps {
  snippet: Snippet;
}

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
    month: "short",
    day: "numeric",
  });
}

export const SnippetCard: React.FC<SnippetCardProps> = ({ snippet }) => {
  return (
    <Link href={`/dashboard/snippets/${snippet._id}`} className="block">
      <div className="bg-[#18181b] border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-white/10 transition-colors flex flex-col gap-2 shadow-sm">
        <div className="flex flex-col xs:flex-row xs:items-center gap-2 mb-1">
          <span className="text-lg font-medium text-white line-clamp-1 flex-1">
            {snippet.title}
          </span>
          <div className="flex items-center gap-x-2">
            <span className="font-mono bg-white/10 hover:bg-white/15 transition-colors text-gray-200 px-1 py-0.5 rounded text-xs">
              {snippet.short_code}
            </span>
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
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-1">
          <Icons.Programming size={14} />
          <span>{languageLabels[snippet.language] || snippet.language}</span>
          <span className="mx-2">•</span>
          <Icons.Calendar size={14} />
          <span>{formatDate(snippet.createdAt)}</span>
        </div>
        <div className="h-3 flex items-center">
          {snippet.description && (
            <div className="text-sm text-gray-300 line-clamp-2 mb-1 truncate">
              {snippet.description}
            </div>
          )}
        </div>
        <pre className="bg-black/30 h-full rounded-lg p-3 text-xs text-white/80 font-mono max-h-32 overflow-auto mt-1 break-words">
          {snippet.code.slice(0, 200)}
          {snippet.code.length > 200 ? "..." : ""}
        </pre>
      </div>
    </Link>
  );
};

export default SnippetCard;
