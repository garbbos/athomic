/* jshint -W030 */
var MYPDF = (function() {
    'use strict';
    var doc = new jsPDF(),
        mypdf = {},
        x = 20,
        y = 25,
        a = 132;

        doc.setTextColor(100);
        doc.setFontType("bold");

    function check(data) {
        if(data) {
            return data;
        } else {
            return "";
        }
    }

    mypdf.client = function (data){
        if (data) {
            doc.setFillColor(220, 220, 220);
            doc.rect(126, 52, 64, 17, 'F');
            doc.setFillColor('white');
            doc.setFontSize(22);
            doc.text(130, 63, check(data.name));
            doc.setFontSize(9);
            doc.text(126, 51, "Bill to: ");
            doc.text(168, 68, check(data.cif));
            doc.text(130, 75, "Tel: " + check(data.telefono));
            doc.text(130, 80, check(data.email));
            doc.text(130, 85, check(data.url));
            doc.text(130, 90, check(data.domicilio));
            doc.text(130, 95, check(data.provincia));
            doc.text(144, 95, check(data.cp));
            doc.text(130, 100, check(data.pais));
        }
    },

    mypdf.setup = function (data){
        var n;

        doc.rect(x, y, (x + 35), (y + 24), 'F');
        doc.setTextColor(222, 222, 222);
        doc.setFontSize(28);
        doc.text(x, y, check(data[1]));
        x = x + 2;
        y = y + 2;
        doc.setFontSize(8);

        for (n in data) {
            if (data.hasOwnProperty(n)) {
                if (data[n]) {
                    if (n !== "1") {
                        y = y + 5;
                        doc.text(x, y, check(data[n]));
                    }
                }
            }
        }
        doc.setTextColor(100);
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

    mypdf.bill = function (data) {
        doc.setFontSize(10);
        doc.line(20, 126, 190, 126);
        doc.text(22, 125, "Concept");
        doc.text(110, 125, "Qty.");
        doc.text(170, 125, "Price");
        doc.text(22, a, data.concepto);
        doc.text(110, a, data.cantidad);
        doc.text(170, a, data.precio);
        a = a + 5;
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
