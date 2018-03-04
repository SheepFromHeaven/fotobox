const Jimp = require("jimp");
const watch = require('node-watch');

const size = 512;
const imageSrcFolder = './src/';
const imageDestFolder = './dest';

const maskPath = './mask.png';

watch(imageSrcFolder, { recursive: false }, function(evt, name) {
  console.log(evt);
  onImgChanged(name);
});

const onImgChanged = (imgName) => {
  console.log(imgName);
  Jimp.read(imgName).then((img) => {
    Jimp.read(maskPath).then((maskImg) => {
      img
        .cover(size, size)
        .crop(0,0,size,size)
        .clone()
        .mask(maskImg.contain(size, size), 0,0)
        .write(imgName.replace('src', imageDestFolder).replace('.jpg', '.png'));
    });
  }).catch(function (err) {
    console.error('ERROR: ' + err);

  });
};
