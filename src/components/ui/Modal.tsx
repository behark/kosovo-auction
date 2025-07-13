import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useKeyboardAccessible from '@/hooks/useKeyboardAccessible';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { getAccessibleProps } = useKeyboardAccessible();

  // Handle mounting - prevents SSR issues with portal
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Handle keyboard events and outside click
  useEffect(() => {
    if (!isOpen) return;

    // Close on ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Close on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Focus trap - ensure focus stays within modal
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Size classes for the modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // Don't render anything on the server
  if (!isMounted) return null;

  // Don't render if the modal is closed
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`w-full ${sizeClasses[size]} bg-white dark:bg-neutral-800 rounded-lg shadow-xl overflow-hidden transform transition-all`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 
            id="modal-title" 
            className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
          >
            {title}
          </h2>
          <button
            className="p-1 rounded-full text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={onClose}
            aria-label="Close modal"
            {...getAccessibleProps(onClose)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;

// Helper component for Modal's default actions
export const ModalActions: React.FC<{
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: string;
}> = ({
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  confirmVariant = 'primary',
}) => {
  return (
    <div className="flex justify-end space-x-3">
      {onCancel && (
        <Button {...{variant: 'outline', size: 'default'} as any} onClick={onCancel}>
          {cancelText}
        </Button>
      )}
      {onConfirm && (
        <Button {...{variant: confirmVariant, size: 'default'} as any} onClick={onConfirm}>
          {confirmText}
        </Button>
      )}
    </div>
  );
};
