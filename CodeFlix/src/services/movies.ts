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
 * Opcional: obtener detalle por id (puedes usarlo en /pages/movies/[id].astro)
 */
export async function getMovieById(id: string | number) {
  const res = await fetch(`${API_URL}/movie/${id}?language=en-US`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

