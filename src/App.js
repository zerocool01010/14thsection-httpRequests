import React, { useEffect, useState, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const emptyMoviesArray = [];
  const dummyMovies = [
    {
      id: 1,
      title: "Some Dummy Movie",
      openingText: "This is the opening text of the movie",
      releaseDate: "2021-05-18",
    },
    {
      id: 2,
      title: "Some Dummy Movie 2",
      openingText: "This is the second opening text of the movie",
      releaseDate: "2021-05-19",
    },
  ];

  const [movies, setMovies] = useState(dummyMovies);
  const [isLoading, setIsLoading] = useState(false);
  const [anError, setError] = useState(false);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      setError(null);
      const resp = await fetch("https://swapi.dev/api/films");

      if (!resp.ok) {
        throw new Error("Something went wrong: " + resp.status);
      }

      const data = await resp.json();

      const transformedMovies = data.results.map((movieInfo) => {
        return {
          id: movieInfo.episode_id,
          title: movieInfo.title,
          director: movieInfo.director,
          producer: movieInfo.producer,
          openingText: movieInfo.opening_crawl,
          releaseDate: movieInfo.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setMovies([]);
      setError(error.message);
    }
    setIsLoading(false);
  }, [])

  useEffect(()=> {
    fetchMoviesHandler()
  }, [fetchMoviesHandler])

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {/* {(isLoading || movies.length === 0) ? <h2>Loading data, please wait...</h2> : <MoviesList movies={movies} />}  */}
        {isLoading && <h2>Loading data, please wait...</h2>}
        {!isLoading && movies.length === 0 && !anError && (
          <h2>Movies not found</h2>
        )}{" "}
        {/* si uso el emptyMoviesArray para setear el setMovies puedo comprobar esta condicion */}
        {!isLoading && anError && <p>{anError}</p>}
        {!isLoading && <MoviesList movies={movies} />}
      </section>
    </React.Fragment>
  );
}

export default App;
