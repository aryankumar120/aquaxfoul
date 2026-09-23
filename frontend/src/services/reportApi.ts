import { apiClient } from './api';
import { ReportItem } from '../types';
import { mockReports } from '../mocks/mockReports';

export const reportApi = {
  async getReports(): Promise<ReportItem[]> {
    try {
      const response = await apiClient.get<ReportItem[]>('/reports');
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return mockReports;
    }
  },

  async downloadReport(id: string): Promise<{ success: boolean; filename: string }> {
    const report = mockReports.find((r) => r.id === id);
    const filename = report ? `${report.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${report.format.toLowerCase()}` : `report-${id}.pdf`;

    // Simulate instant mock download
    const blob = new Blob([`Aqua-X-Foul Maritime Platform Report: ${report?.title || id}\nExported: ${new Date().toISOString()}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, filename };
  },
};
