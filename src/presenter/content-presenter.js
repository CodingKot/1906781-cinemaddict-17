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

import FilmCardPresenter from './film-card-presenter.js';
import {compareRatings, compareDates} from '../utils/film-details.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';

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
  #currentFilm = null;
  #comments = null;
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

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #popupPresenter = new Map();
  #renderedFilmCount = FILMS_COUNT_PER_STEP;
  #filmCardPresenter = new Map();
  #currentFilmPresenter = new Map();
  #isLoading = true;

  constructor(mainContentContainer, bodyContentContainer, filmsModel, commentsModel, filterModel) {
    this.#mainContentContainer = mainContentContainer;
    this.#bodyContentContainer = bodyContentContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    // this.#comments = commentsModel.comments;
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

  #handleViewAction = (actionType, updateType, update) => {
    switch(actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        this.#filmsModel.deleteComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#clearContent();
        this.#renderContent();
        break;
      case UpdateType.MINOR:
        this.#currentFilm = data.id;
        this.#clearContent();
        this.#renderContent();
        this.#filmCardPresenter.get(this.#currentFilm).addPopUpToPage();
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
      case UpdateType.DELETE_COMMENT:
        this.#filmCardPresenter.get(data.id).init(data);
        this.#filmCardPresenter.get(data.id).addPopUpToPage();
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
      return;
    }
    this.#renderSort();
    this.#renderFilms(films.slice(0, Math.min(filmsCount, this.#renderedFilmCount)));
    if(filmsCount > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
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
    const filmCardPresenter = new FilmCardPresenter(this.#filmsListContainer.element, this.#bodyContentContainer, this.#handleViewAction, this.#commentsModel, this.#popupPresenter);
    filmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, filmCardPresenter);
  };

  init = () => {
    this.#renderContent();
  };
}
