function mostrarLogin(){
  limpiar();
  /* Formulario */
 var cadena='<div class="container" id="login"><div class="mainbox col-md-6 col-md-offset-3">';
  cadena=cadena+'<h2 id="cabeceraP"><font color="yellow">INICIO DE SESION</font></h2><div id="ig1" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>';
  cadena=cadena+'<input id="email" type="text" class="form-control" name="email" placeholder="Escribe tu email"></div>';
  cadena=cadena+'<div id="ig2" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>';
  cadena=cadena+'<input id="clave" type="password" class="form-control" name="password" placeholder="Escribe tu clave"></div></div></div>';

  //$('#control').append('<p id="login"><h2 id="cabeceraP">Inicio de sesión</h2><input type="email" id="email" class="form-control" placeholder="introduce tu email" required><input type="password" id="clave" class="form-control" placeholder="introduce tu clave" required></p>');
  $('#cabecera').append(cadena);
  $('#cabecera').append('<p id="nombreBtn"><button type="button" id="nombreBtn" class="btn btn-primary btn-md">Iniciar partida</button></p><a href="#" id="refRecordar">Registrar usuario</a>');//' <a href="#" id="refRegistro" onclick="mostrarRegistro();">Registrar usuario</a>');
  $('#cabecera').append('<h4 id="info"><span class="label label-warning"></span></h4>');
  $('#email').blur(function() {
    var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    if (testEmail.test(this.value) ) 
    {
      $('#nombreBtn').on('click',function(){
        var email=$('#email').val();
        var clave=$('#clave').val();
        //$('#nombre').remove();
        $('#login').remove();
        $('#nombreBtn').remove();   
        limpiar();
        com.loginUsuario(email,clave);
      });
    }
    else {
      mostrarAviso("Debe ser una dirección de email");
      //$("#info span").text("Debe ser una dirección de email");
      //alert('failed');
    }
  });
  $('#refRecordar').on('click',function(){
    //var nombre=$('#email').val();        
    //enviarClave(nombre);
    mostrarRegistro();
  });
}

function mostrarRegistro(){
  //borrarLogin();
  limpiar();

//  $('#home').append('<p id="cabecera"><h2 id="cabeceraP">Registro de usuarios</h2><input type="email" id="email" class="form-control" placeholder="introduce tu email"><input type="password" id="clave" class="form-control" placeholder="introduce tu clave"></p>');
var cadena='<div class="container" id="login"><div class="mainbox col-md-6 col-md-offset-3">';
  cadena=cadena+'<h2 id="cabeceraP"><font id="tab_res" color="yellow" >NUEVO USUARIO</font></h2><div id="ig1" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>';
  cadena=cadena+'<input id="email" type="text" class="form-control" name="email" placeholder="Escribe tu email"></div>';
  cadena=cadena+'<div id="ig12" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>';
  cadena=cadena+'<input id="email2" type="text" class="form-control" name="email" placeholder="Repite el email"></div>';
  cadena=cadena+'<div id="ig2" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>';
  cadena=cadena+'<input id="clave" type="password" class="form-control" placeholder="Escribe tu clave"></div></div></div>';

  //$('#control').append('<p id="login"><h2 id="cabeceraP">Inicio de sesión</h2><input type="email" id="email" class="form-control" placeholder="introduce tu email" required><input type="password" id="clave" class="form-control" placeholder="introduce tu clave" required></p>');
  $('#cabecera').append(cadena);
 
  $('#cabecera').append('<button type="button" id="nombreBtn" class="btn btn-primary btn-md">Registrar usuario</button>');
  $('#cabecera').append('<h4 id="info"><span class="label label-warning"></span></h4>');
  $('#email2').blur(function() {
    var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    var email=$('#email').val();
    var email2=$('#email2').val();
    if (testEmail.test(this.value)&&comprobarEmail(email,email2)) 
    {

        $('#nombreBtn').on('click',function(){  
          var clave=$('#clave').val();      
          $('#nombre').remove();
          $('#nombreBtn').remove();   
          com.registroUsuario(email,clave);
        });
    }
    else {
      mostrarAviso("Debe ser una dirección de email o las direcciones no coinciden");
      //$("#info span").text("Debe ser una dirección de email");
      //alert('failed');
    }
  });
}

