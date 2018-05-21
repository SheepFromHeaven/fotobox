const findCamera = require('./findCamera');

let camera = null;
module.exports = () => new Promise((resolve, reject) => {
  if (camera) {
    resolve(camera);
  } else {
    findCamera().then((cam) => {
      resolve(cam);
    });
  }
});