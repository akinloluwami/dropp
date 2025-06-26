import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCollections,
  fetchCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} from "./collections";
import type {
  CollectionsResponse,
  CollectionResponse,
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from "@/lib/types/collection";

export const collectionKeys = {
  all: ["collections"] as const,
  lists: () => [...collectionKeys.all, "list"] as const,
  list: (filters: { page?: number; limit?: number }) =>
    [...collectionKeys.lists(), filters] as const,
  details: () => [...collectionKeys.all, "detail"] as const,
  detail: (id: string) => [...collectionKeys.details(), id] as const,
};

export function useCollections(params?: { page?: number; limit?: number }) {
  return useQuery<CollectionsResponse>({
    queryKey: collectionKeys.list(params || {}),
    queryFn: () => fetchCollections(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCollection(id: string) {
  return useQuery<CollectionResponse>({
    queryKey: collectionKeys.detail(id),
    queryFn: () => fetchCollection(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCollectionRequest }) =>
      updateCollection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: collectionKeys.details() });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
}
