var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var searchInputVal; // leave this uninitialized until user enters something


function getParams() {
  var searchParamsArr = document.location.search.split('&');
  console.log('searParamsArray is', searchParamsArr);
  var query = searchParamsArr[0].split('=').pop();
  var format = searchParamsArr[1].split('=').pop();

  searchApi(query, format);
  console.log(query)
  console.log(format)
}

function printResults({ trackName, artistName, artist, collectionName, trackViewUrl, albumCoverUrl}) {
  // console.log(albumCoverUrl);

  var resultCard = document.createElement('div');
  var imageContainer = document.createElement('div');
  resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  var resultBody = document.createElement('div');
  resultBody.classList.add('card-body');
  resultCard.append(resultBody);

  var titleEl = document.createElement('h3');
  titleEl.textContent = trackName;

  var bodyContentEl = document.createElement('p');
  bodyContentEl.innerHTML =
    '<strong>Artist:</strong> ' + artistName + '<br/>';

  if (artist) {
    bodyContentEl.innerHTML +=
      '<strong>Songs:</strong> ' + artist;
  }

  if (collectionName) {
    bodyContentEl.innerHTML +=
      '<strong>Album:</strong> ' + collectionName;
  }

  if (collectionName) {
    bodyContentEl.innerHTML +=
      collectionName;
  }

  // var coverUrlEl = document.createElement('p');
  // coverUrlEl.innerHTML = urlToReturn

  var linkButtonEl = document.createElement('a');
  linkButtonEl.textContent = 'View Song';
  linkButtonEl.setAttribute('href', trackViewUrl);
  linkButtonEl.classList.add('btn', 'btn-dark');

  resultBody.append(titleEl, bodyContentEl, linkButtonEl);

  resultContentEl.append(resultCard);
}

function searchApi(query, format) {
  var locQueryUrl = 'https://itunes.apple.com/search?fo=json';

  if (format) {
    locQueryUrl = 'https://itunes.apple.com/search?term=' + query;
  }

  locQueryUrl = locQueryUrl + '&entity=' + format + "&limit=25";

  fetch(locQueryUrl)
    .then(function (response) {
      console.log(response)
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {
      console.log(data);

      if (!data.results.length) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        resultContentEl.textContent = '';
        let albumCoverUrl = getAlbumCover(data.results[0].artistName, data.results[0].collectionName);
        printResults({...data.results[0], albumCoverUrl});

        for (var i = 0; i < data.results.length; i++) {
          let albumCoverUrl = getAlbumCover(data.results[i].artistName, data.results[i].collectionName);
          // console.log(albumCoverUrl);
          printResults({ ...data.results[i], albumCoverUrl });
          // printResults( {...data.results[i]} );
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

// let temp = getAlbumCover("Michael Jackson", "The Essential Michael Jackson");
// console.log(temp);

async function getAlbumCover(artist, album) {
  var albumCover = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=0de9738710e0d0e898651bdeef65a006&artist=' + artist + '&album=' + album + '&format=json';

  const response = await fetch(albumCover);
  const data = await response.json();
  if(!data.album.image.length) {
    console.log('No image found!');
    // return null;
  }
  resultContentEl.textContent = '';
  let urlToReturn = data.album.image[2]['#text'];
  console.log(urlToReturn)
  return urlToReturn;

}



function handleSearchFormSubmit(event) {
  event.preventDefault();

  searchInputVal = document.querySelector('#search-input').value;
  var formatInputVal = document.querySelector('#format-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  searchApi(searchInputVal, formatInputVal);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

getParams();
