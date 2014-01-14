
$('#add').click(function(){

    var content = $('#content').val();
    socket.emit('newpaper', content);
    $('#content').val("");

})


function mzg(paperkey){

    var content = $('#'+paperkey).val();
    socket.emit('newmzg', paperkey, content);
    $('#'+paperkey).val("")
}



