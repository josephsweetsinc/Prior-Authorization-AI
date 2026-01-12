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

export type GlobalSearchControlProps = {
  isOpen: boolean;
  onOpenChange: (_open: boolean) => void;
};

export type SearchResultsPanelProps = {
  isOpen: boolean;
  isSearching: boolean;
  trimmedValue: string;
  hasResults: boolean;
  displayResults: GlobalSearchResultGroup[];
  onItemClick: (_item: GlobalSearchResultItem) => void;
};
