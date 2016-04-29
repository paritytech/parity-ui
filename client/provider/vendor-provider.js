
export function displayAll () {
  return {
    openOnFocus: true,
    filter: (searchText, key) => searchText === '' || key.indexOf(searchText) !== -1
  };
}
