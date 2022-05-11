import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const sliceDescription = (description) => description.length > 140 ? `${description.slice(0,138)}...` : description;

const isGenres = (string) => string.includes(',');

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getUniqueRandomNumber = (items) =>  items.splice(getRandomInteger(0, items.length - 1), 1)[0];

const geneateRandomInfo = (items) => {
  const randomIndex = getRandomInteger(0, items.length-1);
  return items[randomIndex];
};

const changeReleaseDateDisplay = (releaseDate) => dayjs(releaseDate).format('D MMMM YYYY');
const changeCommentDateDisplay = (commentDate) => dayjs(commentDate).format('D/MMMM/YYYY hh:mm');

const getTimeFromMins = (mins) => {
  const {hours, minutes} = dayjs.duration(mins, 'minutes').$d;
  return `${hours}h ${minutes}m`;
};

export {getRandomInteger, changeReleaseDateDisplay, getTimeFromMins, isGenres, sliceDescription, geneateRandomInfo, getUniqueRandomNumber, changeCommentDateDisplay};
