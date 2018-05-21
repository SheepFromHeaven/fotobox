const log = require('../util/log');
const getCamera = require('./getCamera');

module.exports = () => new Promise((resolve, reject) => {
    log('Getting camera');
    getCamera().then((camera) => {
      log('taking picture');
      camera.takePicture({download: true}, (er, data) => {
        if (er) {
          reject('Error occured');
        } else {
          resolve(data);
        }
      });
    });
  });