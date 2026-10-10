import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResizeObserver for ECharts and responsive components in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock HTMLCanvasElement.getContext for charts
HTMLCanvasElement.prototype.getContext = (() => {
  return {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: [] }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    rect: () => {},
    clip: () => {},
  } as any;
}) as any;

// Mock apiClient network calls during unit tests so tests run against standalone mock baseline
vi.mock('../services/api', () => ({
  apiClient: {
    get: vi.fn().mockRejectedValue(new Error('Network offline (test fallback)')),
    post: vi.fn().mockRejectedValue(new Error('Network offline (test fallback)')),
    put: vi.fn().mockRejectedValue(new Error('Network offline (test fallback)')),
    delete: vi.fn().mockRejectedValue(new Error('Network offline (test fallback)')),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));
