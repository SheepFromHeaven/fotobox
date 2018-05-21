const log = require('../util/log');
const config = require('../config');
const printer = require('printer');

module.exports = (buffer) => {
    log('Printing');
    if (config.printer.enabled) {
        printer.printDirect({
            data: buffer,
            printer: config.printer.name,
            type: 'JPEG',
            success: function (id) {
                log('printed with id ' + id);
            },
            error: function (err) {
                log('error on printing: ' + err);
            }
        });
    }
};