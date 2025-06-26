"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { Select } from "@/components/select";
import { Checkbox } from "@/components/checkbox";
import { createSnippet } from "@/lib/client/snippets";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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

const NewSnippetPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    language: "",
    is_public: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
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

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await createSnippet(formData);
      router.push("/dashboard/snippets");
    } catch (error) {
      console.error("Failed to create snippet:", error);
      setErrors({ submit: "Failed to create snippet. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/snippets"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition mb-4"
        >
          <Icons.ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Snippets</span>
        </Link>
        <h1 className="text-3xl font-medium text-white mb-2">
          Create New Snippet
        </h1>
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
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
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
            loading={isLoading}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Creating..." : "Create Snippet"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/snippets")}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewSnippetPage;
