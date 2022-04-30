import {createElement} from '../render.js';

const createHeadingTemplate = () => '<h2 class="films-list__title">Top rated</h2>';

export default class TopHeadingView {
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
