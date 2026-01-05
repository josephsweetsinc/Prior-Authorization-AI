'use client';

import { useState } from 'react';

import { type IUserEntry, useGetUsersQuery } from '@/services/user-management';

import { type IFilters } from '../types';
import { filterPipeline } from '../utils/pipelines';

import { CreateModal } from './CreateModal';
import { DeleteModal } from './DeleteModal';
import { UserManagementHeader } from './Header';
import { UserManagementFilters } from './UserManagementFilters';
import { UsersTable } from './UsersTable';

export const UserManagementContainer = () => {
  const [selectedUser, setSelectedUser] = useState<IUserEntry | null>(null);
  const [activeModal, setActiveModal] = useState<
    'create' | 'update' | 'delete' | null
  >();
  const [filters, setFilters] = useState<IFilters>({
    searchQuery: '',
    role: 'all',
  });

  const { data, isLoading } = useGetUsersQuery();

  const filteredData = filterPipeline(data ? data.items : [], filters);

  const handleFiltersChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const closeModal = () => {
    setSelectedUser(null);
    setActiveModal(null);
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setActiveModal('create');
  };
  const openUpdateModal = () => {
    setActiveModal('update');
  };
  const openDeleteModal = (user: IUserEntry) => {
    setSelectedUser(user);
    setActiveModal('delete');
  };

  return (
    <>
      <UserManagementHeader onCreateClick={openCreateModal} />
      <UserManagementFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
      <UsersTable
        isLoading={isLoading}
        data={filteredData}
        onUpdateClick={openUpdateModal}
        onDeleteClick={openDeleteModal}
      />
      <CreateModal
        isOpen={activeModal === 'create'}
        onCloseAction={closeModal}
      />
      <DeleteModal
        userId={selectedUser?.id}
        isOpen={activeModal === 'delete'}
        onCloseAction={closeModal}
      />
    </>
  );
};
