import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable{
  #commentsApiService = null;
  #comments = [];

  constructor (commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments () {
    return this.#comments;
  }

  init = async (updateType, filmId) => {
    try {
      const comments = await this.#commentsApiService.getCommentsData(filmId);
      this.#comments = comments;
    }catch(err) {
      this.#comments = null;
    }

    this._notify(updateType, filmId);
  };

  addComment = async (updateType, update, film) => {
    try {
      const response = await this.#commentsApiService.addComment(film.id, update);
      this.#comments = response['comments'];
      film = response.movie;
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
    this._notify(updateType, film);
  };

  deleteComment = async (updateType, update, film) => {

    const index = this.#comments.findIndex((comment) => comment.id === update);
    if(index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }
    try {
      await this.#commentsApiService.deleteComment(update);

      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType, film);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }

  };
}
