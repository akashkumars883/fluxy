import Jimp from 'jimp';

async function makeTransparent() {
  try {
    const image = await Jimp.read('public/new-logo.png.jpg');
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is close to white, make it transparent
      if (red > 200 && green > 200 && blue > 200) {
        this.bitmap.data[idx + 3] = 0; // Alpha
      } else {
        // Optional: darken the dark pixels to solid black for crispness
        this.bitmap.data[idx + 0] = 0;
        this.bitmap.data[idx + 1] = 0;
        this.bitmap.data[idx + 2] = 0;
        this.bitmap.data[idx + 3] = 255;
      }
    });

    await image.writeAsync('public/new-logo-transparent.png');
    console.log("Successfully created transparent PNG!");
  } catch (error) {
    console.error("Error:", error);
  }
}

makeTransparent();
