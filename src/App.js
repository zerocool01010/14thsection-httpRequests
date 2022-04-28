import React, {useState} from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const dummyMovies = [
    {
      id: 1,
      title: 'Some Dummy Movie',
      openingText: 'This is the opening text of the movie',
      releaseDate: '2021-05-18',
    },
    {
      id: 2,
      title: 'Some Dummy Movie 2',
      openingText: 'This is the second opening text of the movie',
      releaseDate: '2021-05-19',
    },
  ]; 

  const [movies, setMovies] = useState(dummyMovies)

  async function fetchMoviesHandler() {
    fetch("https://swapi.dev/api/films")
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        const transformedMovies = data.results.map(movieInfo => {
          return {
            id: movieInfo.episode_id,
            title: movieInfo.title,
            director: movieInfo.director,
            producer: movieInfo.producer,
            openingText: movieInfo.opening_crawl,
            releaseDate: movieInfo.release_date
          }
        })
        setMovies(transformedMovies);
      });
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
