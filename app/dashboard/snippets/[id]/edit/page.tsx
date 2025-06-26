"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { Select } from "@/components/select";
import { Checkbox } from "@/components/checkbox";
import { useSnippet } from "@/lib/client/snippet-queries";
import { updateSnippet } from "@/lib/client/snippets";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import * as Icons from "solar-icon-set";
import Link from "next/link";

const programmingLanguages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "scala", label: "Scala" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "powershell", label: "PowerShell" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
  { value: "xml", label: "XML" },
  { value: "other", label: "Other" },
];

interface EditSnippetPageProps {
  params: { id: string };
}

const EditSnippetPage: React.FC<EditSnippetPageProps> = ({ params }) => {
  const router = useRouter();
  const { data, isLoading, error } = useSnippet(params.id);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    language: "",
    is_public: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data?.snippet) {
      setFormData({
        title: data.snippet.title || "",
        description: data.snippet.description || "",
        code: data.snippet.code || "",
        language: data.snippet.language || "",
        is_public: !!data.snippet.is_public,
      });
    }
  }, [data]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
    }
    if (!formData.language) {
      newErrors.language = "Please select a language";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await updateSnippet(params.id, formData);
      router.push(`/dashboard/snippets/${params.id}`);
    } catch (err) {
      setErrors({ submit: "Failed to update snippet. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 h-[80vh] items-center justify-center">
        <Icons.Document size={40} className="animate-pulse text-gray-500" />
        <p className="text-sm">Loading snippet...</p>
      </div>
    );
  }

  if (error || !data?.snippet) {
    return (
      <div className="flex flex-col gap-4 h-[80vh] items-center justify-center">
        <Icons.InfoCircle size={60} iconStyle="BoldDuotone" />
        <div className="text-center">
          <h2 className="text-xl font-medium text-white mb-2">
            Error Loading Snippet
          </h2>
          <p className="text-gray-400 mb-4">
            {error?.message || "Snippet not found."}
          </p>
          <Link href="/dashboard/snippets">
            <Button>Back to Snippets</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/dashboard/snippets/${params.id}`}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition mb-4"
        >
          <Icons.ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Snippet</span>
        </Link>
        <h1 className="text-3xl font-medium text-white mb-2">Edit Snippet</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-white mb-2"
          >
            Title
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Enter snippet title"
            value={formData.title}
            onChange={handleInputChange}
            error={!!errors.title}
            leftIcon={<Icons.Document size={16} />}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title}</p>
          )}
        </div>
        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-white mb-2"
          >
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe what this snippet does..."
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            rows={3}
            leftIcon={<Icons.InfoCircle size={16} />}
          />
        </div>
        {/* Language */}
        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-white mb-2"
          >
            Programming Language
          </label>
          <Select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            error={!!errors.language}
            leftIcon={<Icons.Programming size={16} />}
          >
            <option value="">Select a language</option>
            {programmingLanguages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </Select>
          {errors.language && (
            <p className="mt-1 text-sm text-red-400">{errors.language}</p>
          )}
        </div>
        {/* Code */}
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-white mb-2"
          >
            Code
          </label>
          <Textarea
            id="code"
            name="code"
            placeholder="Paste your code here..."
            value={formData.code}
            onChange={handleInputChange}
            error={!!errors.code}
            rows={12}
            className="font-mono text-sm"
            leftIcon={<Icons.Code size={16} />}
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-400">{errors.code}</p>
          )}
        </div>
        {/* Public/Private Toggle */}
        <div>
          <Checkbox
            id="is_public"
            name="is_public"
            checked={formData.is_public}
            onChange={handleCheckboxChange}
            label="Make this snippet public"
          />
          <p className="mt-1 text-sm text-gray-400">
            Public snippets can be viewed by anyone. Private snippets are only
            visible to you.
          </p>
        </div>
        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{errors.submit}</p>
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/snippets/${params.id}`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditSnippetPage;
