const fs = require('fs-extra')
const utils = require("./utils.js");
const lottieToSvg = require("./lottieToSvg.js");
const Path = require('path');
const xml2js = require('xml2js');


//
var args = process.argv.slice(2);

const src = args[0]; // 'Comp.json'
const dest = args[1]; // `myanim_`;
const startFrame = args[2] || 0;
let endFrame = args[3] || true;
if( endFrame.toLowerCase() === 'true' ) endFrame = true;
const removeClippingMasks = args[4];

console.log('PARAMS:');
console.log('1) source path*:', src );
console.log('2) destination path*:', dest );
console.log('3) start frame:', startFrame );
console.log('4) end frame:', endFrame );
console.log('5) remove clipping masks:', removeClippingMasks );
console.log('');

if( !src || !dest ){
  console.log('Error: a source path and a destination path are required.');
  process.exit(1);
}

const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

const animationData = JSON.parse(fs.readFileSync( src, "utf8" ));

const init = async () => {
  
  const destDir = Path.dirname(dest);
  console.log('destDir: ', destDir );
  await fs.ensureDir(destDir);

  console.log('Extracting frames...');
  const frames = await lottieToSvg( animationData, startFrame, endFrame );
  console.log('Extracting complete:', frames.length );

  console.log('Writing the frames to SVG files...');

  utils.processArray( frames, async (frameData) => {

    if( removeClippingMasks ){
      frameData.data = await cleanupSVG( frameData.data );
    }

    fs.writeFileSync(dest+`_${frameData.frame}.svg`, frameData.data, "utf8");

  });
  
  console.log('Complete');

}

const cleanupSVG = async ( data ) => {
  
  const jObj = await parser.parseStringPromise(data);
  // console.log( jObj.svg.g );


  // Remove clipping masks defenitions
  if( jObj.svg.defs && jObj.svg.defs[0].clipPath ){
    /*
    jObj.svg.defs[0].clipPath.forEach(function(v,i){
      console.log(i+') ',v);
    });
    */
    delete jObj.svg.defs[0].clipPath;

  }

  _removeClippingMasks2( jObj.svg.g );

  return builder.buildObject(jObj);
  return JSON.stringify(jObj,true,'  '); // !!!
  return data; // !!!

}

//
  function _removeClippingMasks2( nd ){
    nd.forEach(function(_nd,i){
      if( _nd.$ && _nd.$['clip-path'] ) delete _nd.$['clip-path'];
      if( _nd.g ) _removeClippingMasks2( _nd.g );
    });
  }

//
/*
  function _removeClippingMasks( nd ){
    
    if( !nd || !nd.length ) {
      // console.log('???', nd);   
      return nd;
    }

    // console.log('>>>', nd);

    const ndt = [];
    let maskFound = false;

    nd.forEach(function(_nd,i){

      // console.log('>',_nd);

      if( _nd.$ && _nd.$['clip-path'] ){

        // console.log('MASK!');
        maskFound = true;
        if( _nd.g ) _nd.g.forEach( function(v) {
          ndt.push( v );
        });

      }else{
        // console.log('OTHER');
        ndt.push( _nd );
      }

      if( !maskFound ) _removeClippingMasks(_nd.g);

    });

    nd.length = 0;

    ndt.forEach(function(v) {
      nd.push(v);
    });

    if( maskFound ) _removeClippingMasks(nd);

    return nd;

  }
*/

init();