const Caman = require('caman').Caman;
var colors = require('colors/safe');

//Note: With error "TypeError: Canvas is not a constructor", update node_modules/caman/dist/caman.full.js on line 371 to this.canvas = new Canvas.Canvas(this.imageWidth(), this.imageHeight()); AND on line 2530, update canvas = new Canvas.Canvas(newDims.width, newDims.height);

const picture = Caman('img/snapshot.jpg', function () {
  const factor = 4;
  this.resize({
    width: 237,
    height: this.height / factor,
  });
  this.render();
  console.log(this.dimensions);
  const rgbaArray = [];
  const brightness =
    '`^",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
  for (let i = 0; i < this.pixelData.length; i += 4) {
    let [red, green, blue, alpha] = this.pixelData.slice(i, i + 4);
    const inverse = true;
    if (inverse) {
      red = 255 - red;
      green = 255 - green;
      blue = 255 - blue;
      alpha = 255 - alpha;
    }
    const average = Math.round((((red + green + blue) / 3) * 65) / 255);
    const lightness = Math.round(
      (((Math.max(red, green, blue) + Math.min(red, green, blue)) / 2) * 65) /
        255
    );
    const luminosity = Math.round(
      (0.21 * red + 0.72 * green + 0.07 * blue) / 255
    );
    rgbaArray.push({ average, lightness, luminosity, red, green, blue, alpha });
  }

  const twoDimensions = [];
  for (let i = 0; i < rgbaArray.length; i += this.width) {
    const row = rgbaArray.slice(i, i + this.width);
    twoDimensions.push(row);
  }
  const final = twoDimensions
    .map((element) =>
      element.map((rgba) => [brightness[rgba.lightness]].join('')).join('')
    )
    .join(colors.bgRed('|\n'));

  console.log(colors.green(final));
});
