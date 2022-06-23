const SectionHeading = {
  COMMENTED: 'Most commented',
  RATED: 'Top rated',
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorite',

};

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.FAVORITE]: 'There are no favorite movies now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  OPEN_POPUP: 'OPEN_POPUP',
  CLOSE_POPUP: 'CLOSE_POPUP',
};

const UpdateType = {
  PATCH_DELETE_COMMENT: 'PATCH_DELETE_COMMENT',
  PATCH_ADD_COMMENT: 'PATCH_ADD_COMMENT',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT_FILMS: 'INIT_FILMS',
  INIT_COMMENTS: 'INIT_COMMENTS',
  DELETE_COMMENT: 'DELETE_COMMENT',
  ADD_COMMENT: 'ADD_COMMENT',
  CLOSE_POPUP: 'CLOSE_POPUP',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const ProfileTitles = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
  NO_HISTORY: 'No History',
};

const PopupMode = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {FilterType, SortType, UserAction,UpdateType, NoFilmsTextType, Method, ProfileTitles, PopupMode, TimeLimit, SectionHeading};
