// Static server for development purposes
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.listen(process.env.PORT || 8080);
console.log("Dev server running, navigate to http://localhost:8080/#editor");