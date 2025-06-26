import type {
  Collection,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CollectionsResponse,
  CollectionResponse,
} from "@/lib/types/collection";

const API_BASE = "/api/collections";

export async function fetchCollections(params?: {
  page?: number;
  limit?: number;
}): Promise<CollectionsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  const url = `${API_BASE}${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch collections");
  }
  return response.json();
}

export async function fetchCollection(id: string): Promise<CollectionResponse> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch collection");
  }
  return response.json();
}

export async function createCollection(
  data: CreateCollectionRequest
): Promise<CollectionResponse> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create collection");
  }
  return response.json();
}

export async function updateCollection(
  id: string,
  data: UpdateCollectionRequest
): Promise<CollectionResponse> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update collection");
  }
  return response.json();
}

export async function deleteCollection(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete collection");
  }
}
