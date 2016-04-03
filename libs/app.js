/*jslint browser: true*/
/*global $, jQuery, alert, openDB*/
var cons = {
	NAME: "AthomicDB",
	VERSION: 1
},
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
	i = 0, databill = {},
	forms = $('input.myconf'),
	panel = $('#panel'),
	popup_nuevo_cliente = $('#nuevo_cliente'),
	lista = $('#lista'),
	listapanel = $('#datapanel'),
	formbill = $('#nuevobill'),
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

function getBill() {
	'use strict';
	var n = localStorage.getItem('factura');

	if (n) {
		n = n + 1;
	} else {
		n = 1;
	}

	localStorage.setItem('factura', n);
	return n;
}

function bill(data) {
	'use strict';

	if (data) {
		panel.panel('close');

		window.console.log("Billing... " + JSON.stringify(data[empresa[1]]));

		$('#titulobill').text("Billing      > " + data[empresa[1]]);
		$('#cifbill').text("CIF: " + data[empresa[0]]);
		$('#telefonobill').text("Tel: " + data[empresa[2]]);

		var n = "Fac00000" + getBill();
		numerobill.text(n);
		fechabill.text(getFullDate());
		databill = data;

		formbill.popup();
		formbill.popup('open', {positionTo: "window", transition: "flip"});
	}
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

var refreshClientes = function (datos) {
	'use strict';
	var id, d;

	if (datos) {
		window.console.log("refreshClientes...");

		window.console.log(JSON.stringify(datos[empresa[1]]));

		$("<li>").append("<a href='#' id=" + datos[empresa[1]] + "><h3>" + datos[empresa[1]] + "</h3><p> " + datos[empresa[2]] + "</p></a>").appendTo(lista);

		id = "#" + datos[empresa[1]];
		$(id).click(function () {
			var z;
			window.console.log(datos[empresa[1]] + ".click");

			listapanel.empty();
			for (z in datos) {
				if (datos.hasOwnProperty(z)) {
					if (datos[z]) {
						if (z === "cif") {
							$("<li>").append("<a href='#' class='color' id=" + z + ">" + datos[z] + "</a>").appendTo(listapanel);
							d = "#cif";
							$(d).click(
								bill(datos)
							);
						} else {

							if (z === "name") {
								$("<li>").append("<a href='#' class='color' id=" + z + ">" + datos[z] + "</a>").appendTo(listapanel);
								d = "#name";
								$(d).click(
									edit(datos)
								);
							} else {
								$("<li class='color'>").append("<span>" + datos[z] + "</span>").appendTo(listapanel);
							}
						}
					}
				}
			}

			listapanel.listview('refresh');
			panel.panel('open');
		});

		lista.listview('refresh');
	}
};

function loadDB() {
	'use strict';
	lista.empty();
	openDB.odb.open(cons, null, refreshClientes, 'read');
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

function newcli() {
	'use strict';
	window.console.log("New Client...");

	clear(forms);
	popup_nuevo_cliente.popup('open', { positionTo: "window", transition: "flip" });
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

function importdata() {
	'use strict';
	window.console.log("Import...");


}

function exportClient(data) {
	'use strict';
	var clientesDB = [], valido = false;

	if (data) {
		clientesDB.push(data);
		valido = true;
	} else {
		if (valido) {
			if (window.saveAs) {
				if (saveAs("AthomicDB", JSON.stringify(clientesDB))) {
					texto("AthomicDB is saved.");
				}
			}
		}
	}
}

function exportdata() {
	'use strict';
	window.console.log("Export...");

	openDB.odb.open(cons, null, exportClient, 'read');
}

function delDB() {
	'use strict';
	var nombre;

	nombre = $('#name').text();
	openDB.odb.open(cons, nombre, texto, 'delete');
	lista.empty();
	openDB.odb.open(cons, refreshClientes);
}

function deleteID() {
	'use strict';
	var popup_delete = $('#popup_delete');

	panel.panel("close");
	popup_delete.popup('open', { positionTo: "window", transition: "flip" });
}

function facturar(data) {
	'use strict';
	window.console.log("refreshBill...");
}

function refreshBill(datos) {
	'use strict';
	var id, d;

	if (datos) {
		window.console.log("refreshBill...");

		window.console.log(JSON.stringify(datos[empresa[1]]));

		$("<li>").append("<a href='#' id=" + datos[empresa[1]] + "><h3>" + datos[empresa[1]] + "</h3><p> " + datos[empresa[2]] + "</p></a>").appendTo(lista);

		id = "#" + datos[empresa[1]];
		$(id).click(function () {
			window.console.log(datos[empresa[1]] + ".click");

			facturar(datos);
		});

		lista.listview('refresh');
	}
}

function savebill() {
	'use strict';
	var fac = {}, consbill;

	if (databill) {
		consbill = {NAME: databill[1], VERSION: 1};

		fac = {
			"name":		databill[1],
			"factura":	numerobill.text(),
			"fecha":	fechabill.text(),
			"concepto":	concepto.text(),
			"cantidad":	cantidad.text(),
			"precio":	precio.text()
		};

		openDB.odb.open(consbill, fac, texto, 'add');
		lista.empty();
		openDB.odb.open(consbill, null, refreshBill, 'read');
	}
}

function loadEvents() {
	'use strict';
	var btn_menu = $('#menu'),
		btn_nuevo = $('#id_nuevo_cliente'),
		btn_setup = $('#setup'),
		btn_import = $('#import'),
		btn_export = $('#export'),
		btn_save = $('#btn_save'),
		btn_delete = $('#deleteID'),
		btn_popup_delete = $('#btn_popup_delete'),
		btn_save_bill = $('#btn_save_bill'),
		btn_lista = $('#lista');

	btn_menu.click(function () {
		panel.panel('open');
	});

	btn_setup.click(function () {
		mysetup();
	});

	btn_import.click(function () {
		importdata();
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
		savebill();
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
