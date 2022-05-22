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
import { updateItem } from '../utils/common.js';

import {render, remove} from '../framework/render.js';

// const EXTRA_CARDS_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #mainContentContainer = null;
  #bodyContentContainer = null;
  #filmsModel = null;
  #sortComponent = new SortView();
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
    this.#filmCardPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#mainContentContainer);
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
