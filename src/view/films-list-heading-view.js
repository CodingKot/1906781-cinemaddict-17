import {createElement} from '../render.js';

const createHeadingTemplate = () => '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>';

export default class FilmsListHeadingView {
  getTemplate () {
    return createHeadingTemplate ();
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
