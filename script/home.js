
$('#add').click(function(){

    var content = $('#content').val();
    socket.emit('newpaper', content);
    $('#content').val("");

})



