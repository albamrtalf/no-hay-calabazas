function com() {
	this.lanzarSocketServer = function(io, juego) {
		io.on('connection',function(socket){
    		socket.on('room', function(id,room,num) {
		    	console.log('nuevo cliente: ',id,room,num);
			    juego.nuevaPartida(id,room,num, function(nombre) {
			  		socket.join(nombre);
      			});
    		});
		    //socket.on('unirme', function(id,room,num) {
		    socket.on('unirme', function(room) {
		        //console.log('nuevo cliente: ',id,room,num);
		        //juego.nuevaPartida(id,room,num,socket);
		        socket.join(room);
    		});
		    socket.on('configuracion',function(room){
		        if (juego.partidas[room]) { /* Cuando se queda un cliente huerfano */
		        	juego.partidas[room].iniciar(function(mens, data){
		           		socket.emit(mens, data);
		           	});
		        }
		    });
		    socket.on('nuevoJugador', function(data){
		        //if (juego.partidas[data.room]) { /* Cuando se queda un cliente huerfano */
		        juego.partidas[data.room].agregarJugador(data.id, function(mens, datos) {
		       		io.sockets.in(data.room).emit(mens, datos);
		        });  
		    });
	    	socket.on('posicion', function(room, data){
	        	//if (juego.partidas[room]) { /* Cuando se queda un cliente huerfano */
		        juego.partidas[room].movimiento(data, function(mens, datos){
		        	if (mens != 'final') {
		        		socket.broadcast.to(room).emit(mens, datos);
		        	}
		        	else
		        	{
		        		io.sockets.in(room).emit(mens, datos);
		        	}
		        });
		    });
		    socket.on('volverAJugar', function(room){
		        console.log(juego.partidas[room]);
		        if (juego.partidas[room]) { /* Cuando se queda un cliente huerfano */
			        juego.partidas[room].volverAJugar(function(mens, datos){
		    	    	io.sockets.in(room).emit(mens, datos);
	        		});
        		}
		    });
		}); // Fin io.on
	}
}
module.exports.com = com;