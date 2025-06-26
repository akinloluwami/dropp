import {
  Snippet,
  CreateSnippetRequest,
  UpdateSnippetRequest,
  SnippetsResponse,
  SnippetResponse,
} from "@/lib/types/snippet";

const API_BASE = "/api/snippets";

export async function fetchSnippets(params?: {
  page?: number;
  limit?: number;
  public?: boolean;
  collection_id?: string;
}): Promise<SnippetsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.public !== undefined)
    searchParams.append("public", params.public.toString());
  if (params?.collection_id)
    searchParams.append("collection_id", params.collection_id);

  const url = `${API_BASE}${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch snippets");
  }

  return response.json();
}

export async function fetchSnippet(id: string): Promise<SnippetResponse> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch snippet");
  }

  return response.json();
}

export async function createSnippet(
  data: CreateSnippetRequest
): Promise<SnippetResponse> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create snippet");
  }

  return response.json();
}

export async function updateSnippet(
  id: string,
  data: UpdateSnippetRequest
): Promise<SnippetResponse> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update snippet");
  }

  return response.json();
}

export async function deleteSnippet(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete snippet");
  }
}
