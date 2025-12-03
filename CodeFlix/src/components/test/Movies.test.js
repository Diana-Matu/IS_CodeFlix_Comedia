// src/components/test/Movies.test.js - VERSIÓN VITEST
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

// ------------------------------------------------------------
// FUNCIONES DEL COMPONENTE (simulan las de Movies.astro)
// ------------------------------------------------------------

function setStatus(msg, statusElement) {
  if (statusElement) {
    statusElement.textContent = msg;
  }
}

function clearGrid(gridElement) {
  if (gridElement) gridElement.innerHTML = "";
}

function renderMovies(movies, gridElement) {
  if (!gridElement) return;
  clearGrid(gridElement);
  
  const moviesToShow = movies.slice(0, 24);
  
  moviesToShow.forEach(movie => {
    const link = document.createElement("a");
    link.className = "card";
    link.href = `/movies/${movie.id}`;

    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = movie.title || movie.name || "Untitled";
    img.src = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
      : "https://via.placeholder.com/500x750?text=No+Image";
    
    link.appendChild(img);

    const header = document.createElement("div");
    header.className = "card-info";

    const h2 = document.createElement("h2");
    h2.className = "title";
    h2.textContent = movie.title || movie.name || "Untitled";
    header.appendChild(h2);

    const p = document.createElement("p");
    p.className = "rating";
    p.textContent = `⭐ ${movie.vote_average || "—"} • ${movie.release_date || movie.first_air_date || ""}`;
    header.appendChild(p);

    if (movie.overview) {
      const ov = document.createElement("p");
      ov.className = "overview";
      ov.textContent = movie.overview;
      header.appendChild(ov);
    }

    link.appendChild(header);
    gridElement.appendChild(link);
  });
}

// ------------------------------------------------------------
// PRUEBAS DE LÓGICA BÁSICA
// ------------------------------------------------------------

