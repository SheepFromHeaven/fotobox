const path = require('path');
const express = require('express');

module.exports = (app) => {
    app.use('/img', express.static(__dirname + '/htdocs/img'));
    app.use('/css', express.static(__dirname + '/htdocs/css'));

    app.get('/', function(req, res){
        res.sendFile(path.resolve(__dirname + '/htdocs/index.html'));
    });

    app.get('/processing', function(req, res){
        res.sendFile(path.resolve(__dirname + '/htdocs/processing.html'));
    });

    app.get('/printing', function(req, res){
        res.sendFile(path.resolve(__dirname + '/htdocs/printing.html'));
    });
}