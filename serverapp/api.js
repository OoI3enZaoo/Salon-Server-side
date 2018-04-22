var Express = require('express')
var mysql = require('mysql')
var app = new Express()
var bodyParser = require("body-parser");
app.use(bodyParser.json({limit:1024102420}));
var mysqlPool = mysql.createPool({
    host     : '172.104.189.169',
    user     : 'root',
    password : '',
    database : 'salon'
});

app.get('/getcourse/:data',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var data = req.params.data
	  var query;
	  if (data == "popular") {
		  query = "SELECT c.youtube, c.course_id, c.admin_id, c.title, c.description,c.cover,c.price, a.fname, a.lname,a.avatar, DATE_FORMAT(c.ts, '%Y-%m-%d %H:%i:%s') AS ts, c.view, cpp.purchase FROM (SELECT course_id, COUNT(*) as count from course_purchase GROUP BY course_id ORDER BY count DESC) cp JOIN course c ON c.course_id = cp.course_id JOIN admin a ON c.admin_id = a.admin_id LEFT JOIN (SELECT COUNT(*) as purchase, course_id from course_purchase) cpp ON cpp.course_id = c.course_id ORDER BY cp.count DESC"
	  }
	  else if (data == "last") {
		  query =  "SELECT c.video, c.course_id, c.admin_id, c.title, c.description,c.cover,c.price, a.fname, a.lname,a.avatar, DATE_FORMAT(c.tstamp, '%Y-%m-%d %H:%i:%s') AS tstamp, c.view, IFNULL(cp.purchase, 0) as purchase FROM `course` c INNER JOIN admin a ON c.admin_id = a.admin_id LEFT JOIN (SELECT COUNT(*) as purchase, course_id from course_purchase) cp ON cp.course_id = c.course_id ORDER BY `purchase` ASC"
	  } else {
		  query = "SELECT c.youtube, c.course_id, c.admin_id, c.title, c.description,c.cover,c.price, a.fname, a.lname,a.avatar, DATE_FORMAT(c.ts, '%Y-%m-%d %H:%i:%s') AS ts, c.view, cp.purchase FROM `course` c INNER JOIN admin a ON c.admin_id = a.admin_id LEFT JOIN (SELECT COUNT(*) as purchase, course_id from course_purchase) cp ON cp.course_id = c.course_id ORDER BY price"
	  }
	  connection.query(query, function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});


app.post('/purchase', function (req, res) {
	console.log(req.body);
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var user_id = req.body.user_id
	  var course_id = req.body.course_id
	  var tstamp = req.body.tstamp
	  var price = req.body.price
		var query = "INSERT INTO course_purchase VALUES("+user_id+","+course_id+",'"+tstamp+"',"+price+")"
		console.log(query)
		connection.query(query);
	  });
});




app.get('/getvideo/:lesson_id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var lesson_id = req.params.lesson_id
	  connection.query("SELECT * FROM `lesson_video` WHERE lesson_id = "+lesson_id+"", function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});





app.post('/insertfavorite', function (req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var user_id = req.body.user_id
	  var video_id = req.body.video_id
		var query = "INSERT INTO `lesson_video_favorite`(`user_id`, `video_id`) VALUES ("+user_id+","+video_id+")"
		console.log(query)
		connection.query(query);
	  });
});

app.post('/removefavorite', function (req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var video_id = req.body.video_id
	  var user_id = req.body.user_id
		var query = "DELETE from lesson_video_favorite WHERE user_id = "+user_id+" AND video_id = "+video_id+""
		console.log(query)
		connection.query(query);
	  });
});
app.get('/getfavorite/:userid', function (req, res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var userid = req.params.userid
			connection.query("SELECT lf.video_id, l.lesson_id, l.course_id, l.title, a.avatar, lv.video, l.tstamp  from lesson l JOIN lesson_video lv ON lv.lesson_id = l.lesson_id JOIN lesson_video_favorite lf ON lf.user_id = "+userid+" AND lf.video_id = lv.video_id JOIN admin a ON a.admin_id = l.admin_id ORDER BY lf.favorite_id DESC", function(err, rows, field) {
				res.send(rows)
				connection.release();
			});
	  });
});

app.get('/getlesson/:id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var id = req.params.id
	  connection.query("SELECT l.lesson_id, l.course_id, l.admin_id, l.title, l.cover, DATE_FORMAT(l.tstamp, '%Y-%m-%d %H:%i:%s') AS tstamp,a.fname,a.lname,a.avatar FROM `lesson` l LEFT JOIN admin a ON a.admin_id = l.admin_id WHERE course_id = "+id+" ORDER BY tstamp DESC", function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});
app.get('/getuserpurchase/:userid',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var userid = req.params.userid
	  connection.query("SELECT l.lesson_id, l.course_id, l.admin_id, l.title, l.cover, DATE_FORMAT(l.tstamp, '%Y-%m-%d %H:%i:%s') AS tstamp ,a.fname,a.lname,a.avatar from lesson l JOIN course_purchase cp ON cp.user_id = "+userid+" AND l.course_id = cp.course_id JOIN admin a ON a.admin_id = l.admin_id LEFT JOIN (SELECT COUNT(*) as purchase, course_id from course_purchase) cpp ON cpp.course_id = l.course_id ORDER BY cp.tstamp DESC", function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});

