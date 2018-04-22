var Express = require('express')
var app = new Express()
var http = require('http').Server(app)
var cors = require('cors')
var port = process.env.PORT || 4100

app.use(cors())

app.get('/',function(req,res) {
	res.send('serverapp');
});



var api = require('./api.js');
app.use('/api', api);
http.listen(port, function () {
  console.log('server is running on port: ' + port);
})
