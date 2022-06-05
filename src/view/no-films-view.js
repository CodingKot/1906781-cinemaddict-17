import AbstractView from '../framework/view/abstract-view.js';
import {NoFilmsTextType} from '../const.js';

const createNoFilmsTemplate = (filterType) => {
  const noFilmTextValue = NoFilmsTextType[filterType];
  return `<h2 class="films-list__title">${noFilmTextValue}</h2>`;
};

export default class NoFilmsView extends AbstractView{
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template () {
    return createNoFilmsTemplate (this.#filterType);
  }
}
