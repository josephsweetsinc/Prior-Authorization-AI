import { useState } from 'react';

import { type IUserEntry } from '@/services/user-management';

export const useUserModals = () => {
  const [selectedUser, setSelectedUser] = useState<IUserEntry | null>(null);
  const [activeModal, setActiveModal] = useState<
    'create' | 'update' | 'delete' | 'approve' | null
  >();

  const close = () => {
    setSelectedUser(null);
    setActiveModal(null);
  };

  const openCreate = () => {
    setSelectedUser(null);
    setActiveModal('create');
  };
  const openUpdate = (user: IUserEntry) => {
    setSelectedUser(user);
    setActiveModal('update');
  };
  const openDelete = (user: IUserEntry) => {
    setSelectedUser(user);
    setActiveModal('delete');
  };
  const openApprove = (user: IUserEntry) => {
    setSelectedUser(user);
    setActiveModal('approve');
  };

  return {
    selectedUser,
    activeModal,
    handlers: {
      close,
      openCreate,
      openUpdate,
      openDelete,
      openApprove,
    },
  };
};
