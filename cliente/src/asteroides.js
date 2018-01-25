function Boot(){
    this.create=function(){
        cliente.cargarConfiguracion(game.width-20,game.height-20);
    }
}

function Juego(){
    this.naves={};
    this.cursors;
    this.naveLocal;
    this.veggies;
    this.fin = false;
    this.marcador;
    this.rival;
    this.contadorTxt;
    this.objetivo;
    this.contador = 0;
    this.preload=function() {
        game.load.image('espacio', '../img/deep-space.jpg');
        game.load.image('fondo', '../img/fondo_inicio.png');
        game.load.image('nave', '../img/ship.png');
        game.load.image('nave2', '../img/ship2.png');
        game.load.spritesheet('veggies', '../img/veggies.png', 44, 40);
        game.load.image('reset', '../img/reset.png');
    }
    this.init=function(data, objetivo){ //data es para coger las coordenadas
        game.stage.disableVisibilityChange = true;
        this.coord = data;
        this.objetivo = objetivo;
    }
    this.mostrarObjetivo = function(veg){
        var img = this.veggies.create(25,35, 'veggies', veg);
    }
    this.create=function() {
        //  This will run in Canvas mode, so let's gain a little speed and display
        game.renderer.clearBeforeRender = false;
        game.renderer.roundPixels = true;
        //  We need arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //  A spacey background
        game.add.tileSprite(0, 0, game.width, game.height, 'espacio');
        // Contador titulo /
        this.contadorTxt = game.add.text(game.width-70, 30, 'Tiempo: 0', { font: "20px Arial", fill: "#ffffff", align: "right" });
        this.contadorTxt.anchor.setTo(0.5, 0.5);
        this.veggies = game.add.physicsGroup();
        for (var i = 0; i < this.coord.length; i++)
        {
            var c = this.veggies.create(this.coord[i].x, this.coord[i].y, 'veggies', this.coord[i].veg);
        }
        //this.veggies.children[this.objetivo].events.onInputDown.add(this.touchFruit, this);
        //this.veggies.children[this.objetivo].inputEnabled=true;
        //  Game input
        this.cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
        
        this.marcador = game.add.text(game.world.centerX, 25, "Partida: "+cliente.email+" - Puntos. Yo: 0 - Rival:0", {
            font: "25px Arial",
            fill: "#FDFEFE",
            align: "center"
        });
        this.marcador.anchor.setTo(0.5, 0.5);
        cliente.nuevoJugador();
    }
    this.actualizarContador=function(){
        this.contador++;
        this.contadorTxt.setText('Tiempo: ' + this.contador);
    }
    this.collisionHandler = function(bullet, veg) { 
        if (veg.frame == this.naves[cliente.id].veg){ // Solo controlamos el pimiento, que es el numero 17
            console.log("ñam ñam"); // En caso de colision con algun grupo de hortaliza
            this.naves[cliente.id].puntos++;
            veg.kill();
        }
        this.actualizarMarcador();
    }
    this.touchFruit = function() { 
        this.naves[cliente.id].puntos++;
        this.actualizarMarcador();
    }
    this.rivalHandler = function(bullet, veg) {      
        if (veg.frame == this.rival.veg){
            console.log("colision rival");
            veg.kill(); 
        } 
        this.actualizarMarcador(); 
    }
    this.processHandler = function(player, veg) {
        return true;
    }
    this.faltaUno = function(){
        this.marcador.setText(cliente.email.substr(0, cliente.email.indexOf("@"))+":0 - Rival:0 \n --- Esperando rival ---");
        this.marcador.anchor.setTo(0.5, 0);
        game.world.bringToTop(this.marcador);
    }
    this.update = function() {
        if (!this.fin){
            var nave = this.naveLocal;
           if (nave){
                if (game.physics.arcade.collide(nave.sprite, this.veggies, this.collisionHandler, this.processHandler, this))
                {
                    
                }
                if (cliente.num>1){
                    if (game.physics.arcade.collide(this.rival.sprite, this.veggies, this.collisionHandler,this.rivalHandler, this))
                    {
                        console.log('boom');                    
                    }
                }
                if (game.input.mousePointer.isDown){
                    var targetAngle = game.math.angleBetween(nave.sprite.x, nave.sprite.y,game.input.mousePointer.x, game.input.mousePointer.y); nave.sprite.rotation = targetAngle;
                    nave.mover(game.input.mousePointer.x,game.input.mousePointer.y,targetAngle); 
                }
                if (this.cursors.left.isDown){
                    nave.sprite.body.angularVelocity = -300;
                }
                else if (this.cursors.right.isDown){
                    nave.sprite.body.angularVelocity = 300;
                }
                 else{
                    nave.sprite.body.angularVelocity = 0;
                }
                if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
                    nave.disparar();
                }
                this.screenWrap(nave.sprite);
                //nave.bullets.forEachExists(this.screenWrap, this); 
                //this.actualizarMarcador();
            }
        }
    }
    var email =cliente.email.substr(0, cliente.email.indexOf("@"));
    var email2 =this.rival;
    this.actualizarMarcador=function(){
        var cadena=email+" Puntos: ";
        for(var jug in this.naves){
         cadena = cadena + this.naves[jug].puntos+" - ";
        };
        this.marcador.setText(cadena);
        game.world.bringToTop(this.marcador);
    }
    this.agregarJugador = function(data){
        if (this.naves[data.id] == null) {
            console.log('nuevo usuario');
            var nave = new Nave(data);
            this.naves[data.id] = nave;
            if (data.id == cliente.id){
                this.naveLocal = this.naves[cliente.id];
                this.naveLocal.email=cliente.email.substr(0, cliente.email.indexOf("@"));
                this.mostrarObjetivo(data.veg);
            }
            else{
                this.rival = nave;
            }
        }
        /** Actualizar el contador cada segundo */
        game.time.events.loop(Phaser.Timer.SECOND, this.actualizarContador, this);
    }
    this.moverNave = function(data){ 
      var nave = this.naves[data.id];
      nave.puntos = data.puntos;
      nave.mover(data.x,data.y,data.ang,true); 
      this.rival = nave;
      this.actualizarMarcador();
    }
    this.finalizar = function(id) {
        console.log('Ha ganado', id);
        this.fin = true;
        game.state.start("FinJuego", true, false, id, cliente.id);
    }
    this.volverAJugar=function(data){
        cliente.reset();
        this.fin=false;
        this.naves={};
        this.naveLocal=null;
        this.coord=[];
        game.state.start("Game",true,false,data);
    }
    this.screenWrap=function(sprite) {
        if (sprite.x < 0)
        {
            sprite.x = game.width;
        }
        else if (sprite.x > game.width)
        {
            sprite.x = 0;
        }
        if (sprite.y < 0)
        {
            sprite.y = game.height;
        }
        else if (sprite.y > game.height)
        {
            sprite.y = 0;
        }
    }
}

