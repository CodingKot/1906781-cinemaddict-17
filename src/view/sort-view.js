import AbstractView from '../framework/view/abstract-view.js';

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

let choosenSort = SortType.DEFAULT;

const createSortTemplate = () => (`<ul class="sort">
<li><a href="#" class="sort__button ${choosenSort !== SortType.DATE && choosenSort !== SortType.RATING && 'sort__button--active'}" data-sort-type="${SortType.DEFAULT}" >Sort by default</a></li>
<li><a href="#" class="sort__button ${choosenSort === SortType.DATE && 'sort__button--active'}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
<li><a href="#" class="sort__button ${choosenSort === SortType.RATING && 'sort__button--active'}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
</ul>`);

export default class SortView extends AbstractView{
  get template () {
    return createSortTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if(evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    choosenSort = evt.target.dataset.sortType;
    this._callback.sortTypeChange(choosenSort);
  };
}

export {SortType};
