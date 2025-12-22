'use client';

import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Window } from '@/shared/components/window';
import { cn } from '@/shared/lib/utils';

type ModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  children?: ReactNode;
  className?: string;
  overlayClassName?: string;
  containerClassName?: string;
  closeOnOverlayClick?: boolean;
};

export const Modal = ({
  isOpen,
  onCloseAction,
  children,
  className,
  overlayClassName,
  containerClassName,
  closeOnOverlayClick = true,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseAction();
      }
    };

    document.addEventListener('keydown', onKey);

    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onCloseAction]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        overlayClassName,
      )}
    >
      <div
        className='absolute inset-0 bg-black/40'
        onClick={closeOnOverlayClick ? onCloseAction : undefined}
        aria-hidden
      />

      <div className={cn('relative z-10', className)}>
        <Window className={containerClassName}>
          <button
            type='button'
            aria-label='Close'
            onClick={onCloseAction}
            className='absolute top-4 right-4 inline-flex items-center justify-center rounded bg-transparent p-1 text-gray-600 hover:text-gray-900'
          >
            <X size={18} />
          </button>

          <div>{children}</div>
        </Window>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
