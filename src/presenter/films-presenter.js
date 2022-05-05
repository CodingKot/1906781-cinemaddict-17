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
import FormView from '../view/form-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import CommentsView from '../view/comments-view.js';

import { render } from '../render.js';

const START_CARDS_COUNT = 5;
const EXTRA_CARDS_COUNT = 2;

export default class FilmsPesenter {
  sectionComponent = new FilmsSectionView();
  filmsSection = new FilmsListSectionView();
  listHeading = new FilmsListHeadingView();
  filmsListContainer = new FilmsListContainerView();
  showMoreButton = new ShowMoreButtonView();
  topRatedExtra = new ExtraView();
  topRatedContainer = new ExtrasContainerView();
  mostCommentedExtra = new ExtraView();
  mostCommentedContainer = new ExtrasContainerView();


  init = (firstContentContainer, secondContentContainer, filmsModel) => {
    this.firstContentContainer = firstContentContainer;
    this.secondContentContainer = secondContentContainer;
    this.popup = new PopupView();
    this.form = new FormView();
    this.filmsModel = filmsModel;
    this.generatedFilms = [...this.filmsModel.getFilms()];
    this.generatedComments = [...this.filmsModel.getComments()];
    render(this.sectionComponent, this.firstContentContainer);
    render(this.filmsSection, this.sectionComponent.getElement());
    render(this.listHeading, this.filmsSection.getElement());
    render(this.filmsListContainer, this.filmsSection.getElement());

    for( let i = 0; i < START_CARDS_COUNT; i++) {
      render(new FilmCardView(this.generatedFilms[i]), this.filmsListContainer.getElement());
    }

    render(this.showMoreButton, this.filmsSection.getElement());
    render(this.topRatedExtra, this.sectionComponent.getElement());
    render(new TopHeadingView(), this.topRatedExtra.getElement());
    render(this.topRatedContainer, this.topRatedExtra.getElement());
    for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
      render(new FilmCardView(this.generatedFilms[i]), this.topRatedContainer.getElement());
    }
    render(this.mostCommentedExtra, this.sectionComponent.getElement());
    render(new CommentedHeadingView(), this.mostCommentedExtra.getElement());
    render(this.mostCommentedContainer, this.mostCommentedExtra.getElement());
    for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
      render(new FilmCardView(this.generatedFilms[i]), this.mostCommentedContainer.getElement());
    }
    render(this.popup, this.secondContentContainer);
    render(this.form, this.popup.getElement());
    render(new FilmDetailsView(this.generatedFilms[0]), this.form.getElement());
    render(new CommentsView(this.generatedFilms[0], this.generatedComments), this.form.getElement());
  };
}
