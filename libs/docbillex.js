//Libreria para la generación de facturas en pdf
var mydoc = (function () {
    'use strict';
    var pdf = require 'pdfkit';

    doc = new PDFDocument;
    doc.pipe fs.createWriteStream('output.pdf');

    doc.fontSize(20);
    doc.text();

    doc.end();

    return {
        doc: doc
    };
}());
