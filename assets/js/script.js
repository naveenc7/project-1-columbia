var searchFormEl = document.querySelector('#search-form');

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  var formatInputVal = document.querySelector('#format-input').value;

  console.log(searchInputVal)
  console.log(formatInputVal)

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  var queryString = './search-results.html?q=' + searchInputVal + '&format=' + formatInputVal;
  // var queryString = 'https://itunes.apple.com/search?term=' + searchInputVal + '&entity=' + formatInputVal;

  location.assign(queryString);
  console.log (queryString);
 
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
