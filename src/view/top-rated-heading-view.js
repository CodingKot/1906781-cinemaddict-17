import {createElement} from '../render.js';

const createHeadingTemplate = () => '<h2 class="films-list__title">Top rated</h2>';

export default class TopHeadingView {
  #element = null;
  get template () {
    return createHeadingTemplate ();
  }

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement () {
    this.#element = null;
  }
}
