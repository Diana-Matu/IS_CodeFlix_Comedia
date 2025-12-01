# IS_CodeFlix_Comedia
Página web Peliculas/Comedia

Para poder correr la spruebas primeor es necesario hacer las siguientes instalaciones:
## 1. Instalar Dependencias
Abre una terminal en la carpeta del proyecto y ejecuta:

    npm install

## 2. Instalar Navegadores de Prueba
Playwright necesita descargar sus propios navegadores. Ejecuta:

    npx playwright install

*(Nota: Si estás en Linux y falla, ejecuta: `sudo npx playwright install-deps`)*

## 3. Ejecutar las Pruebas

### Pruebas Unitarias (Vitest)
Verifican los componentes individuales (Header, etc.):

    npm run test:unit

### Pruebas End-to-End (Playwright)
Verifican el flujo del sitio (Catálogo, Contacto):

    npx playwright test --project=chromium

## 4. Ver el sitio web
Para levantar el servidor local:

    npm run dev

### Correr las pruebas

Una vez echas para correr las pruebas funcionales se hace con:

```bash
npx playwright test --project=chromium --project=firefox

```
Para ver los resultados si no se cargan en el navegador correr:
```bash
npx playwright show-report
```

En el caso de las pruebas que estan en src correr:
```bash
npm run test:unit
```
Si aparece un error correr:

```bash
npx vitest run
```