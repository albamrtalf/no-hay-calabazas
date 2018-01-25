var persistencia=require("./persistencia.js");
var cf=require("./cifrado.js");
var moduloEmail=require("./email.js");
var _ = require("underscore");
var ObjectID=require("mongodb").ObjectID;

function Juego() {
	this.partidas = {};
	this.usuarios = {};
	this.persistencia = new persistencia.Persistencia();
	this.obtenerUsuario = function(id) {
		return _.find(this.usuarios,function(usu){
            return usu._id==id
        });
	}

    this.obtenerKeyUsuario=function(email,adminKey,callback){
        if (adminKey=="admin")
        {
            this.persistencia.encontrarUsuarioCriterio({email:email,confirmada:false},function(usr){
                if (!usr){
                    callback({key:""});
                }
                else{
                    callback({key:usr.key});
                }
            });
        }
        else
        {
            callback({key:""});
        }
    }


	this.nuevaPartida=function(id,nombre,num,callback){
		if (this.usuarios[id] != null){
			if (this.partidas[nombre]==null){
			    this.partidas[nombre]=new Partida(nombre,num, this);
			}
			  //socket.join(nombre);
			  callback(nombre);
		}
	}
	this.iniciarSesion=function(email,pass,callback){
        var ju=this;
        var passCifrada=cf.encrypt(pass);
    	this.persistencia.encontrarUsuarioCriterio({email:email,pass:passCifrada,confirmada:true},function(usr){
	        if (!usr){ /* Si no hay usuarios */
	            callback({'email':''}); 
	        }
	        else{
                ju.usuarios[usr._id]=usr;                        
            	callback(usr);
	        }
	    });
	}

	this.registrarUsuario=function(email,pass,callback){
        var ju=this;
        var passCifrada=cf.encrypt(pass);
        var key=(new Date().valueOf()).toString();
        this.persistencia.encontrarUsuarioCriterio({email:email},function(usr){
	        if(!usr){
	            ju.persistencia.insertarUsuario({email:email,pass:passCifrada,key:key,confirmada:false},function(usu){
	                callback({email:'ok'});
	                moduloEmail.enviarEmail(usu.email, usu.key, "Confirmar su correo en este enlace: ");
	            });
	        }
	        else{
	                callback({email:undefined});
	        }
	    });
	}

	this.confirmarUsuario=function(email,key,callback){
		var pers = this.persistencia;
        this.persistencia.confirmarCuenta(email,key,function(usr){
        if (!usr){
            callback(undefined);
        }
        else{
            usr.confirmada=true;
            pers.modificarColeccionUsuarios(usr,function(result){
                callback(usr);
            });
        }
	    });
    }

	this.unirme = function(nombre,callback){
		//socket.join(nombre);
		callback(nombre);
	}

	this.actualizarUsuario=function(nuevo,callback){
        //this.comprobarCambios(nuevo);
        //var usu=this;
        var oldC=cf.encrypt(nuevo.oldpass);
        var newC=cf.encrypt(nuevo.newpass);
        var pers=this.persistencia;
        this.persistencia.encontrarUsuarioCriterio({email:nuevo.email,pass:oldC},function(usr){
            if(usr){
                usr.pass=newC;
            	pers.modificarColeccionUsuarios(usr,function(nusu){
                   console.log("Usuario modificado");
                   callback(usr);
            	});
            }
            else{
                callback({email:undefined});        
            }
        });
    }

	this.obtenerPartidas = function(callback){
		var lista = [];
		for (var key in this.partidas) {
		    if (this.partidas[key].estado.esInicial()){
		    	lista.push(key);
		    }
		}
		callback(lista);
	}
	/*this.agregarResultado = function(data) {
		// buscar el email de data.id
		this.persistencia.insertarResultado(data, function(res){
			console.log("Resultado insertado");
		});
	}*/
	this.agregarResultado=function(res){
        this.persistencia.insertarResultado(res,function(usu){
            if(usu){
                console.log("Resultado insertado");
            }
            else{
                console.log("Problemas al insertar");            
            }   
        });
	}
	this.obtenerResultados = function(callback){
		this.persistencia.encontrarTodosResultados(function(res) {
			callback(res);
		})
	}
	this.eliminarUsuario=function(uid,callback){
                var json={'resultados':-1};
                if (ObjectID.isValid(uid)){
                        this.persistencia.eliminarUsuario(uid,function(result){
                    if (result.result.n==0){
                        console.log("No se pudo eliminar de usuarios");
                    }
                    else{
                        json={"resultados":1};
                        console.log("Usuario eliminado de usuarios");
                        callback(json);
                    }
                }); 
                }
            else{
                    callback(json);
            }
        }
	this.conectar = function(callback){
		this.persistencia.conectar(function(db){ // Metodo del objeto persistencia
	                callback("conectado a la base de datos");
	    });
	}
}

var nombres = ['cherry', 'orange', 'garlic', 'apple', 'green pepper', 'nose', 'carrot', 'cucumber', 'strawberry', 'broccoli', 'pineapple', 'watermelon', 'turnip', 'potato', 'banana', 'lettuce', 'khaki', 'chilli', 'corn', 'papaya', 'eggplant', 'chard', 'red pepper', 'big champignon', 'onion','dark grapes','tomato','cabbage','champignon', 'lemon', 'white grape', 'mushrooms', 'cantaloupe', 'pinion', 'water melon', 'leek', 'riceball'];

