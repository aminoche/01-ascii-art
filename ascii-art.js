const Caman = require('caman').Caman; //Note: With error "TypeError: Canvas is not a constructor", update node_modules/caman/dist/caman.full.js on line 371 to this.canvas = new Canvas.Canvas(this.imageWidth(), this.imageHeight()); AND on line 2530, update canvas = new Canvas.Canvas(newDims.width, newDims.height);
const colors = require('colors/safe');
const { exec } = require('child_process');
const chunk = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
};
/*
Steps:
1) Take a picture from the webcam
2) Resize the picture to the dimension of the terminal
3) Get the RGB/A pixel data
4) Structure the RGB/A data in rows and columns
5) Map a pixel to a character based on brightness
6) Map a pixel to a color based on rgba dominant color
7) Join characters together in rows
8) Return character maps
*/

//Take a picture from the webcam
//requires imagesnap:
//to install, run brew install imagesnap
const AUTO_PHOTO = false;
if (AUTO_PHOTO) {
  (function takePicture() {})(
    exec('imagesnap img/selfie.jpg -w 1', (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    })
  );
}

const picture = Caman('img/selfie.jpg', function () {
  const SETTINGS = {
    INVERT_COLORS: false,
  };
  const TERMINAL_WIDTH = process.stdout.columns;
  const TERMINAL_HEIGHT = process.stdout.rows;
  const PIXEL_METADATA = { MIN: 0, MAX: 255, LENGTH: 4 };
  const resizePicture = () => {
    this.resize({
      width: TERMINAL_WIDTH,
      height: TERMINAL_HEIGHT,
    });
    this.render();
  };
  resizePicture();
  const pixelData = Array.from(this.pixelData).map((pixel) =>
    SETTINGS.INVERT_COLORS ? PIXEL_METADATA.MAX - pixel : pixel
  );
  const rawPixelDataToArrayOfRgbaObjects = chunk(
    pixelData,
    PIXEL_METADATA.LENGTH
  ).map((pixel) => {
    const red = pixel[0];
    const green = pixel[1];
    const blue = pixel[2];
    const alpha = pixel[3];
    return { red, green, blue, alpha };
  });
  const getCharacterFromRGBA = (pixel) => {
    const BRIGHTNESS_MAP =
      ' `^",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
    const red = pixel.red;
    const blue = pixel.blue;
    const green = pixel.green;
    const rawFormats = {
      rgbaAverage: Math.floor(
        (((red + green + blue) / 3) * (BRIGHTNESS_MAP.length - 1)) / 255
      ),
      lightness: Math.floor(
        (((Math.max(pixel.red, green, blue) +
          Math.min(pixel.red, green, blue)) /
          2) *
          (BRIGHTNESS_MAP.length - 1)) /
          255
      ),
      luminosity: Math.floor(
        ((0.21 * pixel.red + 0.72 * green + 0.07 * blue) *
          (BRIGHTNESS_MAP.length - 1)) /
          255
      ),
    };
    const brightnessLetter =
      BRIGHTNESS_MAP[
        Math.round(
          (rawFormats.lightness +
            rawFormats.rgbaAverage +
            rawFormats.luminosity) /
            3
        )
      ];
    return brightnessLetter;
  };
  const getColorFromRGBA = (pixel) => {
    const maxValue = Math.max(pixel.red, pixel.green, pixel.blue);
    if (maxValue > 200) {
      return 'grey';
    } else if (maxValue < 100) {
      return 'white';
    } else if (maxValue === pixel.red) {
      return 'red';
    } else if (maxValue === pixel.green) {
      return 'green';
    } else if (maxValue === pixel.blue) {
      return 'blue';
    } else {
      return 'black';
    }
  };

  const final = chunk(
    rawPixelDataToArrayOfRgbaObjects.map((pixel) =>
      colors[getColorFromRGBA(pixel)](getCharacterFromRGBA(pixel))
    ),
    TERMINAL_WIDTH
  )
    .map((row) => row.join(''))
    .join('');
  console.log(final);
});
