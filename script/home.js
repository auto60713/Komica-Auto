
$('#add').click(function(){

    var content = $('#content').val();
    socket.emit('newpaper', content);
    $('#content').val("");

})




function mzg(who){

    var content = $('#text'+who).val();
    socket.emit('newmzg', who, content);
    $('#text'+who).val("")
}



