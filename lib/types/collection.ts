export interface Collection {
  _id: string;
  name: string;
  description?: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
}

export interface UpdateCollectionRequest {
  name?: string;
  description?: string;
}

export interface CollectionsResponse {
  collections: Collection[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CollectionResponse {
  collection: Collection;
}
