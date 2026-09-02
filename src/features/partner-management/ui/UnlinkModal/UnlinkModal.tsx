import type { FC } from 'react';
import { UserX } from 'lucide-react';
import { Modal, Button } from '@/shared/ui';
import styles from './UnlinkModal.module.scss';

export interface UnlinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  onConfirmUnlink: () => void;
}

export const UnlinkModal: FC<UnlinkModalProps> = ({
  isOpen,
  onClose,
  partnerName,
  onConfirmUnlink,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Разорвать пару">
      <div className={styles.container}>
        <div className={styles.warningIconWrapper}>
          <UserX size={28} />
        </div>
        <div className={styles.title}>Вы уверены?</div>
        <p className={styles.description}>
          Связь с партнёром <strong>{partnerName}</strong> будет разорвана, а совместные выборы и синхронизация будут сброшены.
        </p>
        <div className={styles.buttonRow}>
          <Button
            type="button"
            variant="secondary"
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="warning"
            className={styles.confirmBtn}
            onClick={() => {
              onConfirmUnlink();
              onClose();
            }}
          >
            Разорвать
          </Button>
        </div>
      </div>
    </Modal>
  );
};
