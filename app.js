var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    path = require('path'),
    mysql = require('mysql'),
    dateFormat = require('dateformat');

app.use(express.static(path.join(__dirname, 'script')));
app.use(express.static(path.join(__dirname, 'views')));



app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/home.html');
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
                  var date=dateFormat(results[i].time, "yy-mm-dd(H:MM:ss)");
                  socket.emit('showpaper', results[i].id, results[i].content, date, results[i].paperkey);
                  }

            });   

      });

      //進入網頁後 先從資料庫把舊留言提出來
      socket.on('loadmzg',function() {      

            connection.query('SELECT * FROM mzg ORDER BY paperkey ASC', function(err, results){

                  for (var i=0; i<results.length; i++){
                  var date=dateFormat(results[i].time, "yy-mm-dd(H:MM:ss)");
                  socket.emit('showmzg', results[i].paperkey, results[i].content, date);
                  }

            });   

      });


      //當有人發文時
      socket.on('newpaper', function(content) {

var array1 = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");
var key ="";
            for (var i=1; i<=10; i++) {
                index = Math.floor(Math.random() * array1.length);
                key = key +array1[index];
            }

            connection.query('INSERT INTO paper SET content=?, paperkey=?, time=now()',[content,key],

                  function(error){
                  if(error){   console.log('寫入資料失敗！');   }
            });

            io.sockets.emit('showpaper', "-", content, "-", key);
      });

      //當有人發留言時
      socket.on('newmzg', function(key,content) {
      console.log('asdasdasd！');
            connection.query('INSERT INTO mzg SET paperkey=?, content=?, time=now()',[key,content],

                  function(error){
                  if(error){   console.log('寫入資料失敗！');   }
            });

            io.sockets.emit('showmzg', key, content, "-");
      });


});