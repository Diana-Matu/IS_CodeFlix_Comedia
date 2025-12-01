import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Movies from '../components/Movies.astro'; 
// Prueba que el componente Movies se renderiza correctamente
test('El componente Movies renderiza correctamente', async () => {
  // Creamos un contenedor falso de Astro
  const container = await AstroContainer.create();
  
  // Renderizamos el componente Movies dentro de él
  const result = await container.renderToString(Movies);

  // Verificamos que el HTML resultante tenga texto clave
  expect(result).toContain('CodeFlix'); 
});