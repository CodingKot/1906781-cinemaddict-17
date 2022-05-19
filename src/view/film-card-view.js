import AbstractView from '../framework/view/abstract-view.js';
import { changeReleaseDateDisplay, getTimeFromMins, sliceDescription} from '../utils/film-details.js';

const createFilmCardTemplate = (film) => {
  const {id,comments, filmInfo} = film;
  const releaseDate = filmInfo.release.date !== null ? changeReleaseDateDisplay(filmInfo.release.date) : '';
  const runtime = getTimeFromMins(filmInfo.runtime);
  return (`<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseDate}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${filmInfo.genre}</span>
      <span class="film-card__id" hidden>${id}</span>
    </p>
    <img src=${filmInfo.poster} alt="" class="film-card__poster">
    <p class="film-card__description">${sliceDescription(filmInfo.description)}</p>
    <span class="film-card__comments">${comments.length}</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
  </article>`);
};


export default class FilmCardView extends AbstractView {

  #film = null;
  constructor(film) {
    super();
    this.#film = film;
  }

  get template () {
    return createFilmCardTemplate (this.#film);
  }

  setFilmDetailsHandler = (callback) => {
    this._callback.showFilmDetails = callback;
    this.element.addEventListener('click', this.#showFilmDetailsHandler);
  };

  #showFilmDetailsHandler = (evt) => {
    evt.preventDefault();
    this._callback.showFilmDetails();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.stopPropagation();
    this._callback.favoriteClick();
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  #watchedClickHandler = (evt) => {
    evt.stopPropagation();
    this._callback.watchedClick();
  };

  setAddToWatchlistClickHandler = (callback) => {
    this._callback.addToWatchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addToWatchlistClickHandler);
  };

  #addToWatchlistClickHandler = (evt) => {
    evt.stopPropagation();
    this._callback.addToWatchlistClick();
  };

}
