import { type HTMLProps } from 'react';

import { type IRecentActivity } from '@/services/dashboard';
import { formatRelativeDateTime } from '@/services/request-analytics/utils/formatRelativeDateTime';
import { EmptyStateMessage, Window } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

type Props = {
  data: IRecentActivity[];
} & Omit<HTMLProps<HTMLDivElement>, 'data'>;

type ActivityRowProps = IRecentActivity & HTMLProps<HTMLLIElement>;

const ActivityRow = ({
  request_id,
  author_name,
  created_at,
  className,
  ...props
}: ActivityRowProps) => {
  return (
    <li
      className={cn(
        'flex items-center justify-between gap-6 [&>*:not(:last-child)]:pb-4',
        className,
      )}
      {...props}
    >
      <div className='space-y-1'>
        <p className='flex gap-2 text-base font-bold text-black'>
          Action
          <span className='text-status-info decoration-status-info block underline'>
            {request_id}
          </span>
        </p>
        <p className='text-gray-dark text-sm'>by {author_name}</p>
      </div>
      <time dateTime={created_at} className='text-muted-blue text-sm'>
        {formatRelativeDateTime(created_at)}
      </time>
    </li>
  );
};

export const RecentActivity = ({ data, className, ...props }: Props) => {
  if (data.length === 0) {
    return (
      <Window
        className={cn('flex flex-col justify-between gap-7.25 p-5', className)}
        {...props}
      >
        <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
          Recent Activity
        </h2>
        <EmptyStateMessage message='No recent activity detected' />
      </Window>
    );
  }

  return (
    <Window
      className={cn('flex flex-col justify-between gap-7.25 p-5', className)}
      {...props}
    >
      <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
        Requests in Progress
      </h2>

      <ul className='space-y-4 divide-y divide-gray-100'>
        {data.map((activity) => (
          <ActivityRow {...activity} key={activity.request_id} />
        ))}
      </ul>
    </Window>
  );
};
