const inputBox = document.querySelector(".inputBox");
const resultsDiv = document.querySelector(".results");
const displayNumOfResults = document.querySelector(".number-of-results");
let currentPage = 0;
let lastSearch = "";
const popup = document.querySelector(".popup");
const popupMessage = document.querySelector(".message");

function addToWishlistSuccess(movieName) {
  // code to open the modal of successfully added movie to wishlist
  const htmlText = `Succesfully added ${movieName} to wishlist!`;
  popupMessage.innerHTML = htmlText;
  popup.className = "popup addedpopup";
}

function addToLibrarySuccess(movieName) {
  // code to open the modal of successfully added movie to library
  const htmlText = `Succesfully added ${movieName} to library!`;
  popupMessage.innerHTML = htmlText;
  popup.className = "popup addedpopup";
}
function closePopup() {
  popup.className = "popup";
}
function saveMovies(movies) {
  localStorage.setItem("currentMovies", JSON.stringify(movies));
}

updateArrows();

function addToWishlist(movieID) {
  const addMovieID = movieID.id;
  const currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const cuurentlyDisplayedMovies = JSON.parse(
    localStorage.getItem("currentMovies")
  );
  if (currentWishlist.length > 0) {
    for (const eachMovie of currentWishlist) {
      if (addMovieID === eachMovie.movieID) {
        return;
      }
    }
  }
  for (pageMovie of cuurentlyDisplayedMovies) {
    if (pageMovie.movieID === addMovieID) {
      addToWishlistSuccess(pageMovie.title);
      currentWishlist.push(pageMovie);
    }
  }
  const newWishlist = JSON.stringify(currentWishlist);
  localStorage.setItem("wishlist", newWishlist);
  console.log(JSON.parse(localStorage.getItem("wishlist")));
}

function addToLibrary(movieID) {
  const addMovieID = movieID.id;
  const currentWishlist = JSON.parse(localStorage.getItem("library")) || [];
  const cuurentlyDisplayedMovies = JSON.parse(
    localStorage.getItem("currentMovies")
  );
  if (currentWishlist.length > 0) {
    for (const eachMovie of currentWishlist) {
      if (addMovieID === eachMovie.movieID) {
        return;
      }
    }
  }
  for (pageMovie of cuurentlyDisplayedMovies) {
    if (pageMovie.movieID === addMovieID) {
      currentWishlist.push(pageMovie);
      addToLibrarySuccess(pageMovie.title);
    }
  }
  const newWishlist = JSON.stringify(currentWishlist);
  localStorage.setItem("library", newWishlist);
  console.log(JSON.parse(localStorage.getItem("library")));
}

inputBox.onkeydown = function (event) {
  if (event.key === "Enter") {
    pressSearch(0);
  }
};

function updateArrows(currentPage, numOfPages) {
  const rightArrow = document.querySelector(".right-arrow");
  const leftArrow = document.querySelector(".left-arrow");
  if (currentPage === 0) {
    rightArrow.style.display = "none";
    leftArrow.style.display = "none";
  } else if (currentPage === 1 && numOfPages > currentPage) {
    rightArrow.style.display = "block";
    leftArrow.style.display = "none";
  } else if (currentPage > 1 && numOfPages > currentPage) {
    rightArrow.style.display = "block";
    leftArrow.style.display = "block";
  } else if (currentPage > 1 && numOfPages === currentPage) {
    rightArrow.style.display = "none";
    leftArrow.style.display = "block";
  } else {
    console.log(
      `current page: ${currentPage}, total number of pages: ${numOfPages}, got to else block of arrows update`
    );
  }
}
function nextPage() {
  pressSearch(currentPage);
}
function prevPage() {
  currentPage -= 2;
  pressSearch(currentPage);
}
let updateNumOfPages = (numOfResults) => {
  return Math.ceil(numOfResults / 10);
};
let pressSearch = async (pageNumer) => {
  const sendRequest = async (name) => {
    let searchPage = pageNumer + 1;
    let apiURL = `http://www.omdbapi.com/?apikey=154d1f43&s=${name}&page=${searchPage}`;
    const searchResults = await fetch(apiURL);
    const fullResults = await searchResults.json();
    const totalNumResults = fullResults.totalResults;
    console.log(fullResults);
    if (totalNumResults === undefined) {
      return;
    }
    const totalPages = updateNumOfPages(totalNumResults);
    currentPage += 1;
    updateArrows(searchPage, totalPages);
    const resultTitles = fullResults.Search.slice(0, 10).map((movie) => ({
      title: movie.Title,
      movieID: movie.imdbID,
      year: movie.Year,
      poster: movie.Poster,
    }));
    console.log(resultTitles);
    totalNumResults
      ? (displayNumOfResults.innerHTML = `Found ${totalNumResults} matching movies:`)
      : (displayNumOfResults.innerHTML = `Dind't find movies with - ${
          name ? name : "no words"
        } in their name.`);
    return resultTitles;
  };
  let userInput = inputBox.value;
  if (userInput) {
    lastSearch = userInput;
  }
  let movies = await sendRequest(userInput);
  if (movies === undefined) {
    resultsDiv.innerHTML = "";
    displayNumOfResults.innerHTML = `Dind't find movies with - ${
      inputBox.value ? inputBox.value : "no words"
    } in their name.`;
    updateArrows(0, 0);
  } else {
    /* movies is now an array of movie objects - each object contains title, id, poster and year of the movie
   totalNum,ovies is a number that represents the total number of results for the search - saved to then count
   how many pages there are for each results - to present the user the option to see more than 10 results.
  */
    saveMovies(movies);
    let movieResultsHTML = ``;
    for (const movieObject of movies) {
      const template = `
        <div class="result">
            <p class="year">${movieObject.year}</p>
            <button class="wishlist" title="Add to wishlist" onclick="addToWishlist(${
              movieObject.movieID
            }
            );">
            <img src="/Assets/heart.png" alt="wishlist"></button>
            <button class="library" title="Add to watched shelf" onclick="addToLibrary(${
              movieObject.movieID
            }
            );"><img src="/Assets/library.png" alt="add to library" class="library-image"></button>
            <img class="poster" onclick="getMovieData(${
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
};
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
