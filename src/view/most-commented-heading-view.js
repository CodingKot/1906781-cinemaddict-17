import {createElement} from '../render.js';

const createHeadingTemplate = () => '<h2 class="films-list__title">Most commented</h2>';

export default class CommentedHeadingView {

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
