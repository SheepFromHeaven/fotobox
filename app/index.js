process.title = 'node-gphoto2 test program';

const fs = require('fs');
const GPhoto = require('gphoto2');
const express = require('express');
const Jimp = require("jimp");
const watch = require('node-watch');
const printer = require('printer');

const config = require('./config');

const gphoto = new GPhoto.GPhoto2();

let camera = null;

gphoto.list(function(cameras) {
  console.log("found " + cameras.length + " cameras");
  camera = cameras[0];
  if (!camera) {
    process.exit(-1);
  }
  console.log("loading " + camera.model + " settings");
  return camera.getConfig(function(er, settings) {
    if (er) {
      console.error({
        camera_error: er
      });
    }
    return console.log(settings);
  });
});

const app = express();

app.use(express["static"](__dirname));


app.get('/', (req, res) => res.render('index.html'));

const logRequests = () => {
  var d, fps;
  d = Date.parse(new Date()) / 1000;
  if (requests[d] > 0) {
    return requests[d]++;
  } else {
    fps = requests[d - 1];
    requests = {};
    requests[d] = 1;
    if (fps) {
      return console.log(fps + " fps");
    }
  }
};

app.get('/settings', (req, res) => {
  if (!camera) {
    return res.send(404, 'Camera not connected');
  } else {
    return camera.getConfig(function(er, settings) {
      return res.send(JSON.stringify(settings));
    });
  }
});

app.get('/takePicture', (req, res) => {
  if (!camera) {
    return res.send(404, 'Camera not connected');
  } else {
    return camera.takePicture({
      download: (req.query.download === 'false' ? false : true)
    }, function(er, data) {
      if (er) {
        return res.send(404, er);
      } else {
        if (req.query.download === 'false') {
          console.log(data);
          return res.send("/download" + data);
        } else {
          res.header('Content-Type', 'image/jpeg');
          return res.send(data);
        }
      }
    });
  }
});

let preview_listeners = [];
let requests = {};

app.get('/preview', function(req, res) {
  if (!camera) {
    return res.send(404, 'Camera not connected');
  } else {
    preview_listeners.push(res);
    if (preview_listeners.length === 1) {
      return camera.takePicture({
        preview: true
      }, function(er, data) {
        var d, i, len, listener, results, tmp;
        logRequests();
        tmp = preview_listeners;
        preview_listeners = new Array();
        d = Date.parse(new Date());
        results = [];
        for (i = 0, len = tmp.length; i < len; i++) {
          listener = tmp[i];
          if (!er) {
            listener.writeHead(200, {
              'Content-Type': 'image/jpeg',
              'Content-Length': data.length
            });
            listener.write(data);
          } else {
            listener.writeHead(500);
          }
          results.push(listener.end());
        }
        return results;
      });
    } else {
        return res.send(404, 'Oh no!');
    }
  }
});

app.listen(process.env.PORT || 1337, "0.0.0.0");





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