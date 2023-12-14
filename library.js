const resultsDiv = document.querySelector(".results");
const savedMovies = JSON.parse(localStorage.getItem("library")) || [];
const popup = document.querySelector(".popup");
const popupMessage = document.querySelector(".message");

function removedFromLibrary(movieName) {
  // code to open the modal of successfully removed movie from library
  const htmlText = `Succesfully removed ${movieName} from library!`;
  popupMessage.innerHTML = htmlText;
  popup.className = "popup removedpopup";
}
function closePopup() {
  popup.className = "popup";
}

function removeFromLibrary(movieID) {
  const removeMovieID = movieID.id;
  for (const movie of savedMovies) {
    if (movie.movieID === removeMovieID) {
      const i = savedMovies.indexOf(movie);
      savedMovies.splice(i, 1);
      localStorage.setItem("library", JSON.stringify(savedMovies));
      displayMovies(savedMovies);
      removedFromWishlist(movie.title);
    }
  }
}

function displayMovies(movies) {
  let movieResultsHTML = ``;
  for (const movieObject of movies) {
    const template = `
        <div class="result">
            <p class="year">${movieObject.year}</p>
            <button class="wishlist" title="Remove from the library" onclick="removeFromLibrary(${
              movieObject.movieID
            });"><img src="/Assets/remove_book.png" alt="wishlist" class="remove-book"></button>
            <img class="poster"   onclick="getMovieData(${
              movieObject.movieID
            });" src="${
      movieObject.poster != "N/A"
        ? movieObject.poster
        : "https://images.bhaskarassets.com/webp/thumb/512x0/web2images/521/2023/06/23/no-photo.jpg"
    }" alt="movie" id="${movieObject.movieID}">
            <h3 class="movieName">${movieObject.title}</h3>
        </div>`;
    movieResultsHTML += template;
  }
  resultsDiv.innerHTML = movieResultsHTML;
}
function openMovieInfo(data) {
  const objectData = JSON.parse(data);
  const infoContainer = document.querySelector(".movie-info-container");
  const movieTitle = objectData.Title;
  const movieReleaseDate = objectData.Year;
  const age = objectData.Rated;
  const movieLength = objectData.Runtime;
  const movieGenre = objectData.Genre;
  const movieDirector = objectData.Director;
  const movieActors = objectData.Actors;
  const moviePlot = objectData.Plot;
  const moviePoster = objectData.Poster;
  const imdbRating = objectData.imdbRating;

  const movieTemplate = `
  <h2>
  ${movieTitle}
  </h2>
  <p><span>Release Year:</span> ${movieReleaseDate}</p>
  <p><span>PG:</span> ${age}</p>
  <p><span>Movie length in minutes:</span> ${movieLength}</p>
  <p><span>Genres:</span> ${movieGenre}</p>
  <p><span>Directors:</span> ${movieDirector}</p>
  <p><span>Actors:</span> ${movieActors}</p>
  <p><span>Plot:</span> ${moviePlot}</p>
  <p><span>IMDB Rating:</span> ${imdbRating}</p>
  `;
  const htmlTemplate = `
  <div class="movie-poster">
        <img
          class="poster"
          src="${moviePoster}"/>
      </div>
      <div class="movie-info">${movieTemplate}</div>
      <div class="exit-div">
      <button class="exit-btn" onclick="closeMovie();">X</button>
      </div>`;
  infoContainer.innerHTML = htmlTemplate;
  infoContainer.style.visibility = "visible";
}
function closeMovie() {
  const infoContainer = document.querySelector(".movie-info-container");
  infoContainer.style.visibility = "hidden";
}
async function getMovieData(omdbId) {
  const movieData = await fetch(
    `http://www.omdbapi.com/?apikey=154d1f43&i=${omdbId.id}`
  );
  const jsonMovieData = await movieData.json();
  const stringMovieData = JSON.stringify(jsonMovieData);
  console.log(stringMovieData);
  openMovieInfo(stringMovieData);
}
displayMovies(savedMovies);
