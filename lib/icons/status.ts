/**
 * Status indicator icons
 * Source: Document 1 - Status indicators
 */

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  XCircle,
} from "lucide-react";

export const StatusIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  pending: Clock,
  alert: AlertCircle,
} as const;

export type StatusIconKey = keyof typeof StatusIcons;
