/* jshint -W030 */
var MYPDF = (function() {
    'use strict';
    var doc = new jsPDF(),
        mypdf = {},
        x = 20,
        y = 24,
        total = 0,
        iva = 0,
        subtotal = 0,
        totalbill = 0,
        nombre = "client",
        fac = "0000",
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
            window.console.log(JSON.stringify(data));
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
            nombre = data.name;
        }
    },

    mypdf.setup = function (data){
        var n;
        window.console.log(JSON.stringify(data));

        doc.rect(x, y, (x + 45), (y + 24), 'F');
        doc.setTextColor(222, 222, 222);
        doc.setFontSize(28);
        doc.text(x, 21, check(data[1]));
        x = x + 2;
        y = y + 3;
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
        window.console.log(JSON.stringify(data));
        doc.setFontSize(12);
        doc.setFontType("bold");
        doc.text(25, 119, "Invoice ID: " + data);
        fac = data;
    },

    mypdf.date = function (data) {
        window.console.log(JSON.stringify(data));
        doc.setFontSize(12);
        doc.setFontType("bold");
        doc.text(168, 119, data);
    },

    mypdf.bill = function (data) {

        doc.setFontSize(10);
        doc.line(20, 126, 190, 126);
        doc.text(22, 125, "Description");
        doc.text(100, 125, "Qty.");
        doc.text(140, 125, "Unit Price");
        doc.text(174,125, "Total");
        doc.text(22, a, data.concepto);
        doc.text(100, a, data.cantidad);
        doc.text(140, a, data.precio);
        total = (data.precio * data.cantidad);
        subtotal = total + subtotal;
        doc.text(174, a, total.toString());
        a = a + 5;
    },

    mypdf.save = function (callback) {
        var espacios;

        doc.setFontSize(11);
        iva = (subtotal * 0.21);
        totalbill = subtotal + iva;

        espacios = (180 - subtotal.toFixed(2).toString().length);
        window.console.log(espacios);

        doc.text(122, 259, "Subtotal: ");
        doc.text(espacios, 259, subtotal.toFixed(2));
        doc.text(122, 264, "Tax: 21%");

        espacios = ((180 - iva.toFixed(2).toString().length) + 1);
        window.console.log(espacios);

        doc.text(espacios, 264, iva.toFixed(2));
        doc.line(168, 268, 190, 268);
        doc.text(122, 276, "TOTAL");

        espacios = (180 - totalbill.toFixed(2).toString().length);
        window.console.log(espacios);

        doc.text(espacios, 276, totalbill.toFixed(2));
        doc.text(40, 260, "COMMENTS:");

        doc.setFontSize(10);
        doc.rect(20, 120, 170, 130); // empty square
        doc.setFontSize(7);
        doc.line(20, 288, 190, 288);
        doc.text("@2016 Athomic WebApp.", 40, 293);
        doc.save(nombre + fac + '.pdf');
    };

    return mypdf;
}());
