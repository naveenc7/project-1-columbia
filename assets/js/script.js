var searchFormEl = document.querySelector('#search-form');

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  var formatInputVal = document.querySelector('#format-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  var queryString = 'https://itunes.apple.com/search?term=' + searchInputVal + '&entity=' + formatInputVal + 'limit=5';
  console.log (queryString);
  location.assign(queryString);
 
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);