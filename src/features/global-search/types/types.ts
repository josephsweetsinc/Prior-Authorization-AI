export interface ISearchResult {
  id: string;
  title: string;
  subtitle?: string;
  requestId?: number;
}

export type ISearchResultGroup = {
  title?: string;
  items: ISearchResult[];
};

export type GlobalSearchControlProps = {
  isOpen: boolean;
  onOpenChange: (_open: boolean) => void;
};
