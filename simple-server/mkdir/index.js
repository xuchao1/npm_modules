
var path = require('path');
var fs = require('fs');

module.exports = function(_path){
  var list = _path.split(path.sep);
  var folderPath="";
  var i = 0;
  var loopDir = function(_path){
    fs.stat(_path,function(error,stat){
      if(error){
        fs.mkdirSync(_path);
      }
      if(i<list.length-1){
        i++;
        loopDir(path.join(_path,list[i]));
      }
    });
  };
  loopDir(list[0]);
};
