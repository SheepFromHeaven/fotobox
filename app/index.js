process.title = 'node-gphoto2 test program';
const sharp = require('sharp');

const shootPhoto = require('./camera/shootPhoto');
const printBuffer = require('./printer/printBuffer');
const onImgChanged = require('./imageManipulation/transformImage');

const config = require('./config');
const log = require('./util/log');


const run = () => {
  shootPhoto().then(transformImage).then(printBuffer);
};

const transformImage = (image) => new Promise((res, rej) => {
  log('transforming image');
  onImgChanged(image, res, sharp);
});

const http = require('http')
const port = 9000

const requestHandler = (request, response) => {
  response.end('<a href="/photo">Photo coming!</a>');
  if(request.url.indexOf('photo')!== -1) {
    setTimeout(run, 0);
  }
  console.log(request.url)
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
