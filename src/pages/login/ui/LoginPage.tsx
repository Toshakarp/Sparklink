import { useState } from 'react';
import type { FC } from 'react';
import { Heart, UserPlus, CalendarHeart, Camera, Sparkles } from 'lucide-react';
import { Button, Card } from '@/shared/ui';
import { DemoAuthButton, RetryAuthButton } from '@/features/auth';
import { LinkPartnerModal } from '@/features/link-partner';
import { useUserStore } from '@/entities/user';
import { useAppInit } from '@/features/auth';
import styles from './LoginPage.module.scss';

export interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const isAuth = useUserStore((state) => state.isAuth);
  const { retryInit } = useAppInit();

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await retryInit();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.heroSection}>
        <div className={styles.brandBadge}>
          <Heart size={36} fill="currentColor" />
        </div>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>SparkLink</h1>
          <p className={styles.subtitle}>
            Персональное приватное пространство для влюблённых
          </p>
        </div>
      </div>

      <div className={styles.featuresList}>
        <Card className={styles.featureItem}>
          <div className={`${styles.featureIcon} ${styles.pink}`}>
            <Camera size={20} />
          </div>
          <div className={styles.featureText}>
            <span className={styles.featureTitle}>Настроение и LockIt-фото</span>
            <span className={styles.featureDesc}>
              Делитесь эмоциями и мгновенными снимками прямо на экран партнёра
            </span>
          </div>
        </Card>

        <Card className={styles.featureItem}>
          <div className={`${styles.featureIcon} ${styles.blue}`}>
            <CalendarHeart size={20} />
          </div>
          <div className={styles.featureText}>
            <span className={styles.featureTitle}>Рандомайзер и места</span>
            <span className={styles.featureDesc}>
              Выбирайте идеи для свиданий с фильтрацией по бюджету и категориям
            </span>
          </div>
        </Card>

        <Card className={styles.featureItem}>
          <div className={`${styles.featureIcon} ${styles.orange}`}>
            <Sparkles size={20} />
          </div>
          <div className={styles.featureText}>
            <span className={styles.featureTitle}>Внимание и синхронизация</span>
            <span className={styles.featureDesc}>
              Отправляйте сигналы заботы и отслеживайте общую историю встреч
            </span>
          </div>
        </Card>
      </div>

      <div className={styles.actionSection}>
        {isAuth ? (
          <>
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={() => setIsLinkModalOpen(true)}
              icon={<UserPlus size={18} />}
            >
              Привязать партнёра
            </Button>
            <div className={styles.dividerRow}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>или</span>
              <span className={styles.dividerLine} />
            </div>
            <DemoAuthButton onSuccess={onLoginSuccess} />
          </>
        ) : (
          <Card variant="big">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Не удалось подключиться к базе данных или Telegram.
              </p>
              <RetryAuthButton isLoading={isRetrying} onRetry={handleRetry} />
              <div className={styles.dividerRow}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>или</span>
                <span className={styles.dividerLine} />
              </div>
              <DemoAuthButton onSuccess={onLoginSuccess} label="Войти в демо-режим" />
            </div>
          </Card>
        )}
      </div>

      <LinkPartnerModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
      />
    </div>
  );
};

