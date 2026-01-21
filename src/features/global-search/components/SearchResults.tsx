import type { HTMLProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import type { ISearchResult, ISearchResultGroup } from '../types';

import { SearchGroup } from './SearchGroup';

export type Props = {
  isOpen: boolean;
  isSearching: boolean;
  trimmedValue: string;
  hasResults: boolean;
  displayResults: ISearchResultGroup[];
  onItemClick: (_item: ISearchResult) => void;
} & HTMLProps<HTMLDivElement>;

export const SearchResults = ({
  isOpen,
  isSearching,
  trimmedValue,
  hasResults,
  displayResults,
  onItemClick,
  className,
  ...props
}: Props) => {
  if (!isOpen) {
    return null;
  }

  let content: ReactNode = (
    <div className='space-y-2'>
      {displayResults.map((group, groupIndex) => (
        <SearchGroup
          group={group}
          onItemClick={onItemClick}
          key={group.title ?? `group-${groupIndex}`}
        />
      ))}
    </div>
  );

  if (isSearching) {
    content = (
      <div className='px-4 py-6 text-center text-sm text-slate-500'>
        Searching...
      </div>
    );
  } else if (trimmedValue.length === 0) {
    content = (
      <div className='px-4 py-6 text-center text-sm text-slate-500'>
        Start typing to search patients or requests.
      </div>
    );
  } else if (!hasResults) {
    content = (
      <div className='px-4 py-6 text-center text-sm text-slate-500'>
        No matches yet.
      </div>
    );
  }

  return (
    <div
      className={cn(
        'absolute top-full right-0 left-0 z-40 mt-3 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.16)]',
        className,
      )}
      {...props}
    >
      <div className='custom-scrollbar max-h-[360px] overflow-y-auto px-1 py-1'>
        {content}
      </div>
    </div>
  );
};
