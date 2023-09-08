export function getPercentInRelationToAverage(input, average) {
  const result = (input / average) * 100;

  return result;
}

export function calculateInvertedPercentage(result) {
  const invertedPercentage = 100 - result;
  return invertedPercentage;
}