function FinJuego(){
    this.ganador;
    this.idLocal;
    this.init = function(id,idLocal) {    
        //alert("Ganador: "+score)
        this.ganador = id;
        this.idLocal = idLocal;
    };
    this.create = function(){
        game.add.tileSprite(0, 0, game.width, game.height, 'espacio');
        var cadena = "";
        if (this.ganador == this.idLocal) {
            cadena = "Enhorabuena, ¡ERES EL GANADOR!";
        }
        else{
            cadena = "Lo siento, tu rival te ha vencido";
        }
        var text2 = game.add.text(game.world.centerX, 180, cadena, {
            font: "25px Arial",
            fill: "#FFFF00",
            align: "center"
        });
        text2.anchor.setTo(0.5, 0.5); 
       /* var text1 = game.add.text(game.world.centerX, 220, "¿Has encontrado alguna calabaza?", {
            font: "25px Arial",
            fill: "#FDFEFE",
            align: "center"
        });
        text1.anchor.setTo(0.5, 0.5);   */
        var text1 = game.add.text(game.world.centerX, 250, 'FIN JUEGO', {
            font: "25px Arial",
            fill: "#FFFF00",
            align: "center"
        });
        text1.anchor.setTo(0.5, 0.5);
        var playButton = game.add.button(400,420,"reset",this.volverAJugar,this);
        playButton.anchor.setTo(0.5,0.5);
    };
    this.volverAJugar= function(){
        cliente.volverAJugar();
    }
}

function Nave(data){
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.email;
    this.sprite;
    this.bullets;
    this.bullet;
    this.bulletTime = 0;
    this.veg = data.veg;
    this.nave = data.nave;
    this.puntos = 0;
    this.mover = function(x, y, ang, socket) { 
        this.sprite.rotation=ang; 
        this.sprite.body.velocity = 10;
        // La funcion calcula la distancia, es lo que va a tardar en llegar
        var distance=Phaser.Math.distance(this.sprite.x, this.sprite.y, x, y);
        var duration = distance*3;
        var tween = game.add.tween(this.sprite);
        tween.to({x:x,y:y}, duration);
        tween.start();
        if (!socket)
            tween.onComplete.add(this.onComplete, this);
    }
    this.onComplete=function(){
        cliente.enviarPosicion(this.sprite.x,this.sprite.y,this.sprite.rotation, this.puntos, juego.contador);
    }
    this.disparar=function() {
        if (game.time.now > this.bulletTime)
        {
            this.bullet = this.bullets.getFirstExists(false);
            if (this.bullet)
            {
               this.bullet.reset(this.sprite.body.x + 16, this.sprite.body.y + 16);
               this.bullet.lifespan = 1000;
               this.bullet.rotation = this.sprite.rotation;
               game.physics.arcade.velocityFromRotation(this.sprite.rotation, 400, this.bullet.body.velocity);
               this.bulletTime = game.time.now + 50;
            }
        }
    }
    this.ini=function(){
        this.bullets= game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        //  All 40 of them
        this.bullets.createMultiple(40, 'disparo');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);

        //  Nuestras naves
        this.sprite = game.add.sprite(this.x, this.y, this.nave);
        this.sprite.anchor.set(0.5);

        //  and its physics settings
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.drag.set(50);
        this.sprite.body.maxVelocity.set(200);
    }
    this.ini();
}