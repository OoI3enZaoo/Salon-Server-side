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


app.get('/getuser/limit/:limit',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var limit = req.params.limit
	  connection.query('SELECT * FROM `user` ORDER BY tstamp DESC limit ' + limit, function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});

app.get('/getuser',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  connection.query('SELECT * FROM `user` ORDER BY tstamp DESC', function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});

app.get('/getuser/:id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var id = req.params.id
	  connection.query('SELECT * FROM `user` WHERE user_id = ' + id + ' limit 1', function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});

app.get('/getcourse',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  connection.query('SELECT c.video,c.view, c.course_id, c.admin_id, c.title, c.description,c.cover,c.price, a.fname, a.lname,a.avatar, DATE_FORMAT(c.tstamp, "%Y-%m-%d %H:%i:%s") AS tstamp FROM `course` c INNER JOIN admin a ON c.admin_id = a.admin_id ORDER BY tstamp DESC', function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});

app.get('/get_course_from_id/:course_id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
    var course_id = req.params.course_id
	  connection.query('SELECT c.video,c.view, c.course_id, c.admin_id, c.title, c.description,c.cover,c.price, a.fname, a.lname,a.avatar, DATE_FORMAT(c.tstamp, "%Y-%m-%d %H:%i:%s") AS tstamp FROM `course` c INNER JOIN admin a ON c.admin_id = a.admin_id WHERE course_id = '+course_id+' ORDER BY tstamp DESC', function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});

app.get('/getcourselength',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  connection.query('SELECT DISTINCT course_id as course_id FROM `course_purchase`', function(err, rows, field) {
		  res.send(rows);
		connection.release();
	  });
	});
});
app.get('/getchart/:id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var id = req.params.id
			connection.query('SELECT COUNT(cl.course_id) as value, c.title as name FROM course_purchase cl, course c WHERE c.course_id = cl.course_id and cl.course_id = ' + id, function(err2, rows2, field2) {
				res.send(rows2)
				connection.release();
			});
	  });
});
app.get('/getadmin',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
			connection.query('select admin_id, fname,lname,avatar,email from admin', function(err2, rows2, field2) {
				res.send(rows2)
				connection.release();
			});
	  });
});
app.get('/getcoursename/:id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var id = req.params.id
			connection.query('SELECT title FROM course where course_id = ' + id, function(err, rows, field) {
				res.json(rows)
				connection.release();
			});
	  });
});
app.get('/getcoursepurchase/:limit',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var limit = req.params.limit
	  connection.query('SELECT u.user_id, u.fname,u.lname, u.avatar, cl.tstamp, c.title FROM course_purchase cl, user u,course c order by cl.tstamp desc limit ' + limit, function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});
