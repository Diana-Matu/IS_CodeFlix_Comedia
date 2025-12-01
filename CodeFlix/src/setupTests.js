const { jest } = require('@jest/globals');

// Mock básico de fetch
global.fetch = jest.fn();

// Mock de Astro
globalThis.Astro = {
  props: {},
  request: {},
  redirect: jest.fn(),
};

// Mock de environment
globalThis.import_meta_env = {
  TMDB_ACCESS_TOKEN: 'test-token',
};