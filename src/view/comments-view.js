import {createElement} from '../render.js';
import { changeCommentDateDisplay } from '../utils.js';

const renderComments = (array1, array2) => array1.filter((element) => (array2.includes(element.id))).map((element) => `<li class="film-details__comment">
<span class="film-details__comment-emoji">
  <img src="./images/emoji/${element.emotion}.png" width="55" height="55" alt="emoji-${element.emotion}">
</span>
<div>
  <p class="film-details__comment-text">${element.comment}</p>
  <p class="film-details__comment-info">
    <span class="film-details__comment-author">${element.author}</span>
    <span class="film-details__comment-day">${changeCommentDateDisplay(element.date)}</span>
    <button class="film-details__comment-delete">Delete</button>
  </p>
</div>
</li>`).join('');

const createCommentsTemplate = (film, comments) =>  (`<div class="film-details__bottom-container">
 <section class="film-details__comments-wrap">
   <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.comments.length}</span></h3>

   <ul class="film-details__comments-list">
      ${renderComments(comments, film.comments)}
   </ul>

   <div class="film-details__new-comment">
     <div class="film-details__add-emoji-label"></div>

     <label class="film-details__comment-label">
       <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
     </label>

     <div class="film-details__emoji-list">
       <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
       <label class="film-details__emoji-label" for="emoji-smile">
         <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
       </label>

       <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
       <label class="film-details__emoji-label" for="emoji-sleeping">
         <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
       </label>

       <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
       <label class="film-details__emoji-label" for="emoji-puke">
         <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
       </label>

       <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
       <label class="film-details__emoji-label" for="emoji-angry">
         <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
       </label>
     </div>
   </div>
 </section>
</div>`);

export default class CommentsView {

  constructor(film, comments) {
    this.film = film;
    this.comments = comments;
  }

  getTemplate () {
    return createCommentsTemplate (this.film, this.comments);
  }

  getElement () {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement () {
    this.element = null;
  }
}
