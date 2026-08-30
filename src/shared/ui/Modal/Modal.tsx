import React from 'react';
import { X } from 'lucide-react';
import { IconButton } from '../IconButton/IconButton';
import { useModalEvents } from '@/shared/lib/hooks/useModal';
import styles from './Modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  useModalEvents(isOpen);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.content} ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <IconButton
            icon={<X size={18} />}
            onClick={onClose}
            aria-label="Закрыть"
            variant="ghost"
            size="sm"
            className={styles.closeBtn}
          />
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

