import dayjs from 'dayjs';

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
  const hours = Math.trunc(mins/60);
  const minutes = mins % 60;
  return `${hours}h ${minutes}m`;
};

export {getRandomInteger, changeReleaseDateDisplay, getTimeFromMins, isGenres, sliceDescription, geneateRandomInfo, getUniqueRandomNumber, changeCommentDateDisplay};
