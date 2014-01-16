var url = location.href
  , cut = url.split("?")
  , val = cut[1].split("=")
  , paperid = val[1];
  
$('#add').click(function(){

    var content = $('#content').val();
    socket.emit('newreply', paperid , content);
    $('#content').val("");

})

