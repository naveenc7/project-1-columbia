var searchFormEl = document.querySelector('#search-form');

function handleSearchFormSubmit(event) {
  event.preventDefault();
  // gathers the inputs given from the user
  var searchInputVal = document.querySelector('#search-input').value;
  var formatInputVal = document.querySelector('#format-input').value;

  console.log(searchInputVal)
  console.log(formatInputVal)

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  // this builds the string to send to the display-search JS
  var queryString = './search-results.html?q=' + searchInputVal + '&format=' + formatInputVal;

  location.assign(queryString);
  console.log (queryString);
 
}
// this looks for the push of the button after the choices are made
searchFormEl.addEventListener('submit', handleSearchFormSubmit);
