import { useRef, useEffect } from 'react';
import type { InputHTMLAttributes, FC } from 'react';
import styles from './Slider.module.scss';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const Slider: FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className = '',
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const percent = max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 50;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.setProperty('--slider-percent', `${percent}%`);
    }
  }, [percent]);

  return (
    <div className={styles.sliderWrapper}>
      <input
        ref={inputRef}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`${styles.slider} ${className}`.trim()}
        {...rest}
      />
    </div>
  );
};
