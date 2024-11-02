export const gameLoop = ({ graphics }) => {
  for (let y = 0; y < 200; ++y) {
    for (let x = 0; x < 200; ++x) {
        graphics.putPixel(x,y,0xff0000)
    }
  }
};
