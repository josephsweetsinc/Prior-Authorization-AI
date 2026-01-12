export type GlobalSearchResultItem = {
  id: string;
  title: string;
  subtitle?: string;
  requestId?: number;
};

export type GlobalSearchResultGroup = {
  title?: string;
  items: GlobalSearchResultItem[];
};
