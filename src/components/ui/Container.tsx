import React from 'react';
import { container, spacing } from '@/styles/design-system';
import { cx } from 'class-variance-authority';

export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  padding?: boolean;
  centered?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'xl',
  className = '',
  padding = true,
  centered = true,
}) => {
  return (
    <div
      className={cx(
        'w-full',
        {
          'max-w-screen-sm': maxWidth === 'sm',
          'max-w-screen-md': maxWidth === 'md',
          'max-w-screen-lg': maxWidth === 'lg',
          'max-w-screen-xl': maxWidth === 'xl',
          'max-w-screen-2xl': maxWidth === '2xl',
          'mx-auto': centered,
          'px-4 sm:px-6 md:px-8': padding,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
