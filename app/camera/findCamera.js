const GPhotoLib = require('gphoto2');
const gphoto = new GPhotoLib.GPhoto2();
const createMockCamera = require('./createMockCamera');
const log = require('../util/log');

module.exports = () => new Promise((resolve, reject) => {
    gphoto.list((cameras) => {
      log(`found ${cameras.length} cameras`);
  
      if(cameras.length > 0) {
        resolve(cameras[0]);
      } else {
        log('creating mock camera');
        resolve(createMockCamera());
      }
    });
  });