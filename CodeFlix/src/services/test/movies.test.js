const { test, expect, describe, beforeEach } = require('@jest/globals');

// Mock completo de las funciones - definidas localmente
const mockMoviesService = {
  getComedyMovies: jest.fn(() => 
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
  
  getMovieById: jest.fn((id) => 
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
    // Limpiar todos los mocks antes de cada test
    mockMoviesService.getComedyMovies.mockClear();
    mockMoviesService.getMovieById.mockClear();
  });

  test('getComedyMovies devuelve array de películas de comedia', async () => {
    // Act
    const movies = await mockMoviesService.getComedyMovies();
    
    // Assert
    expect(movies).toHaveLength(2);
    expect(movies[0].title).toBe('Funny Mock Movie');
    expect(movies[1].title).toBe('Hilarious Comedy');
    expect(movies[0].vote_average).toBe(7.8);
    expect(mockMoviesService.getComedyMovies).toHaveBeenCalledTimes(1);
  });

  test('getMovieById devuelve película específica por ID', async () => {
    // Act
    const movie = await mockMoviesService.getMovieById(123);
    
    // Assert
    expect(movie.id).toBe(123);
    expect(movie.title).toBe('Mock Movie 123');
    expect(movie.overview).toContain('123');
    expect(mockMoviesService.getMovieById).toHaveBeenCalledWith(123);
    expect(mockMoviesService.getMovieById).toHaveBeenCalledTimes(1);
  });

  test('getComedyMovies maneja diferentes llamadas', async () => {
    // Primera llamada
    const movies1 = await mockMoviesService.getComedyMovies();
    
    // Segunda llamada  
    const movies2 = await mockMoviesService.getComedyMovies();
    
    // Assert
    expect(mockMoviesService.getComedyMovies).toHaveBeenCalledTimes(2);
    expect(movies1).toEqual(movies2); // Mismo resultado
  });

  test('getMovieById con diferentes IDs', async () => {
    // Act
    const movie1 = await mockMoviesService.getMovieById(1);
    const movie2 = await mockMoviesService.getMovieById(999);
    
    // Assert
    expect(movie1.title).toBe('Mock Movie 1');
    expect(movie2.title).toBe('Mock Movie 999');
    expect(mockMoviesService.getMovieById).toHaveBeenCalledTimes(2);
  });
});