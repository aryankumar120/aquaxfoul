import { apiClient } from './api';
import {
  Vessel,
  VesselFilterParams,
  PaginatedResponse,
  InspectionRecord,
  FoulingAssessmentRecord,
  CleaningEvent,
  PerformanceRecord,
} from '../types';
import { generateFullFleet, mockVessels } from '../mocks/mockVessels';
import {
  mockInspections,
  mockFoulingAssessments,
  mockCleanings,
  mockPerformance,
} from '../mocks/mockDetails';

const cachedFleet = generateFullFleet();

export const vesselApi = {
  async getVessels(params: VesselFilterParams = {}): Promise<PaginatedResponse<Vessel>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Vessel>>('/vessels', { params });
      return response.data;
    } catch {
      // Mock fallback: apply filtering, sorting, and pagination
      await new Promise((resolve) => setTimeout(resolve, 300));

      let result = [...cachedFleet];

      // Global Search across Name, IMO, Technical Manager
      if (params.search && params.search.trim() !== '') {
        const query = params.search.toLowerCase().trim();
        result = result.filter(
          (v) =>
            v.name.toLowerCase().includes(query) ||
            v.imo.toLowerCase().includes(query) ||
            v.technicalManager.toLowerCase().includes(query)
        );
      }

      // Vessel Type filter
      if (params.type && params.type !== 'All') {
        result = result.filter((v) => v.type === params.type);
      }

      // Manager Domicile filter
      if (params.managerDomicile && params.managerDomicile !== 'All') {
        result = result.filter((v) => v.managerDomicile === params.managerDomicile);
      }

      // Technical Manager filter
      if (params.technicalManager && params.technicalManager !== 'All') {
        result = result.filter((v) => v.technicalManager === params.technicalManager);
      }

      // Fouling Risk filter
      if (params.foulingRisk && params.foulingRisk !== 'All') {
        result = result.filter((v) => v.foulingRisk === params.foulingRisk);
      }

      // Status filter
      if (params.status && params.status !== 'All') {
        result = result.filter((v) => v.status === params.status);
      }

      // DWT Range
      if (params.minDwt !== undefined) {
        result = result.filter((v) => v.dwt >= (params.minDwt || 0));
      }
      if (params.maxDwt !== undefined) {
        result = result.filter((v) => v.dwt <= (params.maxDwt || 9999999));
      }

      // Sorting
      if (params.sortBy) {
        const key = params.sortBy as keyof Vessel;
        const order = params.sortOrder === 'desc' ? -1 : 1;
        result.sort((a, b) => {
          const valA = a[key] ?? '';
          const valB = b[key] ?? '';
          if (valA < valB) return -1 * order;
          if (valA > valB) return 1 * order;
          return 0;
        });
      }

      // Pagination
      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || 10;
      const total = result.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const data = result.slice(startIndex, startIndex + limit);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    }
  },

  async getVessel(idOrImo: string): Promise<Vessel> {
    try {
      const response = await apiClient.get<Vessel>(`/vessels/${idOrImo}`);
      return response.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const vessel =
        cachedFleet.find((v) => v.id === idOrImo || v.imo === idOrImo) ||
        mockVessels.find((v) => v.id === idOrImo || v.imo === idOrImo) ||
        cachedFleet[0];
      return vessel;
    }
  },

  async getInspections(vesselId: string): Promise<InspectionRecord[]> {
    try {
      const response = await apiClient.get<InspectionRecord[]>(`/vessels/${vesselId}/inspections`);
      return response.data;
    } catch {
      return mockInspections.filter((i) => i.vesselId === vesselId || i.vesselId === 'v-9876543');
    }
  },

  async getFoulingData(vesselId: string): Promise<FoulingAssessmentRecord[]> {
    try {
      const response = await apiClient.get<FoulingAssessmentRecord[]>(`/vessels/${vesselId}/fouling`);
      return response.data;
    } catch {
      return mockFoulingAssessments.filter((f) => f.vesselId === vesselId || f.vesselId === 'v-9876543');
    }
  },

  async getCleaningHistory(vesselId: string): Promise<CleaningEvent[]> {
    try {
      const response = await apiClient.get<CleaningEvent[]>(`/vessels/${vesselId}/cleaning`);
      return response.data;
    } catch {
      return mockCleanings.filter((c) => c.vesselId === vesselId || c.vesselId === 'v-9876543');
    }
  },

  async getPerformanceData(vesselId: string): Promise<PerformanceRecord[]> {
    try {
      const response = await apiClient.get<PerformanceRecord[]>(`/vessels/${vesselId}/performance`);
      return response.data;
    } catch {
      return mockPerformance;
    }
  },
};
