import {createElement} from '../render.js';
import { changeReleaseDateDisplay, getTimeFromMins, sliceDescription} from '../utils.js';

const createFilmCardTemplate = (film) => {
  const {comments, filmInfo} = film;
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


export default class FilmCardView {
  constructor(film) {
    this.film = film;
  }

  getTemplate () {
    return createFilmCardTemplate (this.film);
  }

  getElement () {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement () {
    this.element = null;
  }
}
