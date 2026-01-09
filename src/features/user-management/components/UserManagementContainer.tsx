'use client';

import { useState } from 'react';

import { useGetUsersQuery } from '@/services/user-management';

import { useUserFilters, useUserModals } from '../hooks';
import { type IFilters } from '../types';

import { CreateModal } from './CreateModal';
import { DeleteModal } from './DeleteModal';
import { UserManagementHeader } from './Header';
import { UpdateModal } from './UpdateModal';
import { UserManagementFilters } from './UserManagementFilters';
import { UsersTable } from './UsersTable';

export const UserManagementContainer = () => {
  const { filters, handleFiltersChange } = useUserFilters();
  const { selectedUser, activeModal, handlers } = useUserModals();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const { data, isFetching } = useGetUsersQuery({
    page: pagination.pageIndex + 1,
    role: filters.role === 'all' ? undefined : filters.role,
    search: filters.searchQuery,
  });

  const updateFilters = <Key extends keyof IFilters>(
    key: Key,
    value: IFilters[Key],
  ) => {
    handleFiltersChange(key, value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  return (
    <>
      <UserManagementHeader onCreateClick={handlers.openCreate} />
      <UserManagementFilters
        filters={filters}
        onFiltersChange={updateFilters}
      />
      <UsersTable
        isLoading={isFetching}
        data={data}
        onUpdateClick={handlers.openUpdate}
        onDeleteClick={handlers.openDelete}
        onPaginationChange={setPagination}
        paginationState={pagination}
      />
      <CreateModal
        isOpen={activeModal === 'create'}
        onCloseAction={handlers.close}
        className='w-1/2 min-w-[288px]'
      />
      <UpdateModal
        user={selectedUser}
        isOpen={activeModal === 'update'}
        onCloseAction={handlers.close}
        className='w-1/2 min-w-[288px]'
      />
      <DeleteModal
        userId={selectedUser?.id}
        isOpen={activeModal === 'delete'}
        onCloseAction={handlers.close}
        className='w-1/2 min-w-[288px]'
      />
    </>
  );
};
