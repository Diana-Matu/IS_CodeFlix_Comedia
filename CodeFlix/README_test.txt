Dependencias necearias para las pruebas

npm install

npx playwright install


Para correr las pruebas

Pruebas unitarias

Todas las pruebas unitarias
npm test

Modo watch (desarrollo)
npm run test:watch

Con interfaz UI
npm run test:ui

Con reporte de cobertura
npm run test:coverage


Pruebas E2E

1. Iniciar sitio web (en terminal 1)
npm run dev

2. Ejecutar pruebas E2E (en terminal 2)
npm run test:e2e

3. Correr con interfaz UI
npm run test:e2e:ui


Todas las pruebas

Ejecuta pruebas unitarias + E2E
npm run test:all