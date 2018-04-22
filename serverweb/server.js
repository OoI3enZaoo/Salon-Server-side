var Express = require('express')
var app = new Express()
var http = require('http').Server(app)
var cors = require('cors')
var port = process.env.PORT || 4000
var bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors())

app.get('/',function(req,res) {
	res.send('/api');
});

var api = require('./api.js');
app.use('/api', api);
http.listen(port, function () {
  console.log('Server is running on port: ' + port);
})
