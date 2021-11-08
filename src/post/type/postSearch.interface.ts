export interface PostSearchBody {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

export interface PostCountResult {
  count: number;
}

export interface PostSearchResult {
  hits: {
    total: { value: number };
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}
