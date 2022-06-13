import AbstractView from '../framework/view/abstract-view.js';
import { firstToUpper } from '../utils/common.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (`<a href="#${name}" data-filter = ${type} class="main-navigation__item ${type === currentFilterType && 'main-navigation__item--active'}">${name === 'all' ? 'All movies' : firstToUpper(name)} ${name !== 'all' ? `<span class="main-navigation__item-count" data-filter = ${type}>${count}</span>` : ''}</a>`);
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');

  return (`<nav class="main-navigation">
  ${filterItemsTemplate}
  </nav>`);
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType){
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template () {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
    // const filterLinks = this.element.querySelectorAll('.main-navigation__item');
    // filterLinks.forEach((link) => link.addEventListener('click', this.#filterTypeChangeHandler));
    // const filterCounts = this.element.querySelectorAll('.main-navigation__item-count');
    // filterCounts.forEach((count) => count.addEventListener('click', this.#filterTypeChangeHandler));
  };

  #filterTypeChangeHandler = (evt) => {
    if(evt.target.tagName === 'A' || evt.target.tagName === 'SPAN') {
      evt.preventDefault();
      this._callback.filterTypeChange(evt.target.dataset.filter);
    }
  };
}
