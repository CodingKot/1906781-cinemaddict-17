import {geneateRandomInfo, getUniqueRandomNumber} from '../utils';

const COMMENTS = [
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Nice',
  'Almost two hours? Seriously?'
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
  date: '2019-05-11T16:12:32.554Z',
  emotion: geneateRandomInfo(EMOTIONS)
});
