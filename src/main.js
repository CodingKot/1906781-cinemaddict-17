import ContentPresenter from './presenter/content-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './films-api-service.js';
import CommentsApiService from './comments-api-service.js';


const AUTHORISATION = 'Basic gh6yT5io987j72aj';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const bodyElement = document.querySelector('body');
const footerStatistics = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORISATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORISATION), filmsModel);
const filterModel = new FilterModel();
const contentPresenter = new ContentPresenter(siteMainElement, bodyElement, filmsModel, commentsModel, filterModel, footerStatistics);
const filterPresenter = new FilterPresenter(siteHeaderElement, siteMainElement, filterModel, filmsModel);


filterPresenter.init();
contentPresenter.init();
filmsModel.init();

