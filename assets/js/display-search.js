var resultTextEl = document.querySelector("#result-text");
var resultContentEl = document.querySelector("#result-content");
var searchFormEl = document.querySelector("#search-form");
let searchInputVal = null;
let formatInputVal = null;
let cardNodeList = null;
let index = 0;

// this function runs on script load
function getParamsAndRender() {
  let searchParamsArr = document.location.search.split("&");
  let theArtist = searchParamsArr[0].split("=").pop();
  let theFormat = searchParamsArr[1].split("=").pop();
  // run the function below, passing in artist and format as arguments
  getArtistSongsAndRender(theArtist, theFormat);
}

function handleSearchFormSubmit(event) {
  event.preventDefault();

  searchInputVal = document.querySelector("#search-input").value;
  formatInputVal = document.querySelector("#format-input").value;

  // if either input field is left blank, show an alert and return out of function
  if (!searchInputVal || !formatInputVal) {
    console.log("Enter an artist's name and format");
    alert("Enter an artist's name and format!");
    return null;
  }
  // otherwise, call the function below, passing in the two arguments
  getArtistSongsAndRender(searchInputVal, formatInputVal);
}

// this function is declared as asynchronous, in order to await the results
// from getting the songs list, as well as the album cover images
async function getArtistSongsAndRender(artist, format) {
  // to cover the case that another search is being executed,
  // reset resultContentEl and index
  resultContentEl.innerHTML = "";
  index = 0;

  let listOfSongs = null;

  // get songs from artist
  await getSongs(artist, format)
    .then((songsList) => {
      // if song list is falsy, i.e. no songs were returned, throw an error
      if (!songsList) {
        resultContentEl.innerHTML = `<h4 style='text-align: center'>Sorry, your search produced no results. Try again!</h4>`;
        throw new Error("No songs found for the desired artist. Try again");
      }

      listOfSongs = [...songsList];
     
      songsList.forEach((songObject, index) => {
        const { artistName, collectionName, trackViewUrl, trackName } =
          songObject;
        renderCard(artistName, collectionName, trackViewUrl, trackName, index);
      });
    })
    .catch((error) => console.error(error));

  // now that the cards exist, assign them to cardNodeList
  cardNodeList = document.querySelectorAll("div.card");

  for (song of listOfSongs) {
    // destructure name and album from the current song object in the song list
    const { artistName, collectionName } = song;
    // now pass the name and album into the asynchronous function getAlbumCover
    await getAlbumCover(artistName, collectionName).then((imageUrl) => {
           renderAlbumCoverImage(imageUrl, index);
    });
    // update index by one
    index++;
  }
}

// this function is declared as asynchronous, so I can use keyword 'await' in it
async function getSongs(query, format) {
  var locQueryUrl =
    "https://itunes.apple.com/search?term=" +
    query +
    "&entity=" +
    format +
    "&limit=25";
  // here I'm using await, because I want to await the completion of the asynchronous
  // fetch operation and have the promise resolve into a usable value that I store
  // in response
  let response = await fetch(locQueryUrl);
  // I also await response.json and store its promise's resolution in the variable
  // data
  let data = await response.json();
  const { results: songList } = data; // the returned data object looks like { results: .... }
  //const results = data.results;
  return songList;
}

// this function is declared as asynchronous, so I can use keyword 'await' in it
async function getAlbumCover(artist, album) {
  let imageUrl = null;
  var albumCover =
    "https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=0de9738710e0d0e898651bdeef65a006&artist=" +
    artist +
    "&album=" +
    album +
    "&format=json";

  const response = await fetch(albumCover);
  const data = await response.json();
  if (data.error) {
    return imageUrl;
  }
  imageUrl = data.album.image[2]["#text"];
  return imageUrl;
}

function renderAlbumCoverImage(imageUrl, i) {
  // create a div element
  var resultImage = document.createElement("div");
  // add a value to its class attribute
  resultImage.classList.add("card-image");
  if (!imageUrl) {
    resultImage.textContent = "No Image Avail";
    resultImage.setAttribute("style", "display: flex; align-items: center");
    cardNodeList[i].append(resultImage);
    return null;
  }
  // otherwise, go ahead and set the background image to the url
  resultImage.setAttribute("style", `background-image: url("${imageUrl}")`);
  cardNodeList[i].append(resultImage);
}

function renderCard(artistName, collectionName, trackViewUrl, trackName, i) {
  var resultCard = document.createElement("div");

  resultCard.classList.add("card", "bg-light", "text-dark", "mb-3", "p-3");

  var resultBody = document.createElement("div");
  resultBody.classList.add("card-body");
  resultCard.append(resultBody);

  var titleEl = document.createElement("h3");
  titleEl.textContent = trackName;

  var bodyContentEl = document.createElement("p");
  bodyContentEl.innerHTML = "<strong>Artist:</strong> " + artistName + "<br/>";
  if (collectionName) {
    bodyContentEl.innerHTML +=
      "<strong>Album:</strong> " + collectionName + "<br/>";
  }
  var linkButtonEl = document.createElement("a");
  linkButtonEl.textContent = "View Song";
  linkButtonEl.setAttribute("href", trackViewUrl);
  linkButtonEl.classList.add("btn", "btn-dark");

  resultBody.append(titleEl, bodyContentEl, linkButtonEl);

  resultContentEl.append(resultCard);
}

searchFormEl.addEventListener("submit", handleSearchFormSubmit);

getParamsAndRender();
