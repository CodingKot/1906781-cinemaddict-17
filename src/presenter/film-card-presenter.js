import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import {render, replace, remove} from '../framework/render.js';

const PopupMode = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED'
};

export default class FilmCardPresenter {

  #bodyContentContainer = null;
  #filmsListContainer = null;
  #popupComponent = null;
  #comments = null;
  #film = null;
  #changeData = null;
  #filmComponent = null;
  #changeMode = null;
  #mode = PopupMode.CLOSED;

  constructor (filmsListContainer, bodyContentContainer, comments, changeData, changeMode){
    this.#bodyContentContainer = bodyContentContainer;
    this.#filmsListContainer = filmsListContainer;
    this.#comments = comments;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;
    const prevfilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#popupComponent = new PopupView(film, this.#comments);

    this.#addFilmComponentListeners();
    this.#addPopupComponentListeners();

    if(prevfilmComponent === null) {
      render(this.#filmComponent, this.#filmsListContainer);
      return;
    }

    if(this.#mode === PopupMode.CLOSED) {
      replace(this.#filmComponent, prevfilmComponent);
    }

    if(this.#mode === PopupMode.OPEN) {
      replace(this.#filmComponent, prevfilmComponent);
      replace(this.#popupComponent, prevPopupComponent);
    }

    remove(prevfilmComponent);
    remove(prevPopupComponent);
  };


  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#popupComponent);
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #closePopup = () => {
    this.#bodyContentContainer.classList.remove('hide-overflow');
    remove(this.#popupComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = PopupMode.CLOSED;
  };

  #renderPopup = () => {
    render(this.#popupComponent, this.#bodyContentContainer);
  };

  #handlePopupOpenClose = () => {
    this.#changeMode();
    this.#renderPopup();
    this.#mode = PopupMode.OPEN;
    this.#bodyContentContainer.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#addPopupComponentListeners();
  };

  #handleFavoriteClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite
      }
    });
  };

  #handleWatchedClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched
      }
    });
  };

  #handleAddToWatchListClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails:{
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist
      }
    });
  };

  resetView = () => {
    if(this.#mode !== PopupMode.CLOSED) {
      this.#closePopup();
    }
  };

  #addPopupComponentListeners = () => {
    this.#popupComponent.setCloseClickHandler(this.#closePopup);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchListClick);
  };

  #addFilmComponentListeners = () => {
    this.#filmComponent.setFilmDetailsHandler(this.#handlePopupOpenClose);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchListClick);
  };
}
