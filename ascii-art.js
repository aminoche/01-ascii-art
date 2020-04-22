const Caman = require('caman').Caman;
//Note: With error "TypeError: Canvas is not a constructor", update node_modules/caman/dist/caman.full.js on line 371 to this.canvas = new Canvas.Canvas(this.imageWidth(), this.imageHeight()); AND on line 2530, update canvas = new Canvas.Canvas(newDims.width, newDims.height);

const colors = require('colors/safe');
const { exec } = require('child_process');

//requires imagesnap:
//to install, run brew install imagesnap
exec('imagesnap img/selfie.jpg -w 1', (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  //console.log(`stdout: ${stdout}`);
});

const TERMINAL_WIDTH = 212; //run tput cols in the terminal
const TERMINAL_HEIGHT = 59; //run tput lines in the terminal
const resizeFactor = 1;
const picture = Caman('img/selfie.jpg', function () {
  //console.log('original dimensions: ', this.dimensions);
  this.resize({
    width: TERMINAL_WIDTH / resizeFactor,
    height: TERMINAL_HEIGHT / resizeFactor, //(this.height * (TERMINAL_WIDTH / this.width)) / resizeFactor,
  });
  this.render();
  //console.log('updated dimensions', this.dimensions);
  const rgbaArray = [];
  const brightness =
    '`^",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
  for (let i = 0; i < this.pixelData.length; i += 4) {
    let [red, green, blue, alpha] = this.pixelData.slice(i, i + 4);
    const inverse = false;
    if (inverse) {
      red = 255 - red;
      green = 255 - green;
      blue = 255 - blue;
      alpha = 255 - alpha;
    }
    const average = Math.floor(
      (((red + green + blue) / 3) * brightness.length) / 255
    );

    const lightness = Math.floor(
      (((Math.max(red, green, blue) + Math.min(red, green, blue)) / 2) *
        brightness.length) /
        255
    );
    const luminosity = Math.floor(
      (0.21 * red + 0.72 * green + 0.07 * blue) / 255
    );
    const dominantColor =
      Math.max(red, green, blue) === red
        ? 'red'
        : Math.max(red, green, blue) === green
        ? 'green'
        : 'blue';
    rgbaArray.push({
      dominantColor,
      average,
      lightness,
      luminosity,
      red,
      green,
      blue,
      alpha,
    });
  }

  const twoDimensions = [];
  for (let i = 0; i < rgbaArray.length; i += this.width) {
    const row = rgbaArray.slice(i, i + this.width);
    twoDimensions.push(row);
  }
  const final = twoDimensions
    .map((element) =>
      element
        .map((rgba) => {
          return [
            //length of this array should be the resize factor
            //colors[rgba.dominantColor](brightness[rgba.lightness]),
            //            colors[rgba.dominantColor](brightness[rgba.luminosity]),
            colors[rgba.dominantColor](brightness[rgba.average]),
          ].join('');
        })
        .join('')
        .padEnd(TERMINAL_WIDTH, '-')
    )
    .join('\n');
  console.log(final);
});
