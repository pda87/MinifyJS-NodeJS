var fs = require('fs');
var dir = require('node-dir');
var uglifyJS = require("uglify-js");

var encoding = "utf8";
var jsFolder = "folder-with-JS-files";
var allJSCode = "";
var resultFileName = "allJS-min.js";
var resultFilePath = jsFolder + "/" + resultFileName;

module.exports = {
    minifyJS: function() {
        console.log("Minifying and Uglifying JS in: " + jsFolder);
        this.readJSDirectory();
    },
    readJSDirectory: function() {
        console.log("Reading files...");
        dir.files(jsFolder, function(err, filenames) {
            if(err) {
                console.log(err);
            }
            else {
                module.exports.readFiles(filenames, function() {
                    module.exports.uglifyCode();
                });
            }
        });
    },
    readFiles: function(filenames, callback) {
        var fileCount = filenames.length;
        var filesProcessed = 0;

        filenames.forEach(function(file) {
            if(file.toString().indexOf(".js") > -1 && file != resultFilePath) {
                fs.readFile(file, encoding, function(err, fileData) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        allJSCode += fileData + "; ";
                        filesProcessed++;
                        if(fileCount == filesProcessed) {
                            callback();
                        }
                    }
                })
            }
            else {
                fileCount--;
            }
        });
    },
    uglifyCode: function() {
        console.log("Uglifying...");
        var uglifiedJS = uglifyJS.minify(allJSCode);
        console.log("Writing final JS file: " + resultFilePath);
        debugger;
        fs.writeFile(resultFilePath, uglifiedJS.code.toString(), function(err) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("Done!");
            }
        });
    }
}

module.exports.minifyJS();
