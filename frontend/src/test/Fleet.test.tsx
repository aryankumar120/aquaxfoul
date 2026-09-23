import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { FleetPage } from '../pages/Fleet/FleetPage';

describe('Fleet / Vessel Directory Module', () => {
  it('renders vessel directory and responds to search', async () => {
    render(
      <MemoryRouter>
        <FleetPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Fleet & Vessel Directory/i)).toBeInTheDocument();
    });

    // Verify search input is present
    const searchInput = screen.getByPlaceholderText(/Search by vessel name/i);
    expect(searchInput).toBeInTheDocument();

    // Trigger search for specific vessel
    fireEvent.change(searchInput, { target: { value: 'Ocean Pioneer' } });

    // Wait for filtered result
    await waitFor(() => {
      expect(screen.getByText('Ocean Pioneer')).toBeInTheDocument();
    });
  });
});
