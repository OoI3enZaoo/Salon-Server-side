var express = require('express');
http = require('http');
var app = new express();
var server = http.createServer(app);
var cors = require('cors')
var bodyParser = require("body-parser");
app.use(cors({credentials: true}));

app.use(bodyParser.json({limit:1024102420, type:'application/json'}));

app.get('/',function(req,res) {
	res.send('/api');
});
var api = require('./api.js');
app.use('/api', api);
var port = 4400;
server.listen(port ,function(){
console.log('server running on port: ' + port);
});
