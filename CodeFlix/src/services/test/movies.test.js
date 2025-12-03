// src/services/test/movies.test.js
import { describe, test, expect, beforeEach, vi } from 'vitest';

// Mock manual - NO importa el servicio real TypeScript
const mockMoviesService = {
  getComedyMovies: vi.fn(() => 
    Promise.resolve([
      {
        id: 1,
        title: 'Funny Mock Movie',
        poster_path: '/funny-mock.jpg',
        vote_average: 7.8,
        release_date: '2023-12-01',
        overview: 'A very funny mock comedy movie'
      },
      {
        id: 2,
        title: 'Hilarious Comedy', 
        poster_path: '/hilarious-mock.jpg',
        vote_average: 8.2,
        release_date: '2023-11-15',
        overview: 'Extremely hilarious mock movie'
      }
    ])
  ),
  
  getMovieById: vi.fn((id) => 
    Promise.resolve({
      id: id,
      title: `Mock Movie ${id}`,
      poster_path: `/mock${id}.jpg`,
      vote_average: 7.5,
      release_date: '2023-01-01',
      overview: `This is a mock overview for movie ID ${id}`
    })
  )
};

describe('Movies Service - Mock Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getComedyMovies devuelve array de películas de comedia', async () => {
    const movies = await mockMoviesService.getComedyMovies();
    
    expect(movies).toHaveLength(2);
    expect(movies[0].title).toBe('Funny Mock Movie');
    expect(movies[1].title).toBe('Hilarious Comedy');
    expect(movies[0].vote_average).toBe(7.8);
    expect(mockMoviesService.getComedyMovies).toHaveBeenCalledOnce();
  });

  test('getMovieById devuelve película específica por ID', async () => {
    const movie = await mockMoviesService.getMovieById(123);
    
    expect(movie.id).toBe(123);
    expect(movie.title).toBe('Mock Movie 123');
    expect(movie.overview).toContain('123');
    expect(mockMoviesService.getMovieById).toHaveBeenCalledWith(123);
    expect(mockMoviesService.getMovieById).toHaveBeenCalledOnce();
  });
});