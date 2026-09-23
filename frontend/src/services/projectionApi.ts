import { apiClient } from './api';
import { VesselProjections } from '../types';
import { mockVesselProjections } from '../mocks/mockProjections';

export const projectionApi = {
  async getProjections(vesselId: string = 'v-9876543'): Promise<VesselProjections> {
    try {
      const response = await apiClient.get<VesselProjections>(`/projections/${vesselId}`);
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockVesselProjections[vesselId] || mockVesselProjections['v-9876543'] || mockVesselProjections.default;
    }
  },
};
