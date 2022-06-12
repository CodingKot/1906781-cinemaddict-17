import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { changeCommentDateDisplay } from '../utils/film-details.js';
import he from 'he';

const renderCommentEmotion = (value) => {
  if(value === '') {
    return '';
  }
  return `<img src="./images/emoji/${value}.png" width = "55" height = "55" alt="emoji">`;
};

const renderComments = (filmComments) => filmComments.map((element) => `<li class="film-details__comment" >
<span class="film-details__comment-emoji">
  <img src="./images/emoji/${element.emotion}.png" width="55" height="55" alt="emoji-${element.emotion}">
</span>
<div>
  <p class="film-details__comment-text">${element.comment}</p>
  <p class="film-details__comment-info">
    <span class="film-details__comment-author">${element.author}</span>
    <span class="film-details__comment-day">${changeCommentDateDisplay(element.date)}</span>
    <button class="film-details__comment-delete" data-id = "${element.id}">Delete</button>
  </p>
</div>
</li>`).join('');

const createPopUpCommentsTemplate = (film, filmComments) => {
  const {comments} = film;
  return (
    `<div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.lehgth}</span></h3>

          <ul class="film-details__comments-list">
            ${renderComments(filmComments)}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${renderCommentEmotion(comments[comments.lehgth-1].emotion)}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(comments[comments.lehgth-1].comment)}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${comments[comments.lehgth-1].emotion === 'smile' && 'checked'}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${comments[comments.lehgth-1].emotion === 'sleeping' && 'checked'}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${comments[comments.lehgth-1].emotion === 'puke' && 'checked'}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${comments[comments.lehgth-1].emotion === 'angry' && 'checked'}>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
            </div>
          </div>
        </section>
      </div>`
  );
};

export default class PopUpCommentsView extends AbstractStatefulView {
  #film = null;
  #localComment = null;

  constructor (film, filmComments) {
    super();
    this.#film = film;
    this._state = PopUpCommentsView.transformToState(filmComments);
    this.#setInnerHandlers();
  }

  get template () {
    return createPopUpCommentsTemplate (this.#film, this._state);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#commentEmotionHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  };

  #commentEmotionHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      emotion: evt.target.value
    });
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      comment: evt.target.value,
    });
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  static transformToState = (comments) => ([...comments,
    {
      comment: '',
      emotion: ''
    }
  ]);

  static transformToComments = (state) => {
    const comments = [...state];
    this.#localComment = comments.pop();
    return comments;
  };

  reset = (comments) => {
    this.updateElement(
      PopUpCommentsView.transformToState(comments)
    );
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    const buttons = this.element.querySelectorAll('.film-details__comment-delete');
    buttons.forEach((button) => {
      button.addEventListener('click', this.#commentDeleteClickHandler);

    });
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    const id = +(evt.target.dataset.id);
    const index = this._state.comments.findIndex((commentId) => commentId === id);
    this._callback.deleteClick(index);
  };
}

