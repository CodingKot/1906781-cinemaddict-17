const FilterType = {
  ALREADY_WATCHED : 'alreadyWatched',
  FAVORITE: 'favorite',
  WATCHLIST: 'watchlist'
};

const filter = {
  [FilterType.ALREADY_WATCHED] : (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITE] : (films) => films.filter((film) => film.userDetails.favorite),
  [FilterType.WATCHLIST] : (films) => films.filter((film) => film.userDetails.watchlist)
};

export {filter};


