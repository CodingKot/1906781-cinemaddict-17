import {FilterType, ProfileTitles} from '../const.js';

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.FAVORITE]: (films) => films.filter((film) => film.userDetails.favorite),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched)
};

const getTitle = (number) => {

  switch (true) {
    case (number >= 1 && number <= 10):
      return ProfileTitles.NOVICE;
    case (number >= 11 && number <= 20):
      return ProfileTitles.FAN;
    case number >= 21:
      return ProfileTitles.MOVIE_BUFF;
    case number === 0:
      return ProfileTitles.NO_HISTORY;
  }
};

export {filter, getTitle};


