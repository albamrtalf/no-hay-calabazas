var fs=require("fs");
var exp=require("express");
var app=exp(); // El tutorial indicaba exp.createServer()
var http = require('http').Server(app);
var io = require('socket.io').listen(http); // Socket.io server listens to our app
var modelo = require('./servidor/modelo.js');
var juego = new modelo.Juego(); // Importo juego
var bodyParser=require("body-parser");
var comServer = require('./servidor/com.js');
var com = new comServer.com();

app.use(exp.static(__dirname + "/cliente"));

juego.conectar(function(mens) {
    console.log(mens);
});


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

// El get() que hace el navegador al servidor
app.get("/",function(request,response){
	var contenido = fs.readFileSync("./cliente/index.html");
	response.setHeader("Content-Type", "text/html");
	response.send(contenido);
});

app.get('/obtenerPartidas', function(request, response) {
    juego.obtenerPartidas(function(lista){
        response.send(lista);        
    });
});

app.post("/login",function(request,response){
    var email=request.body.email;
    var pass=request.body.password; 
    console.log("registro "+email+" "+pass);   
    if (!pass){
        pass="";
    }
    juego.iniciarSesion(email,pass,function(usr){
        response.send(usr);
    });        
});

app.post("/registro",function(request,response){ /* response corresponde la respuesta al calback */
    var email=request.body.email;
    var pass=request.body.password;    
    if (!pass){
        pass="";
    }
    juego.registrarUsuario(email,pass,function(usr){
        response.send(usr);
    });
});

app.delete("/eliminarUsuario/:uid",function(request,response){
    var uid=request.params.uid;
    juego.eliminarUsuario(uid,function(result){
        response.send(result);
    });
});

app.get("/confirmarUsuario/:email/:key",function(request,response){
    var key=request.params.key;
    var email=request.params.email;
    var usuario;

    juego.confirmarUsuario(email,key,function(usr){
        if (!usr){
            console.log("El usuario no existe o la cuenta ya está activada");
            response.send("<h1>La cuenta ya esta activada</h1>"); /* Hacer web de error */
        }
        else{
            response.redirect("/");
        }
    });
});

app.get("/comprobarUsuario/:id",function(request,response){
    var id=request.params.id;
    var json={'email':''};
    var usr=juego.obtenerUsuario(id);
    if (usr){
        response.send(usr);
    }
    else{
        response.send(json);
    }
});

app.get("/obtenerKeyUsuario/:email/:adminKey",function(request,response){
    var adminKey=request.params.adminKey;
    var email=request.params.email;

    juego.obtenerKeyUsuario(email,adminKey,function(result){
        response.send(result)
    });
});

app.put("/actualizarUsuario",function(request,response){
    juego.actualizarUsuario(request.body,function(result){
            response.send(result);
        });
});

app.get('/obtenerResultados', function(request, response) {
    juego.obtenerResultados(function(lista){
        response.send(lista);        
    });
});

http.listen(app.set('port'), function(){
    console.log('Servidor escuchando en ', app.get('port'));
});

com.lanzarSocketServer(io, juego);