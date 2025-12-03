import { test, expect } from '@playwright/test';

test.describe('Validación del Formulario de Contacto', () => {

  test.beforeEach(async ({ page }) => {
    // Entramos a la página de contacto antes de cada prueba
    await page.goto('http://localhost:4321/contact');
  });

  test('No debe enviar si el nombre está vacío', async ({ page }) => {
    // 1. Buscamos el botón de enviar y le damos click SIN llenar nada
    await page.getByRole('button', { name: /Enviar/i }).click({ force: true });

    // 2. Obtenemos el input del nombre
    const inputNombre = page.locator('#name');

    // 3. Preguntamos al navegador: "¿Este campo es válido?"
    // HTML5 devuelve validity.valid = false si está vacío y tiene 'required'
    const esValido = await inputNombre.evaluate((e: HTMLInputElement) => e.validity.valid);

    // 4. Esperamos que SEA FALSO (que no sea válido)
    expect(esValido).toBe(false);
  });

  test('No debe enviar si el email no tiene formato de correo', async ({ page }) => {
    // 1. Llenamos el nombre bien
    await page.fill('#name', 'Erick Israel');

    // 2. Llenamos el correo MAL (sin @ ni dominio)
    await page.fill('#email', 'esto-no-es-un-correo');
    
    // 3. Intentamos enviar
    await page.getByRole('button', { name: /Enviar/i }).click({ force: true });

    // 4. Verificamos que el campo email sea inválido
    const inputEmail = page.locator('#email');
    const esValido = await inputEmail.evaluate((e: HTMLInputElement) => e.validity.valid);

    expect(esValido).toBe(false);
  });

  test('No debe enviar si el mensaje está vacío', async ({ page }) => {
    // 1. Llenamos nombre y correo CORRECTAMENTE para que no sean el problema
    await page.fill('#name', 'Erick Israel');
    await page.fill('#email', 'erick@test.com');

    // 2. Nos aseguramos de que el mensaje esté vacío
    await page.fill('#message', '');

    // 3. Intentamos enviar (usando force: true por la barrita de Astro)
    await page.getByRole('button', { name: /Enviar/i }).click({ force: true });

    // 4. Verificamos que el navegador marque el campo #message como inválido
    const inputMensaje = page.locator('#message');
    // Nota: Aquí usamos HTMLTextAreaElement porque es un <textarea>, no un <input>
    const esValido = await inputMensaje.evaluate((e: HTMLTextAreaElement) => e.validity.valid);

    expect(esValido).toBe(false);
  });

});