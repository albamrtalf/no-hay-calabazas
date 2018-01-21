var sendgrid = require("sendgrid")("albamrtalf","a659676212");

//var url="https://no-hay-calabazas.herokuapp.com/";
var url = "http://localhost:5000/";

module.exports.enviarEmail=function(direccion,key,msg){
        var email = new sendgrid.Email();
        email.addTo(direccion);
        email.setFrom('alba.martinez5@alu.uclm.es');
        email.setSubject('confirmar cuenta');
        email.setHtml('<a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'">'+msg+'</a>');

        sendgrid.send(email);        
}

module.exports.enviarEmailResetPassword=function(direccion,key,msg){
        var email = new sendgrid.Email();
        email.addTo(direccion);
        email.setFrom('alba.martinez5@alu.uclm.es');
        email.setSubject('Reiniciar clave');
        email.setHtml('<a href="'+url+'cambiarClave/'+direccion+'/'+key+'">'+msg+'</a>');

        sendgrid.send(email);        
}
