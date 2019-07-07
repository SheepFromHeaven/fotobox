const config = require('../config');

module.exports = () => {
    const fs = require('fs');
    const mockImg = fs.readFileSync(config.imagePaths.mock);
    return {
        takePicture: (opt, callback) => {
            setTimeout(() => {
                callback(undefined, mockImg);
            }, 1000);
        }
    }
};
