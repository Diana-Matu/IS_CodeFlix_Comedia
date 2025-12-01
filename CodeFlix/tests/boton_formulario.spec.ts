import { test, expect } from '@playwright/test';

// Prueba que el botón de contacto en la página principal lleva al formulario de contacto
test('El botón de contacto lleva al formulario', async ({ page }) => {
  // Entrar a la página principal (ajusta el puerto si no es 4321)
  await page.goto('http://localhost:4321/');

  // Verificar que el título dice CodeFlix
  await expect(page).toHaveTitle(/CodeFlix/);

  // Buscar el botón que creamos y hacerle clic
  const botonContacto = page.getByRole('link', { name: 'CONTACTANOS' });
  await expect(botonContacto).toBeVisible();
  await botonContacto.click();

  // Verificar que nos llevó a la URL de contacto
  await expect(page).toHaveURL(/.*contact/);

  // Verificar que existe el campo de "Tu Nombre"
  await expect(page.getByLabel('Tu Nombre')).toBeVisible();
});