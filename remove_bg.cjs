const jimp = require('jimp');

async function removeWhiteBg() {
  console.log("Loading image...");
  // jimp v1 or v0 has different exports. We'll use the default export
  let Jimp = jimp;
  if (jimp.Jimp) Jimp = jimp.Jimp;
  
  const image = await Jimp.read('public/logo.png');
  console.log("Image loaded.");

  const targetColor = { r: 255, g: 255, b: 255, a: 255 }; // White
  const replaceColor = { r: 0, g: 0, b: 0, a: 0 }; // Transparent
  const colorDistance = (c1, c2) => {
    return Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
    );
  };

  const tolerance = 50; // out of ~441 max distance

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const a = this.bitmap.data[idx + 3];

    if (a > 0) {
      if (colorDistance({ r, g, b }, targetColor) <= tolerance) {
        this.bitmap.data[idx + 3] = 0; // Make transparent
      }
    }
  });

  console.log("Saving image...");
  // Jimp v0 returns promise from writeAsync if available, else use write with callback
  if (image.writeAsync) {
    await image.writeAsync('public/logo.png');
  } else {
    await new Promise((resolve, reject) => {
      image.write('public/logo.png', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  console.log("Done.");
}

removeWhiteBg().catch(console.error);
