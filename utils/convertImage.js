const fs = require('fs');
const path = require('path');
const pngjs = require('pngjs');

const convertImageFromArray = (array) => {
  const width = 1500;
  const height = 504;
  const cellWidth = 12;
  const cellHeight = 12;

  const createFullArray = () => {
    const fullArray = new Map();

    for (let i = 0; i < array.length; i++) {
      const { x, y, color } = array[i];

      const rgb = convertHEXtoRGB(color);

      for (let j = 0; j < cellWidth; j++) {
        for (let k = 0; k < cellHeight; k++) {
          const key = `${x + j},${y + k}`;

          fullArray.set(key, rgb);
        }
      }
    }

    return fullArray;
  }

  const fullArray = createFullArray();

  const buffer = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const key = `${i},${j}`;

      const rgb = fullArray.get(key);

      const index = (i + j * width) * 4;

      buffer[index] = rgb[0];
      buffer[index + 1] = rgb[1];
      buffer[index + 2] = rgb[2];
      buffer[index + 3] = 255;
    }
  }

  return buffer;
}

const convertHEXtoRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return [r, g, b];
}

const createImageFromBuffer = (buffer, target) => {
  const png = new pngjs.PNG({
    width: 1500,
    height: 504,
  });

  png.data = Buffer.from(buffer);

  const bufferStream = png.pack();

  const writeStream = fs.createWriteStream(path.join(__dirname, target));

  bufferStream.pipe(writeStream);
}

const findHighestXandY = (array) => {
  let highestX = 0;
  let highestY = 0;

  for (let i = 0; i < array.length; i++) {
    const { x, y } = array[i];

    if (x > highestX) {
      highestX = x;
    }

    if (y > highestY) {
      highestY = y;
    }

  }

  return { highestX, highestY };
}

module.exports ={
  convertImageFromArray,
  createImageFromBuffer
}