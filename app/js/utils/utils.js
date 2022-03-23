export function getRndInteger({ min = 0, max }) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function transformNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function createDescription(country) {
  return `${country?.name?.common} is the UN member country in ${
    country?.continents?.[0]
  }, with the capital city in ${
    country?.capital?.[0]
  }. The country has a territory of  ${transformNumber(
    country?.area
  )} km² and a population of ${transformNumber(country?.population)} people.`;
}

export function inPluralOrSingular(word, num) {
  if (num === 1 || num === 0) {
    return word;
  } else if (word.endsWith("y")) {
    return word.slice(0, -1) + "ies";
  } else {
    return word + "s";
  }
}
