import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListSectionView from '../view/films-list-section-view.js';
import FilmsListHeadingView from '../view/films-list-heading-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import LoadingView from '../view/loading-view.js';
import ExtraView from '../view/extras-view.js';
import TopHeadingView from '../view/top-rated-heading-view.js';
import CommentedHeadingView from '../view/most-commented-heading-view.js';
import ExtrasContainerView from '../view/extras-container.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmsQuantityView from '../view/films-quantity-view.js';
import FilmCardPresenter from './film-card-presenter.js';
import {compareRatings, compareDates} from '../utils/film-details.js';
import {SortType, UpdateType, UserAction, FilterType, PopUpMode, TimeLimit} from '../const.js';

import {render, remove, RenderPosition} from '../framework/render.js';
import {filter} from '../utils/filter.js';


// const EXTRA_CARDS_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

export default class ContentPresenter {
  #mainContentContainer = null;
  #bodyContentContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #sortComponent = null;
  #noFilmComponent = null;
  #loadingComponent = new LoadingView();
  #sectionComponent = new FilmsSectionView();
  #filmsSection = new FilmsListSectionView();
  #listHeading = new FilmsListHeadingView();
  #filmsListContainer = new FilmsListContainerView();
  #showMoreButton = null;

  #topHeadingView = new TopHeadingView();
  #commentedHeadingView = new CommentedHeadingView();
  #topRatedExtra = new ExtraView();
  #topRatedContainer = new ExtrasContainerView();
  #mostCommentedExtra = new ExtraView();
  #mostCommentedContainer = new ExtrasContainerView();
  #footerStatistics = null;
  #filmsQuantity = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #popupPresenter = new Map();
  #renderedFilmCount = FILMS_COUNT_PER_STEP;
  #filmCardPresenter = new Map();
  #previousState = new Map();
  #isLoading = true;
  #mode = PopUpMode.CLOSED;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(mainContentContainer, bodyContentContainer, filmsModel, commentsModel, filterModel, footerStatistics) {

