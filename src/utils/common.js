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

export {getRandomInteger, getUniqueRandomNumber, geneateRandomInfo};
