import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRatiing";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "d6d74e0c";

export default function AppV1() {
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorageState("watched", []);
  // const [watched, setWatched] = useState(() => {
  //   const storedData = localStorage.getItem("watched");
  //   return JSON.parse(storedData) || [];
  // });

  
  function handleSelectedId(id) {
    setSelectedId((movieId) => (movieId === id ? null : id));
    // console.log(id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }

 

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Failed to fetch movies....");

          const data = await res.json();
          // console.log(data.Response);
          if (data.Response === "False") {
            // console.log(data);
            throw new Error(data.Error || "Movie not found...");
          }
          // console.log(data.Search);
          setMovies(data.Search);
          setError("");
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : typeof err === "object" && err !== null && "message" in err
              ? err.message
              : "An unknown error occurred";
          // console.log(`Caught error ${err}`)
          if (err.name !== "AbortError") setError(errorMessage);
          setMovies([]);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <div>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumSearchResult movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {console.log(error)}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              selectedId={selectedId}
              handleSelectedId={handleSelectedId}
            />
          )}
          {error && <Error message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedMovie={selectedId}
              handleBackClick={handleSelectedId}
              onAddWatched={handleAddWatched}
              onCloseMovie={handleCloseMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} handleWatched={setWatched} />
              <WatchedList
                watched={watched}
                onDeleteMovie={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </div>
  );
}

function Error({ message }) {
  return <p className="error">{message}</p>;
}
function Loader() {
  return <p className="loader">Loading...</p>;
}
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Main({ children }) {
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("enTer", function(){
    if (document.activeElement === inputEl.current) {
      return;
    }
    inputEl.current.focus();
    setQuery("");
    console.log("Enter key pressed");
  })

  /*useEffect(
    function () {
      function callBack1(e) {
        if (!inputEl.current) return;

        if (e.code === "Enter") {
          if (document.activeElement === inputEl.current) {
            return;
          }
          inputEl.current.focus();
          setQuery("");
          console.log("Enter key pressed");
        }
      }

      document.addEventListener("keydown", callBack1);

      return () => document.removeEventListener("keydown", callBack1);
    },
    [setQuery]
  );*/

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumSearchResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies ? movies.length : 0}</strong> results
    </p>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <Button handleOnClick={setIsOpen}>{isOpen ? "–" : "+"}</Button>
      {isOpen && children}
    </div>
  );
}

/*function WatchedBox() {
  const [isOpen2, setIsOpen2] = useState(true);
  
  return (
    <div className="box">
      <Button handleOnClick={setIsOpen2}>{isOpen2 ? "–" : "+"}</Button>
      {isOpen2 && (
        <>
          
        </>
      )}
    </div>
  );
}
*/

function MovieList({ movies, selectedId, handleSelectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleClick={handleSelectedId}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleClick }) {
  return (
    <li onClick={() => handleClick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedMovie,
  handleBackClick,
  onAddWatched,
  onCloseMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);

  const {
    Title: title,
    Director: director,
    Plot: plot,
    Poster: poster,
    Runtime: runtime,
    Genre: genre,
    Released: released,
    Actors: actors,
    imdbRating,
  } = movie;

  const isWatched = watched
    .map((movie) => movie.imdbID)
    .includes(selectedMovie);
  const userWatchedRating = watched.find(
    (movie) => movie.imdbID === selectedMovie
  )?.userRating;

  function handleWatched() {
    const newWatchedMovie = {
      imdbID: selectedMovie,
      Poster: poster,
      imdbRating: Number(imdbRating),
      Title: title,
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      userRatingDecisionCount: countRef.current,
    };
    // console.log(newWatchedMovie);
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  const countRef = useRef(0);

  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      if (userRating) {
        countRef.current += 1;
      }
    },
    [userRating]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovie}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedMovie]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={() => handleBackClick()}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating && (
                    <button
                      className="btn-add"
                      onClick={() => handleWatched(movie)}
                    >
                      + Add to Watched List
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You have already watched this movie and rated it with &nbsp;
                  <strong>
                    {userWatchedRating}
                    <span>⭐</span>
                  </strong>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Button({ handleOnClick, children }) {
  function handleClick() {
    handleOnClick((open) => !open);
  }
  return (
    <button className="btn-toggle" onClick={handleClick}>
      {children}
    </button>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onDeleteMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatechedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteMovie={onDeleteMovie}
        />
      ))}
    </ul>
  );
}

function WatechedMovie({ movie, onDeleteMovie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          className="btn-delete"
          onClick={() => onDeleteMovie(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
