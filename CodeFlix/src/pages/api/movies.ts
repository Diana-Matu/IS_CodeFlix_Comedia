import type { APIRoute } from "astro";

export const prerender = false; // 🔥 Esto fuerza modo runtime (con headers y query reales)

const API_KEY = "72a08ef93943ef7f2719f4d0bfb1a7cf";
const BASE_URL = "https://api.themoviedb.org/3";

export const GET: APIRoute = async ({ request }) => {
  // Parse request URL safely
    // 🧩 SOLUCIÓN COMPLETA: obtener parámetros incluso si Astro corta la query string
  let searchParams: URLSearchParams;

  try {
    // 1️⃣ Intentar construir desde la URL completa
    const fullUrl = new URL(request.url, 'http://localhost:4321');
    if ([...fullUrl.searchParams.keys()].length > 0) {
      searchParams = fullUrl.searchParams;
    } else {
      // 2️⃣ Si no hay params, intentar leer de la cabecera referer
      const ref = request.headers.get('referer') || '';
      const queryPart = ref.includes('?') ? ref.split('?')[1] : '';
      searchParams = new URLSearchParams(queryPart);
    }
  } catch {
    // 3️⃣ Fallback: sin errores, pero sin datos
    searchParams = new URLSearchParams();
  }

  const rawFilter = searchParams.get("filter") ?? "";
  const rawQuery = searchParams.get("query") ?? "";

  const filter = rawFilter.trim().toLowerCase();
  const query = rawQuery.trim();

  console.log("🎯 Backend recibió filter =", JSON.stringify(filter), "query =", JSON.stringify(query));
  console.log("Parsed searchParams:", Object.fromEntries(searchParams.entries()));

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
        endpoint = `${BASE_URL}/trending/all/week`;
        params.delete("with_genres");
        params.delete("sort_by");
      default:
        console.warn("[API] filter desconocido, usando 'comedy-movies' por defecto. rawFilter:", rawFilter);
        endpoint = `${BASE_URL}/discover/movie`;
        params.set("with_genres", "35"); // 35 = Comedia
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
        "X-RECEIVED-FILTER": filter, // cabecera para debug adicional
      },
    });
  } catch (err) {
    console.error("[API ERROR]", err);
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
    });
  }
};
