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
  res.sendfile(__dirname + '/views/page1.html');
});

app.get('/reply', function (req, res) {
  res.sendfile(__dirname + '/views/reply.html');
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


  
 	    //進入網頁後 先從資料庫把舊文章提出來(首頁)
      socket.on('loadpaper',function() {      

            connection.query('SELECT * FROM paper ORDER BY id ASC', function(err, results){

                  for (var i=0; i<results.length; i++){
                  var date=dateFormat(results[i].time, "yy-mm-dd(H:MM:ss)");
                  socket.emit('showpaper', results[i].id, results[i].content, date, results[i].paperkey);
                  }

            });   

      });

      //舊文章提出來後 載入相對回覆文章(首頁)
      socket.on('loadreply',function() {      

            connection.query('SELECT * FROM reply ORDER BY time ASC', function(err, results){

                  for (var i=0; i<results.length; i++){
                  var date=dateFormat(results[i].time, "yy-mm-dd(H:MM:ss)");
                  socket.emit('showreply', results[i].paperid, results[i].content, date);
                  }

            });   

      });



      //當有人發文時(首頁)
      socket.on('newpaper', function(content) {


            connection.query('INSERT INTO paper SET content=?, time=now()',[content],

                  function(error){
                  if(error){   console.log('寫入資料失敗！');   }
            });

            io.sockets.emit('showpaper', "-", content, "-");
      });




      //提領要回覆的文章(返信頁)
      socket.on('replypaper',function(id) {      

            connection.query('SELECT * FROM paper where id ='+id, function(err, results){
    
                  var date=dateFormat(results[0].time, "yy-mm-dd(H:MM:ss)");
                  socket.emit('showpaper', results[0].id, results[0].content, date);
                  
            });   

      });

      //只載入指定文章的回覆文章(返信頁)
      socket.on('reply',function(id) {      

            connection.query('SELECT * FROM reply where paperid ='+id, function(err, results){

                  for (var i=0; i<results.length; i++){
                  var date=dateFormat(results[i].time, "yy-mm-dd(H:MM:ss)");
                  socket.emit('showreply', results[i].paperid, results[i].content, date);
                  }

            });   

      });


      //當有人回覆時(返信頁)
      socket.on('newreply', function(paperid,content) {

            connection.query('INSERT INTO reply SET paperid=?, content=?, time=now()',[paperid,content],

                  function(error){
                  if(error){   console.log('寫入資料失敗！');   }
            });

            io.sockets.emit('showreply', paperid, content, "-");
      });





      










});