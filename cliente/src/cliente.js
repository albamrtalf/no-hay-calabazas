function Cliente(id, email){ /* El id viene de mongo */
	this.socket;
	this.nombre; /* Nombre partida */
	this.email = email;
	this.id = id;
	this.num;
	this.veg; //No se si hace falta
	this.cargarConfiguracion = function() {
		this.socket.emit('configuracion', this.nombre);
	};
	this.unirmeAPartida = function(){		
    	this.socket.emit('unirme',this.nombre);
	};
	this.nuevoJugador = function() {
		this.socket.emit('nuevoJugador', {room:this.nombre, id:this.id}); /* El cliente espera */
	}; // Fin nuevoJugador
	this.enviarPosicion=function(x,y,ang, puntos, tiempo){
		this.socket.emit('posicion', this.nombre, {"id":this.id,"email":this.email,"x":x,"y":y,"ang":ang, "puntos":puntos, "tiempo":tiempo});
	}; // Fin enviarPosicion
	this.ini = function(nombre, num){
		// this.id = randomInt(1,1000);
		this.socket = io.connect(); /* Conectamos con el servidor */
		this.nombre = nombre;
		this.num = num;
		this.lanzarSocketSrv(); /* Podemos lanzarlo aqui o en ini.js */
	}; /* Fin ini */
	this.volverAJugar = function() {
		this.socket.emit('volverAJugar',this.nombre);
	};
	this.reset=function(){
		this.id=id;
	};
	this.lanzarSocketSrv = function(){
		var cli = this;
		this.socket.on('connect', function() { 
		   cli.socket.emit('room', cli.id,cli.nombre,cli.num);
		   //cli.socket.emit('room', cli.id, cli.nombre,cli.num);
		   console.log("envio room");
		   cli.cargarConfiguracion();
		});
		this.socket.on('coord', function(data, objetivo) {
			//this.coord = data;
			game.state.start('Game', true, false, data, objetivo);
		});
		this.socket.on('faltaUno', function(data) {
			console.log('Falta un jugador');
			juego.faltaUno();
		});
		this.socket.on('aJugar', function(data) {
			for(var jug in data) {
				console.log('aJugar: ', data[jug]);
				// juego.agregarJugador(data[jug].id, data[jug].x, data[jug].y, data[jug].veg);
			   juego.agregarJugador(data[jug]);
			}
		});
		this.socket.on('final', function(data) { // data = idGanador
			juego.finalizar(data);
		});
		this.socket.on('crearJugador', function(data){
			juego.agregarJugador(data.id, data.x, data.y);
		});
		/**this.socket.on('todos', function(data){
			console.log(data);
			for(var i = 0; i < data.length; i++){
					juego.agregarJugador(data[i].id, data[i].x, data[i].y);
			}
		});**/
		this.socket.on('movimiento',function(data){ 
		    juego.moverNave(data); 
		});
		this.socket.on('reset',function(data){ 
		    juego.volverAJugar(data);
		});
		this.socket.on('ganador',function(data){	
			juego.finJuego(data.id);
		    //juego.moverNave(data.id,data.x,data.y,data.ang);        
		});
	} // Fin lanzarSocketSrv
	//this.ini();

} // Fin Cliente

function randomInt(low, hight){
	return Math.floor(Math.random() * (hight - low) + low);
} // Fin randomInt