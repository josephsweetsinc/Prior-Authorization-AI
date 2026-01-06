'use client';

import { useState } from 'react';

import { useGetUsersQuery } from '@/services/user-management';

import { useUserFilters, useUserModals } from '../hooks';

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

  const { data, isLoading } = useGetUsersQuery({
    page: pagination.pageIndex + 1,
    role: filters.role,
    search: filters.searchQuery,
  });

  return (
    <>
      <UserManagementHeader onCreateClick={handlers.openCreate} />
      <UserManagementFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
      <UsersTable
        isLoading={isLoading}
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
