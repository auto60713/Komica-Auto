var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    path = require('path'),
    mysql = require('mysql');
    


app.use(express.static(path.join(__dirname, '/script')));
app.use(express.static(path.join(__dirname, '/views')));



app.get('/', function (req, res) {
  res.sendfile(__dirname + '/home.html');
});


//==============================================================
server.listen(200);
 console.log('伺服器開啟 localhost:200');

//==============================================================
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'komica'
});


connection.connect();

//==============================================================
io.sockets.on('connection', function (socket) {


  
 	    //進入網頁後 先從資料庫把舊文章提出來
      socket.on('loadpaper',function() {      

            connection.query('SELECT * FROM paper ORDER BY id ASC', function(err, results){

                  for (var i=0; i<results.length; i++){

                  socket.emit('showpaper', results[i].id, results[i].content, results[i].time);
                  }

            });   

      });

      //進入網頁後 先從資料庫把舊留言提出來
      socket.on('loadmzg',function() {      

            connection.query('SELECT * FROM mzg ORDER BY id ASC', function(err, results){

                  for (var i=0; i<results.length; i++){

                  socket.emit('showmzg', results[i].paperid, results[i].content, results[i].time);
                  }

            });   

      });


      //當有人發文時
      socket.on('newpaper', function(content) {

            connection.query('INSERT INTO paper SET content=?, time=now()',[content],

                  function(error){
                  if(error){   console.log('寫入資料失敗！');   }
            });

            socket.emit('showpaper', "-", content, "-");
      });

      //當有人發留言時
      socket.on('newmzg', function(who,content) {
      console.log('asdasdasd！');
            connection.query('INSERT INTO mzg SET paperid=?, content=?, time=now()',[who,content],

                  function(error){
                  if(error){   console.log('寫入資料失敗！');   }
            });

            socket.emit('showmzg', who, content, "-");
      });


});