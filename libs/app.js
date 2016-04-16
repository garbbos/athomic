/*jslint browser: true*/
/*global $, jQuery, alert, openDB, saveAs, Blob, FileReader*/
var cons = {NAME: "AthomicDB", VERSION: 1},

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
	forms = $('input.myconf'),
	panel = $('#panel'),
	btn_billID = $('#billID'),
	btn_delete = $('#deleteID'),
	popup_nuevo_cliente = $('#nuevo_cliente'),
	popup_delete = $('#popup_delete'),
	deltitulo = $('#deltitulo'),
	paneltitulo = $('#panel_titulo'),
	lista = $('#lista'),
	listapanel = $('#datapanel'),
	selectfile = document.getElementById('selectfile'),
	formbill = $('#nuevobill'),
	titulobill = $('#titulobill'),
	numerobill = $('#numerobill'),
	fechabill = $('#fechabill'),
	concepto = $('#concepto'),
	cantidad = $('#cantidad'),
	precio = $('#precio'),
	allbill = [],
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

	window.console.log("Billing... " + JSON.stringify(nombre.text()));

	titulobill.text(nombre.text());
	n = "00000" + getBill(nombre.text());
	numerobill.text(n);
	fechabill.text(getFullDate());

	formbill.popup();
	formbill.popup('open', {positionTo: "window", transition: "flip"});
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

function refreshSetup(datos) {
	'use strict';
	window.console.log("refreshSetup...");

	if (datos) {
		var z;

		for (z in empresa) {
			if (empresa.hasOwnProperty(z)) {
				if (datos[empresa[z]]) {
					document.formo.elements[z].value = datos[empresa[z]];
				}
			}
		}
	}

	titulo.text("Setup");
	popup_nuevo_cliente.popup('open', {positionTo: "window", transition: "flip"});
}

