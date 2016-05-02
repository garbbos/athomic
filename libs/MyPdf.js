/* jshint -W030 */
var MYPDF = (function() {
    'use strict';
    var doc,
        mypdf = {},
        x,
        y,
        total,
        iva,
        subtotal,
        totalbill,
        nombre,
        fac,
        a;

    function check(data) {
        if(data) {
            return data;
        } else {
            return "";
        }
    }

    function checkNumber(data) {
        if (isNaN(data)) {
            data = Number(data);
        }
        return data;
    }

    mypdf.init = function () {
        doc = new jsPDF();

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
    },

    mypdf.client = function (data){
        var n = 68;

        if (data) {
            doc.setFillColor(220, 220, 220);
            doc.rect(120, 52, 64, 17, 'F');
            doc.setFillColor('white');
            doc.setFontSize(22);
            doc.text(122, 63, check(data.name));
            doc.setFontSize(9);
            doc.text(122, 51, "Bill to: ");
            doc.text(166, 68, check(data.cif));
            doc.text(122, 75, "Tel: " + check(data.telefono));
            doc.text(122, 80, check(data.email));
            doc.text(122, 85, check(data.url));
            doc.text(122, 90, check(data.domicilio));
            doc.text(122, 95, check(data.provincia));
            doc.text(142, 95, check(data.cp));
            doc.text(122, 100, check(data.pais));

            mypdf.save();
        }
    },

    mypdf.setup = function (data){
        var n, largo = 0;

        if (data) {
            window.console.log(JSON.stringify(data));

            largo = 80;
            doc.rect(x, y, largo, (y + 24), 'F');
            doc.setTextColor(222, 222, 222);
            doc.setFontSize(28);
            doc.text(x, 21, check(data[1]));
            x = x + 2;
            y = y + 3;
            doc.setFontSize(9);

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
        }
    },

    mypdf.fac = function (data) {
        if (data) {
            window.console.log(JSON.stringify(data));
            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(25, 119, "Invoice ID: " + data);
            fac = data;
        }
    },

    mypdf.date = function (data) {
        if (data) {
            window.console.log(JSON.stringify(data));
            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(168, 119, data);
        }
    },

    mypdf.name = function (data) {
        if (data) {
            nombre = data;
        }
    },

    mypdf.bill = function (data) {
        var precio = 0;

        if(data) {
            doc.setFontSize(10);
            doc.line(20, 126, 190, 126);
            doc.text(22, 125, "Description");
            doc.text(100, 125, "Qty.");
            doc.text(136, 125, "Unit Price");
            doc.text(168,125, "Total");

            precio = checkNumber(data.precio);
            window.console.log("Bills total " + precio);

            doc.text(22, a, data.concepto);
            doc.text(100, a, data.cantidad);
            doc.text(136, a, precio);
            total = (precio * checkNumber(data.cantidad));
            total = checkNumber(total);

            subtotal = total + subtotal;
            window.console.log("Subtotal " + subtotal);
            doc.text(168, a, total.toString());
            a = a + 5;
        }
    },

    mypdf.save = function () {
        var espacios;

        iva = (subtotal * 0.21);
        iva = checkNumber(iva);
        totalbill = subtotal + iva;
        totalbill = checkNumber(totalbill);
        subtotal = checkNumber(subtotal);

        doc.setFontSize(11);

        espacios = (180 - subtotal.toFixed(2).toString().length);
        doc.text(122, 259, "Subtotal ");

        doc.text(espacios, 259, subtotal.toFixed(2).toString());
        window.console.log(espacios + " subtotal " + subtotal);

        doc.text(122, 264, "Tax: 21%");
        espacios = ((180 - iva.toFixed(2).toString().length));
        window.console.log(espacios + "iva " + iva);

        doc.text(espacios, 264, iva.toFixed(2).toString());
        doc.line(168, 268, 190, 268);
        doc.text(122, 276, "TOTAL");

        espacios = (180 - totalbill.toFixed(2).toString().length);
        window.console.log(espacios + "Totalbill " + totalbill);

        doc.text(espacios, 276, totalbill.toFixed(2).toString());
        doc.text(40, 260, "COMMENTS:");

        doc.setFontSize(10);
        doc.rect(20, 120, 170, 130); // empty square
        doc.setFontSize(7);
        doc.line(20, 288, 190, 288);
        doc.text("@2016 Athomic WebApp.", 40, 293);


        doc.save(nombre + fac + '.pdf');
        espacios = 0, iva = 0, subtotal = 0, totalbill = 0;
    };

    return mypdf;
}());
