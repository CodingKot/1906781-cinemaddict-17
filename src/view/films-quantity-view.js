import AbstractView from '../framework/view/abstract-view.js';

const createFilmsQuantityTemplate = (films) =>  `<p>${films.length} movies inside</p>`;

export default class FilmsQuantityView extends AbstractView {
  #films = null;

  constructor (films) {
    super();
    this.#films = films;
  }

  get template () {
    return createFilmsQuantityTemplate(this.#films);
  }

}
