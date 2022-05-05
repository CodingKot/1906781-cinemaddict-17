import {createElement} from '../render.js';
import { changeReleaseDateDisplay, getTimeFromMins, isGenres} from '../utils.js';


const renderGenres = (string, bool) => {
  if(!bool) {
    return `<span class="film-details__genre">${string}</span>`;
  }
  const items = string.split(' ,').map((item)=>`<span class="film-details__genre">${item}</span>`);
  return items;
};

const createFilmDetailsTemplate = (film) => {
  const {filmInfo} = film;
  const releaseDate = filmInfo.release.date !== null ? changeReleaseDateDisplay(filmInfo.release.date) : '';
  const runtime = getTimeFromMins(filmInfo.runtime);
  const genreOrGenres = isGenres(filmInfo.genre) ? 'Genres' : 'Genre';
  return (`
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
      <div class="film-details__poster">
      <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

      <p class="film-details__age">${filmInfo.ageRating}</p>
    </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title}</h3>
              <p class="film-details__title-original">${filmInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmInfo.writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmInfo.actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${runtime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genreOrGenres}</td>
              <td class="film-details__cell">

                ${renderGenres(filmInfo.genre, isGenres(filmInfo.genre))}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${filmInfo.description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>`);
};

export default class FilmDetailsView {

  constructor(film) {
    this.film = film;
  }

  getTemplate () {
    return createFilmDetailsTemplate (this.film);
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
