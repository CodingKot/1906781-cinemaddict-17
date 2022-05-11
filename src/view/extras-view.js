import {createElement} from '../render.js';

const createExtraTemplate = () => '<section class="films-list films-list--extra"></section';

export default class ExtraView {
  #element = null;
  get template () {
    return createExtraTemplate ();
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
