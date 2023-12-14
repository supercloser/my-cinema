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

function removedFromWishlist(movieName) {
  // code to open the modal of successfully removed movie from wishlist
  const htmlText = `Succesfully removed ${movieName} from wishlist!`;
  popupMessage.innerHTML = htmlText;
  popup.className = "popup removedpopup";
}

function removedFromLibrary(movieName) {
  // code to open the modal of successfully removed movie from library
  const htmlText = `Succesfully removed ${movieName} from library!`;
  popupMessage.innerHTML = htmlText;
  popup.className = "popup removedpopup";
}
function closePopup() {
  popup.className = "popup";
}
