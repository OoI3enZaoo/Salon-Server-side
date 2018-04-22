var Express = require('express')
var mysql = require('mysql')
var multer  = require('multer')
var fs = require('fs');
var app = new Express()
var rimraf = require('rimraf');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
	 var firstPath = 'uploads'
	 if (!fs.existsSync(firstPath)){
		fs.mkdir(firstPath);
	}
	 var path = firstPath + '/' + req.params.id;
	 var mypath = path
	 if (!fs.existsSync(path)){
	console.log('dont have directories')
		fs.mkdir(path);
		cb(null, path)
	}
	else if (fs.existsSync(path)) {
		console.log('have directories')
		rimraf(path, function(){
			console.log('1');
			if(!fs.existsSync(path)) {
				fs.mkdir(path)
			}
			cb(null, path)
		});
		console.log('2');
		//fs2.removeSync(path);
		//fs.mkdir(path)
		//


	}
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({storage: storage});
var mysqlPool = mysql.createPool({
    host     : '172.104.189.169',
    user     : 'root',
    password : '',
    database : 'salon'
});



app.get('/',function(req,res) {
	res.send('serversideupload');
});
app.post('/videoupload/:id',  upload.any(), function(req, res) {

console.log('uplode')
	var file_id = req.params.id //รับ file_id
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
	for (i = 0; i < req.files.length; i++ ){
		var originalname = req.files[i].originalname //รับชื่อไฟล์
		var path = file_id + '/' + originalname //สร้าง path file_id/ชื่อไฟล์
		var query = "UPDATE lesson_video SET video = '"+path+"' WHERE video_id = "+file_id+""
		console.log(query);
			connection.query(query, function(){
				let data = {
					video: path
				}
				res.json(data)
				res.status(200).send();
			})

	   }
  })
});


app.post('/courseupload/:id',  upload.any(), function(req, res) {

console.log('uplode')
	var course_id = req.params.id //รับ course_id
  mysqlPool.getConnection(function(err, connection) {
    if(err) throw err;
	for (i = 0; i < req.files.length; i++ ){
		var originalname = req.files[i].originalname //รับชื่อไฟล์
		var path = course_id + '/' + originalname //สร้าง path course_id/ชื่อไฟล์
		var query = "UPDATE course  SET video = '"+path+"' WHERE course_id  = "+course_id+""
			connection.query(query, function(){
				let data = {
					video: path
				}
				res.json(data)
				res.status(200).send();
			})

	   }
  })
});


app.post('/editlesson/:lesson_id/:title',  upload.any(), function(req,res){
	mysqlPool.getConnection(function(error,connection) {
    var lesson_id = req.params.lesson_id
	var title = req.params.title

	console.log(req.files)
		var originalname = req.files[0].originalname //รับชื่อไฟล์
		var path = lesson_id + '/' + originalname //สร้าง path lesson_id/ชื่อไฟล์
		var query = "UPDATE lesson set title = '"+title+"', video = '"+path+"' WHERE lesson_id = "+lesson_id+""
		console.log(query)
		connection.query(query, function(){
			let data = {
				video: path
			}
			res.json(data)
			res.status(200).send();
		});
	});
});

app.post('/edittitlelesson/',  upload.any(), function(req,res){
	mysqlPool.getConnection(function(error,connection) {
    var lesson_id = req.body.lesson_id
	var title = req.body.title
	var query = "UPDATE lesson set title = '"+title+"' WHERE lesson_id = "+lesson_id+""
		console.log(query)
		connection.query(query);
	});
});


app.get('/getfile/:name/:file' , function(req,res){
	var mName = req.params.name
	var mFile = req.params.file
	var pathFile = __dirname + "/uploads/"+mName+"/"+mFile+""
	console.log(pathFile);
	res.sendFile(pathFile)
});




/*
app.post('/insertlesson',function(req,res) {
	console.log(req.body.data)
	var lesson_id = req.body.lesson_id;
	var course_id = req.body.course_id;
	var admin_id = req.body.admin_id;
	var title = req.body.title;
	var video = req.body.video
	var tstamp = req.body.tstamp
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var query = "INSERT INTO lesson(lesson_id,course_id,admin_id,title,video,tstamp) VALUES("+lesson_id+","+course_id+","+admin_id+",'"+title+"','"+video+"','"+tstamp+"')"
	  console.log(query)
	  connection.query(query);
	});
});*/

/*app.post('/insertlesson',function(req,res) {
	console.log(req.body.data)
	var lesson_id = req.body.lesson_id;
	var course_id = req.body.course_id;
	var admin_id = req.body.admin_id;
	var title = req.body.title;
	var description = req.body.description;
	var cover = req.body.cover;
	var view = req.body.view;
	var love = req.body.love
	var tstamp = req.body.tstamp
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var query = "INSERT INTO lesson VALUES ("+lesson_id+","+course_id+","+admin_id+",'"+title+"','"+description+"','"+cover+"',"+view+","+love+",'"+tstamp+"')"
	  console.log(query)
	  connection.query(query);
	});
});*/









module.exports = app;
