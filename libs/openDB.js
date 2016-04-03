//Libreria para la gestión de una Base de datos con IndexedDB
var openDB = (function () {
	'use strict';

	var oDB = {}, indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDb || window.msIndexedDB,
		read = function (store, callback) {
			var cursor;

			try {
				store.openCursor().onsuccess = function (e) {
					cursor = e.target.result;

					if (cursor) {
						window.console.log(JSON.stringify(cursor.value));
						callback(cursor.value);
						cursor['continue']();
					} else {
						return;
					}
				};
			} catch (event) {
				callback("OpenDB: Read DB failed. " + event.message);
			}
		},

		add = function (store, data, callback) {
			var req;

			try {
				req = store.add(data).onsuccess = function (e) {
					callback("OpenDB: Add record " + JSON.stringify(data['name']) + " success.");
					return true;
				};
			} catch (event) {
				callback("OpenDB: ADD record failed. " + event.message);
			}
		},

		del = function (store, data, callback) {
			try {
				store['delete'](data).onsuccess = function (e) {
					callback("OpenDB: " + data + "  is Deleted.");
					return true;
				};
			} catch (event) {
				callback("OpenDB: ADD record failed. " + event.message);
			}
		},

		update = function (store, data, callback) {
			var record, res;

			try {
				res = store.get(data.name);

				res.onsuccess = function (ev) {

					record = res.result;
					window.console.log("OpenDB: Update " + JSON.stringify(data.name));

					if (record) {
						var z;

						for (z in data) {
							if (data.hasOwnProperty(z)) {
								if (z !== 'name') {
									record[z] = data[z];
									window.console.log("OpenDB: Update " + record[z]);
								}
							}
						}

						store.put(record).onsuccess = function (e) {
							callback("OpenDB: Update record: UPDATE " + record.name);
						};
					}
				};

				res.onerror = function (ev) {
					store.add(record).onsuccess = function (e) {
						callback("OpenDB: Update record: ADD " + record.name);
					};
				};

			} catch (event) {
				callback("OpenDB: ADD record failed. " + event.message);
			}
		};

	oDB.open = function (cons, data, callback, modo) {
		var db, request, transaction, store;

		try {
			request = indexedDB.open(cons.NAME, cons.VERSION);

			request.onerror = function (e) {
				window.console.log("OpenDB: open... request.onerror " + e.message);
				return;
            };

			request.onupgradeneeded = function (e) {
				db = e.target.result;

				if (!db.objectStoreNames.contains('clientes')) {
					window.console.log("OpenDB: not exists clientes");

					store = db.createObjectStore('clientes', { keyPath: "name" });
				}
            };

			request.onsuccess = function (e) {
				window.console.log("OpenDB: open: request.onsuccess...");

				db = e.target.result;
				transaction = db.transaction('clientes', 'readwrite');
				store = transaction.objectStore('clientes');

				if (modo === 'read') {
					read(store, callback);
				}

				if (modo === 'add') {
					add(store, data, callback);
				}

				if (modo === 'update') {
					update(store, data, callback);
				}

				if (modo === 'delete') {
					del(store, data, callback);
				}
			};
		} catch (event) {
			callback("OpenDB: Error open DB. " + event.message);
			return;
		}
	};

	return {
		odb: oDB
	};
}());
