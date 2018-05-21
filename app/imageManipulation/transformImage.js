const log = require('../util/log');
const config = require('../config');
const fs = require('fs');

module.exports = (buffer, callback, sharp) => {
    fs.writeFile(config.imagePaths.dest + '/test.png', buffer).then(() => {
      
    });
    sharp(config.imagePaths.mask)
      .resize(config.imageWidth, config.imageHeight)
      .toBuffer()
      .then(maskBuffer => {
        sharp(buffer)
        .resize(config.imageWidth, config.imageHeight)
        .overlayWith(maskBuffer)
        .jpeg()
        .withMetadata()
        .toBuffer()
        .then(callback);
      });
  };