function Partida(nombre, num, juego) {
	this.estado = new Inicial();
	this.jugadores = {}; // Inicializado como un objeto json
	//this.veggie = 16;
	this.juego = juego;
	this.nombre = nombre;
	this.veg; //random(0,35)
	//this.socket;
	this.coord=[];
	//this.io;
	this.numJugadores = num;
	this.objetivoNumFruta = 5;
	this.nave = 'nave';
	this.callback;
	this.iniciar = function(callback) {
		//this.socket = socket;
		//this.io = io;
		//this.socket.emit('coord', this.coord, this.objetivo);
		callback('coord', this.coord);
	}
	this.agregarJugador = function(id, callback) {
		//this.socket = socket;
		this.callback = callback;
		this.estado.agregarJugador(id, this);
	}
	this.puedeAgregarJugador = function(id) {
		if (this.jugadores[id] == null) {
			this.jugadores[id] = new Jugador(id, this.veg, this.nave);
			this.veg++;
			this.nave='nave2';
		}
		if (Object.keys(this.jugadores).length>=this.numJugadores){			
			this.estado = new Jugar();
			this.enviarAJugar();
		} else {
			this.enviarFaltaUno();
		}
	}
	this.enviarFaltaUno = function() {
		this.callback('faltaUno' , null);
		//this.io.sockets.in(this.nombre).emit('faltaUno');
	}
	this.enviarAJugar = function() {
		this.callback('aJugar', this.jugadores);
		//this.io.sockets.in(this.nombre).emit('aJugar', this.jugadores);
        //this.socket.broadcast.to(this.nombre).emit('aJugar', this.jugadores);
	}
	this.movimiento = function (data, callback) {
		//this.socket = socket;
		this.callback = callback;
		this.estado.movimiento(data, this);
	}
	this.puedeMover = function(data) {
		if (data.puntos >= this.objetivoNumFruta) {
			this.estado = new Final();
			this.enviarFinal(data.id);
			var fecha=Date.now();
			this.juego.agregarResultado({"email":data.email,"fecha":fecha,"usuario":data.id,"nivel":this.objetivoNumFruta,"tiempo":data.tiempo});
			console.log('Tiempo: ' + data.tiempo);
		} else {
			this.callback('movimiento', data);
			//this.socket.broadcast.to(this.nombre).emit('movimiento',data)
		}
	} 
	this.enviarFinal = function(idGanador){
		//this.io.sockets.in(this.nombre).emit('final',idGanador);
		//this.socket.broadcast.to(this.nombre).emit('final',idGanador);	
		this.callback('final', idGanador);
	}
	this.volverAJugar = function(callback){
	  //this.socket = socket;
	  this.callback = callback;
	  //this.objetivoNumFruta =+ 5;
	  this.estado.volverAJugar(this);
	}
	this.reset = function(){
		this.estado.reset(this);
	}
	this.reiniciar = function(){
	  this.jugadores = {};
	  this.coord = [];
	  this.ini();
	  this.nave ='nave'; /**/
	  this.estado = new Inicial();
	  this.callback('reset', this.coord);
	  //this.io.sockets.in(this.nombre).emit('reset',this.coord);
	  //this.socket.broadcast.to(this.nombre).emit('reset',this.coord);
	}
    this.ini=function(){
        this.veg=randomInt(0,11);
        var otra=this.veg+1;
        //this.veg = 1;
        this.objetivo = this.veg;

        //console.log(this.veg,"--",otra);
        for(var i=0;i<this.objetivoNumFruta;i++){
            this.coord.push({'veg':this.veg,'x':randomInt(10,720),'y':randomInt(25,520)});
        }
        for(var i=0;i<this.objetivoNumFruta;i++){
            this.coord.push({'veg':otra,'x':randomInt(10,720),'y':randomInt(25,520)});
        }
        var alea;
        for(var i=0;i<30;i++){
	        do {
	            alea=randomInt(0,12);
	        }while(alea==this.veg || alea==otra)
		        this.coord.push({'veg':alea,'x':randomInt(10,720),'y':randomInt(12,520)});
	    }
    }

    this.ini();
} // Fin Juego
function randomInt(low, hight){
	return Math.floor(Math.random() * (hight - low) + low);
} // Fin randomInt
function Jugador(id, veg, nave) {
	this.id = id;
	this.x = randomInt(400,60);
	this.y = randomInt(100,400);
	this.veg = veg;
	this.nave = nave;
} // Fin Jugador
function Inicial() {
	this.agregarJugador = function(id, juego) {
		juego.puedeAgregarJugador(id);
	}
	this.movimiento = function (data, juego) {
		console.log('No se puede mover la nave');
	}
	this.esInicial = function(){
		return true;
	}
	this.reset = function(){
		console.log('Reset en estado Inicial');
	}
	this.volverAJugar = function(juego){
		juego.reiniciar();
	}
} // Fin Inicial
function Jugar() {
	this.agregarJugador = function(id, juego) { // Si se esta jugando ya
		console.log('No se pueden agregar jugadores');
	}
	this.esJugar=function(){
        return true;
    }
	this.movimiento = function (data, juego) {
		juego.puedeMover(data);
	}
	this.volverAJugar = function(juego){
	  juego.reiniciar();
	}
	this.esInicial = function(){
		return false;
	}
	this.reset = function(juego){
		juego.reiniciar();
	}
} // Fin Jugar
function Final() {
	this.esInicial = function(){
		return false;
	}
	this.agregarJugador = function(id, juego) { // Si se ha terminado ya la partida
		console.log('No se pueden agregar jugadores');
	}
	this.movimiento = function (data, juego) {
		console.log('No se puede mover la nave');
	}
	this.volverAJugar=function(juego){
	  juego.reiniciar();
	}
} // Fin Fial

module.exports.Juego = Juego;