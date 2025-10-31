export const getComedyMovies = async () => {
    interface Movie {
        id: number;
        title: string;
        poster_path: string | null;
        vote_average: number;
        release_date: string;
        overview?: string;
    }

    const res = await fetch(
    "https://api.themoviedb.org/3/discover/movie?language=en-US&with_genres=35",
    {
        headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.TMDB_ACCESS_TOKEN}`,
        },
    }
    );

    const data = await res.json();
    const movies: Movie[] = data.results;
    return movies;
};

export const getComedyMoviesById = async ({ id }: { id: string | number}) => {
    interface Movie {
        id: number;
        title: string;
        poster_path: string | null;
        vote_average: number;
        release_date: string;
        overview?: string;
    }

    // Aseguramos que id sea string para construir la URL
    const movieId = String(id);

    const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?language=en-US&with_genres=35/${id}`,
        {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.TMDB_ACCESS_TOKEN}`,
            },
        }
    );

    if (!res.ok) {
        // Manejo básico de error
        throw new Error(`TMDB fetch failed: ${res.status} ${res.statusText}`);
    }

    const movie: Movie = await res.json();
    return movie;
}


