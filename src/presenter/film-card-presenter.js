import FilmCardView from '../view/film-card-view.js';
import PopupPresenter from './popup-presenter.js';
import { UserAction, UpdateType } from '../const.js';
import {render, replace, remove} from '../framework/render.js';

const PopUpMode = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED'
};

export default class FilmCardPresenter {

  #bodyContentContainer = null;
  #filmsListContainer = null;
  #film = null;
  #comments = null;
  #changeData = null;
  #filmComponent = null;
  #commentsModel = null;
  #popUpPresenter = null;
  #mode = PopUpMode.CLOSED;
  #localComment = {
    comment: '',
    emotion: ''
  };

  constructor (filmsListContainer, bodyContentContainer, changeData, commentsModel, popUpPresenter){
    this.#bodyContentContainer = bodyContentContainer;
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;
    this.#popUpPresenter = popUpPresenter;
  }

  init = (film) => {
    this.#film = film;
    const prevfilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#addFilmComponentListeners();

    if(prevfilmComponent === null) {
      render(this.#filmComponent, this.#filmsListContainer);
      return;
    }

    replace(this.#filmComponent, prevfilmComponent);

    remove(prevfilmComponent);
    if(this.#mode === PopUpMode.OPEN) {
      this.addPopUpToPage();
    }
  };

  destroy = () => {
    remove(this.#filmComponent);
  };

  #handleFilmCardEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.INIT_COMMENTS:
        this.addPopUpToPage();
        this.#commentsModel.removeObserver(this.#handleFilmCardEvent);
        break;
      // case UpdateType.DELETE_COMMENT:
      //   this.#commentsModel.deleteComment(updateType, update);

    }
  };

  #updatePopup = () => {
    if(this.#mode === PopUpMode.OPEN) {
      this.#popUpPresenter.get(this.#film.id).init(this.#film, this.#comments);
    }
  };

  addPopUpToPage = () => {
    if(this.#popUpPresenter.size !== 0) {
      this.#popUpPresenter.forEach((presenter) => presenter.resetView());
    }
    const comments = this.comments;
    this.#renderPopUp(this.#film, comments);
    this.#mode = PopUpMode.OPEN;
  };

  #handlePopupOpenClose = () => {
    this.#commentsModel.addObserver(this.#handleFilmCardEvent);
    this.#commentsModel.init(this.#film.id);
  };

  get comments () {
    const comments = this.#commentsModel.comments;
    return comments;
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      this.#mode === PopUpMode.OPEN ? UpdateType.MINOR : UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite}
      },
    );
  };

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      this.#mode === PopUpMode.OPEN ? UpdateType.MINOR : UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched
        }
      }
    );
  };

  #handleAddToWatchListClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      this.#mode === PopUpMode.OPEN ? UpdateType.MINOR : UpdateType.PATCH,
      {
        ...this.#film,
        userDetails:{
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist
        }
      });
  };

  #renderPopUp = (film, comments) => {
    const popupPresenter = new PopupPresenter(this.#bodyContentContainer, this.#changeData, this.#handleFilmCardEvent);
    popupPresenter.init(film, comments);
    this.#popUpPresenter.set(film.id, popupPresenter);
    this.#mode = PopUpMode.OPEN;
  };

  #addFilmComponentListeners = () => {
    this.#filmComponent.setFilmDetailsHandler(this.#handlePopupOpenClose);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchListClick);
  };
}
