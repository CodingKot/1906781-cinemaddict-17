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
      this.#comments = 'no comments';
    }

    this._notify(updateType, filmId);
  };

  addComment = async (updateType, film, update) => {
    try {
      const response = await this.#commentsApiService.addComment(film, update);
      const newComment = response;
      this.#comments = [newComment, ...this.#comments];
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
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
