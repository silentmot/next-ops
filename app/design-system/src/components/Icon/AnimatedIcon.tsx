'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';
import { IconName, IconSize } from '../../icons';

interface AnimatedIconProps {
  name: IconName;
  size?: IconSize;
  color?: string;
  animation?: 'pulse' | 'spin' | 'bounce' | 'wave' | 'flip';
  duration?: number;
  isDark?: boolean;
}

/**
 * Animated Icon - Framer Motion-powered animations
 * Source: DeskOps-DashboardGuide.md - ANIMATED ICON COMPONENT
 */
export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  name,
  size = 'md',
  color = 'primary',
  animation = 'pulse',
  duration = 2,
  isDark = true,
}) => {
  const animationVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.7, 1],
      transition: { duration, repeat: Infinity, ease: 'easeInOut' },
    },
    spin: {
      rotate: [0, 360],
      transition: { duration, repeat: Infinity, ease: 'linear' },
    },
    bounce: {
      y: [0, -8, 0],
      transition: { duration, repeat: Infinity, ease: 'easeInOut' },
    },
    wave: {
      rotate: [0, 15, -15, 0],
      transition: { duration, repeat: Infinity, ease: 'easeInOut' },
    },
    flip: {
      rotateY: [0, 360],
      transition: { duration, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      animate={animationVariants[animation]}
      style={{ display: 'inline-block' }}
    >
      <Icon name={name} size={size} color={color} isDark={isDark} />
    </motion.div>
  );
};

export default AnimatedIcon;