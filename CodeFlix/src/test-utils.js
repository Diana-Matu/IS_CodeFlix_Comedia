/**
 * Utilidades para testing del componente Movies
 */

export function createMockMovies(count = 1) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Test Movie ${i + 1}`,
    poster_path: `/poster${i + 1}.jpg`,
    vote_average: 7 + (i * 0.5),
    release_date: `2023-01-${String(i + 1).padStart(2, '0')}`,
    overview: `Test overview for movie ${i + 1}`
  }));
}

export function setupMoviesDOM() {
  document.body.innerHTML = `
    <div id="movies-grid"></div>
    <div id="status"></div>
    <input id="search-input" type="text" />
    <button id="search-button"></button>
    <select id="filter-select">
      <option value="comedy-movies">Comedy Movies</option>
      <option value="comedy-series">Comedy Series</option>
    </select>
  `;
}