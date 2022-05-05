import { generateFilm } from '../fish/film';
import { generateComment } from '../fish/comments.js';


export default class FilmsModel {
  films = Array.from({length: 15}, generateFilm);
  getFilms = () => this.films;

  comments = Array.from({length: 1000}, generateComment);
  getComments = () => this.comments;

}

