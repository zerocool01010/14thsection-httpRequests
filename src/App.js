import React, { useEffect, useState, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMoviesForm from "./components/AddMovie";
import "./App.css";

function App() {
  const theUrl = 'https://swapi.dev/api/'; //esta url sirve para el get, no para el post
  const emptyMoviesArray = [];
  const loadedMovies = [] //para el POST
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
      const resp = await fetch(theUrl+'films');

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

      if (!(loadedMovies.length > 0)) { //si no hay elementos en el arreglo de la pelicula del form
        setMovies(transformedMovies);
      } else {
        setMovies(loadedMovies)
        loadedMovies.pop()
      }

    } catch (error) {
      setMovies([]);
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const postMovieHandler = useCallback(async (movie) => {
    console.log(
      "Aca esta la pelicula que queremos enviar por POST: ",
      movie
    );

    const resp = await fetch(theUrl, { //la Url no esta bien definida aun, es solo el codigo, ya que solo sirve para el GET
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await resp.json() //en teoria en la url que deberiamos trabajar se devuelve un obj, no un array
    console.log(data)

    for (const key in data) { //el for in es para los obj
      loadedMovies.push({
        id: key,
        title: data[key].title,
        openingText: date[key].openingText,
        date: date[key].releaseDate
      })
    }
    setMovies(loadedMovies) //ahora vamos a ver las peli cargada

  }, []);

  return (
    <React.Fragment>
      <section>
        <AddMoviesForm onAddMovie={postMovieHandler} />
      </section>
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
