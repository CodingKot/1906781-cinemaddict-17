import AbstractView from '../framework/view/abstract-view.js';

const createHeadingTemplate = () => '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>';

export default class FilmsListHeadingView extends AbstractView{
  get template () {
    return createHeadingTemplate ();
  }
}
