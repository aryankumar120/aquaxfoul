import { apiClient } from './api';
import { DashboardSummary } from '../types';
import { mockDashboardSummary } from '../mocks/mockDashboard';

export const dashboardApi = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const response = await apiClient.get<DashboardSummary>('/dashboard/summary');
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return mockDashboardSummary;
    }
  },
};
