import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListSectionView from '../view/films-list-section-view.js';
import FilmsListHeadingView from '../view/films-list-heading-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ExtraView from '../view/extras-view.js';
import TopHeadingView from '../view/top-rated-heading-view.js';
import CommentedHeadingView from '../view/most-commented-heading-view.js';
import ExtrasContainerView from '../view/extras-container.js';
import NoFilmsView from '../view/no-films-view.js';

import FilmCardPresenter from './film-card-presenter.js';
import {updateItem} from '../utils/common.js';
import {compareRatings, compareDates} from '../utils/film-details.js';
import {SortType} from '../view/sort-view.js';

import {render, remove, replace} from '../framework/render.js';


// const EXTRA_CARDS_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #mainContentContainer = null;
  #bodyContentContainer = null;
  #filmsModel = null;
  #sortComponent = null;
  #noFilmView = new NoFilmsView();
  #sectionComponent = new FilmsSectionView();
  #filmsSection = new FilmsListSectionView();
  #listHeading = new FilmsListHeadingView();
  #filmsListContainer = new FilmsListContainerView();
  #showMoreButton = new ShowMoreButtonView();

  #topHeadingView = new TopHeadingView();
  #commentedHeadingView = new CommentedHeadingView();
  #topRatedExtra = new ExtraView();
  #topRatedContainer = new ExtrasContainerView();
  #mostCommentedExtra = new ExtraView();
  #mostCommentedContainer = new ExtrasContainerView();
  #generatedFilms = [];
  #generatedComments = [];
  #currentSortType = SortType.DEFAULT;
  #sourcedFilms = [];
  #renderedFilmCount = FILMS_COUNT_PER_STEP;
  #filmCardPresenter = new Map();

  constructor(mainContentContainer, bodyContentContainer, filmsModel) {
    this.#mainContentContainer = mainContentContainer;
    this.#bodyContentContainer = bodyContentContainer;
    this.#filmsModel = filmsModel;
  }

  #handleModeChange = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleFilmChange = (updatedFilm) => {
    this.#generatedFilms = updateItem(this.#generatedFilms, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#filmCardPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #sortFilms = (sortType) => {
    switch(sortType) {
      case SortType.RATING:
        this.#generatedFilms.sort(compareRatings);
        break;
      case SortType.DATE:
        this.#generatedFilms.sort(compareDates);
        break;
      default:
        this.#generatedFilms = [...this.#sourcedFilms];
    }
    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortFilms(sortType);
    this.#clearFilmsList();
    this.#renderFilmsList();
    this.#renderSort();
  };

  #renderSort = () => {
    const prevSort = this.#sortComponent;
    this.#sortComponent = new SortView();
    if(prevSort === null) {
      render(this.#sortComponent, this.#mainContentContainer);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
      return;
    }
    if(this.#mainContentContainer.contains(prevSort.element)){
      replace(this.#sortComponent, prevSort);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    }
    remove(prevSort);
  };

  #renderFilmsContainer = () => {
    render(this.#sectionComponent, this.#mainContentContainer);
    render(this.#filmsSection, this.#sectionComponent.element);
    render(this.#listHeading, this.#filmsSection.element);
    render(this.#filmsListContainer, this.#filmsSection.element);
  };

  #renderNoFilmView = () => {
    render(this.#noFilmView, this.#filmsSection.element);
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButton, this.#filmsSection.element);
    this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #renderFilms = (from, to, container) => {
    this.#generatedFilms
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film, container));
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

  #renderFilmsList = () => {
    if(this.#generatedFilms.length === 0) {
      this.#renderNoFilmView();
    } else {
      this.#renderFilms(0, Math.min(this.#generatedFilms.length, FILMS_COUNT_PER_STEP));

      if(this.#generatedFilms.length > FILMS_COUNT_PER_STEP) {
        this.#renderShowMoreButton();
      }

      // this.#renderTopRatedContainer();
      // this.#renderFilms(0, Math.min(this.#generatedFilms.length, EXTRA_CARDS_COUNT), this.#topRatedContainer.element);

      // this.#renderMostCommentedContainer();
      // this.#renderFilms(0, Math.min(this.#generatedFilms.length, EXTRA_CARDS_COUNT), this.#mostCommentedContainer.element);
    }
  };

  #clearFilmsList = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
    this.#renderedFilmCount = FILMS_COUNT_PER_STEP;
    remove(this.#showMoreButton);
  };

  init = () => {
    this.#generatedFilms = [...this.#filmsModel.films];
    this.#generatedComments = [...this.#filmsModel.comments];
    this.#sourcedFilms = [...this.#filmsModel.films];
    this.#renderContent();
  };


  #renderContent = () => {

    this.#renderSort();
    this.#renderFilmsContainer();
    this.#renderFilmsList();
  };

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILMS_COUNT_PER_STEP,this.#filmsListContainer.element);
    this.#renderedFilmCount += FILMS_COUNT_PER_STEP;

    if(this.#renderedFilmCount >= this.#generatedFilms.length) {
      remove(this.#showMoreButton);
    }
  };

  #renderFilm = (film) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmsListContainer.element, this.#bodyContentContainer, this.#generatedComments, this.#handleFilmChange, this.#handleModeChange);
    filmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, filmCardPresenter);
  };

}
