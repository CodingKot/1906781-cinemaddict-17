import AbstractView from '../framework/view/abstract-view.js';
import {PROFILE_TITLES} from '../const.js';

const createProfileTemplate = (title) => {
  if (title === PROFILE_TITLES.NO_HISTORY) {
    return (`<section class="header__profile profile visually-hidden">
    <p class="profile__rating">Movie Buff</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);
  }
  return (`<section class="header__profile profile">
      <p class="profile__rating">${title}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`);
};

export default class ProfileView extends AbstractView {
  #title = null;

  constructor(title) {
    super();
    this.#title = title;
  }

  get template () {
    return createProfileTemplate (this.#title);
  }
}
