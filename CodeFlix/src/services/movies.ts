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
 * Obtener lista de películas de comedia (SSR inicial)
 */
export async function getComedyMovies(): Promise<Movie[]> {
  const res = await fetch(
    `${API_URL}/discover/movie?with_genres=35&language=en-US&page=1`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );

  if (!res.ok) {
    console.error(`TMDB error ${res.status} in getComedyMovies`);
    return [];
  }

  const data = await res.json();
  return data?.results ?? [];
}

/**
 * Obtener detalle de una película por ID
 * Compatible con pages/movies/[id].astro sin getStaticPaths
 */
export async function getMovieById(id: string | number): Promise<Movie | null> {
  if (!id) {
    console.error("getMovieById called without ID");
    return null;
  }

  const res = await fetch(
    `${API_URL}/movie/${id}?language=en-US`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );

  if (!res.ok) {
    console.error(`TMDB error ${res.status} in getMovieById(${id})`);
    return null;
  }

  return res.json();
}
