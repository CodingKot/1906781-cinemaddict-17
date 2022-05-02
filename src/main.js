import ProfileView from './view/profile-view';
import NavigationView from './view/navigation-view.js';
import SortView from './view/sort-view';
import FilmsPesenter from './presenter/films-presenter';

import { render} from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const bodyElement = document.querySelector('body');

const filmsPresenter = new FilmsPesenter();
render(new ProfileView(), siteHeaderElement);
render(new NavigationView(), siteMainElement);
render(new SortView(), siteMainElement);

filmsPresenter.init(siteMainElement, bodyElement);
