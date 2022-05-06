

const fs = require('fs-extra')
const utils = require("./utils.js");
const lottieToSvg = require("./lottieToSvg.js");
const Path = require('path');

var args = process.argv.slice(2);

const src = args[0]; // 'Comp.json'
const dest = args[1]; // `myanim_`;
const startFrame = args[2] || 0;
const endFrame = args[3] || true;

console.log('PARAMS:');
console.log('1) source path*:', src );
console.log('2) destination path*:', dest );
console.log('3) start frame:', startFrame );
console.log('4) end frame:', endFrame );
console.log('');

if( !src || !dest ){
  console.log('Error: a source path and a destination path are required.');
  process.exit(1);
}

const animationData = JSON.parse(fs.readFileSync( src, "utf8" ));

const init = async () => {
  
  const destDir = Path.dirname(dest);
  console.log('destDir: ', destDir );
  await fs.ensureDir(destDir);

  console.log('Extracting frames...');
  const frames = await lottieToSvg(animationData, startFrame, endFrame );
  console.log('Extracting complete:', frames.length );

  console.log('Writing the frames to SVG files...');
  utils.processArray( frames, async (frameData) => {
    fs.writeFileSync(dest+`_${frameData.frame}.svg`, frameData.data, "utf8");
  });
  
  console.log('Complete');

}


init();