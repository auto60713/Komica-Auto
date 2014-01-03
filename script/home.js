
$('#add').click(function(){

    var content = $('#content').val();
    socket.emit('newpaper', content);
    $('#content').val("");

})




function mzg(who){

    var data = $('#text'+who).val();
    alert(data);

}



