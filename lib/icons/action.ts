/**
 * Action button icons
 * Source: Document 1 - Export capability & common actions
 */

import {
  Check,
  Download,
  Edit,
  Filter,
  Minus,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Upload,
  X,
} from "lucide-react";

export const ActionIcons = {
  download: Download,
  upload: Upload,
  refresh: RefreshCw,
  settings: Settings,
  filter: Filter,
  search: Search,
  close: X,
  check: Check,
  edit: Edit,
  delete: Trash2,
  add: Plus,
  remove: Minus,
} as const;

export type ActionIconKey = keyof typeof ActionIcons;
