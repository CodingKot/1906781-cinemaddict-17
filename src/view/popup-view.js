import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { changeReleaseDateDisplay, getTimeFromMins, isGenres, changeCommentDateDisplay} from '../utils/film-details.js';

const renderGenres = (string, bool) => {
  if(!bool) {
    return `<span class="film-details__genre">${string}</span>`;
  }
  const items = string.split(' ,').map((item)=>`<span class="film-details__genre">${item}</span>`);
  return items;
};

const renderCommentEmotion = (value) => {
  if(value === '') {
    return '';
  }
  return `<img src="./images/emoji/${value}.png" width = "55" height = "55" alt="emoji">`;
};

const renderComments = (commentsId, filmComments) => filmComments.filter((element) => (commentsId.includes(element.id))).map((element) => `<li class="film-details__comment" >
<span class="film-details__comment-emoji">
  <img src="./images/emoji/${element.emotion}.png" width="55" height="55" alt="emoji-${element.emotion}">
</span>
<div>
  <p class="film-details__comment-text">${element.comment}</p>
  <p class="film-details__comment-info">
    <span class="film-details__comment-author">${element.author}</span>
    <span class="film-details__comment-day">${changeCommentDateDisplay(element.date)}</span>
    <button class="film-details__comment-delete" data-id = "${element.id}">Delete</button>
  </p>
</div>
</li>`).join('');

const createPopupTemplate = (film, filmComments) =>  {
  const {comments, filmInfo, userDetails, commentEmotion} = film;
  const releaseDate = filmInfo.release.date !== null ? changeReleaseDateDisplay(filmInfo.release.date) : '';
  const runtime = getTimeFromMins(filmInfo.runtime);
  const genreOrGenres = isGenres(filmInfo.genre) ? 'Genres' : 'Genre';

  return (`<section class="film-details">
  <form class="film-details__inner" action="" method="get">
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
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.watchlist && 'film-details__control-button--active'}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.alreadyWatched && 'film-details__control-button--active'}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite && 'film-details__control-button--active'}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
 <section class="film-details__comments-wrap">
   <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

   <ul class="film-details__comments-list">
      ${renderComments(comments, filmComments)}
   </ul>

   <div class="film-details__new-comment">
     <div class="film-details__add-emoji-label">${renderCommentEmotion(commentEmotion)}</div>

     <label class="film-details__comment-label">
       <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
     </label>

      <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${commentEmotion === 'smile' && 'checked'}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${commentEmotion === 'sleeping' && 'checked'}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${commentEmotion === 'puke' && 'checked'}>
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${commentEmotion === 'angry' && 'checked'}>
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>
      </section>
    </div>
  </form>
</section>`);
};


export default class PopupView extends AbstractStatefulView {

  #filmComments = null;

  constructor(film, filmComments) {
    super();
    this._state = PopupView.transformFilmToState(film, filmComments);
    this.#filmComments = filmComments;

    this.#setInnerHandlers();
  }

  get template () {
    return createPopupTemplate (this._state, this.#filmComments);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('change', this.#commentEmotionHandler);
  };

  #commentEmotionHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      commentEmotion: evt.target.value
    });
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseClickHandler(this._callback.close);
    this.setAddToWatchlistClickHandler(this._callback.addToWatchlistClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  static transformFilmToState = (film, comments) => ({... film,
    commentEmotion: '',
    commentText: '',
    allComments: comments,
  });

  static transformStateToFilm = (state) => {
    const film = {...state};
    this.#filmComments = this._state.allComments;
    return film;
  };

  reset = (film) => {
    this.updateElement(
      PopupView.transformFilmToState(film),
    );
  };

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

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    const buttons = this.element.querySelectorAll('.film-details__comment-delete');
    buttons.forEach((button) => {
      button.addEventListener('click', this.#commentDeleteClickHandler);

    });
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    const id = +(evt.target.dataset.id);
    const index = this._state.comments.findIndex((commentId) => commentId === id);
    this._callback.deleteClick(index);
  };
}

