import { generateFilm, FILMS_NUMBER } from '../mock/film';
import { generateComment } from '../mock/comments.js';


export default class FilmsModel {
  #films = Array.from({length: FILMS_NUMBER}, generateFilm);
  #comments = Array.from({length: 1000}, generateComment);

  get films() {
    return this.#films;
  }

  get comments () {
    return this.#comments;
  }
}

