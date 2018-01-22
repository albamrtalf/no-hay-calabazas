function com () {
	this.obtenerPartidas =  function(){
  		$.getJSON("/obtenerPartidas",function(data){    
        	//console.log(data);       
        	listaPartidas(data);
  		});
	}

	this.loginUsuario = function(email,clave){
		$.ajax({
		    type:'POST',
		    url:'/login/',
		    data:JSON.stringify({email:email,password:clave}), /* Puedes pasarle la informacion que desees aqui */
		    success:function(data){
		      if (data.email==""){ /* Email sin parametros */
		        //mostrarRegistro();
		        mostrarLogin();
		        mostrarAviso("Usuario o clave incorrectos");
		      }
		      else{
		        console.log('el usuario ha iniciado la sesión');
		        mostrarIniciarPartida(data);
		        $.cookie("usr", JSON.stringify(data));
		        }
		      },
		    contentType:'application/json',
		    dataType:'json'
	  	});
	}

	this.registroUsuario = function(email, clave){
		/* Cliente registrandose */
		$.ajax({
		    type:'POST',
		    url:'/registro/',
		    data:JSON.stringify({email:email,password:clave}),
		    success:function(data){
		      if (data.email==undefined){
		        mostrarRegistro();
		        mostrarAviso("Dirección de email inventada o el usuario ya existe");
		        //mostrarSolicitarReenvioMail();
		      }
		      else{        
		        //mostrarLogin();
		        mostrarAviso("Te hemos enviado un email para confirmar tu cuenta");
		      }
		      },
		    contentType:'application/json',
		    dataType:'json'
	  	});
	}
	this.comprobarUsuario =  function() {
		// ver si existe $.cookie("usr")
		// extraer el _id del usuario
		// comrpobar si el usuario existe en el srv
		  
		if ($.cookie("usr") != undefined) {
		    var usr = JSON.parse($.cookie("usr"));
		    var id = usr._id;
		    $.getJSON("/comprobarUsuario/"+id, function(usr) {
			    // si el usuario no existe: mostrarLogin
			    // si existe, mostrarIniciarPartida()
			    if (usr.email == '') {
			        mostrarLogin();
			    } else {
			        mostrarIniciarPartida(usr);
			    }
		    });
		} else {
		    mostrarLogin();
		}
	}
	this.obtenerResultados=function(){
	  var uid;
	  if ($.cookie("usr")!=undefined){
	    var usr=JSON.parse($.cookie("usr"));
	    uid=usr._id;
	  }
	  if (uid!=undefined){
	    $.getJSON("/obtenerResultados/"+uid,function(data){          
	        mostrarResultados(data);
	    });
	  }
	  else
	    mostrarAviso("Debes iniciar sesión");
	}
	this.actualizarUsuario=function(oldpass,newpass,newpass2,nick){
	  var usr=JSON.parse($.cookie("usr"));
	  var nivel=usr.nivel;
	 $.ajax({
	    type:'PUT',
	    url:'/actualizarUsuario',
	    data:JSON.stringify({uid:usr._id,email:usr.email,nick:nick,oldpass:oldpass,newpass:newpass,newpass2:newpass2}),
	    success:function(data){
	      if (data.email==undefined){
	        mostrarRegistro();
	      }
	      else{
	        $.cookie("usr",JSON.stringify(data));
	        mostrarIniciarPartida(data);
	      }
	      },
	    contentType:'application/json',
	    dataType:'json'
	  });
	}
	this.eliminarUsuario=function(){
	  var usr=JSON.parse($.cookie("usr"));
	  $.ajax({
	    type:'DELETE',
	    url:'/eliminarUsuario/'+usr._id,//$.cookie("uid"),
	    data:'{}',
	    success:function(data){
	      if (data.resultados==1)
	      {
	        eliminarCookies();
	        mostrarLogin();
	      }
	      },
	    contentType:'application/json',
	    dataType:'json'
	  });
	}
}