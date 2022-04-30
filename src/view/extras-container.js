import {createElement} from '../render.js';

const createExtrasContainerTemplate = () => '<div class="films-list__container"></div>';

export default class ExtrasContainerView {
  getTemplate () {
    return createExtrasContainerTemplate ();
  }

  getElement () {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement () {
    this.element = null;
  }
}
