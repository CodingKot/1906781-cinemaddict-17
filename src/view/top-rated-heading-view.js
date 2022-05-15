import AbstractView from '../framework/view/abstract-view.js';

const createHeadingTemplate = () => '<h2 class="films-list__title">Top rated</h2>';

export default class TopHeadingView extends AbstractView {
  get template () {
    return createHeadingTemplate ();
  }
}