app.post('/deletelesson',function(req,res) {
	var lesson_id = req.body.lesson_id;
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var query = "DELETE from lesson WHERE lesson_id = "+lesson_id+""
	  console.log(query)
	  connection.query(query);
	});
});
app.post('/updatelesson',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var lesson_id = req.body.lesson_id;
	  var title = req.body.title;
	  var description = req.body.description;
	  var cover = req.body.cover
		console.log('lesson_id: ' + lesson_id);
		console.log('title: ' + title);
		console.log('description: ' + description);
		console.log('cover: ' + cover);
		var query = 'update lesson set title = "'+ title + '", description = "'+ description+'" , cover = "'+cover+'" WHERE lesson_id = ' + lesson_id;
		console.log(query);
		connection.query(query, function(err2, rows2, field2) {
				connection.release();
			});

	});
});
app.get('/yearsales/:date/:course_id', function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var course_id = req.params.course_id
	var date = req.params.date
	var year = date.substring(0,4)
	var month = date.substring(5,7)
	var intMonth = parseInt(month)
	var allMonth = []
	var query = 'select\n'
	for(i = 1; i<= intMonth; i++) {
		var month = 'january'
		if (i == 1) {
			month = 'january'
		}
		else if (i == 2) {
			month = 'february'
		}
		else if (i == 3) {
			month = 'march'
		}
		else if (i == 4) {
			month = 'april'
		}
		else if (i == 5) {
			month = 'may'
		}
		else if (i == 6) {
			month = 'june'
		}
		else if (i == 7) {
			month = 'july'
		}
		else if (i == 8) {
			month = 'august'
		}
		else if (i == 9) {
			month = 'setember'
		}
		else if (i == 10) {
			month = 'october'
		}
		else if (i == 11) {
			month = 'november'
		}
		else if (i == 12) {
			month = 'december'
		}
		var iString = i.toString();
		if(iString.length == 1) {
			if(i == intMonth) {
				query += " count(case when tstamp like '" + year + "-0" + i + "%' then 1 end) as " + month + '\n'
			} else {
				query += " count(case when tstamp like '" + year + "-0" + i + "%' then 1 end) as " + month + ',\n'
			}
		} else {
			if(i == intMonth) {
				query += " count(case when tstamp like '" + year + "-" + i + "%' then 1 end) as " + month + '\n'
			} else {
				query += " count(case when tstamp like '" + year + "-" + i + "%' then 1 end) as " + month + ',\n'
			}
		}
		allMonth.push(iString)
		// console.log('iString: ' + iString)
		if(i == intMonth) {
			query += ' from course_purchase where course_id = '+ course_id
			console.log("end: " + query)
			connection.query(query, function(err, rows, field) {
				res.json(rows);
				connection.release();
			});

		}
	}
	});

});
app.get('/getlastpurchase',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
			connection.query('SELECT SUM(price) as sum FROM `course_purchase`', function(err, rows, field) {
				res.json(rows)
				connection.release();
			});
	  });
});
app.get('/getlastpurchase/:numday',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var numday = req.params.numday
			connection.query('SELECT SUM(price) as sum FROM `course_purchase` WHERE DATE(tstamp) > (NOW() - INTERVAL ' + numday + ' DAY) ', function(err, rows, field) {
				res.json(rows)
				connection.release();
			});
	  });
});
app.get('/checklogin/:username/:password',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var username = req.params.username
	  var password = req.params.password
			connection.query("SELECT admin_id, fname, lname, email, avatar FROM `admin` where username = SHA2('"+username+"',512) and password = SHA2('"+password+"',512)", function(err, rows, field) {
				res.send(rows)
				connection.release();
			});
	  });
});

app.get('/getlastchat/',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
			connection.query("SELECT user_id from chat GROUP by user_id  ORDER BY max(tstamp) desc", function(err, rows, field) {
				res.send(rows)
				connection.release();
			});
	  });
});
app.get('/getlastchat/:userid',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var userid = req.params.userid
			connection.query("select c.user_id,c.admin_id, u.fname, u.lname,u.avatar, c.text, DATE_FORMAT(c.tstamp, '%Y-%m-%d %H:%i:%s') AS tstamp,c.type from chat c, user u where c.user_id = "+userid+" and u.user_id = "+userid+" order by c.tstamp desc limit 1", function(err, rows, field) {
				res.send(rows)
				connection.release();
			});
	  });
});

app.post('/postchat',function(req,res) {
	console.log("postchat");
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var admin_id = req.body.admin_id
	  var user_id = req.body.user_id
	  var text = req.body.text
	  var tstamp = req.body.tstamp
	  var type = req.body.type
	  var query = "INSERT INTO chat VALUES ("+user_id+","+admin_id+",'"+text+"','"+tstamp+"','"+type+"')";
	  console.log(query);
			connection.query(query, function(err, rows, field) {
				connection.release();
			});
	  });
});

