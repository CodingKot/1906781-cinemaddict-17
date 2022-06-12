import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {filter} from '../utils/filter.js';
import { FilterType, UpdateType } from '../const.js';



export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
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
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if(prevFilterComponent  === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
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