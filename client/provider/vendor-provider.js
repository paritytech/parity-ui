// AutoComplete
export function displayAll () {
  return {
    openOnFocus: true,
    filter: (searchText, key) => searchText === '' || key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
  };
}
