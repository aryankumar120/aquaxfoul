import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LoginPage } from '../pages/Login/LoginPage';

describe('Authentication Module', () => {
  it('renders login screen with credentials input', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Aqua-X-Foul')).toBeInTheDocument();
    expect(screen.getByText(/Enterprise Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Security Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Dashboard/i })).toBeInTheDocument();
  });
});