function mysetup() {
	'use strict';
	var setup = { NAME: "SetupDB", VERSION: 1 };
	window.console.log("Setup...");

	clear(forms);

	if (!openDB.odb.open(setup, null, refreshSetup, 'read')) {
		titulo.text("Setup");
		popup_nuevo_cliente.popup('open', { positionTo: "window", transition: 'flip' });
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

function readForExport (data) {
	'use strict';

	clientDB.push(data);
}

function exportdata() {
	'use strict';

	popup_delete.popup('open', { positionTo: "window", transition: "flip" });
	deltitulo.text("Export...");

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
	var id;

	if (datos) {
		window.console.log("refreshBill..." + JSON.stringify(datos));

		$("<li>").append("<a href='#' id=" + datos.name + "><h3>" + datos.titulo + "</h3><p>Date: " + datos.fecha + "&nbsp;&nbsp;&nbsp;&nbsp;Bill Nº: " + datos.name + "&nbsp;&nbsp;&nbsp;&nbsp;</p></a>").appendTo(lista);

		titulobill.text(datos.titulo);

		id = "#" + datos.name;

		$(id).click(function (event) {
			var z;
			window.console.log(id + ".click");
			event.stopPropagation();

			listapanel.empty();
			for (z in datos) {
				if (datos.hasOwnProperty(z)) {
					if (datos[z]) {
						if (z !== "titulo") {
							if (z === "0") {
								window.console.log("datos.factura: " + JSON.stringify(datos[z]));
								$("<li class='color'>").append("<span>" + datos[z].concepto + "</span>").appendTo(listapanel);
							} else {
								$("<li id=" + z + " class='color'>").append("<span>" + datos[z] + "</span>").appendTo(listapanel);
							}
						}
					}
				}
			}
			btn_delete.text(datos.name);

			listapanel.listview('refresh');
			panel.panel('open');
		});

		lista.listview('refresh');
	}
}

function bills() {
	'use strict';
	var namebill = $('#name'), consbill = {NAME: namebill.text(), VERSION: 1};

	paneltitulo.text(namebill.text());
	panel.panel('close');
	lista.empty();
	openDB.odb.open(consbill, null, refreshBill, 'read');
}

function checkInput(element) {
	'use strict';

	if (element) {
		if (!element.val()) {
			element.css('background-color', '#ffcc66').attr('placeholder', '*Concept is required*').trigger('create');
			element.on('focusin', function () {
				element.css('background-color', '#ffffff').trigger('create');
			});
			return false;
		} else {
			return true;
		}
	}
}

function savebill() {
	'use strict';

	nextbill();
	bills();
}

function saveallbill() {
	'use strict';
	var z, fac = {}, consbill = {NAME: factura.titulo, VERSION: 1};

	if (facturacompleta) {
		fac.ref = facturacompleta[0].ref;
		fac.titulo = facturacompleta[0].titulo;
		fac.fecha = facturacompleta[0].fecha;

		for (z in facturacompleta) {
			if (facturacompleta.hasOwnProperty(z)) {
				concept = facturacompleta[z].concepto + z;
				fac.concept = facturacompleta[z].concepto;
				window.console.log("Factura: " + JSON.stringify(facturacompleta[z]));
			}
		}

		openDB.odb.open(consbill,factura, texto, 'add');
	}
}

function conceptos(con, quantity, price) {
	this.concepto = con;
	this.cantidad = quantity;
	this.precio = price;
}

function factura (ref, titulo, fecha, concepto, cantidad, precio) {
	this.ref = ref;
	this.titulo = titulo;
	this.fecha = fecha;
	this.concepto = new conceptos();
}

function nextbill() {
	'use strict';
	var textoconcepto = $('#texto_concepto'), namebill = $('#name');

		if (checkInput(concepto.val()) && checkInput(cantidad.val()) && checkInput(precio.val())) {
			myfactura(numerobill.text(), namebill.text(), fechabill.text(), concepto.val(), cantidad.val(), precio.val());

			facturacompleta.push(factura);

			textoconcepto.html("<span><b style='font'>" + concepto.val() + "</b></span>");
			window.console.log("Bill: " + ref + " Data: " + JSON.stringify(fac));
		}

		concepto.val("");
		cantidad.val("");
		precio.val("");
}

var refreshClientes = function (datos) {
	'use strict';
	var id, cifEvent = "#cif", nameEvent = "#name";

	if (datos) {
		window.console.log("refreshClientes..." + JSON.stringify(datos[empresa[1]]));

		$("<li>").append("<a href='#' id=" + datos[empresa[1]] + "><h3>" + datos[empresa[1]] + "</h3><p> " + datos[empresa[2]] + "</p></a>").appendTo(lista);

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
				bills();
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
}

function save_client() {
	'use strict';
	var z, setup, correcto = true, objeto = {}, id_cif = $('#id_cif'), id_nombre = $('#id_nombre'), id_telefono = $('#id_telefono');

	for (z in empresa) {
		if (empresa.hasOwnProperty(z)) {
			objeto[empresa[z]] = document.formo.elements[z].value;
			window.console.log("save_client " + z + " " + document.formo.elements[z].value);
		}
	}

	if (!objeto[empresa[0]]) {

		id_cif.css('background-color', '#ffcc66').attr('placeholder', '*CIF	 is required*').trigger('create');
		id_cif.on('focusin', function () {
			id_cif.css('background-color', '#ffffff').trigger('create');
		});
		correcto = false;
	}

	if (!objeto[empresa[1]]) {

		id_nombre.css('background-color', '#ffcc66').attr('placeholder', '*Nombre is required*').trigger('create');
		id_nombre.on('focusin', function () {
			id_nombre.css('background-color', '#ffffff').trigger('create');
		});
		correcto = false;
	}

	if (!objeto[empresa[2]] || (objeto[empresa[2]].length < 9)) {

		id_telefono.css('background-color', '#ffcc66').attr('placeholder', '*Teléfono is required*').trigger('create');
		id_telefono.on('focusin', function () {
			id_telefono.css('background-color', '#ffffff').trigger('create');
		});
		correcto = false;
	}

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
					setup = { NAME: "SetupDB", VERSION: 1 };

					openDB.odb.open(setup, objeto, texto, 'update');
					titulo.text("New Client");
				}
			}
		}
		loadDB();
	}
}

function delDB() {
	'use strict';
	var nombre, consbill, filename = "AthomicDB.json", blob, ref, name = $('#name');

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
	var btn_menu = $('#menu'),
		btn_reload = $('#reload'),
		btn_nuevo = $('#id_nuevo_cliente'),
		btn_setup = $('#setup'),
		btn_import = $('#import'),
		btn_export = $('#export'),
		btn_save = $('#btn_save'),
		btn_popup_delete = $('#btn_popup_delete'),
		btn_save_bill = $('#btn_save_bill'),
		btn_next_bill = $('#btn_next_bill'),
		btn_lista = $('#lista');

	selectfile.addEventListener('change', importData, false);

	btn_reload.click(function () {
		loadDB();
	});

	btn_menu.click(function () {
		panel.panel('open');
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

	btn_billID.click(function () {
		bills();
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