app.get('/getchat/:userid',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var userid = req.params.userid
			connection.query("SELECT user_id,admin_id,text,DATE_FORMAT(tstamp, '%Y-%m-%d %H:%i:%s') AS tstamp,type FROM `chat` where user_id = "+userid+" ORDER BY tstamp desc limit 10", function(err, rows, field) {
				res.send(rows)
				connection.release();
			});
	  });
});
app.get('/usercourse/:userid', function (req, res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var userid = req.params.userid

			connection.query("SELECT cl.user_id, c.cover, cl.course_id, DATE_FORMAT(cl.tstamp, '%Y-%m-%d %H:%i:%s') AS tstamp,  c.title FROM course_purchase cl, course c WHERE cl.course_id = c.course_id and user_id = "+userid+" ORDER BY `user_id`  DESC", function(err, rows, field) {
				res.send(rows)
				connection.release();
			});
	  });
});
app.post('/updatecourse', function (req, res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var course_id = req.body.course_id
	  var description = req.body.description
	  var query = "update course set description = '"+description+"' WHERE course_id = "+course_id;
	  console.log(query);
			connection.query(query, function(err, rows, field) {
				connection.release();
			});
	  });
});
app.post('/insertlesson', function(req,res){
	mysqlPool.getConnection(function(error,connection) {
    var course_id = req.body.course_id
	var admin_id = req.body.admin_id
		var title = req.body.title
		var cover = req.body.cover
		var tstamp = req.body.tstamp
    var query = "INSERT INTO lesson(course_id,admin_id,title,cover, tstamp) VALUES("+course_id+","+admin_id+",'"+title+"','"+cover+"','"+tstamp+"')"
	console.log(query)
    connection.query(query, function (error, results, fields) {
    if (error) throw error;
      console.log("lesson_id = " + results.insertId);
    var data = {
      lesson_id: results.insertId
    }
    res.json(data);

  });
  console.log(query)

	});
});
app.post('/insertcourse', function(req,res){
	mysqlPool.getConnection(function(error,connection) {
	var admin_id = req.body.admin_id
	var title = req.body.title
	var description = req.body.description
	var cover = req.body.cover
	var price = req.body.price
	var tstamp = req.body.tstamp

    var query = "INSERT INTO course(admin_id,title,description,cover,price,tstamp) VALUES("+admin_id+",'"+title+"','"+description+"','"+cover+"',"+price+",'"+tstamp+"')"
	console.log(query)
    connection.query(query, function (error, results, fields) {
    if (error) throw error;
      console.log("lesson_id = " + results.insertId);
    var data = {
      course_id: results.insertId
    }
    res.json(data);

  });
  console.log(query)

	});
});
app.post('/deletecourse',function(req,res) {
	var course_id = req.body.course_id;
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var query = "DELETE FROM course WHERE course_id = " + course_id;
	  console.log(query)
	  connection.query(query);
	});
});
app.get('/getrecommend',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  connection.query("SELECT u.user_id, u.fname, u.lname, u.avatar, u.account_number, r.status , r.tstamp FROM user u INNER JOIN recommend r ON r.user_id = u.user_id", function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});
app.post('/setrecommend',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var user_id = req.body.user_id
	  var status = req.body.status
	  var query = "UPDATE recommend set status = "+status+" WHERE user_id = " + user_id;
	  connection.query(query);
	});
});
app.get('/check_noti_recommend/:user_id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  var user_id = req.params.user_id
	  if(err) throw err;
	  connection.query("SELECT COUNT(*) as count from user u INNER JOIN recommend r ON r.user_id = u.user_id WHERE u.user_id = "+user_id+" and u.account_number IS NOT NULL", function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});
app.get('/getlesson/:id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var id = req.params.id
	  connection.query("SELECT l.lesson_id, l.course_id, l.admin_id, l.title, l.cover , DATE_FORMAT(l.tstamp, '%Y-%m-%d %H:%i:%s') AS tstamp,a.fname,a.lname,a.avatar FROM `lesson` l LEFT JOIN admin a ON a.admin_id = l.admin_id WHERE course_id = "+id+" ORDER BY tstamp DESC", function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});

app.get('/getvideo/:lesson_id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var lesson_id = req.params.lesson_id
	  var query = "SELECT * FROM lesson_video WHERE lesson_id = "+lesson_id+" ORDER BY tstamp ";
	  connection.query(query, function(err, rows) {
		res.json(rows);
		connection.release();
	  });
	});
});

