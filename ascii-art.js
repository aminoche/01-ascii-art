const Caman = require('caman').Caman;
//Note: With error "TypeError: Canvas is not a constructor", update node_modules/caman/dist/caman.full.js on line 371 to this.canvas = new Canvas.Canvas(this.imageWidth(), this.imageHeight()); AND on line 2530, update canvas = new Canvas.Canvas(newDims.width, newDims.height);

const picture = Caman('img/ascii-pineapple.jpg', function () {
  const factor = 7;
  this.resize({
    width: this.width / factor,
    height: this.height / factor,
  });
  this.render();
  console.log(this.dimensions);
  const rgbaArray = [];
  const brightness =
    '`^",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
  for (let i = 0; i < this.pixelData.length; i += 4) {
    const [red, green, blue, alpha] = this.pixelData.slice(i, i + 4);
    const average = Math.round((((red + green + blue) / 3) * 65) / 255);
    rgbaArray.push({ average, red, green, blue, alpha });
  }

  const twoDimensions = [];
  for (let i = 0; i < rgbaArray.length; i += this.width) {
    const row = rgbaArray.slice(i, i + this.width);
    twoDimensions.push(row);
  }
  const final = twoDimensions.map((element) =>
    element
      .map((rgba) =>
        [brightness[rgba.average], brightness[rgba.average]].join('')
      )
      .join('')
  );

  console.log(final);
});
