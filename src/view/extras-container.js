import {createElement} from '../render.js';

const createExtrasContainerTemplate = () => '<div class="films-list__container"></div>';

export default class ExtrasContainerView {
  #element = null;
  get template () {
    return createExtrasContainerTemplate ();
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
