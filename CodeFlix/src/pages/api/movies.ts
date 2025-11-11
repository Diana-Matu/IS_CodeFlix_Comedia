import type { APIRoute } from "astro";

const API_KEY = "72a08ef93943ef7f2719f4d0bfb1a7cf";
const BASE_URL = "https://api.themoviedb.org/3";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter") || "comedy-movies";
  const query = url.searchParams.get("query") || "";

  console.log("🎯 Backend recibió filter =", filter, "query =", query);

  let endpoint = "";
  let params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    sort_by: "popularity.desc",
    "vote_count.gte": "10",
  });

  // 🔍 1. Si hay búsqueda, priorizamos eso
  if (query) {
    endpoint = `${BASE_URL}/search/multi`;
    params.set("query", query);
  } else {
    // 🔍 2. Si no hay búsqueda, filtramos según tipo
    switch (filter) {
      case "comedy-movies":
        endpoint = `${BASE_URL}/discover/movie`;
        params.set("with_genres", "35"); // 35 = Comedia
        break;

      case "comedy-series":
        endpoint = `${BASE_URL}/discover/tv`;
        params.set("with_genres", "35"); // 35 = Comedia
        break;

      case "movies-all":
        endpoint = `${BASE_URL}/discover/movie`;
        params.delete("with_genres");
        break;

      case "series-all":
        endpoint = `${BASE_URL}/discover/tv`;
        params.delete("with_genres");
        break;

      case "all":
      default:
        endpoint = `${BASE_URL}/trending/all/week`;
        params.delete("with_genres");
        params.delete("sort_by");
        break;
    }
  }

  // 👀 Enviamos el endpoint usado en los headers para depuración
  const finalUrl = `${endpoint}?${params.toString()}`;
  console.log(`[API] Fetching TMDb endpoint: ${finalUrl}`);

  try {
    const response = await fetch(finalUrl);
    const data = await response.json();

    // TMDb puede devolver resultados bajo "results"
    const results = data.results || [];

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-TMDB-ENDPOINT": finalUrl,
      },
    });
  } catch (err) {
    console.error("[API ERROR]", err);
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
    });
  }
};
