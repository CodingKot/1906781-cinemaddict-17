import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const sliceDescription = (description) => description.length > 140 ? `${description.slice(0,138)}...` : description;

const isGenres = (string) => string.includes(',');

const changeReleaseDateDisplay = (releaseDate) => dayjs(releaseDate).format('D MMMM YYYY');
const changeCommentDateDisplay = (commentDate) => dayjs(commentDate).format('D/MMMM/YYYY hh:mm');

const getTimeFromMins = (mins) => {
  const {hours, minutes} = dayjs.duration(mins, 'minutes').$d;
  return `${hours}h ${minutes}m`;
};

const compareRatings = (ratingA, ratingB) => ratingB.filmInfo.totalRating - ratingA.filmInfo.totalRating;
const compareDates = (dateA, dateB) => dayjs(dateB.filmInfo.release.date) - dayjs(dateA.filmInfo.release.date);

export {changeReleaseDateDisplay, getTimeFromMins, isGenres, sliceDescription, changeCommentDateDisplay, compareRatings, compareDates};
