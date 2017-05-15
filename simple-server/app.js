console.time("server start");
var g_setting = {port:3000};

var checkArgv = function(){
	var argvs = process.argv;
	for(var i=0;i<argvs.length;i++){
		if(argvs[i] === "-port" && i<argvs.length-1){
			if(parseInt(argvs[i+1]) == argvs[i+1]){
				g_setting.port = parseInt(argvs[i+1]);
			}else{
				console.log("-port error;use 3000 by default");
			}
		}
	}
};
checkArgv();

var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var Busboy = require('busboy');
var UUID = require('node-uuid');
var fs = require('fs');

var app = express();
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

var customers = [{
		id: "1",
		name: "customer1",
		gender: 1,
		age: 24,
		company: "com1",
		job: ""
	},
	{
		id: "2",
		name: "customer2",
		gender: 1,
		age: 27,
		company: "com2",
		job: ""
	},
	{
		id: "3",
		name: "customer3",
		gender: 2,
		age: 26,
		company: "com1",
		job: ""
	},
	{
		id: "4",
		name: "customer4",
		gender: 1,
		age: 40,
		company: "com1",
		job: ""
	},
	{
		id: "5",
		name: "customer5",
		gender: 3,
		age: 50,
		company: "com1",
		job: ""
	},
	{
		id: "6",
		name: "customer6",
		gender: 1,
		age: 30,
		company: "com3",
		job: ""
	},
	{
		id: "7",
		name: "customer7",
		gender: 2,
		age: 25,
		company: "com4",
		job: ""
	},
	{
		id: "8",
		name: "customer8",
		gender: 2,
		age: 26,
		company: "com3",
		job: ""
	}
];


app.post("/api/upload", function(req, res) {
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
});

app.post("/api/customer", function(req, res) {
	var gender = req.body.gender;
	if (gender == 1) {
		gender = 1;
	} else if (gender == 2) {
		gender = 2;
	} else if (gender == 3) {
		gender = 3;
	} else {
		gender = 3;
	}
	var customer = {
		id: req.body.id || (new Date().getTime() + ""),
		name: req.body.name,
		age: req.body.age || 20,
		gender: gender,
		company: req.body.company || "",
		job: req.body.job || ""
	};
	customers.push(customer);
	res.send(customer).end();
});
app.get("/api/customer", function(req, res) {
	var queryBody = req.query;
	var filtered = customers.filter(query);
	res.send(filtered).end();

	function query(v) {
		return checkStrByKey(v, "name") &&
			checkNumberByKey(v, "age") &&
			checkNumberByKey(v, "gender") &&
			checkStrByKey(v, "company") &&
			checkStrByKey(v, "job");
	}

	function checkStrByKey(v, key) {
		if (queryBody[key] && v[key].indexOf(queryBody[key]) < 0) {
			return false;
		} else {
			return true;
		}
	}

	function checkNumberByKey(v, key) {
		if (queryBody[key] && v[key] != queryBody[key]) {
			return false;
		} else {
			return true;
		}
	}
});
app.put("/api/customer/:id", function(req, res) {
	var _id = req.params.id;
	var customer = req.body;
	var gender = customer.gender;
	if (gender == 1) {
		gender = 1;
	} else if (gender == 2) {
		gender = 2;
	} else if (gender == 3) {
		gender = 3;
	} else {
		gender = undefined;
	}
	customer.id = _id;
	for (var i = 0; i < customers.length; i++) {
		if (customers[i].id === _id) {
			customers[i].name = customer.name || customers[i].name;
			customers[i].gender = gender || customers[i].gender;
			customers[i].age = customer.age || customers[i].age;
			customers[i].company = customer.company || customers[i].company;
			customers[i].job = customer.job || customers[i].job;
			res.send(customers[i]).end();
			return;
		}
	}
	res.status(500).send({
		error: "not found"
	}).end();
});
app.get("/api/customer/:id", function(req, res) {
	var _id = req.params.id;
	for (var i = 0; i < customers.length; i++) {
		if (customers[i].id === _id) {
			res.send(customers[i]).end();
		}
	}
	res.status(500).send({
		error: "not found"
	}).end();
});
app.delete("/api/customer/:id", function(req, res) {
	var _id = req.params.id;
	var i = 0,
		j = 0;
	for (; i < customers.length; i++, j++) {
		if (customers[i].id === _id) {
			res.send(customers[i]).end();
			i++;
		}
		customers[j] = customers[i];
	}
	if (i === j) {
		res.status(500).send({
			error: "not matched",
			code: 404
		}).end();
	} else {
		customers.length = j;
	}
});

app.use(express.static('static'));

app.listen(g_setting.port);

console.timeEnd("server start");
