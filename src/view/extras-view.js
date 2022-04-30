import {createElement} from '../render.js';

const createExtraTemplate = () => '<section class="films-list films-list--extra"></section';

export default class ExtraView {
  getTemplate () {
    return createExtraTemplate ();
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
