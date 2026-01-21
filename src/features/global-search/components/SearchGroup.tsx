import { type HTMLProps } from 'react';

import { type ISearchResultGroup } from '../types';

import { SearchItem } from './SearchItem';

type Props = {
  group: ISearchResultGroup;
  onItemClick: (_item: ISearchResultGroup['items'][number]) => void;
} & HTMLProps<HTMLDivElement>;

export const SearchGroup = ({ group, onItemClick, ...props }: Props) => {
  return (
    <div {...props}>
      {group.title && (
        <p className='px-3 py-2 text-xs font-semibold tracking-wide text-slate-400 uppercase'>
          {group.title}
        </p>
      )}

      <div className='space-y-1'>
        {group.items.map((item) => (
          <SearchItem key={item.id} onClick={() => onItemClick(item)}>
            <SearchItem.Title>{item.title}</SearchItem.Title>

            {item.subtitle && (
              <SearchItem.Subtitle>{item.subtitle}</SearchItem.Subtitle>
            )}
          </SearchItem>
        ))}
      </div>
    </div>
  );
};
