import {geneateRandomInfo, getUniqueRandomNumber} from '../utils/common.js';

const COMMENTS = [
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Nice',
  'Almost two hours? Seriously?'
];

const COMMENT_DATES = [
  '2021-05-27T07:44:32.554Z',
  '2020-05-27T07:44:32.554Z',
  '2022-05-27T07:44:32.554Z',
  '2019-05-27T07:44:32.554Z',
  '2022-05-27T07:44:32.554Z',
  '2018-05-26T07:44:32.554Z',
  '2017-05-26T07:44:32.554Z',
  '2006-05-26T07:41:32.554Z',
  '2007-05-26T09:12:32.554Z',
  '2022-05-23T16:12:32.554Z'
];

const AUTHORS = [
  'Ivan Ivanov',
  'Vasilisa Petrova',
  'Anna Sidorova',
  'Ilya O\'Reilly',
  'Stiven King'
];

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const commentsId = Array.from({length: 1000}, (item, index) => index);
export const generateComment = () => ({
  id: getUniqueRandomNumber(commentsId),
  author: geneateRandomInfo(AUTHORS),
  comment: geneateRandomInfo(COMMENTS),
  date: geneateRandomInfo(COMMENT_DATES),
  emotion: geneateRandomInfo(EMOTIONS)
});
