/* jslint browser: true */
/* global $, jQuery, alert, openDB, saveAs, MYPDF, Blob, FileReader */
var	cons = {NAME: "AthomicDB", VERSION: 1},
	setup = { NAME: "SetupDB", VERSION: 1 },

	empresa = [
		"cif",
		"name",
		"telefono",
		"email",
		"url",
		"domicilio",
		"provincia",
		"cp",
		"pais"
	],
	i = 0,
	clientDB = [],
	vector = [],
	cliente = {},
	forms = $('input.myconf'),
	panel = $('#panel'),
	btn_delete = $('#deleteID'),
	popup_nuevo_cliente = $('#nuevo_cliente'),
	popup_delete = $('#popup_delete'),
	deltitulo = $('#deltitulo'),
	paneltitulo = $('#panel_titulo'),
	lista = $('#lista'),
	listapanel = $('#datapanel'),
	selectfile = document.getElementById('selectfile'),
	nuevobill = $('#nuevobill'),
	formbill = $('#form_bill'),
	titulobill = $('#titulobill'),
	numerobill = $('#numerobill'),
	fechabill = $('#fechabill'),
	concepto = $('#concepto'),
	cantidad = $('#cantidad'),
	precio = $('#precio'),
	titulo = $('#titulo_nuevo');

function texto(msg) {
	'use strict';
	var element = $('#status_bar');

	window.console.log(msg);
	$('#status_msg').text(msg);
	element.animate({ opacity: ".9" });
	setTimeout(function () { element.animate({ opacity: '0' }); }, 3000);
}

function getFullDate() {
	'use strict';
	var dato = new Date(), d, m, a;

	d = dato.getDate();
	m = dato.getMonth();
	m = m + 1;
	a = dato.getFullYear();
	dato = (d + "/" + m + "/" + a);
	window.console.log("Date: " + dato);

	return dato;
}

function clear(objeto) {
	'use strict';
	if (objeto) {
		objeto.each(function () {
			$(this).val("");
		});
	}
}

function getBill(name) {
	'use strict';
	var n = parseInt(localStorage.getItem(name), 10);

	if (n) {
		window.console.log("No Factura grabado: " + n);
		n = n + 1;
	} else {
		n = 1;
	}

	localStorage.setItem(name, n);
	return n;
}

function edit(data) {
	'use strict';
	var z;

	if (data) {
		panel.panel('close');
		clear(forms);
		titulo.text("Update Client");

		for (z in empresa) {
			if (empresa.hasOwnProperty(z)) {
				window.console.log("Edit... " + JSON.stringify(data[empresa[z]]));
				if (data[empresa[z]]) {
					document.formo.elements[z].value = data[empresa[z]];
					popup_nuevo_cliente.popup('open', {positionTo: "window", transition: 'flip'});
				}
			}
		}
	}
}

function bill() {
	'use strict';
	var n, nombre = $('#name');

	if (paneltitulo.text() === "Athomic") {
		titulobill.text(nombre.text());
	} else {
		titulobill.text(paneltitulo.text());
	}

	n = "00000" + getBill(titulobill.text());
	numerobill.text(n);
	fechabill.text(getFullDate());

	nuevobill.popup();
	nuevobill.popup('open', {positionTo: "window", transition: "flip"});
}

function newcli() {
	'use strict';

	window.console.log(titulo.text());
	clear(forms);

	if (paneltitulo.text() === "Athomic") {
		popup_nuevo_cliente.popup('open', { positionTo: "window", transition: "flip" });
	} else {
		bill();
	}
}

function getSetup() {
	'use strict';
	var z, mydata = [];

	window.console.log("Setup...");

	for (z in empresa) {
		if (empresa.hasOwnProperty(z)) {
			mydata.push(localStorage.getItem(empresa[z]));
		}
	}

	if (mydata) {
		return mydata;
	} else {
		texto("Setup: Empty data.");
		return;
	}
}

