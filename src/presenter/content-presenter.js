import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListSectionView from '../view/films-list-section-view.js';
import FilmsListHeadingView from '../view/films-list-heading-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import LoadingView from '../view/loading-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilmsQuantityView from '../view/films-quantity-view.js';
import FilmCardPresenter from './film-card-presenter.js';
import ExtraView from '../view/extra-view.js';
import ExtraContainerView from '../view/extra-container.js';
import ExtraHeadingView from '../view/extra-heading-view.js';
import {getUniqueRandomNumber} from '../utils/common.js';
import {compareRatings, compareDates, compareCommentsNumber} from '../utils/film-details.js';
import {SortType, UpdateType, UserAction, FilterType, PopUpMode, TimeLimit, SectionHeading} from '../const.js';

import {render, remove, RenderPosition} from '../framework/render.js';
import {filter} from '../utils/filter.js';


const EXTRA_CARDS_COUNT = 2;
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
  #footerStatistics = null;
  #filmsQuantity = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #mostCommentedSection = new ExtraView();
  #mostCommentedContainer = new ExtraContainerView();
  #mostCommentedHeading = new ExtraHeadingView(SectionHeading.COMMENTED);
  #topRatedSection = new ExtraView();
  #topRatedContainer = new ExtraContainerView();
  #topRatedHeading = new ExtraHeadingView(SectionHeading.RATED);
  #popupPresenter = new Map();
  #filmCardPresenter = new Map();
  #topRatedPresenter = new Map();
  #mostCommentedPresenter = new Map();
  #previousState = new Map();
  #presenter = null;
  #renderedFilmCount = FILMS_COUNT_PER_STEP;
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
        this.#updatePresenter(data.id, data);
        this.#updateMostCommentedSection();
        if(this.#mode === PopUpMode.OPEN) {
          this.#popupPresenter.get(data.id).init(data, this.comments);
          this.#updateToPrevious(data, this.#popupPresenter.get(data.id));
        }
        break;
      case UpdateType.PATCH_ADD_COMMENT:
        this.#updatePresenter(data.id, data);
        this.#updateMostCommentedSection();
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
        this.#renderFilmsQuantity();

        break;
      case UpdateType.INIT_COMMENTS:
        this.#renderPopup(data, this.comments);
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

  #renderMostCommentedContainer = () => {
    render(this.#mostCommentedSection, this.#sectionComponent.element);
    render (this.#mostCommentedHeading, this.#mostCommentedSection.element);
    render(this.#mostCommentedContainer, this.#mostCommentedSection.element);
  };

  #renderTopRatedContainer = () => {
    render(this.#topRatedSection, this.#sectionComponent.element);
    render (this.#topRatedHeading, this.#topRatedSection.element);
    render(this.#topRatedContainer, this.#topRatedSection.element);
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

  #renderMostCommentedFilms = (films) => {
    films.forEach((film) => {
      this.#renderMostCommentedFilm(film);
    });
  };

  #renderTopRatedFilms = (films) => {
    films.forEach((film) => {
      this.#renderTopRatedFilm(film);
    });
  };

  #renderFilmsQuantity = () => {

    this.#filmsQuantity = new FilmsQuantityView (this.films);
    render (this.#filmsQuantity, this.#footerStatistics);
  };

  #renderTopRatedSection = () => {
    const films = [...this.#filmsModel.films];
    let topRatedFilms = [];
    if(films.every((film) => film.filmInfo.totalRating === 0)) {
      return;
    }
    if(films.every((film) => film.filmInfo.totalRating === films[0].filmInfo.totalRating)){
      for(let i = 0; i < Math.min(films.length, EXTRA_CARDS_COUNT); i++){
        topRatedFilms.push(getUniqueRandomNumber(films));
      }
    } else {
      topRatedFilms = films.sort(compareRatings).slice(0, Math.min(films.length, EXTRA_CARDS_COUNT));
    }
    this.#renderTopRatedContainer();
    this.#renderTopRatedFilms(topRatedFilms);
  };

  #renderMostCommentedSection = () => {
    const films = [...this.#filmsModel.films];
    let mostCommentedFilms = [];
    if(films.every((film) => film.comments.length === 0)) {
      return;
    }
    if(films.every((film) => film.comments.length === films[0].comments.length)){
      for(let i = 0; i < Math.min(films.length, EXTRA_CARDS_COUNT); i++){
        mostCommentedFilms.push(getUniqueRandomNumber(films));
      }
    } else {
      mostCommentedFilms = films.sort(compareCommentsNumber).slice(0, Math.min(films.length, EXTRA_CARDS_COUNT));
    }
    this.#renderMostCommentedContainer();
    this.#renderMostCommentedFilms(mostCommentedFilms.slice(0, Math.min(films.length, EXTRA_CARDS_COUNT)));
  };

  #removeTopRatedSection = () => {
    if(this.#topRatedSection) {
      remove(this.#topRatedHeading);
      remove(this.#topRatedContainer);
      remove(this.#topRatedSection);
    }
  };

  #removeMostCommentedSection = () => {
    if(this.#mostCommentedSection) {
      remove(this.#mostCommentedHeading);
      remove(this.#mostCommentedContainer);
      remove(this.#mostCommentedSection);
    }
  };

  #updatePresenter = (id, data) => {
    if(this.#topRatedPresenter.has(id)) {
      this.#topRatedPresenter.get(id).init(data);
    }
    if(this.#mostCommentedPresenter.has(id)) {
      this.#mostCommentedPresenter.get(id).init(data);
    }
    if(this.#filmCardPresenter.has(id)) {
      this.#filmCardPresenter.get(id).init(data);
    }
  };

  #renderPopup = (data, comments) => {
    if (this.#topRatedPresenter.has(data)) {
      this.#topRatedPresenter.get(data).addPopUpToPage(comments);
    } else if (this.#mostCommentedPresenter.has(data)) {
      this.#mostCommentedPresenter.get(data).addPopUpToPage(comments);
    } else {
      this.#filmCardPresenter.get(data).addPopUpToPage(comments);
    }
  };

  #updateMostCommentedSection = () => {
    this.#removeMostCommentedSection();
    this.#renderMostCommentedSection();
  };

  #clearContent = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.films.length;
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#showMoreButton);

    if(this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }
    this.#removeTopRatedSection();
    this.#removeMostCommentedSection();
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
      return;
    }

    this.#renderSort();
    this.#renderFilms(films.slice(0, Math.min(filmsCount, this.#renderedFilmCount)));
    if(filmsCount > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
    this.#renderTopRatedSection();
    this.#renderMostCommentedSection();
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

  #renderMostCommentedFilm = (film) => {
    const mostCommentedPresenter = new  FilmCardPresenter(this.#mostCommentedContainer.element, this.#bodyContentContainer, this.#handleViewAction, this.#popupPresenter, this.#previousState);
    mostCommentedPresenter.init(film);
    this.#mostCommentedPresenter.set(film.id, mostCommentedPresenter);
  };

  #renderTopRatedFilm = (film) => {
    const topRatedPresenter = new  FilmCardPresenter(this.#topRatedContainer.element, this.#bodyContentContainer, this.#handleViewAction, this.#popupPresenter, this.#previousState);
    topRatedPresenter.init(film);
    this.#topRatedPresenter.set(film.id, topRatedPresenter);
  };

  init = () => {
    this.#renderContent();
  };
}
