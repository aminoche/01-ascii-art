//Ported from:
//https://stackoverflow.com/questions/44189508/finding-which-color-is-the-closest-to-the-given-rgb-values-in-c/44463014

const distinct = [
  { color: 'black', value: { red: 0, green: 0, blue: 0 } },
  { color: 'green', value: { red: 0, green: 190, blue: 0 } },
  { color: 'red', value: { red: 255, green: 0, blue: 0 } },
  {
    color: 'grey',
    value: { red: 128, green: 128, blue: 128 },
  },
  {
    color: 'blue',
    value: { red: 67, green: 133, blue: 255 },
  },
  {
    color: 'yellow',
    value: { red: 255, green: 235, blue: 0 },
  },
  {
    color: 'magenta',
    value: { red: 255, green: 0, blue: 255 },
  },
  {
    color: 'cyan',
    value: { red: 100, green: 255, blue: 255 },
  },
  {
    color: 'white',
    value: { red: 255, green: 255, blue: 255 },
  },
];
const closestColor = (r, g, b) => {
  let colorReturn = 'NA';
  let maxRGB = 255;
  let biggestDifference = maxRGB * 3 + 1;
  for (let i = 0; i < distinct.length; i++) {
    if (
      Math.sqrt(
        Math.pow(r - distinct[i].value.red, 2) +
          Math.pow(g - distinct[i].value.green, 2) +
          Math.pow(b - distinct[i].value.blue, 2)
      ) < biggestDifference
    ) {
      colorReturn = distinct[i].color;
      biggestDifference = Math.sqrt(
        Math.pow(r - distinct[i].value.red, 2) +
          Math.pow(g - distinct[i].value.green, 2) +
          Math.pow(b - distinct[i].value.blue, 2)
      );
    }
  }
  return colorReturn;
};
