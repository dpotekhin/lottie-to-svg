/*
const lottie = require("lottie-web");
// const lottie = require("./node_modules/lottie-web/build/player/lottie.js");
lottie.loadAnimation();
*/

const fs = require("fs");
const utils = require("./utils.js");
const lottieToSvg = require("./lottieToSvg.js");

var args = process.argv.slice(2);

const src = args[0]; // 'Comp.json'
const dest = args[1]; // `myanim_`;
const startFrame = args[2] || 0;
const endFrame = args[3] || true;

console.log('SRC:',src);
console.log('DEST:',dest);
console.log('START:',startFrame);
console.log('END:',endFrame);

const animationData = JSON.parse(fs.readFileSync( src, "utf8" ));

const init = async () => {

  const frames = await lottieToSvg(animationData, startFrame, endFrame );

  console.log('frames:', frames.length );
  
  utils.processArray( frames, async (frameData) => {
    fs.writeFileSync(dest+`_${frameData.frame}.svg`, frameData.data, "utf8");
  });
    

}


init();