function mostrarActualizarEliminar(){
  //borrarLogin();
  limpiar();
  $('#resultados').remove();
  var uid;
  if ($.cookie("usr")!=undefined){
    var usr=JSON.parse($.cookie("usr"));
    uid=usr._id;
  }
  if(uid!=undefined)
  {
    var cadena = '<div id="cabeceraActualizar" class="bg4" style="padding-bottom:15px;">';
    cadena = cadena + '<h2><font id="tab_res" color="yellow" >ACTUALIZAR DATOS DEL USUARIO</font></h2>';
    cadena = cadena + '<table id="tabla_actel" class="table">';
    cadena = cadena + '<tr><td><label>Email: </label></td><td>'+usr.email+'</td></tr>';
    cadena = cadena + '<tr><td><label>Clave anterior: </label></td><td><input type="password" id="oldpass" class="form-control" placeholder="Contraseña anterior:"></span></td></tr>';
    cadena = cadena + '<tr><td><label>Nueva clave: </label></td><td><input type="password" id="newpass" class="form-control" placeholder="introduce tu nueva clave"></td></tr>';
    cadena = cadena + '<tr><td><label>Repite la nueva clave </label></td><td><input type="password" id="newpass2" class="form-control" placeholder="repite la nueva clave"></td></tr></table> ';
    cadena = cadena + '<p><button type="button" id="actualizarBtn" class="btn btn-primary btn-md">Actualizar usuario</button> <button type="button" id="eliminarBtn" class="btn btn-danger btn-md">Eliminar usuario</button></div>';
    cadena = cadena + '<h4 id="info"><span class="label label-warning"></span></h4>';
    $('#cabeceraActualizar').append(cadena);
    $('#partida').remove();
    $('#actualizarBtn').on('click',function(){
      var oldpass=$('#oldpass').val();
      var newpass=$('#newpass').val();
      var newpass2=$('#newpass2').val();
      console.log(usr.pass);
      console.log(oldpass);
      //if (oldpass == usr.pass) {
        if (oldpass=="" && newpass=="" && newpass2==""){
          mostrarAviso("No se han introducido parametros");
        } else if ((oldpass != newpass) && (oldpass != newpass2) && (newpass == newpass2)){
          //$('#actualizarBtn').remove();   
          com.actualizarUsuario(oldpass,newpass,newpass2);
          alert("Contraseña cambiada");
          $('#cabeceraActualizar').remove();
        reset();
        } else {
          mostrarAviso("Datos introducidos incorrectos");
        }
      /*} else {
        mostrarAviso("Contraseña antigua incorrecta");
      }*/
    });
    $('#eliminarBtn').on('click',function(){
      var oldpass=$('#oldpass').val();
      if (oldpass!=""){
        //var clave=$('#clave').val();
        $('#nombre').remove();
        //$('#eliminarBtn').remove();   
        com.eliminarUsuario();
      }
      else
        mostrarAviso('Introduce tu clave');
    });
  }
  else{
    mostrarLogin();
  }
}


function eliminarGame(){
  if (game && game.state!=null) {
    game.destroy();
    location.reload();
  }
}

function mostrarResultados(datos){
  //eliminarGame();
  limpiar();
 $('#partida').remove();
  //var cadena="<div class='panel panel-default' id='res'><div class='panel-heading'><h4>Resultados</h4></div>";
  //cadena=cadena+"<div class='panel-body'>";
  
  var cadena='<div id="tab" class="datagrid"><h3><font id="tab_res" color="yellow" >RESULTADOS</font></h3><ul class="nav nav-tabs bg4">';
  cadena=cadena+'<li class="active"><a href="#todos" data-toggle="tab">Todos</a></li>'
  cadena=cadena+'<li><a href="#mislogros" data-toggle="tab">Mis logros</a></li>'
  cadena=cadena+'<li><a href="#losmejores" data-toggle="tab">Los mejores</a></li></ul>'
  cadena=cadena+'<div class="tab-content">';
  cadena=cadena+"<div class='tab-pane active' id='todos'>";
  cadena=cadena+obtenerTodos(datos);
  cadena=cadena+'</div>';
  cadena=cadena+"<div class='tab-pane' id='mislogros'>";
  cadena=cadena+obtenerMisLogros(datos);
  cadena=cadena+'</div>';
  cadena=cadena+"<div class='tab-pane' id='losmejores'>";
  cadena=cadena+obtenerLosMejores(datos);
  cadena=cadena+'</div>';
  cadena=cadena+'</div><div class="paging-container" id="demo"> </div>';
  cadena=cadena+'</div>';
  $('#resultados').append(cadena);  
 // mostrarControlPaginas(datos.length); 
}


