import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';

// Mock ECharts to avoid canvas rendering complexities in jsdom
vi.mock('echarts-for-react', () => ({
  default: () => <div data-testid="mock-echart">Chart Mock</div>,
}));

describe('Dashboard Module', () => {
  const queryClient = new QueryClient();

  it('renders greeting and KPI cards with realistic metrics', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MemoryRouter>
            <DashboardPage />
          </MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    );

    // Verify greeting
    await waitFor(() => {
      expect(screen.getByText(/Good morning/i)).toBeInTheDocument();
    });

    // Verify KPI metric cards
    expect(screen.getByText('Total Vessels')).toBeInTheDocument();
    expect(screen.getByText('142')).toBeInTheDocument();
    expect(screen.getByText('Active Vessels')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('Requiring Attention')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.getByText('Cleaning Due')).toBeInTheDocument();
    expect(screen.getByText('26')).toBeInTheDocument();
    expect(screen.getByText(/2,840/i)).toBeInTheDocument();

    // Verify recent vessels table loaded
    const oceanPioneerItems = screen.getAllByText('Ocean Pioneer');
    expect(oceanPioneerItems.length).toBeGreaterThan(0);
    expect(screen.getAllByText('Blue Horizon').length).toBeGreaterThan(0);
  });
});
