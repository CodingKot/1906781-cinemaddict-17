import PopUpView from '../view/popup-view.js';
import PopUpWithoutComments from '../view/popup-no-comments-view.js';
import { UserAction, UpdateType } from '../const.js';
import {render, replace, remove} from '../framework/render.js';

export default class PopupPresenter {
  #bodyContentContainer = null;
  #popUpComponent = null;
  #film = null;
  #comments = [];
  #changeData = null;
  #changeCard = null;

  constructor(bodyContentContainer, changeData, changeCard){
    this.#bodyContentContainer = bodyContentContainer;
    this.#changeData = changeData;
    this.#changeCard = changeCard;
  }

  init (film, comments) {
    this.#film = film;
    this.#comments = comments;
    const prevPopUpComponent = this.#popUpComponent;
    if(this.#comments === 'no comments') {
      this.#popUpComponent = new PopUpWithoutComments(film);
      this.#addPopUpNoCommentsListeners();
    } else {
      this.#popUpComponent = new PopUpView(film, comments);
      this.#addPopUpComponentListeners();
    }
    if(prevPopUpComponent === null) {
      this.#renderPopUp();
      return;
    }
    replace(this.#popUpComponent, prevPopUpComponent);
    remove(prevPopUpComponent);
  }

  #renderPopUp = () => {
    render(this.#popUpComponent, this.#bodyContentContainer);
    this.#bodyContentContainer.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #closePopup = () => {
    this.#bodyContentContainer.classList.remove('hide-overflow');
    remove(this.#popUpComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    this.#changeCard(
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

  #addPopUpComponentListeners = () => {
    this.#popUpComponent.setCloseClickHandler(this.#closePopup);
    this.#popUpComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popUpComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popUpComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchListClick);
    this.#popUpComponent.setDeleteClickHandler(this.#handleDeleteCommentClick);
  };

  #addPopUpNoCommentsListeners = () => {
    this.#popUpComponent.setCloseClickHandler(this.#closePopup);
    this.#popUpComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popUpComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popUpComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchListClick);
  };

  #handleDeleteCommentClick = (commentId) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.DELETE_COMMENT,
      commentId);
  };

  resetView = () => {
    this.#closePopup();
  };
}
