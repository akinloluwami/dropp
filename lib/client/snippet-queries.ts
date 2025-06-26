import { useQuery } from "@tanstack/react-query";
import { fetchSnippets, fetchSnippet } from "./snippets";
import type { SnippetsResponse, SnippetResponse } from "@/lib/types/snippet";

export const snippetKeys = {
  all: ["snippets"] as const,
  lists: () => [...snippetKeys.all, "list"] as const,
  list: (filters: { page?: number; limit?: number; public?: boolean }) =>
    [...snippetKeys.lists(), filters] as const,
  details: () => [...snippetKeys.all, "detail"] as const,
  detail: (id: string) => [...snippetKeys.details(), id] as const,
};

export function useSnippets(params?: {
  page?: number;
  limit?: number;
  public?: boolean;
  collection_id?: string;
}) {
  return useQuery<SnippetsResponse>({
    queryKey: snippetKeys.list(params || {}),
    queryFn: () => fetchSnippets(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSnippet(id: string) {
  return useQuery<SnippetResponse>({
    queryKey: snippetKeys.detail(id),
    queryFn: () => fetchSnippet(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