app.post('/insertvideo', function(req,res){
	mysqlPool.getConnection(function(error,connection) {
    var lesson_id = req.body.lesson_id
	var title = req.body.title
		var tstamp = req.body.tstamp
    var query = "INSERT INTO lesson_video(lesson_id,title,tstamp) VALUES("+lesson_id+",'"+title+"','"+tstamp+"')"
	console.log(query)
    connection.query(query, function (error, results, fields) {
    if (error) throw error;
      //console.log(results);
    var data = {
      file_id: results.insertId
    }
    res.json(data);

  });
  console.log(query)

	});
});

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

app.post('/add_course_for',function(req,res) {
	var course_id = req.body.course_id;
  var des = req.body.des;
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var query = "INSERT INTO course_for(course_id,for_des) VALUES("+course_id+",'"+des+"')"
	  console.log(query)
    connection.query(query, (error, result) => {
      var data = {
        cf_id: result.insertId
      }
      res.json(data)
    })
	})
})

app.post('/add_course_receive',function(req,res) {
	var course_id = req.body.course_id;
  var des = req.body.des;
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var query = "INSERT INTO course_receive(course_id,receive_des) VALUES("+course_id+",'"+des+"')"
	  console.log(query)
    connection.query(query, (error, result) => {
      var data = {
        cr_id: result.insertId
      }
      res.json(data)
    })
	})
})

app.post('/add_course_include',function(req,res) {
	var course_id = req.body.course_id;
  var des = req.body.des;
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var query = "INSERT INTO course_include(course_id,include_des) VALUES("+course_id+",'"+des+"')"
	  console.log(query)
    connection.query(query, (error, result) => {
      var data = {
        ci_id: result.insertId
      }
      res.json(data)
    })
	})
})


app.post('/remove_course_for',function(req,res) {
	var id = req.body.id
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var query = "DELETE FROM course_for WHERE cf_id = "+id+""
	  console.log(query)
    connection.query(query)
	})
})
app.post('/remove_course_receive',function(req,res) {
	var id = req.body.id
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var query = "DELETE FROM course_receive WHERE cr_id = "+id+""
	  console.log(query)
    connection.query(query)
	})
})

app.post('/remove_course_include',function(req,res) {
	var id = req.body.id
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var query = "DELETE FROM course_include WHERE ci_id = "+id+""
	  console.log(query)
    connection.query(query)
	})
})

app.post('/remove_video_lesson',function(req,res) {
	var video_id = req.body.video_id
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var query = "DELETE from lesson_video WHERE video_id = "+video_id+""
	  console.log(query)
    connection.query(query, (error, result) => {
      res.json(result)
    })
	})
})


app.get('/get_user_recommend_from_id/:user_id',function(req,res) {
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var user_id = req.params.user_id
	  var query = "SELECT r.user_id, r.recommend_to , u.fname, u.lname, u.avatar from recommend r LEFT JOIN user u ON u.user_id = r.recommend_to WHERE r.user_id = " + user_id;
	  connection.query(query, function(err, rows) {
		res.json(rows);
		connection.release();
	  })
	})
})
app.post('/add_lesson_picture',function(req,res) {
	var lesson_id = req.body.lesson_id
  var title = req.body.title
  var picture = req.body.picture
  var tstamp = req.body.tstamp
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var query = "INSERT INTO lesson_picture(lesson_id,title,picture,tstamp) values ("+lesson_id+",'"+title+"','"+picture+"','"+tstamp+"')"
	  // console.log(query)
    connection.query(query, (error, result) => {
      var data = {
        picture_id: result.insertId
      }
      res.json(data)
    })
	})
})
app.post('/remove_picture_lesson',function(req,res) {
	var picture_id = req.body.picture_id
	mysqlPool.getConnection(function(err, connection) {
	  if(err) throw err;
	  var query = "DELETE from lesson_picture WHERE picture_id = "+picture_id+""
	  console.log(query)
    connection.query(query, (error, result) => {
      res.json(result)
    })
	})
})







module.exports = app;
