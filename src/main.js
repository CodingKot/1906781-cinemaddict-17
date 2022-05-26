import ProfileView from './view/profile-view';
import FilterView from './view/filter-view.js';

import FilmsPresenter from './presenter/content-presenter.js';
import FilmsModel from './model/films-model.js';
import {render} from './framework/render.js';
import { generateFilter } from './mock/filter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const bodyElement = document.querySelector('body');

const filmsModel = new FilmsModel();
const filmsPresenter = new FilmsPresenter(siteMainElement, bodyElement, filmsModel);

const filters = generateFilter(filmsModel.films);

render(new ProfileView(), siteHeaderElement);
render(new FilterView(filters), siteMainElement);


filmsPresenter.init();

