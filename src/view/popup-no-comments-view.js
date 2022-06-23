import AbstractView from '../framework/view/abstract-view.js';
import {changeReleaseDateDisplay, getTimeFromMins, isGenres} from '../utils/film-details.js';

const createPopupTemplate = (film) => {
  const {filmInfo, userDetails, comments} = film;
  const releaseDate = filmInfo.release.date !== null ? changeReleaseDateDisplay(filmInfo.release.date) : '';
  const runtime = getTimeFromMins(filmInfo.runtime);
  const genreOrGenres = isGenres(filmInfo.genre) ? 'Genres' : 'Genre';

  return (`
  <section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">
            <p class="film-details__age">${filmInfo.ageRating}+</p>
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

                 ${filmInfo.genre}
              </tr>
            </table>

            <p class="film-details__film-description">
              ${filmInfo.description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.watchlist && 'film-details__control-button--active'}" id="watchlist" name="watchlist" disabled>Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.alreadyWatched && 'film-details__control-button--active'}" id="watched" name="watched" disabled>Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite && 'film-details__control-button--active'}" id="favorite" name="favorite" disabled>Add to favorites</button>
        </section>
      </div>
      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <p class = "no_comments__text"> Sorry, comments can't be loaded.</p>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" readonly></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" disabled>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" disabled>
              <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" disabled>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" disabled>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`);
};

export default class PopupNoCommentsView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template () {
    return createPopupTemplate(this.#film);
  }

  setCloseClickHandler = (callback) => {
    this._callback.close = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.close();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  setAddToWatchlistClickHandler = (callback) => {
    this._callback.addToWatchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addToWatchlistClickHandler);
  };

  #addToWatchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToWatchlistClick();
  };
}
