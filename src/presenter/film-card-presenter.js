import FilmCardView from '../view/film-card-view.js';
import PopupPresenter from './popup-presenter.js';
import { UserAction, UpdateType } from '../const.js';
import {render, replace, remove} from '../framework/render.js';


export default class FilmCardPresenter {

  #bodyContentContainer = null;
  #filmsListContainer = null;
  #film = null;
  #changeData = null;
  #filmComponent = null;
  #popupPresenter = null;
  #previousState = null;

  constructor (filmsListContainer, bodyContentContainer, changeData, popupPresenter, previousState){
    this.#bodyContentContainer = bodyContentContainer;
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#popupPresenter = popupPresenter;
    this.#previousState = previousState;
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
  };

  destroy = () => {
    remove(this.#filmComponent);
  };

  addPopUpToPage = (comments) => {
    if(this.#popupPresenter.size !== 0) {
      this.#popupPresenter.forEach((presenter) => presenter.resetView());
    }
    this.#renderPopUp(this.#film, comments);
  };

  #handlePopupOpenClose = () => {
    this.#changeData(
      UserAction.OPEN_POPUP,
      UpdateType.INIT_COMMENTS,
      this.#film
    );
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
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
      UpdateType.MINOR,
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
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails:{
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist
        }
      });
  };

  #renderPopUp = (film, comments) => {
    const popupPresenter = new PopupPresenter(this.#bodyContentContainer, this.#changeData, this.#previousState);
    popupPresenter.init(film, comments);
    this.#popupPresenter.set(film.id, popupPresenter);
  };

  #addFilmComponentListeners = () => {
    this.#filmComponent.setFilmDetailsHandler(this.#handlePopupOpenClose);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchListClick);
  };

  setCardUpdating = () => {
    this.#filmComponent.updateElement({
      isUpdating: true,
    });
  };

  setAborting = () => {
    const resetCardState = () => {
      this.#filmComponent.updateElement({
        isUpdating: false,
      });
    };
    this.#filmComponent.shake(resetCardState);
  };

}
