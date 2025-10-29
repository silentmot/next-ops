'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';
import { IconName, IconSize } from '../../icons';

interface IconButtonProps {
  icon: IconName;
  onClick: () => void;
  size?: IconSize;
  color?: string;
  variant?: 'ghost' | 'solid' | 'outline' | 'gradient';
  disabled?: boolean;
  ariaLabel: string;
  isDark?: boolean;
  className?: string;
}

/**
 * Interactive Icon Button - With hover effects
 * Source: DeskOps-DashboardGuide.md - ICON BUTTON COMPONENT
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      onClick,
      size = 'md',
      color = 'primary',
      variant = 'ghost',
      disabled = false,
      ariaLabel,
      isDark = true,
      className = '',
    },
    ref
  ) => {
    const variantStyles = {
      ghost: 'hover:bg-white/10',
      solid: 'bg-white/20 hover:bg-white/30',
      outline: 'border border-white/20 hover:border-white/40',
      gradient:
        'bg-gradient-to-r from-emerald-500/20 to-violet-500/20 hover:from-emerald-500/30 hover:to-violet-500/30',
    };

    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`
          relative inline-flex items-center justify-center
          p-2 rounded-lg
          backdrop-blur-md
          transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          focus-visible:ring-emerald-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${className}
        `.trim()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon name={icon} size={size} color={color} isDark={isDark} animated />
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';
export default IconButton;