app.get('/getlesson_from_lesson_id/:id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var id = req.params.id
	  connection.query('SELECT l.lesson_id, l.course_id, l.admin_id, l.title,l.description,l.cover,l.view,l.love,DATE_FORMAT(l.tstamp, "%Y-%m-%d %H:%i:%s") AS tstamp,a.fname,a.lname,a.avatar FROM `lesson` l LEFT JOIN admin a ON a.admin_id = l.admin_id WHERE lesson_id = ' + id, function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});
/*
app.post('/addCourseview', function (req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
		var course_id = req.body.course_id;
		var query = "UPDATE course SET view = view + 1  WHERE course_id = "+course_id+""
		console.log(query)
		connection.query(query);
	  });
});*/


app.post('/addchat', function (req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
		var user_id = req.body.user_id;
		var text = req.body.text;
		var tstamp = req.body.tstamp;
		var type = req.body.type;
		var query = "INSERT INTO chat(user_id,text,tstamp,type) VALUES("+user_id+",'"+text+"','"+tstamp+"','"+type+"')"
		console.log(query)
		connection.query(query);
	  });
});
app.get('/getlastuserchat/:userid',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var userid = req.params.userid
	  connection.query("SELECT c.user_id, c.admin_id, c.text,c.tstamp,c.type, a.fname as afname , a.lname as alname , a.avatar as aavatar, u.fname as ufname, u.lname as ulname , u.avatar as uavatar FROM `chat` c  LEFT JOIN admin a ON a.admin_id = c.admin_id  LEFT JOIN user u on u.user_id = c.user_id WHERE c.user_id = "+userid+" ORDER BY `tstamp` DESC LIMIT 20", function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});


app.post('/addrecommend',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var user_id = req.body.user_id
    var recommend_to = req.body.recommend_to
	  var tstamp = req.body.tstamp
	  var query = "INSERT INTO recommend(user_id, recommend_to, tstamp) VALUES ("+user_id+","+recommend_to+",'"+tstamp+"')";
	  console.log(query)
	  connection.query(query);
	});
});
app.post('/updateuserrecommend',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var user_id = req.body.user_id
	  var query = "UPDATE user SET account_status = 1 WHERE user_id = " + user_id;
	  console.log(query)
	  connection.query(query);
	})
})
app.get('/checkloginuser/:email/:password',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var email = req.params.email
	  var password = req.params.password
			connection.query("SELECT COUNT(*) as check_user , user_id FROM user WHERE email = '"+email+"' AND password = SHA2('"+email+"',256)", function(err, rows, field) {
				res.send(rows)
				connection.release();
			});
	  });
});

app.get('/getuserdata/:user_id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var user_id = req.params.user_id
			connection.query("SELECT user_id, email, fname,lname, avatar, address, phone, age, tstamp from user WHERE user_id = " + user_id, function(err, rows, field) {
				res.send(rows)
				connection.release();
			});
	  });
});

app.get('/checksameemail/:email',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var email = req.params.email
	  var query = "SELECT COUNT(*) AS status FROM `user` WHERE email = '" + email + "'";
			connection.query(query, function(err, rows, field) {
				res.send(rows)
				connection.release();
			});
	  });
});

app.post('/insertuser/',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var email = req.body.email
	  var password = req.body.password
	  var fname = req.body.fname
	  var lname = req.body.lname
	  var avatar = req.body.avatar
	  var age = req.body.age
	  var phone = req.body.phone
	  var tstamp = req.body.tstamp
	  var query = "INSERT INTO user(email,password,fname,lname,avatar,phone,age,tstamp) VALUES('"+email+"',SHA2('"+password+"',256),'"+fname+"','"+lname+"','"+avatar+"','"+phone+"',"+age+",'"+tstamp+"')"
	  connection.query(query, function (error, results, field) {
		  if (error) throw error;
		  res.send({user_id: results.insertId})
	  })
  });
});

app.get('/getbank/:user_id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var user_id = req.params.user_id
	  var query = "SELECT user_id, account_bank, account_number, account_status FROM `user` WHERE user_id = '" + user_id + "'";
			connection.query(query, function(err, rows, field) {
				res.send(rows)
				connection.release();
			});
	  });
});

app.post('/insertbank/',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
    let user_id = req.body.user_id
    let bankName = req.body.account_bank
    let bankAccount = req.body.account_number
    let bankStatus = req.body.account_status
	  var query = "UPDATE user SET account_bank = '"+bankAccount+"', account_number = '"+bankName+"', account_status = "+bankStatus+" WHERE user_id = " + user_id
    console.log(query)
	  connection.query(query)
  })
})

app.get('/get_course_for/:course_id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var course_id = req.params.course_id
	  var query = "SELECT * FROM course_for WHERE course_id = "+course_id+"";
	  connection.query(query, function(err, rows) {
		res.json(rows);
		connection.release();
	  })
	})
})

app.get('/get_course_include/:course_id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var course_id = req.params.course_id
	  var query = "SELECT * FROM course_include WHERE course_id = "+course_id+"";
	  connection.query(query, function(err, rows) {
		res.json(rows);
		connection.release();
	  })
	})
})

app.get('/get_course_receive/:course_id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var course_id = req.params.course_id
	  var query = "SELECT * FROM course_receive WHERE course_id = "+course_id+"";
	  connection.query(query, function(err, rows) {
		res.json(rows);
		connection.release();
	  })
	})
})



module.exports = app;
