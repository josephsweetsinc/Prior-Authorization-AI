'use client';

import { useState } from 'react';

import { usersMock } from '../constants';
import { type IFilters } from '../types';
import { filterPipeline } from '../utils/pipelines';

import { CreateModal } from './CreateModal';
import { DeleteModal } from './DeleteModal';
import { UserManagementHeader } from './Header';
import { UserManagementFilters } from './UserManagementFilters';
import { UsersTable } from './UsersTable';

export const UserManagementContainer = () => {
  const [activeModal, setActiveModal] = useState<
    'create' | 'update' | 'delete' | null
  >();
  const [filters, setFilters] = useState<IFilters>({
    searchQuery: '',
    role: 'all',
  });

  const data = usersMock;

  const filteredData = filterPipeline(data ?? [], filters);

  const handleFiltersChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const closeModal = () => setActiveModal(null);

  const openCreateModal = () => setActiveModal('create');
  const openUpdateModal = () => setActiveModal('update');
  const openDeleteModal = () => setActiveModal('delete');

  return (
    <>
      <UserManagementHeader onCreateClick={openCreateModal} />
      <UserManagementFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
      <UsersTable
        data={filteredData}
        onUpdateClick={openUpdateModal}
        onDeleteClick={openDeleteModal}
      />
      <CreateModal
        isOpen={activeModal === 'create'}
        onCloseAction={closeModal}
      />
      <DeleteModal
        isOpen={activeModal === 'delete'}
        onCloseAction={closeModal}
      />
    </>
  );
};
