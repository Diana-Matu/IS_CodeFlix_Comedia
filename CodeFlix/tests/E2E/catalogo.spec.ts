import { test, expect } from '@playwright/test';

//Prueba que el catálogo carga películas desde la API
test('El catálogo carga películas desde la API correctamente', async ({ page }) => {
  // Entrar a la página
  await page.goto('http://localhost:4321/');

  //Localizar todas las imágenes (pósters) dentro del main o grid
  const posters = page.locator('main img');

  // Esperar a que aparezca al menos una imagen
  await expect(posters.first()).toBeVisible();

  //Validar que hay una cantidad razonable
  const cantidad = await posters.count();
  console.log(`Se encontraron ${cantidad} películas cargadas desde la API.`);
  
  expect(cantidad).toBeGreaterThan(0);
});