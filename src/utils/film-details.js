import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const sliceDescription = (description) => description.length > 140 ? `${description.slice(0,139)}...` : description;

const isGenres = (array) => array.length > 1;

const changeReleaseDateDisplayYears = (releaseDate) => dayjs(releaseDate).format('YYYY');
const changeReleaseDateDisplay = (releaseDate) => dayjs(releaseDate).format('DD MMMM YYYY');
const changeCommentDateDisplay = (commentDate) => dayjs(commentDate).fromNow();

const getTimeFromMins = (mins) => {
  const {hours, minutes} = dayjs.duration(mins, 'minutes').$d;
  return `${hours}h ${minutes}m`;
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const compareRatings = (ratingA, ratingB) => ratingB.filmInfo.totalRating - ratingA.filmInfo.totalRating;
const compareDates = (dateA, dateB) => {
  const weight = getWeightForNullDate(dateA.filmInfo.release.date, dateB.filmInfo.release.date);
  return weight ?? dayjs(dateB.filmInfo.release.date).diff(dayjs(dateA.filmInfo.release.date));
};

const compareCommentsNumber = (numberA, numberB) => numberB.comments.length - numberA.comments.length;


export {changeReleaseDateDisplayYears, changeReleaseDateDisplay, getTimeFromMins, isGenres, sliceDescription, changeCommentDateDisplay, compareRatings, compareDates, compareCommentsNumber};
