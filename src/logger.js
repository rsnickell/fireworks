function logMsg(msg){
    if(window.console){
        var d = new Date();
        console.log(d + ' ' + msg);
    }
}