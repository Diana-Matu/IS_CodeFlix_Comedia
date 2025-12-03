// src/setupTests.js
import '@testing-library/dom';
import { vi } from 'vitest';

// Mock de fetch
global.fetch = vi.fn();

// Mock de Astro
globalThis.Astro = {
  props: {},
  request: {},
  redirect: vi.fn(),
};

// Mock de environment
globalThis.import_meta_env = {
  TMDB_ACCESS_TOKEN: 'test-token',
};