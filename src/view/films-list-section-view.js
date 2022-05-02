import {createElement} from '../render.js';


const createFilmsListSectionTemplate = () => `<section class="films-list">
</section>`;

export default class FilmsListSectionView {
  getTemplate () {
    return createFilmsListSectionTemplate ();
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
