import React from 'react';
import styles from './SectionHeader.module.scss';

export interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  level = 2,
  className = '',
}) => {
  const HeadingTag = `h${level}` as React.ElementType;
  const levelClass = styles[`level${level}`] || styles.level2;

  return (
    <div className={`${styles.sectionHeader} ${className}`}>
      <div className={styles.left}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.textGroup}>
          <HeadingTag className={`${styles.title} ${levelClass}`}>{title}</HeadingTag>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
      </div>
      {action && <div className={styles.right}>{action}</div>}
    </div>
  );
};
