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
var fs = require('fs');

var uploadFile = require('./fileupload/index');
var apiServer = require('./api/customer');
var mkdir = require('./mkdir/index');

var app = express();
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

//file upload
app.post("/api/upload", uploadFile);

//rest api
apiServer(app);

mkdir("static");

app.use(express.static('static'));

app.listen(g_setting.port);

console.timeEnd("server start");