function mysetup() {
	'use strict';
	var datos, z;

	clear(forms);

	titulo.text("Setup");
	datos = getSetup();
	if (datos) {

		for (z in datos) {
			if (datos.hasOwnProperty(z)) {
				document.formo.elements[z].value = datos[z];
			}
		}
	}

	popup_nuevo_cliente.popup('open', {positionTo: "window", transition: "flip"});
}

function saveSetup(data) {
	'use strict';
	var z;

	for (z in data) {
		if (data.hasOwnProperty(z)) {
			localStorage.setItem(z, data[z]);
		}
	}

}

function importfile() {
	'use strict';
	panel.panel('close');

	if (window.File && window.FileReader && window.FileList && window.Blob) {
		$('#readfile').popup('open', { positionTo: "window", transition: "flip" });
	} else {
		texto("Error: Not support File Api");
	}
}

function readForExport(data) {
	'use strict';

	clientDB.push(data);
}

function exportdata() {
	'use strict';

	popup_delete.popup('open', { positionTo: "window", transition: "flip" });
	deltitulo.text("Export...");

	clientDB = [];
	openDB.odb.open(cons, null, readForExport, 'read');
}

function deleteID() {
	'use strict';

	panel.panel('close');
	deltitulo.text("Deleting...");
	popup_delete.popup('open', { positionTo: "window", transition: "flip" });
}

function refreshBill(datos) {
	'use strict';
	var id, suma, mysetup, respuesta = [], mydata = [];

	if (datos) {

		$("<li>").append("<a href='#' id=" + datos.name + "><h3>" + datos.titulo + "</h3><p>Date: " + datos.fecha + "&nbsp;&nbsp;&nbsp;&nbsp;Bill Nº: " + datos.name + "&nbsp;&nbsp;&nbsp;&nbsp;</p></a>").appendTo(lista);

		titulobill.text(datos.titulo);


		id = "#" + datos.name;

		$(id).click(function (event) {
			var z, x, idname, myfac = {}, myfactura = [];
			event.stopPropagation();

			listapanel.empty();

			for (z in datos) {
				if (datos.hasOwnProperty(z)) {
					if (z !== "titulo") {

						if (z === "name") {
							idname = "#fac" + datos[z];
							$("<li>").append("<a href='#' class='color' id=fac" + datos[z] + ">Nº " + datos[z] + "</a>").appendTo(listapanel);

						} else {
							for (x in datos[z]) {
								if (datos[z].hasOwnProperty(x) && (x === "concepto")) {
									suma = datos[z].cantidad * datos[z].precio;
									$("<li class='color myfactura'>").append("<span class='cantidad'>" + datos[z].cantidad + "</span><span>&nbsp;" + datos[z][x] + "</span><span>&nbsp;&nbsp;&nbsp;" + suma + "&#8364;</span>").appendTo(listapanel);
									myfac = {id: idname, data: datos[z]};
									myfactura.push(myfac);
								}
							}
						}
					}
				}
			}

			$(idname).click(function (event) {
				var no;

				panel.panel('close');
				respuesta = getSetup();

				if (respuesta[1]) {
					MYPDF.init();
					MYPDF.setup(respuesta);

					MYPDF.date(datos.fecha);
					MYPDF.fac(datos.name);
					MYPDF.name(datos.titulo);

					openDB.odb.open(cons, datos.titulo, MYPDF.client, 'get');

					for (no in myfactura) {
						if (myfactura.hasOwnProperty(no)) {
							if (myfactura[no].id === idname) {
								MYPDF.bill(myfactura[no].data);
							}
						}
					}

					//bills(datos.titulo);
					//loadDB();
				} else {
					texto("Setup is empty, write it!!");
				}
			});

			btn_delete.text(datos.name);

			listapanel.listview('refresh');
			panel.panel('open');
		});

		lista.listview('refresh');
	}
}

function bills(data) {
	'use strict';

	if (data) {
		var consbill = {NAME: data, VERSION: 1};
		paneltitulo.text(data);
		panel.panel('close');
		lista.empty();
		openDB.odb.open(consbill, null, refreshBill, 'read');
	}
}

