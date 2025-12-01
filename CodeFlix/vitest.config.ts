/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    // CAMBIO IMPORTANTE: Usamos 'node' en vez de 'jsdom'
    environment: 'node',
    
    // Mantenemos estas líneas para ignorar a Playwright
    include: ['src/**/*.test.{js,ts}'],
    exclude: ['tests/**', 'node_modules/**'],
  },
});