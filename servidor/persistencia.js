var mongo=require("mongodb").MongoClient;
var ObjectID=require("mongodb").ObjectID;

function Persistencia(){
    this.usuariosCol=undefined;
    this.resultadosCol=undefined;
    this.encontrarUsuario=function(email,callback){
        encontrar(this.usuariosCol,{email:email},callback);
    };
    this.encontrarUsuarioCriterio=function(criterio,callback){
        encontrar(this.usuariosCol,criterio,callback);
    };
    this.confirmarCuenta=function(email,key,callback){
        encontrar(this.usuariosCol,{email:email,key:key,confirmada:false},callback);
    };
    this.encontrarTodosResultados=function(callback){
        encontrarTodos(this.resultadosCol,callback);
    };

    function encontrar(coleccion,criterio,callback){
        coleccion.find(criterio).toArray(function(error,usr){
            if (usr.length==0){
                callback(undefined);
            }
            else{
                callback(usr[0]);
            }
        });
    };

    function encontrarTodos(coleccion,callback){
        coleccion.find().toArray(function(error,usr){
            callback(usr);
        });
    };

    this.insertarUsuario=function(usu,callback){
        insertar(this.usuariosCol,usu,callback);
    }

     this.insertarResultado=function(resu,callback){
        insertar(this.resultadosCol,resu,callback);
    }
    
    function insertar(coleccion,usu,callback){
        coleccion.insert(usu,function(err,result){
            if(err){
                console.log("error");
            }
            else{
                console.log("Nuevo usuario creado: "+usu.email);
                callback(usu);
            }
        });
    }

    /* Publico */
    this.modificarColeccionUsuarios=function(usr,callback){
        modificarColeccion(this.usuariosCol,usr,callback);
    }

    /* Privado */
    function modificarColeccion(coleccion,usr,callback){
        coleccion.findAndModify({_id:ObjectID(usr._id)},{},usr,{},function(err,result){
            if (err){
                console.log("No se pudo actualizar (método genérico)");
            }
            else{     
                console.log("Usuario actualizado"); 
            }
            callback(result);
        });
    }

    this.conectar=function(callback){
        var pers=this; // Porque se pierde la persistencia
        mongo.connect("mongodb://alba:a659676212@ds261745.mlab.com:61745/no-hay-calabazas", function(err, db) {
            if (err){
                console.log("No pudo conectar a la base de datos")
            }
            else{
                console.log("conectado a MLab: alba");
                db.collection("usuarios",function(err,col){
                    if (err){
                        console.log("No pude obtener la coleccion")
                    }
                    else{       
                        console.log("tenemos la colección usuarios");
                        pers.usuariosCol=col;   
                    }
                });
                db.collection("resultados",function(err,col){
                    if (err){
                        console.log("No pude obtener la coleccion resultados")
                    }
                    else{       
                        console.log("tenemos la colección resultados");
                        //juego.iniUsuarios(col);
                        pers.resultadosCol=col;   
                    }
                });
                callback(db); // Conectado a la base de datos
            }
        });
    }

     this.eliminarUsuario=function(uid,callback){
        eliminar(this.usuariosCol,{_id:ObjectID(uid)},callback);
    }

    function eliminar(coleccion,criterio,callback){
        coleccion.remove(criterio,function(err,result){
            //console.log(result);
            if(!err){
                callback(result);
            }
        });
    }
}

module.exports.Persistencia=Persistencia;
