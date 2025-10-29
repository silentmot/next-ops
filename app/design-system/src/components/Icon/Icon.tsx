'use client';

import React from 'react';
import { IconRegistry, IconName } from '../../icons/registry';
import { IconSizes, IconSize, IconColors, IconStrokeWidths, IconStrokeWidth } from '../../icons/theme';
import { motion } from 'framer-motion';
import styles from './Icon.module.css';

interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: 'primary' | 'secondary' | 'tertiary' | string;
  variant?: 'solid' | 'outline' | 'gradient';
  stroke?: IconStrokeWidth;
  animated?: boolean;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
  isDark?: boolean;
}

/**
 * Base Icon Component - Type-safe, themeable, animated
 * Source: DeskOps-DashboardGuide.md - BASE ICON COMPONENT
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      name,
      size = 'md',
      color = 'primary',
      variant = 'solid',
      stroke = 'normal',
      animated = false,
      className = '',
      ariaLabel,
      onClick,
      isDark = true,
    },
    ref
  ) => {
    const IconComponent = IconRegistry[name];
    const sizePixels = IconSizes[size];

    const themeColors = isDark ? IconColors.dark : IconColors.light;
    
    let iconColor: string;
    if (color === 'primary' || color === 'secondary' || color === 'tertiary') {
      iconColor = themeColors[color];
    } else if (color in themeColors.status) {
      iconColor = themeColors.status[color as keyof typeof themeColors.status];
    } else if (color in themeColors.accent) {
      iconColor = themeColors.accent[color as keyof typeof themeColors.accent];
    } else {
      iconColor = color;
    }

    const baseClasses = `
      inline-block
      flex-shrink-0
      ${onClick ? 'cursor-pointer' : ''}
      ${animated ? styles.animated : ''}
      ${className}
    `.trim();

    const iconElement = (
      <IconComponent
        ref={ref}
        size={sizePixels}
        strokeWidth={IconStrokeWidths[stroke]}
        color={iconColor}
        className={baseClasses}
        onClick={onClick}
        aria-label={ariaLabel || name}
        role={onClick ? 'button' : 'img'}
        tabIndex={onClick ? 0 : undefined}
      />
    );

    if (animated) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {iconElement}
        </motion.div>
      );
    }

    return iconElement;
  }
);

Icon.displayName = 'Icon';
export default Icon;