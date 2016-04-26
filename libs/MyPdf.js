/* jshint -W030 */
var MYPDF = (function() {
    'use strict';
    var doc = new jsPDF(),
        mypdf = {},
        myclient = [],
        x = 20,
        y = 25;

        doc.setTextColor(100);
        doc.setFontType("bold");
        doc.setFontSize(30);

    mypdf.client = function (data){
        if (data) {
            myclient = data;

            doc.setFontSize(9);
            doc.text(120, 60, "Bill to: ");
            doc.text(120, 65, "CIF: ");
            doc.text(120, 70, "Phone: ");
            doc.text(120, 75, "Email: ");
            doc.text(120, 80, "Web: ");
            doc.text(120, 85, "Address: ");
            doc.text(120, 90, "State: ");
            doc.text(120, 95, "Country: ");
            doc.setFontSize(22);
            doc.text(140, 60, myclient.name);
        }
    },

    mypdf.setup = function (data){
        var n;

        doc.setFontSize(28);
        doc.text(x, y, data[1]);
        x = x + 2;
        y = y + 2;
        doc.setFontSize(8);

        for (n in data) {
            if (data.hasOwnProperty(n)) {
                if (data[n]) {
                    if (n !== 1) {
                        y = y + 5;
                        doc.text(x, y, data[n]);
                    }
                }
            }
        }
    },

    mypdf.fac = function (data) {
        doc.setFontSize(12);
        doc.setFontType("bold");
        doc.text(25, 119, "Fac: " + data);
    },

    mypdf.date = function (data) {
        doc.setFontSize(12);
        doc.setFontType("bold");
        doc.text(168, 119, data);
    },

    mypdf.save = function (callback) {
        var no, h = 130, v = 60;

        doc.setFontSize(10);
        doc.rect(20, 120, 170, 160); // empty square
        doc.setFontSize(7);
        doc.text("@2016 Athomic WebApp.", 25, 285);
        doc.save('filepdf.pdf');
    };

    return mypdf;
}());
