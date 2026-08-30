import type { FC } from 'react';
import { Camera, Image as ImageIcon, Check } from 'lucide-react';
import { Modal, Button } from '@/shared/ui';
import { usePhotoUpload } from '../../model/usePhotoUpload';
import styles from './PhotoUploadModal.module.scss';

export interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl?: string | null;
  onSavePhoto?: (photoUrl: string) => void;
}

export const PhotoUploadModal: FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  onSavePhoto,
}) => {
  const {
    photoUrl,
    isUploading,
    fileInputRef,
    handleFileChange,
    handleOpenPicker,
    handleConfirm,
  } = usePhotoUpload({ currentPhotoUrl, onSavePhoto, onClose });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Отправить Lock It фото">
      <div className={styles.container}>
        <div
          className={styles.previewBox}
          onClick={handleOpenPicker}
        >
          {photoUrl ? (
            <img src={photoUrl} alt="Preview" className={styles.previewImg} />
          ) : (
            <div className={styles.placeholder}>
              <Camera size={32} />
              <span>Нажмите, чтобы загрузить фото</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleFileChange}
        />

        <div className={styles.actionBtns}>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleOpenPicker}
            icon={<ImageIcon size={16} />}
          >
            Из галереи
          </Button>
          <Button
            type="button"
            variant="confirm"
            fullWidth
            disabled={isUploading}
            onClick={handleConfirm}
            icon={<Check size={16} />}
          >
            {isUploading ? 'Отправка...' : 'Отправить'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

