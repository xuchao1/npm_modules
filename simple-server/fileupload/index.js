var path = require('path');
var fs = require('fs');
var Busboy = require('busboy');
var UUID = require('node-uuid');

var uploadFile = function(req, res) {
	var id = UUID.v1();
	var ret_file = {
		fileName: "",
		filePath: "",
		fileSize: ""
	};
	var total = 0;
	var busboy = new Busboy({
		headers: req.headers
	});
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		file.on('data', function(data) {
			total += data.length;
			//console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
		});
		file.on('end', function() {
			ret_file.fileSize = total;
		});
		var fileName = path.basename(filename);
		var filePath = path.join("api", "file", id + path.extname(filename));
		ret_file.fileName = filename;
		ret_file.filePath = filePath;

		file.pipe(fs.createWriteStream(path.join("static", filePath)));
	});
	busboy.on('finish', function() {
		res.send(ret_file).end();
	});
	req.pipe(busboy);
};

module.exports = uploadFile;
