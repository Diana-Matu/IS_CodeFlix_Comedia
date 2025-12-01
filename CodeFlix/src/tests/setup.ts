// src/tests/setup.ts
import { TextEncoder, TextDecoder } from 'util';

// Parche para arreglar el error de "Invariant violation" en JSDOM
Object.assign(global, { TextEncoder, TextDecoder });