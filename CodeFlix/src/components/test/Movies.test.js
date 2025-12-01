/**
 * Pruebas para la lógica JavaScript del componente Movies.astro
 */

// Mock del DOM para las funciones del componente
describe('Movies Component Logic', () => {
  let moviesGrid;
  let statusEl;

  beforeEach(() => {
    // Setup del DOM mock
    document.body.innerHTML = `
      <div id="movies-grid"></div>
      <div id="status"></div>
    `;

    moviesGrid = document.getElementById('movies-grid');
    statusEl = document.getElementById('status');
    
    // Mock global de fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  function setStatus(msg, statusElement) {
    statusElement.textContent = msg;
  }

  function clearGrid(gridElement) {
    if (gridElement) gridElement.innerHTML = "";
  }

  function renderMovies(movies, gridElement) {
    if (!gridElement) return;
    clearGrid(gridElement);
    const list = movies.slice(0, 24);
    
    for (const m of list) {
      const link = document.createElement("a");
      link.className = "card";
      link.href = `/movies/${m.id}`;

      const img = document.createElement("img");
      img.loading = "lazy";
      img.alt = m.title ?? m.name ?? "Untitled";
      img.src = m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image";
      link.appendChild(img);

      const header = document.createElement("div");
      header.className = "card-info";

      const h2 = document.createElement("h2");
      h2.className = "title";
      h2.textContent = m.title ?? m.name ?? "Untitled";
      header.appendChild(h2);

      const p = document.createElement("p");
      p.className = "rating";
      p.textContent = `⭐ ${m.vote_average ?? "—"} • ${m.release_date ?? m.first_air_date ?? ""}`;
      header.appendChild(p);

      link.appendChild(header);
      gridElement.appendChild(link);
    }
  }

  test('setStatus actualiza el texto correctamente', () => {
    setStatus('Cargando...', statusEl);
    expect(statusEl.textContent).toBe('Cargando...');
  });

  test('clearGrid limpia el contenido', () => {
    moviesGrid.innerHTML = '<div>Test content</div>';
    clearGrid(moviesGrid);
    expect(moviesGrid.innerHTML).toBe('');
  });

  test('renderMovies muestra películas correctamente', () => {
    const movies = [
      {
        id: 1,
        title: 'Test Movie',
        poster_path: '/test.jpg',
        vote_average: 8.0,
        release_date: '2023-01-01'
      }
    ];

    renderMovies(movies, moviesGrid);

    const cards = moviesGrid.querySelectorAll('.card');
    expect(cards).toHaveLength(1);
    
    const title = moviesGrid.querySelector('.title');
    expect(title.textContent).toBe('Test Movie');
  });

  // Pruebas de la lógica de renderizado
  test('renderMovies crea elementos DOM correctamente', () => {
    document.body.innerHTML = '<div id="movies-grid"></div>';
    const grid = document.getElementById('movies-grid');
  
    const movies = [{ id: 1, title: 'Test', poster_path: '/test.jpg' }];
    renderMovies(movies, grid); // Tu función del componente
  
    expect(grid.querySelector('.card')).toBeTruthy();
  });

  // Pruebas de utilidades
  test('setStatus actualiza el mensaje', () => {
    document.body.innerHTML = '<div id="status"></div>';
    const statusEl = document.getElementById('status');
  
    setStatus('Cargando...', statusEl);
    expect(statusEl.textContent).toBe('Cargando...');
  });
});