function obtenerTodos(datos){
  var misDatos=(_.sortBy(datos,'puntos')).reverse();
  var cadena="<table id='table' class='table table-bordered table-condensed table-striped bg4'><thead><tr><th>Nombre</th><th>Fecha</th><th>Nivel</th><th>Tiempo</th></tr></thead>";
  cadena=cadena+'<tbody>';
  for(var i=0;i<misDatos.length;i++){
      var fecha=new Date(misDatos[i].fecha);
      var strFecha=fecha.getDate()+'/'+(fecha.getMonth()+1)+'/'+fecha.getFullYear()+'  '+fecha.getHours()+':'+fecha.getMinutes();
      var nombre=misDatos[i].email.substr(0,misDatos[i].email.indexOf('@'));
      cadena=cadena+"<tr class='data'><td>"+nombre+"</td><td>"+strFecha+"</td><td> "+misDatos[i].nivel+"</td>"+"</td><td>"+misDatos[i].tiempo+"</td></tr>";      
    }
    cadena=cadena+"</tbody></table>";
  return cadena;
}

function obtenerMisLogros(datos){
  var usr=JSON.parse($.cookie("usr"));
  var miEmail=usr.email;
  //var max=_.max(datos,function(ele){return ele.nivel});
  var nDatos=_.sortBy(_.filter(datos,function(each){
    return each.email==miEmail
  }),'puntos');

  var misDatos=nDatos.reverse();  
  var cadena="<table id='table' class='table table-bordered table-condensed table-striped bg4'><tr><th>Nombre</th><th>Fecha</th><th>Nivel</th><th>Tiempo</th></tr>";
  for(var i=0;i<misDatos.length;i++){ 
      var fecha=new Date(misDatos[i].fecha);
      var strFecha=fecha.getDate()+'/'+(fecha.getMonth()+1)+'/'+fecha.getFullYear()+'  '+fecha.getHours()+':'+fecha.getMinutes();
      var nombre=misDatos[i].email.substr(0,misDatos[i].email.indexOf('@'));
      cadena=cadena+"<tr><td>"+nombre+"</td><td>"+strFecha+"</td><td> "+misDatos[i].nivel+"</td>"+"</td><td>"+misDatos[i].tiempo+"</td></tr>";      
    }
    cadena=cadena+"</table>";
  return cadena;
}

function obtenerLosMejores(datos){
  var usr=JSON.parse($.cookie("usr"));
  var miEmail=usr.email;
  
  // for(var i=0;i<numero;i++){
  //   nuevaCol.push(_.filter(datos,function(ele){
  //     return ele.nivel;
  //   }))
  // }
  var tope;
  if (datos.length<10){
    tope=datos.length;
  }
  else
    tope=10;
  var nCol=_.sortBy(datos,'puntos');
  var nuevaCol=nCol.reverse(); 
  var cadena="<table class='table table-bordered table-condensed table-striped bg4'><tr><th>Puesto</th><th>Nombre</th><th>Fecha</th><th>Nivel</th><th>Tiempo</th></tr>";
  for(var i=0;i<tope;i++){ 
      var fecha=new Date(nuevaCol[i].fecha);
      var strFecha=fecha.getDate()+'/'+(fecha.getMonth()+1)+'/'+fecha.getFullYear()+'  '+fecha.getHours()+':'+fecha.getMinutes();
      var nombre=nuevaCol[i].email.substr(0,nuevaCol[i].email.indexOf('@'));
      cadena=cadena+"<tr><td>"+(i+1)+"</td><td>"+nombre+"</td><td>"+strFecha+"</td><td> "+nuevaCol[i].nivel+"</td>"+"</td><td>"+nuevaCol[i].tiempo+"</td></tr>";      
    }
    cadena=cadena+"</table>";
  return cadena;
}

function comprobarEmail(cad1,cad2){
  if (cad1==cad2){
    return true;
  }
  else{
    return false;
  }
}

function limpiar(){
  $('#login').remove();
  $('#nombreBtn').remove();
  $('#refRecordar').remove();
  //$('#cabecera').remove();

 /* $('#nombre').remove();
  $('#regBtn').remove();
  $('#info').remove();
  $('#cab').remove();
  $('#listaP').remove();
  $("#cab2").remove();
  $("#cab3").remove();
  $("#tab").remove();
  $('#cabeceraP').remove();
  $('#actualizarBtn').remove();
  $('#eliminarBtn').remove();*/
}

function mostrarAviso(cadena){
  $("#info span").text(cadena);
}

function borrarCookies() {
  $.removeCookie("usr");
}

function eliminarCookies(){
  $.removeCookie("usr");
  window.localStorage.clear();
}

function reset(){
  eliminarGame();  
  eliminarCookies(); 
  //mostrarNavLogin();
  com.comprobarUsuario();
  //location.reload();
}