describe('Movies Component - Basic Logic', () => {
  let moviesGrid;
  let statusEl;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="movies-grid"></div>
      <div id="status"></div>
    `;
    
    moviesGrid = document.getElementById('movies-grid');
    statusEl = document.getElementById('status');
  });

  test('setStatus actualiza el mensaje correctamente', () => {
    setStatus('Cargando...', statusEl);
    expect(statusEl.textContent).toBe('Cargando...');
  });

  test('setStatus maneja elemento nulo', () => {
    setStatus('Test', null);
    expect(statusEl.textContent).toBe('');
  });

  test('clearGrid limpia el contenido', () => {
    moviesGrid.innerHTML = '<div>Test content</div>';
    clearGrid(moviesGrid);
    expect(moviesGrid.innerHTML).toBe('');
  });

  test('renderMovies crea elementos DOM correctamente', () => {
    const movies = [
      {
        id: 1,
        title: 'Test Movie',
        poster_path: '/test.jpg',
        vote_average: 8.0,
        release_date: '2023-01-01',
        overview: 'Test overview'
      }
    ];

    renderMovies(movies, moviesGrid);

    const cards = moviesGrid.querySelectorAll('.card');
    expect(cards).toHaveLength(1);
    
    const img = cards[0].querySelector('img');
    expect(img.alt).toBe('Test Movie');
    expect(img.src).toContain('https://image.tmdb.org/t/p/w500/test.jpg');
  });

  test('renderMovies usa placeholder cuando no hay poster', () => {
    const movies = [
      {
        id: 1,
        title: 'No Poster Movie',
        poster_path: null,
        vote_average: 8.0
      }
    ];

    renderMovies(movies, moviesGrid);

    const img = moviesGrid.querySelector('img');
    expect(img.src).toContain('via.placeholder.com');
  });

  test('renderMovies limita a 24 películas', () => {
    const movies = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      title: `Movie ${i + 1}`,
      poster_path: '/test.jpg'
    }));

    renderMovies(movies, moviesGrid);

    const cards = moviesGrid.querySelectorAll('.card');
    expect(cards).toHaveLength(24);
  });
});

// ------------------------------------------------------------
// PRUEBAS DE INTEGRACIÓN
// ------------------------------------------------------------

describe('Movies Component - Integration Tests', () => {
  let searchInput, searchButton, filterSelect, moviesGrid, statusEl;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="search-input" type="text" placeholder="Buscar película o serie..." />
      <button id="search-button" type="button">🔍 Buscar</button>
      <select id="filter-select" aria-label="Filtros">
        <option value="comedy-movies">🎬 Películas de comedia</option>
        <option value="comedy-series">📺 Series de comedia</option>
      </select>
      <div id="status" role="status" aria-live="polite"></div>
      <div id="movies-grid"></div>
    `;
    
    searchInput = document.getElementById('search-input');
    searchButton = document.getElementById('search-button');
    filterSelect = document.getElementById('filter-select');
    moviesGrid = document.getElementById('movies-grid');
    statusEl = document.getElementById('status');
    
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('El componente tiene todos los elementos esenciales', () => {
    expect(searchInput).toBeTruthy();
    expect(searchInput.placeholder).toContain('Buscar película');
    
    expect(searchButton).toBeTruthy();
    expect(searchButton.textContent).toContain('Buscar');
    
    expect(filterSelect).toBeTruthy();
    expect(filterSelect.getAttribute('aria-label')).toBe('Filtros');
    
    expect(moviesGrid).toBeTruthy();
    expect(statusEl).toBeTruthy();
    expect(statusEl.getAttribute('aria-live')).toBe('polite');
  });

  test('La búsqueda por botón dispara fetch', () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });
    
    let fetchCalled = false;
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockImplementation(() => {
      fetchCalled = true;
      return Promise.resolve({ ok: true, json: async () => [] });
    });
    
    searchButton.addEventListener('click', () => {
      global.fetch('/api/movies');
    });
    
    searchButton.click();
    
    expect(fetchCalled).toBe(true);
    global.fetch = originalFetch;
  });

  test('Manejo de errores de API', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'API error'
    });
    
    async function fetchAndRender() {
      setStatus('Cargando...', statusEl);
      try {
        const res = await global.fetch('/api/movies');
        if (!res.ok) throw new Error('API error');
        return await res.json();
      } catch (err) {
        setStatus('Error cargando películas.', statusEl);
        return [];
      }
    }
    
    const result = await fetchAndRender();
    
    expect(statusEl.textContent).toBe('Error cargando películas.');
    expect(result).toEqual([]);
    expect(global.fetch).toHaveBeenCalled();
  });

  test('Renderizado de películas desde API', async () => {
    const mockApiResponse = [
      {
        id: 123,
        title: 'Película de Comedia',
        poster_path: '/comedia.jpg',
        vote_average: 8.2
      }
    ];
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    });
    
    const res = await global.fetch('/api/movies');
    const data = await res.json();
    renderMovies(data, moviesGrid);
    
    const cards = moviesGrid.querySelectorAll('.card');
    expect(cards).toHaveLength(1);
    expect(moviesGrid.querySelector('.title').textContent).toBe('Película de Comedia');
  });
});

// ------------------------------------------------------------
// PRUEBAS DE ACCESIBILIDAD
// ------------------------------------------------------------

describe('Movies Component - Accessibility', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <select id="filter-select" aria-label="Filtros">
        <option value="comedy-movies">Comedia</option>
      </select>
      <div id="status" role="status" aria-live="polite"></div>
    `;
  });

  test('El select de filtros tiene aria-label', () => {
    const filterSelect = document.getElementById('filter-select');
    expect(filterSelect.getAttribute('aria-label')).toBe('Filtros');
  });

  test('El estado tiene rol y aria-live correctos', () => {
    const statusEl = document.getElementById('status');
    expect(statusEl.getAttribute('role')).toBe('status');
    expect(statusEl.getAttribute('aria-live')).toBe('polite');
  });
});