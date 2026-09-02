import type { FC } from 'react';
import { Heart, Copy, Check, Send } from 'lucide-react';
import { Modal, Button } from '@/shared/ui';
import { useLinkPartner } from '../model/useLinkPartner';
import styles from './LinkPartnerModal.module.scss';

export interface LinkPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LinkPartnerModal: FC<LinkPartnerModalProps> = ({ isOpen, onClose }) => {
  const {
    inviteUrl,
    isLoading,
    isCopied,
    handleCopyLink,
    handleShareTelegram,
  } = useLinkPartner(isOpen);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Привязка партнёра">
      <div className={styles.modalContent}>
        <div className={styles.headerIntro}>
          <div className={styles.iconBadge}>
            <Heart size={24} fill="currentColor" />
          </div>
          <h3 className={styles.title}>Пригласите вторую половинку</h3>
          <p className={styles.subtitle}>
            Отправьте персональную ссылку вашему партнёру, чтобы создать единое пространство пары.
          </p>
        </div>

        <div className={styles.stepsCard}>
          <div className={styles.stepItem}>
            <span className={styles.stepNumber}>1</span>
            <span>Скопируйте или отправьте ссылку партнёру в Telegram</span>
          </div>
          <div className={styles.stepItem}>
            <span className={styles.stepNumber}>2</span>
            <span>Партнёр открывает приложение по ссылке-приглашению</span>
          </div>
          <div className={styles.stepItem}>
            <span className={styles.stepNumber}>3</span>
            <span>Ваши профили мгновенно объединяются в общую пару</span>
          </div>
        </div>

        <div className={styles.linkContainer}>
          <span className={styles.linkLabel}>Ваша ссылка-приглашение</span>
          <div className={styles.linkInputRow}>
            <span className={styles.linkText}>
              {isLoading ? 'Генерация персональной ссылки...' : inviteUrl}
            </span>
            <Button
              type="button"
              variant={isCopied ? 'confirm' : 'secondary'}
              onClick={handleCopyLink}
              disabled={isLoading || !inviteUrl}
              icon={isCopied ? <Check size={15} /> : <Copy size={15} />}
            >
              {isCopied ? 'Скопировано' : 'Копировать'}
            </Button>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleShareTelegram}
            disabled={isLoading || !inviteUrl}
            icon={<Send size={18} />}
          >
            Поделиться в Telegram
          </Button>
        </div>
      </div>
    </Modal>
  );
};

