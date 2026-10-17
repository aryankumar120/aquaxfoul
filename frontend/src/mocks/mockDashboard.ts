import { DashboardSummary, AlertItem } from '../types';
import { mockVessels } from './mockVessels';

export const mockAlerts: AlertItem[] = [
  {
    id: 'alt-1',
    vesselId: 'v-9012345',
    vesselName: 'Pacific Crown',
    imo: '9012345',
    message: 'High fouling risk detected',
    severity: 'critical',
    timestamp: '2026-09-17T10:30:00Z',
    timeAgo: '2 days ago',
  },
  {
    id: 'alt-2',
    vesselId: 'v-9345678',
    vesselName: 'Sea Voyager',
    imo: '9345678',
    message: 'Cleaning due in 15 days',
    severity: 'high',
    timestamp: '2026-09-16T14:15:00Z',
    timeAgo: '3 days ago',
  },
  {
    id: 'alt-3',
    vesselId: 'v-9123456',
    vesselName: 'Blue Horizon',
    imo: '9123456',
    message: 'Fuel consumption above expected',
    severity: 'warning',
    timestamp: '2026-09-14T08:00:00Z',
    timeAgo: '5 days ago',
  },
  {
    id: 'alt-4',
    vesselId: 'v-9876543',
    vesselName: 'Ocean Pioneer',
    imo: '9876543',
    message: 'Inspection completed',
    severity: 'info',
    timestamp: '2026-09-13T16:45:00Z',
    timeAgo: '6 days ago',
  },
  {
    id: 'alt-5',
    vesselId: 'v-9765432',
    vesselName: 'Global Trader',
    imo: '9765432',
    message: 'Moderate fouling risk',
    severity: 'warning',
    timestamp: '2026-09-12T09:20:00Z',
    timeAgo: '1 week ago',
  },
];

export const mockDashboardSummary: DashboardSummary = {
  kpis: {
    totalVessels: {
      value: 142,
      changePct: 12,
      trend: [126, 129, 133, 136, 139, 142],
    },
    activeVessels: {
      value: 128,
      changePct: 8,
      trend: [118, 120, 122, 124, 126, 128],
    },
    requiringAttention: {
      value: 14,
      changePct: 3,
      trend: [12, 11, 14, 13, 15, 14],
    },
    cleaningDue: {
      value: 26,
      changePct: 18,
      trend: [21, 22, 23, 25, 24, 26],
    },
    estimatedCo2Savings: {
      value: 2840,
      changePct: 22,
      trend: [2100, 2300, 2480, 2600, 2720, 2840],
    },
  },
  vesselDistribution: [
    { type: 'Container Ship', count: 34, percentage: 23.9, color: '#00B7EB' },
    { type: 'Bulk Carrier', count: 28, percentage: 19.7, color: '#10b981' },
    { type: 'General Cargo', count: 18, percentage: 12.7, color: '#3b82f6' },
    { type: 'LNG Carrier', count: 16, percentage: 11.3, color: '#6366f1' },
    { type: 'Cruise', count: 12, percentage: 8.5, color: '#a855f7' },
    { type: 'Other', count: 34, percentage: 23.9, color: '#94a3b8' },
  ],
  riskDistribution: [
    { level: 'Low', count: 45, color: '#10b981' },
    { level: 'Moderate', count: 30, color: '#3b82f6' },
    { level: 'High', count: 18, color: '#f97316' },
    { level: 'Critical', count: 8, color: '#ef4444' },
  ],
  fuelConsumptionTrend: [
    { month: 'Apr', value: 160 },
    { month: 'May', value: 125 },
    { month: 'Jun', value: 110 },
    { month: 'Jul', value: 85 },
    { month: 'Aug', value: 70 },
    { month: 'Sep', value: 52 },
  ],
  recentVessels: mockVessels.slice(0, 5),
  recentAlerts: mockAlerts,
};
