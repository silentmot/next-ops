/**
 * Icon Registry - Single Source of Truth for Icon Mappings
 * Source: DeskOps-DashboardGuide.md - Icon System & Library Specification
 */

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  ShoppingCart,
  Target,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  LineChart,
  AreaChart,
  BarChart,
  PieChart,
  ScatterChart,
  Home,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Zap,
  Sun,
  Moon,
  Monitor,
  Download,
  Upload,
  Share2,
  Filter,
  Search,
  RefreshCw,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  HelpCircle,
} from 'lucide-react';

/**
 * Icon Registry - Map semantic names to Lucide icons
 */
export const IconRegistry = {
  // Dashboard Metrics
  revenue: DollarSign,
  users: Users,
  performance: TrendingUp,
  activity: Activity,
  orders: ShoppingCart,
  goals: Target,
  views: Eye,
  time: Clock,

  // Charts
  line: LineChart,
  area: AreaChart,
  bar: BarChart,
  pie: PieChart,
  scatter: ScatterChart,
  trend: TrendingUp,
  decline: TrendingDown,
  barChart3: BarChart3,

  // Navigation
  home: Home,
  settings: Settings,
  logout: LogOut,
  menu: Menu,
  close: X,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,

  // Status
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  alert: AlertTriangle,
  critical: AlertOctagon,
  info: Info,
  help: HelpCircle,
  power: Zap,
  checkCircle2: CheckCircle2,

  // Theme
  sun: Sun,
  moon: Moon,
  device: Monitor,

  // Actions
  download: Download,
  upload: Upload,
  share: Share2,
  filter: Filter,
  search: Search,
  refresh: RefreshCw,
  calendar: Calendar,
} as const;

export type IconName = keyof typeof IconRegistry;