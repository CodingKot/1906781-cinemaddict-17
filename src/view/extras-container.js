import AbstractView from '../framework/view/abstract-view.js';

const createExtrasContainerTemplate = () => '<div class="films-list__container"></div>';

export default class ExtrasContainerView extends AbstractView {
  get template () {
    return createExtrasContainerTemplate ();
  }
}
