const FilterType = {
  WATCHLIST: 'watchlist',
  HISTORY : 'history',
  FAVORITE: 'favorite',

};

const filter = {
  [FilterType.WATCHLIST] : (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.FAVORITE] : (films) => films.filter((film) => film.userDetails.favorite),
  [FilterType.HISTORY] : (films) => films.filter((film) => film.userDetails.alreadyWatched)
};

export {filter};


