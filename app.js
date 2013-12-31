var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , mysql = require('mysql');


server.listen(200);
 console.log('伺服器開啟 localhost:200');

//==============================================================
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/home.html');
});



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


      //當有人發文時
      socket.on('newpaper', function(content) {

            connection.query('INSERT INTO paper SET content=?, time=now()',[content],

                  function(error){
                  if(error){   console.log('寫入資料失敗！');   }
            });

            socket.emit('showpaper', "-", content, "-");
      });




});