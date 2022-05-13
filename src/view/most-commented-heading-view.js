import AbstractView from '../framework/view/abstract-view.js';

const createHeadingTemplate = () => '<h2 class="films-list__title">Most commented</h2>';

export default class CommentedHeadingView extends AbstractView{

  get template () {
    return createHeadingTemplate ();
  }
}
