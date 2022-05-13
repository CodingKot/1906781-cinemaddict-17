import AbstractView from '../framework/view/abstract-view.js';


const createFilmsListSectionTemplate = () => `<section class="films-list">
</section>`;

export default class FilmsListSectionView extends AbstractView {
  get template () {
    return createFilmsListSectionTemplate ();
  }
}