function checkInput(element) {
	'use strict';

	if (element) {
		if (!element.val()) {
			element.css('background-color', '#ffcc66').attr('placeholder', '*Filed Required*').trigger('create');
			element.on('focusin', function () {
				element.css('background-color', '#ffffff').trigger('create');
			});
			return false;
		} else {
			return true;
		}
	}
}

function Conceptos(con, quantity, price) {
	'use strict';

	this.concepto = con;
	this.cantidad = quantity;
	this.precio = price;
}

function nextbill() {
	'use strict';
	var newbill, textoconcepto = $('#texto_concepto');

	if (checkInput(concepto) && checkInput(cantidad) && checkInput(precio)) {
		newbill = new Conceptos(concepto.val(), cantidad.val(), precio.val());

		vector.push(newbill);
		textoconcepto.html("<span><b style='font'>" + concepto.val() + "</b></span>");
		window.console.log("Bill: " + JSON.stringify(vector));
	}
	concepto.val("");
	cantidad.val("");
	precio.val("");
}

function saveallbill() {
	'use strict';
	var z, myconcepto, fac = {}, consbill = {NAME: titulobill.text(), VERSION: 1};
	fac.name = numerobill.text();
	fac.titulo = titulobill.text();
	fac.fecha = fechabill.text();

	nextbill();

	if (vector) {
		for (z in vector) {
			if (vector.hasOwnProperty(z)) {
				myconcepto = "concepto" + z;
				fac[myconcepto] = vector[z];
			}
		}
		window.console.log("Vector: " + JSON.stringify(vector));
	}

	window.console.log("Factura: " + JSON.stringify(fac));

	openDB.odb.open(consbill, fac, texto, 'add');
	clear(formbill);
	vector = [];
	bills(fac.titulo);
}

var refreshClientes = function (datos) {
	'use strict';
	var id, cifEvent = "#cif", nameEvent = "#name";

	if (datos) {
		window.console.log("refreshClientes..." + JSON.stringify(datos[empresa[1]]));

		$("<li>").append("<a href='#' id=" + datos[empresa[1]] + "><h3><span>" + datos[empresa[1]] + "</span></h3><p><span>" + datos[empresa[0]] + "</span><span>&nbsp;&nbsp;&nbsp;&nbsp;" + datos[empresa[2]] + "</span><span>&nbsp;&nbsp;&nbsp;&nbsp;" + datos[empresa[3]] + "</span></p></a>").appendTo(lista);

		id = "#" + datos[empresa[1]];
		$(id).click(function (event) {
			var z;
			window.console.log(id + ".click");
			event.stopPropagation();

			listapanel.empty();
			for (z in datos) {
				if (datos.hasOwnProperty(z)) {
					if (datos[z]) {
						if (z === "cif") {
							$("<li>").append("<a href='#' class='color' id=" + z + ">" + datos[z] + "</a>").appendTo(listapanel);
						} else {

							if (z === "name") {
								$("<li>").append("<a href='#' class='color' id=" + z + ">" + datos[z] + "</a>").appendTo(listapanel);
							} else {
								$("<li class='color'>").append("<span>" + datos[z] + "</span>").appendTo(listapanel);
							}
						}
					}
				}
			}

			$(cifEvent).click(function (event) {
				//event.stopPropagation();
				window.console.log(cifEvent + ".click");
				bills(datos[empresa[1]]);
			});

			$(nameEvent).click(function (event) {
				//event.stopPropagation();
				window.console.log(nameEvent + ".click");
				edit(datos);
			});

			listapanel.listview('refresh');
			panel.panel('open');
		});

		lista.listview('refresh');
	}
};

function loadDB() {
	'use strict';

	paneltitulo.text("Athomic");
	lista.empty();

	openDB.odb.open(cons, "", refreshClientes, 'read');
	btn_delete.text("delete");
}

function reqText(data) {
	'use strict';
	var lines, z;

	lines = JSON.parse(data);
	if (lines) {
		for (z in lines) {
			if (lines.hasOwnProperty(z)) {
				openDB.odb.open(cons, lines[z], texto, 'add');
				window.console.log("Record: " + lines[z].name);
			}
		}
		loadDB();
	}

}

