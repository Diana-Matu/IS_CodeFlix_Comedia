// src/services/movies.ts
export type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  media_type?: string;
};

const API_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.TMDB_ACCESS_TOKEN;

/**
 * Devuelve películas de comedia (discover movie with genre 35)
 */
export async function getComedyMovies(): Promise<Movie[]> {
  const res = await fetch(`${API_URL}/discover/movie?with_genres=35&language=en-US&page=1`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

/**
 * Obtener detalle por id:
 *  - intenta /movie/{id}
 *  - si 404 -> intenta /tv/{id}
 * Esto permite abrir detalles tanto de películas como de series sin 404.
 */
export async function getMovieById(id: string | number) {
  // primera intención: movie
  try {
    const resMovie = await fetch(`${API_URL}/movie/${id}?language=en-US`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (resMovie.ok) {
      return await resMovie.json();
    }
    // si es 404 o similar, no lanzamos todavía: intentamos tv
    if (resMovie.status !== 404) {
      // para otros errores, lanzar
      const txt = await resMovie.text();
      throw new Error(`TMDB movie error ${resMovie.status}: ${txt}`);
    }
  } catch (err) {
    // si fetch lanzó por red, se intentará tv (no hacemos throw aquí)
    console.warn("getMovieById: movie fetch failed, trying tv. Error:", err);
  }

  // fallback a tv
  try {
    const resTv = await fetch(`${API_URL}/tv/${id}?language=en-US`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (resTv.ok) {
      return await resTv.json();
    }
    const txt = await resTv.text();
    throw new Error(`TMDB tv error ${resTv.status}: ${txt}`);
  } catch (err) {
    throw new Error(`getMovieById failed for id=${id}: ${err}`);
  }
}
