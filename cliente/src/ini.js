var game;
var juego;
var finJuego;
var cliente;
var num;
var com; // Agrupar todas las llamadas al API rest

function borrar(){
	$("#cnt1").remove();
	$("#cab").remove();
	$('#sel1').remove();
	$('#formSel').remove();
	$('#lbl').remove();
	$('#cab').remove();
  	$('#par').remove();
	$('#nombre').remove();
	$('#btn').remove(); 
	$('.video-background').remove(); 
}
function mostrarIntroducirPartida() {
	limpiar();
	$('#cabecera').remove();
	$('#cabecera').remove();

	var cadena = " ";
	cadena = "<div id='titulo'><h2><font color='yellow'>ERES UN VERDADERO JEDI?</font></h2></div>";
	cadena=cadena+"<div class='partidainicio'><form class='form-inline'><div class='form-group'><label id='lbl'><font color='white'>Partida:</font></label> ";
	cadena=cadena+'<input id="nombre" class="form-control" type="text" placeholder="nombre partida"> <label id="lbl"><font color="white">Jugadores:</font></label> <select class="form-control" id="sel2"> <option>1</option><option>2</option></select>';
	cadena=cadena+'<button type="button" class="btn btn-primary" id="btn">Nueva partida</button></form>';
	cadena=cadena+'</div></div>';

	$('#partida').append(cadena);
	$('#btn').on('click', function() {
		var nombre = $('#nombre').val();
		var num=$('#sel2').val();
		if (nombre != ""){
			borrar();
			cliente.ini(nombre, num);
			mostrarCanvas();
		}
	});
}

function mostrarIniciarPartida(usr) {
	cliente = new Cliente(usr._id, usr.email);
	mostrarIntroducirPartida();
	com.obtenerPartidas();
}

function listaPartidas(lista){
	var cadena;

	cadena="<form class='form-inline'><select class='form-control' id='sel1'>"

	for(var i=0;i<lista.length;i++){
        cadena=cadena+"<option>"+lista[i]+"</option>"
	}
	cadena=cadena+"</select> ";
	cadena=cadena+"<button type='button' class='btn btn-primary' id='unirmeBtn'>Unirme a partida</button></form>";
	$('#partida').append(cadena);
	$('#unirmeBtn').on('click',function(){
	  var nombre=$('#sel1').val();
		    if (nombre!=""){
		          borrar();
		          //cliente=new Cliente(nombre,-1);          
		          //cliente.room=nombre;
		          cliente.ini(nombre,-1);
		          cliente.unirmeAPartida();
		          mostrarCanvas();
			}
	});
}

function mostrarCanvas() {
	game = new Phaser.Game(850, 550, Phaser.CANVAS, 'no-hay-calabazas');

	boot=new Boot();
	juego=new Juego();
	finJuego=new FinJuego();

	game.state.add('Boot',boot);
	game.state.add('Game', juego);
	game.state.add('FinJuego', finJuego);
}

