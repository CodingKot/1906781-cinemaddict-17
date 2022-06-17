import AbstractView from '../framework/view/abstract-view.js';

const createExtraTemplate = () => '<section class="films-list films-list--extra"></section';

export default class ExtraView extends AbstractView {
  get template () {
    return createExtraTemplate ();
  }
}
