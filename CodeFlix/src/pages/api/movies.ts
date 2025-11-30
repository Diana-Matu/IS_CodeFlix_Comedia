import type { APIRoute } from "astro";

export const prerender = false; // Runtime API

const API_KEY = "72a08ef93943ef7f2719f4d0bfb1a7cf";
const BASE_URL = "https://api.themoviedb.org/3";

export const GET: APIRoute = async ({ request }) => {
  let searchParams: URLSearchParams;

  try {
    const fullUrl = new URL(request.url, 'http://localhost:4321');

    if ([...fullUrl.searchParams.keys()].length > 0) {
      searchParams = fullUrl.searchParams;
    } else {
      const ref = request.headers.get('referer') || "";
      const queryPart = ref.includes("?") ? ref.split("?")[1] : "";
      searchParams = new URLSearchParams(queryPart);
    }
  } catch {
    searchParams = new URLSearchParams();
  }

  const rawFilter = searchParams.get("filter") ?? "";
  const rawQuery = searchParams.get("query") ?? "";

  const filter = rawFilter.trim().toLowerCase();
  const query = rawQuery.trim();

  console.log("🎯 Backend recibió filter =", JSON.stringify(filter), "query =", JSON.stringify(query));

  let endpoint = "";
  let params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    sort_by: "popularity.desc",
    "vote_count.gte": "10",
  });

  // 🔍 1. Si hay búsqueda, priorizar búsqueda
  if (query) {
    endpoint = `${BASE_URL}/search/multi`;
    params.set("query", query);
  } else {
    // 🔍 2. Si no hay búsqueda, usar filtro
    switch (filter) {
      case "comedy-movies":
        endpoint = `${BASE_URL}/discover/movie`;
        params.set("with_genres", "35");
        break;

      case "comedy-series":
        endpoint = `${BASE_URL}/discover/tv`;
        params.set("with_genres", "35");
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
        endpoint = `${BASE_URL}/trending/all/week`;
        params.delete("with_genres");
        params.delete("sort_by");
        break;     // 🔥🔥🔥 SOLUCIÓN DEL PROBLEMA

      default:
        console.warn("[API] Filtro desconocido, usando comedia por defecto.");
        endpoint = `${BASE_URL}/discover/movie`;
        params.set("with_genres", "35");
        break;
    }
  }

  const finalUrl = `${endpoint}?${params.toString()}`;
  console.log(`[API] Fetching TMDb endpoint: ${finalUrl}`);

  try {
    const response = await fetch(finalUrl);
    const data = await response.json();

    return new Response(JSON.stringify(data.results || []), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-TMDB-ENDPOINT": finalUrl,
        "X-RECEIVED-FILTER": filter,
      },
    });
  } catch (err) {
    console.error("[API ERROR]", err);
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
    });
  }
};

