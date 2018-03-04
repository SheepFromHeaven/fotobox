const Jimp = require("jimp");
const watch = require('node-watch');
const printer = require('printer');

const config = require('./config');

watch(config.imagePaths.src, { recursive: false }, function(evt, name) {
  if(evt === 'update') {
    onImgChanged(getImageNameFromPath(name));
  }
});

const onImgChanged = (imgName) => {
  Jimp.read(mergeWithSourcePath(imgName)).then((img) => {
    Jimp.read(config.imagePaths.mask).then((maskImg) => {
      img
        .clone()
        .cover(config.imageWidth, config.imageHeight)
        .crop(0, 0, config.imageWidth, config.imageHeight)
        .composite(maskImg.contain(config.imageWidth, config.imageHeight), 0,0)
        .write(mergeWithDestPath(imgName), onFileWritten(mergeWithDestPath(imgName)));
    });
  }).catch(function (err) {
    console.error('Error creating image: ' + err);
  });
};

const onFileWritten = (writtenFile) => () => {
  if(config.printerEnabled) {
    printImage(writtenFile);
  }
};

const getImageNameFromPath = (imagePath) => {
  const splitPath = imagePath.split('/');
  return splitPath[splitPath.length - 1];
};

const mergeWithSourcePath = (imageName) => `${config.imagePaths.src}/${imageName}`;

const mergeWithDestPath = (imageName) => `${config.imagePaths.dest}/${imageName.replace('.jpg', '.png')}`;

const printImage = (filePath) => {
  printer.printFile({
    filename: filePath,
    printer: config.printerName,
    success:function(jobID){
      console.log('sent to printer with ID: ' + jobID);
    },
    error:function(err){
      console.log(err);
    }
  })
};
