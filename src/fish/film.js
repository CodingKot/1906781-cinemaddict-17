import {getRandomInteger, geneateRandomInfo, getUniqueRandomNumber} from '../utils';

const RUNTIMES = [100, 90, 170, 69, 76, 98];

const GENRES = [
  'Comedy',
  'Comedy, Romantic, Detective',
  'Thriller, Horror',
  'Horror, War',
  'Romantic, Tragedy'
];

const DESCRIPTIONS = [
  'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.',
  'England, the end of the XVIII century. The parents of the five Bennet sisters are concerned about successfully marrying their daughters. And therefore the measured life of a respectable family is turned upside down when a young gentleman - Mr. Bingley - appears in the neighborhood.',
  'The lord of the forces of darkness Sauron directs his countless army under the walls of Minas Tirith, the fortress of Last Hope. He anticipates a close victory, but this is what prevents him from noticing two tiny hobbit figures approaching the Fatal Mountain, where they will destroy the Ring of Omnipotence.',
  'Dreaming of becoming a journalist, a provincial girl, Andy, after graduating from university, gets a position as an assistant to the all-powerful Miranda Priestly, the despotic editor of one of the largest New York fashion magazines. Andy had always dreamed of such a job, not knowing what kind of nervous tension it would be associated with.',
  'Jack Torrance and his wife and son arrive at an elegant remote hotel to work as a caretaker during the off-season.'
];

const TITLES = [
  'Bitter Moon',
  'Gone With The Wind',
  'The Shining',
  'Vertigo',
  'Some Like It Hot',
  'Black Swan',
  'Home Alone',
  'Pride and Prejudice',
  'The Devil Wears Prada',
  'Lord Of The Rings: The Two Towers'
];

const POSTERS = [
  'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png',
  'images/posters/sagebrush-trail.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/the-dance-of-life.jpg',
  'images/posters/the-great-flamarion.jpg',
  'images/posters/the-man-with-the-golden-arm.jpg'
];

const WRITERS = [
  'Anne Wigton, Heinz Herald, Richard Weil',
  'Anne Wigton',
  'Anne Wigton, Heinz Herald',
  'Richard Weil',
  'Heinz Herald, Anne Wigton, John Johnson, Richard Weil'
];

const filmsId = Array.from({length: 15}, (number, index) => index);
const numbers = Array.from({length: 1000}, (number, index) => index);
const getCommentsIdArray = (items) => items.splice(0, getRandomInteger(1, 20));

export const generateFilm = () => ({
  id: getUniqueRandomNumber(filmsId),
  comments: getCommentsIdArray(numbers),
  filmInfo: {
    title: geneateRandomInfo(TITLES),
    alternativeTitle: 'Laziness Who Sold Themselves',
    totalRating: 5.3,
    poster: geneateRandomInfo(POSTERS),
    ageRating: '12+',
    director: 'Tom Ford',
    writers: geneateRandomInfo(WRITERS),
    actors: [
      'Morgan Freeman'
    ],
    release: {
      date: '2019-05-11T00:00:00.000Z',
      releaseCountry: 'Finland'
    },
    runtime: geneateRandomInfo(RUNTIMES),
    genre: geneateRandomInfo(GENRES),
    description: geneateRandomInfo(DESCRIPTIONS),
  },
  userDetails: {
    watchlist: false,
    alreadyWatched: true,
    watchingDate: null,
    favorite: false
  }
});
