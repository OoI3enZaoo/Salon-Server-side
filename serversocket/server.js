var Express = require('express')
var app = new Express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var cors = require('cors')
var port = process.env.PORT || 4200
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}));
var omise = require('omise')({
  'secretKey': '',
  'omiseVersion': '2015-09-10'
});


app.use(cors())

app.get('/',function(req,res) {
	res.send('socker.ioo');
});


app.post('/checkout/:course_id/:user_id/:amount', function(req, res) {
  var token = req.body.omiseToken
  var course_id = req.params.course_id
  var user_id = req.params.user_id
  var myAmount = req.params.amount
  console.log(req.path)
    omise.charges.create({
    'amount': myAmount + '00' ,
    'currency': 'thb',
    'card': token
  }, function(err, resp) {
    if (resp.paid) {
		console.log("user_id: " + user_id + "success");
      //Success
	  let data = {
		  user_id: user_id,
		  course_id: course_id
	  }
		io.to(user_id).emit('purchase', data)
    } else {
      //Handle failure
      res.send('fail' + err)
      throw resp.failure_code;
    }
  });
})

io.on('connection', function (socket) {
  console.log('a user connected ', socket.id)
  // user ที่เปิดหรืออก browser
  socket.on('disconnect', function () {
    console.log('user disconnected ', socket.id)
  })
  socket.on('subscribe', function(user_id) {
    console.log('joining room', user_id)
    socket.join(user_id);
  });
  socket.on('leaveRoom',function(room){
    console.log('leave Room', room);
    socket.leave(room)
  });
  socket.on('private_message',function(data){
    console.log("send from room: " + data.room);
    //io.to(data.room).emit('conversation_private', data);
    io.emit('admin', data)
  });
  socket.on('toUser',function(data){
      data.type = "admin"
      io.to(data.user_id).emit('fromAdmin', data)
  })
  socket.on('course' ,function(data){
    console.log('course: ' + data)
      io.emit('course', data)
  })
  socket.on('removeCourse' ,function(data){
    console.log('removeCourse: ' + data)
      io.emit('removeCourse', data)
  })

  socket.on('viewlesson' ,function(data){
    console.log('viewlesson')
      io.emit('viewlesson', data)
  })
  socket.on('favoritelesson' ,function(data){
    console.log('favoritelesson')
      io.emit('favoritelesson', data)
  })


  // รับเฉพาะ Event ข้อความ จาก client
  socket.on('chat_message', function (msg) {
    console.log('socket by : ', socket.id, ' message: ' + msg)
    // ส่งข้อมูลกลับไปหาผู้ส่งมา
    io.emit('chat_message', msg)
  })
})
http.listen(port, function () {
  console.log('Server is running on port: ' + port)
})
