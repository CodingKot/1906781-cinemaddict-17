import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import ProfileView from '../view/profile-view.js';
import {filter, getTitle} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';


export default class FilterPresenter {
  #headerContainer = null;
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;
  #filterComponent = null;
  #profile = null;

  constructor(siteHeaderElement, filterContainer, filterModel, filmsModel) {
    this.#headerContainer = siteHeaderElement;
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters () {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'all',
      },

      {
        type: FilterType.FAVORITE,
        name: 'favorite',
        count: filter[FilterType.FAVORITE](films).length,
      },

      {
        type: FilterType.HISTORY,
        name: 'history',
        count: filter[FilterType.HISTORY](films).length,
      },

      {
        type: FilterType.WATCHLIST,
        name: 'watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },

    ];
  }

  init = () => {
    const filters = this.filters;
    const historyFilterCount = filters.filter((item) => item.name === 'history')[0].count;
    const prevFilterComponent = this.#filterComponent;
    const prevProfile = this.#profile;
    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#profile = new ProfileView (getTitle(historyFilterCount));
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if(prevFilterComponent  === null && prevProfile === null) {
      render(this.#filterComponent, this.#filterContainer);
      render(this.#profile, this.#headerContainer);

      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    replace(this.#profile, prevProfile);
    remove(prevFilterComponent);
    remove(prevProfile);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if(this.#filmsModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
