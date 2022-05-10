import {createElement} from '../render.js';


const createFilmsListSectionTemplate = () => `<section class="films-list">
</section>`;

export default class FilmsListSectionView {
  #element = null;
  get template () {
    return createFilmsListSectionTemplate ();
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
