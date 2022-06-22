import {FilterType, PROFILE_TITLES} from '../const.js';

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.FAVORITE]: (films) => films.filter((film) => film.userDetails.favorite),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched)
};

const getTitle = (number) => {

  switch (true) {
    case (number >= 1 && number <= 10):
      return PROFILE_TITLES.NOVICE;
    case (number >= 11 && number <= 20):
      return PROFILE_TITLES.FAN;
    case number >= 21:
      return PROFILE_TITLES.MOVIE_BUFF;
    case number === 0:
      return PROFILE_TITLES.NO_HISTORY;
  }
};

export {filter, getTitle};


