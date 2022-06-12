import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class CommentsModel extends Observable{
  #commentsApiService = null;
  #filmsModel = null;
  #comments = [];

  constructor (commentsApiService, filmsModel) {
    super();
    this.#commentsApiService = commentsApiService;
    this.#filmsModel = filmsModel;
  }

  get comments () {
    return this.#comments;
  }

  init = async (filmId) => {
    try {
      const comments = await this.#commentsApiService.getCommentsData(filmId);
      this.#comments = comments;
    }catch(err) {
      this.#comments = 'no comments';
    }

    this._notify(UpdateType.INIT_COMMENTS);
  };


  addComment = (update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

  };

  deleteComment = async (updateType, update) => {
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
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }

  };
}
