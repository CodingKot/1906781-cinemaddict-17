import {createElement} from '../render.js';

const createHeadingTemplate = () => '<h2 class="films-list__title">Most commented</h2>';

export default class CommentedHeadingView {
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
