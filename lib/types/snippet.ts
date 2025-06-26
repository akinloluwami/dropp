export interface Snippet {
  _id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  user_id: string;
  is_public: boolean;
  createdAt: string;
  updatedAt: string;
  short_code: string;
  collection_id?: string;
}

export interface CreateSnippetRequest {
  title: string;
  description: string;
  code: string;
  language: string;
  is_public?: boolean;
  short_code?: string;
}

export interface UpdateSnippetRequest {
  title: string;
  description: string;
  code: string;
  language: string;
  is_public?: boolean;
  short_code?: string;
}

export interface SnippetsResponse {
  snippets: Snippet[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SnippetResponse {
  snippet: Snippet;
}