function importData(e) {
	'use strict';
	var file, reader;
	$('#readfile').popup('close');

	file = e.target.files[0];
	if (file) {
		reader = new FileReader();
		reader.onload = function (e) {
			var contents = e.target.result;
			reqText(contents);
		};
		reader.readAsText(file);
	}
}

function checkForm(form) {
	'use strict';
	if (form) {
		for (i in form) {
			if (form.hasOwnProperty(i)) {
				if (i.val()) {
					return true;
				} else {


				}
			}
		}
	} else {
		return false;
	}
}

function save_client() {
	'use strict';
	var z = 0, element, setup, correcto = true, objeto = {};

	$('input.myconf').keyup(function() {
		if ($(this).val()) {
			objeto[empresa[z]] = $(this).val();
			z = z + 1;
	  	} else {
			$(this).attr('placeholder', '*required*').trigger('create');
			correcto = false;
		}
  	});

	$('input.myconf').keyup();

	if (correcto) {
		popup_nuevo_cliente.popup('close');

		if (titulo.text() === 'New Client') {
			openDB.odb.open(cons, objeto, texto, 'add');
		} else {
			if (titulo.text() === 'Update Client') {
				openDB.odb.open(cons, objeto, texto, 'update');
				titulo.text('New Client');
			} else {
				if (titulo.text() === 'Setup') {
					saveSetup(objeto);
					titulo.text("New Client");
				}
			}
		}
		loadDB();
		$('input.myconf').unbind();
	}
}

function delDB() {
	'use strict';
	var nombre, filename = "AthomicDB.json", blob, ref, name = $('#name'), consbill = {};

	if (deltitulo.text() === "Export...") {
		try {
			if (clientDB) {
				blob = new Blob([JSON.stringify(clientDB)], {type: "application/json"});
				saveAs(blob, filename);
				texto("AthomicDB is saved.");
			} else {
				texto("No data in DataBase.");
			}
		} catch (event) {
			texto("Error: Athomic.json is not saved. " + event.message);
		}
	} else {
		if (paneltitulo.text() === "Athomic") {
			nombre = name.text();
			openDB.odb.open(cons, nombre, texto, 'delete');
			consbill = {NAME: nombre, VERSION: 1};
			openDB.odb.open(consbill, null, texto, 'deleteDB');
			loadDB();
		} else {
			consbill = {NAME: paneltitulo.text(), VERSION: 1};
			ref = btn_delete.text();
			nombre = paneltitulo.text();
			window.console.log("delDB: Nombre de panel " + nombre);
			openDB.odb.open(consbill, ref, texto, 'delete');
			lista.empty();
			openDB.odb.open(consbill, nombre, refreshBill, 'read');
		}
	}
}

function loadEvents() {
	'use strict';
	var btn_reload = $('#reload'),
		btn_nuevo = $('#id_nuevo_cliente'),
		btn_setup = $('#setup'),
		btn_import = $('#import'),
		btn_export = $('#export'),
		btn_save = $('#btn_save'),
		btn_popup_delete = $('#btn_popup_delete'),
		btn_save_bill = $('#btn_save_bill'),
		btn_next_bill = $('#btn_next_bill');

	selectfile.addEventListener('change', importData, false);

	btn_reload.click(function () {
		loadDB();
	});

	btn_setup.click(function () {
		mysetup();
	});

	btn_import.click(function () {
		importfile();
	});

	btn_export.click(function () {
		exportdata();
	});

	btn_nuevo.click(function () {
		newcli();
	});

	btn_save.click(function () {
		save_client();
	});

	btn_delete.click(function () {
		deleteID();
	});

	btn_save_bill.click(function () {
		saveallbill();
	});

	btn_next_bill.click(function () {
		nextbill();
	});

	btn_popup_delete.click(function () {
		delDB();
	});
}

//Carga de página principal
window.onload = function () {
	'use strict';
	window.console.log("window.onload()... ");
	loadDB();

	loadEvents();
};
