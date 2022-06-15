import PopUpView from '../view/popup-view.js';
import PopUpWithoutComments from '../view/popup-no-comments-view.js';
import { UserAction, UpdateType } from '../const.js';
import {render, replace, remove} from '../framework/render.js';

export default class PopupPresenter {
  #bodyContentContainer = null;
  #popupComponent = null;
  #film = null;
  #comments = [];
  #changeData = null;


  constructor(bodyContentContainer, changeData){
    this.#bodyContentContainer = bodyContentContainer;
    this.#changeData = changeData;
  }

  init (film, comments) {
    this.#film = film;
    this.#comments = comments;
    const prevPopupComponent = this.#popupComponent;
    if(this.#comments === null) {
      this.#popupComponent = new PopUpWithoutComments(film);
      this.#addPopUpNoCommentsListeners();
    } else {
      this.#popupComponent = new PopUpView(film, comments);
      this.#addPopUpComponentListeners();
    }
    if(prevPopupComponent === null) {
      this.#renderPopUp();
      return;
    }
    replace(this.#popupComponent, prevPopupComponent);
    remove(prevPopupComponent);
  }

  #renderPopUp = () => {
    render(this.#popupComponent, this.#bodyContentContainer);
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
    remove(this.#popupComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#changeData(
      UserAction.CLOSE_POPUP,
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

  #addPopUpComponentListeners = () => {
    this.#popupComponent.setCloseClickHandler(this.#closePopup);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchListClick);
    this.#popupComponent.setDeleteClickHandler(this.#handleDeleteCommentClick);
    this.#popupComponent.setFormSubmitHandler(this.#handleFormSubmit);
  };

  #addPopUpNoCommentsListeners = () => {
    this.#popupComponent.setCloseClickHandler(this.#closePopup);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchListClick);
  };

  #handleDeleteCommentClick = (commentId) => {

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.DELETE_COMMENT,
      commentId,
      this.#film);
  };

  #handleFormSubmit = (localComment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.ADD_COMMENT,
      localComment,
      this.#film);
  };

  resetView = () => {
    this.#closePopup();
  };

  setCommentDeleting = () => {
    this.#popupComponent.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  };

  setCommentSending = () => {
    this.#popupComponent.updateElement({
      isSending: true,
    });
  };

  setPopupUpdating = () => {
    this.#popupComponent.updateElement({
      isUpdating: true,
    });
  };

  setAborting = () => {
    const resetPopupState = () => {
      this.#popupComponent.updateElement({
        isDisabled: false,
        isDeleting: false,
        isSending: false,
        isUpdating: false,
      });
    };
    this.#popupComponent.shake(resetPopupState);
  };
}
