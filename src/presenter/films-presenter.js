import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListSectionView from '../view/films-list-section-view.js';
import FilmsListHeadingView from '../view/films-list-heading-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ExtraView from '../view/extras-view.js';
import TopHeadingView from '../view/top-rated-heading-view.js';
import CommentedHeadingView from '../view/most-commented-heading-view.js';
import ExtrasContainerView from '../view/extras-container.js';
import PopupView from '../view/popup-view.js';
import NoFilmsView from '../view/no-films-view.js';

import {render, remove} from '../framework/render.js';

const EXTRA_CARDS_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #mainContentContainer = null;
  #bodyContentContainer = null;
  #filmsModel = null;
  #popup = null;
  #sectionComponent = new FilmsSectionView();
  #filmsSection = new FilmsListSectionView();
  #listHeading = new FilmsListHeadingView();
  #filmsListContainer = new FilmsListContainerView();
  #showMoreButton = new ShowMoreButtonView();
  #topRatedExtra = new ExtraView();
  #topRatedContainer = new ExtrasContainerView();
  #mostCommentedExtra = new ExtraView();
  #mostCommentedContainer = new ExtrasContainerView();
  #generatedFilms = [];
  #generatedComments = [];
  #renderedFilmCount = FILMS_COUNT_PER_STEP;

  constructor(mainContentContainer, bodyContentContainer, filmsModel) {
    this.#mainContentContainer = mainContentContainer;
    this.#bodyContentContainer = bodyContentContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#generatedFilms = [...this.#filmsModel.films];
    this.#generatedComments = [...this.#filmsModel.comments];
    this.#renderContent();
  };

  #renderContent = () => {
    render(this.#sectionComponent, this.#mainContentContainer);
    render(this.#filmsSection, this.#sectionComponent.element);
    render(this.#listHeading, this.#filmsSection.element);
    render(this.#filmsListContainer, this.#filmsSection.element);

    if(this.#generatedFilms.length === 0) {
      render(new NoFilmsView(), this.#filmsSection.element);
    } else {
      for( let i = 0; i < Math.min(this.#generatedFilms.length, FILMS_COUNT_PER_STEP); i++) {
        this.#renderFilm(this.#generatedFilms[i], this.#filmsListContainer.element);
      }

      if(this.#generatedFilms.length > FILMS_COUNT_PER_STEP) {
        render(this.#showMoreButton, this.#filmsSection.element);

        this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
      }
      render(this.#topRatedExtra, this.#sectionComponent.element);
      render(new TopHeadingView(), this.#topRatedExtra.element);
      render(this.#topRatedContainer, this.#topRatedExtra.element);
      for (let i = 0; i < Math.min(this.#generatedFilms.length, EXTRA_CARDS_COUNT); i++) {
        this.#renderFilm(this.#generatedFilms[i], this.#topRatedContainer.element);
      }
      render(this.#mostCommentedExtra, this.#sectionComponent.element);
      render(new CommentedHeadingView(), this.#mostCommentedExtra.element);
      render(this.#mostCommentedContainer, this.#mostCommentedExtra.element);
      for (let i = 0; i < Math.min(this.#generatedFilms.length, EXTRA_CARDS_COUNT); i++) {
        this.#renderFilm(this.#generatedFilms[i], this.#mostCommentedContainer.element);
      }
    }
  };

  #handleShowMoreButtonClick = () => {
    this.#generatedFilms
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film, this.#filmsListContainer.element));

    this.#renderedFilmCount += FILMS_COUNT_PER_STEP;

    if(this.#renderedFilmCount >= this.#generatedFilms.length) {
      remove(this.#showMoreButton);
    }
  };

  #renderFilm = (film, container) => {

    let closeButton = null;
    const filmCard = new FilmCardView(film);
    render(filmCard, container);

    const closePopup = () => {
      remove(this.#popup);
      this.#bodyContentContainer.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if(evt.key === 'Escape' || evt.key === 'Esc') {
        closePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const showPopup = () => {
      if (this.#bodyContentContainer.classList.contains('hide-overflow')) {
        closePopup();
      }
      const filmId = +(filmCard.element.querySelector('.film-card__id').textContent);
      const selectedFilm = this.#generatedFilms.find((item) => item.id === filmId);
      this.#popup = new PopupView(selectedFilm, this.#generatedComments);
      render(this.#popup, this.#bodyContentContainer);
      this.#bodyContentContainer.classList.add('hide-overflow');
      closeButton = this.#popup.element.querySelector('.film-details__close-btn');
      closeButton.addEventListener('click', closePopup);
      document.addEventListener('keydown', onEscKeyDown);
    };

    filmCard.setFilmDetailsHandler(showPopup);
  };
}
