var modelo=require("./modelo.js");

xdescribe("El juego No-Hay-Calabazas...",function(){        
    var juego = new modelo.Juego();  

    it('El juego tiene ',function(){
    	expect(juego.usuarios).toEqual({});
    	expect(juego.partidas).toEqual({});
    	expect(juego.persistencia).toBeDefined({});
    	
    });
    it('El usuario patata@patata.com con clave patata se registra', function(done){
    	juego.conectar(function() {
	    	juego.registrarUsuario('patata@patata.com', ' pass1234', function(usr){
	    		expect(usr.email).toEqual('ok');
	    		done();
	    	});	    	
    	});
    });
    it('El usuario patata@patata.com confirma su cuenta', function(done){
    	juego.obtenerKeyUsuario('patata@patata.com', 'pass1234', function(datos) {
	    	var key = datos.key;
	    	juego.confirmarUsuario('patata@patata.com', key, function(usr){
	    		expect(usr.confirmada).toEqual(true);
	    		done();
	    	});    	
    	});
    });
});

describe("El juego No-Hay-Calabazas...", function() {
    var juego = new modelo.Juego();  
    var uid;
	var coord;

	it('El usuario patata@patata.com con clave patata se ya existe', function(done){
	   	juego.conectar(function() {
	    	juego.registrarUsuario('patata@patata.com', ' pass1234', function(usr){
	    		expect(usr.email).toEqual(undefined);
	    		done();
	    	});	    	
	  	});
	});
	it('El usuario patata@patata.com inicia sesion', function(done) {
		juego.iniciarSesion('patata@patata.com', 'pass1234', function(usr) {
			uid = usr._id;
			expect(usr.email).toEqual("patata@patata.com");
			done();
		});
	});
	it('patata@patata.com crea una partida individual prueba', function(done) {
		juego.nuevaPartida(uid, 'prueba', 1, function(nombres) {
			expect(nombre).toEqual('prueba');
			expect(juego.partidas[nombre].estado.esInicial()).toEqual(true);
			done();
		});
	});
	it('se obtiene la configuracion de la partida', function(done) {
		juego.partidas['prueba'].iniciar(function(mens, data) {
			coord = data;
			expect(mens).toEqual('coord');
			expect(data).toBeDefined();
			done();
		});
	});
	it('se agrega el usuario a la partida', function(done) {
		juego.partidas['prueba'].agregaJugador(uid, function(mens, datos) {
			expect(mensa).toEqual('prueba');
			expect(datos[uid].id).toEqual(uid);
			done();
		});
	});
	it('El estado del juego ya no es inicial', function() {
		expect(juego.partidas['prueba'].estado.esInicial()).toEqual(false);
		done();
	});

	for(var i=0;i<10;i++){
        it("El usuario pepe@pepe.es comienza ajugar",function(done){
            var data;
            var puntos=0;              
            x=coord[i].x;
            y=coord[i].y;
            data={"id":uid,"x":x,"y":y,"ang":0,"puntos":puntos,"tiempo":0};
            juego.partidas['prueba'].movimiento(data,function(mens,datos){
		        if (mens!='final'){
		            expect(mens).toEqual('movimiento');
		        }
		        else{
	                expect(mens).toEqual('final');
	            }
	            puntos++;
	            done();
        	});                   
        });
    }
});