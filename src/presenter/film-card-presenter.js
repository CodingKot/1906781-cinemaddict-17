import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import {render, replace, remove} from '../framework/render.js';

const PopupMode = {
  OPEN: 'OPEN',
  CLOSED: 'CLoSED'
};

export default class FilmCardPresenter {

  #bodyContentContainer = null;
  #filmListContainer = null;
  #popup = null;
  #films = null;
  #comments = null;
  #film = null;
  #changeData = null;
  #filmComponent = null;
  #changeMode = null;
  #mode = PopupMode.CLOSED;

  constructor (filmListContainer, bodyContentContainer, films, comments, changeData, changeMode){
    this.#bodyContentContainer = bodyContentContainer;
    this.#filmListContainer = filmListContainer;
    this.#films = films;
    this.#comments = comments;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film, container) => {
    this.#film = film;

    const prevCard = this.#filmComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#filmComponent.setFilmDetailsHandler(this.#handlePopupOpenClose);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchListClick);
    if(prevCard === null) {
      render(this.#filmComponent, container);
      return;
    }

    if(this.#filmListContainer.contains(prevCard.element)) {
      replace(this.#filmComponent, prevCard);
    }

    remove(prevCard);

  };


  destroy = () => {
    remove(this.#film);
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #closePopup = () => {
    this.#bodyContentContainer.classList.remove('hide-overflow');
    remove(this.#popup);
    this.#mode = PopupMode.CLOSED;
  };

  #renderPopup = () => {
    const filmId = +(this.#filmComponent.element.querySelector('.film-card__id').textContent);
    const selectedFilm = this.#films.find((film) => film.id === filmId);
    this.#popup = new PopupView(selectedFilm, this.#comments);
    render(this.#popup, this.#bodyContentContainer);
    this.#popup.setPopupFavoriteClickHandler(this.#handlePopupFavoriteClick);
    this.#popup.setPopupAddToWatchlistClickHandler(this.#handlePopupAddToWatchlistClick);
    this.#popup.setPopupWatchedClickHandler(this.#handlePopupWatchedClick);
    this.#bodyContentContainer.classList.add('hide-overflow');
    const closeButton = this.#popup.element.querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', this.#closePopup);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = PopupMode.OPEN;
  };

  #handlePopupOpenClose = () => {
    this.#changeMode();
    const prevPopup = this.#popup;
    if (prevPopup === null) {
      this.#renderPopup();
      return;
    }

    if(this.#mode === PopupMode.OPEN) {
      replace(this.#popup, prevPopup);
    }

    remove(prevPopup);
  };

  #handleFavoriteClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite
      }
    });

    this.#filmComponent.element.querySelector('.film-card__controls-item--favorite').classList.toggle('film-card__controls-item--active');
  };

  #handleWatchedClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched
      }
    });

    this.#filmComponent.element.querySelector('.film-card__controls-item--mark-as-watched').classList.toggle('film-card__controls-item--active');
  };

  #handleAddToWatchListClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails:{
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist
      }
    });

    this.#filmComponent.element.querySelector('.film-card__controls-item--add-to-watchlist').classList.toggle('film-card__controls-item--active');
  };

  #handlePopupFavoriteClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite
      }
    });

    this.#popup.element.querySelector('.film-details__control-button--favorite').classList.toggle('film-details__control-button--active');
  };

  #handlePopupAddToWatchlistClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails:{
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist
      }
    });

    this.#popup.element.querySelector('.film-details__control-button--watchlist').classList.toggle('film-details__control-button--active');
  };

  #handlePopupWatchedClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched
      }
    });

    this.#popup.element.querySelector('.film-details__control-button--watched').classList.toggle('film-details__control-button--active');
  };

  resetView = () => {
    if(this.#mode !== PopupMode.CLOSED) {
      this.#closePopup();
    }
  };


}
