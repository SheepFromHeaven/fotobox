const findCamera = require('./findCamera');
const log = require('../util/log');

let camera = null;
module.exports = () => new Promise((resolve, reject) => {
  if (camera) {
    log('Camera stored, using stored camera')
    resolve(camera);
  } else {
    log('Camera not stored, getting camera')
    findCamera().then((cam) => {
      camera = cam;
      resolve(cam);
    });
  }
});