    this.#mainContentContainer = mainContentContainer;
    this.#bodyContentContainer = bodyContentContainer;
    this.#footerStatistics = footerStatistics;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = [...this.#filmsModel.films];
    const filteredFilms = filter[this.#filterType](films);
    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(compareDates);
      case SortType.RATING:
        return filteredFilms.sort(compareRatings);
    }
    return filteredFilms;
  }

  get comments () {
    return this.#commentsModel.comments;
  }

  #handleViewAction = async (actionType, updateType, update, film) => {
    this.#uiBlocker.block();
    switch(actionType) {
      case UserAction.OPEN_POPUP:
        this.#commentsModel.init(updateType, update.id);
        break;
      case UserAction.CLOSE_POPUP:
        this.#mode = PopUpMode.CLOSED;
        break;
      case UserAction.UPDATE_FILM:
        this.#filmCardPresenter.get(update.id).setCardUpdating();
        if(this.#mode === PopUpMode.OPEN) {
          this.#popupPresenter.get(update.id).setPopupUpdating();
        }
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch(err) {
          this.#filmCardPresenter.get(update.id).setAborting();
          if(this.#mode === PopUpMode.OPEN) {
            this.#popupPresenter.get(update.id).setAborting();
          }
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#popupPresenter.get(film.id).setCommentSending();
        try {
          await this.#commentsModel.addComment(updateType, update, film);
        } catch(err) {
          this.#popupPresenter.get(film.id).setAborting();
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#popupPresenter.get(film.id).setCommentDeleting();
        try {
          await this.#commentsModel.deleteComment(updateType, update, film);
        } catch(err) {
          this.#popupPresenter.get(film.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH_DELETE_COMMENT:
        this.#filmCardPresenter.get(data.id).init(data);
        if(this.#mode === PopUpMode.OPEN) {
          this.#popupPresenter.get(data.id).init(data, this.comments);
          this.#updateToPrevious(data, this.#popupPresenter.get(data.id));
        }
        break;
      case UpdateType.PATCH_ADD_COMMENT:
        this.#filmCardPresenter.get(data.id).init(data);
        if(this.#mode === PopUpMode.OPEN) {
          this.#popupPresenter.get(data.id).init(data, this.comments);
        }
        break;
      case UpdateType.MINOR:
        this.#clearContent({resetRenderedFilmCount: true});
        this.#renderContent();
        if(this.#mode === PopUpMode.OPEN) {
          this.#popupPresenter.get(data.id).init(data, this.comments);
          this.#updateToPrevious(data, this.#popupPresenter.get(data.id));
        }
        break;
      case UpdateType.MAJOR:
        this.#clearContent({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderContent();
        break;
      case UpdateType.INIT_FILMS:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderContent();
        break;
      case UpdateType.INIT_COMMENTS:
        this.#filmCardPresenter.get(data).addPopUpToPage(this.comments);
        this.#mode = PopUpMode.OPEN;
        break;
      case UpdateType.DELETE_COMMENT:
        this.#filmsModel.updateFilm(UpdateType.PATCH_DELETE_COMMENT, data);
        break;
      case UpdateType.ADD_COMMENT:
        this.#filmsModel.addComment(UpdateType.PATCH_ADD_COMMENT, data);
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearContent({resetRenderedFilmCount: true});
    this.#renderContent();
  };

  #updateToPrevious = (film, element) => {
    const previous = this.#previousState.get(film.id);
    element.setPreviousComment(previous);
    this.#previousState.clear();
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#mainContentContainer);
  };

  #renderFilmsContainer = () => {
    render(this.#sectionComponent, this.#mainContentContainer);
    render(this.#filmsSection, this.#sectionComponent.element);
    render(this.#listHeading, this.#filmsSection.element);
    render(this.#filmsListContainer, this.#filmsSection.element);
  };


  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#sectionComponent.element, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderNoFilm = () => {
    this.#noFilmComponent = new NoFilmsView(this.#filterType);
    render(this.#noFilmComponent, this.#filmsSection.element);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButton = new ShowMoreButtonView();
    render(this.#showMoreButton, this.#filmsSection.element);
    this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #renderFilms = (films) => {
    films.forEach((film) => {
      this.#renderFilm(film);
    });
  };

  #renderTopRatedContainer = () => {
    render(this.#topRatedExtra, this.#sectionComponent.element);
    render(this.#topHeadingView, this.#topRatedExtra.element);
    render(this.#topRatedContainer, this.#topRatedExtra.element);
  };

  #renderMostCommentedContainer = () => {
    render(this.#mostCommentedExtra, this.#sectionComponent.element);
    render(this.#commentedHeadingView, this.#mostCommentedExtra.element);
    render(this.#mostCommentedContainer, this.#mostCommentedExtra.element);
  };

  #renderFilmsQuantity = (films) => {

    this.#filmsQuantity = new FilmsQuantityView (films);
    render (this.#filmsQuantity, this.#footerStatistics);

  };


  // this.#renderTopRatedContainer();
  // this.#renderFilms(0, Math.min(this.#generatedFilms.length, EXTRA_CARDS_COUNT), this.#topRatedContainer.element);

  // this.#renderMostCommentedContainer();
  // this.#renderFilms(0, Math.min(this.#generatedFilms.length, EXTRA_CARDS_COUNT), this.#mostCommentedContainer.element);


  #clearContent = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.films.length;
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#showMoreButton);
    remove(this.#filmsQuantity);

    if(this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }

    if(resetRenderedFilmCount) {
      this.#renderedFilmCount = FILMS_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmsCount, this.#renderedFilmCount);
    }

    if(resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderContent = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const films = this.films;
    const filmsCount = films.length;
    this.#renderFilmsContainer();
    if(filmsCount === 0) {
      this.#renderNoFilm();
      this.#renderFilmsQuantity(films);
      return;
    }

    this.#renderSort();
    this.#renderFilms(films.slice(0, Math.min(filmsCount, this.#renderedFilmCount)));
    if(filmsCount > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
    this.#renderFilmsQuantity(films);
  };

  #handleShowMoreButtonClick = () => {
    const filmsCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmCount + FILMS_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmsCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmsCount;

    if(this.#renderedFilmCount >= filmsCount) {
      remove(this.#showMoreButton);
    }
  };


  #renderFilm = (film) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmsListContainer.element, this.#bodyContentContainer, this.#handleViewAction, this.#popupPresenter, this.#previousState);
    filmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, filmCardPresenter);
  };

  init = () => {
    this.#renderContent();
  };
}
