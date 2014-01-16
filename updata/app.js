var app = require('express')()
  , server = require('http').createServer(app)
  , fs = require('fs')
  , util = require('util')
  , formidable = require('formidable');


server.listen(8080);

console.log('HTTP伺服器在 http://localhost:8080/ 上運行');



app.get('/', function (req, res) {
  res.sendfile(__dirname + '/home.html');
});

app.post('/upload', function (req, res) {
  upload(req, res);
});



function upload(request , response) {

  var form = new formidable.IncomingForm();

  form.parse(request, function(error, fields, files) {


    var readStream = fs.createReadStream(files.upload.path)
    var writeStream = fs.createWriteStream( "./upload/test.png" );
     
    util.pump(readStream, writeStream, function () {
        fs.unlinkSync(files.upload.path);
    });

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("<head><meta http-equiv='refresh' content='5;url=/' charset='UTF-8'></head>");
    response.write("檔案上傳成功! 5秒後回到首頁..");
    response.end();


  });
}