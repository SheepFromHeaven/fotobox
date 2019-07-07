process.title = 'node-gphoto2 test program';
const sharp = require('sharp');

const shootPhoto = require('./camera/shootPhoto');
const printBuffer = require('./printer/printBuffer');
const onImgChanged = require('./imageManipulation/transformImage');

const setupServer = require('./display/setupServer');

const config = require('./config');
const log = require('./util/log');

const Gpio = require('onoff').Gpio;
const button = new Gpio(4, 'in', 'both');

const PAGES = {
  INDEX: '/',
  PROCESSING: 'processing',
  PRINTING: 'printing'
};

const run = (callback) => {
  shootPhoto().then((image) => {
    callback(PAGES.PROCESSING);
    return transformImage(image);
  }).then((buffer) => {
    callback(PAGES.PRINTING);
    setTimeout(() => {
      clicked = false;
      callback(PAGES.INDEX);
    }, 10000);
    return printBuffer(buffer);
  }).catch((err) => {
    log('ERROREROORERRORERRORERRORERRORERRORERRORERROR');
  });
};

const transformImage = (image) => new Promise((res, rej) => {
  log('transforming image');
  onImgChanged(image, res, sharp);
});


const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 9000;
const clickInterval = 1000;

let clicked = false;
let s;

const callback = (key) => {
  console.log('Redirect to ' + key);
  s.emit('redirect', key);
};

io.on('connection', function(socket){
  console.log('a user connected');
  s = socket;
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  button.watch(function (err, value) {
    if(value && !clicked) {
      clicked = true;
      run(callback);
    }
  });
});

setupServer(app);

http.listen(port, function(){
  console.log('listening on *:' + port);
});