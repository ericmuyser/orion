Basic game:

    return;var props = {
        width: 500,
        height: 500
    };

    <Game {...props} />

Ship Trail:

    return;
    var OrionV1 = {};
    var sprite;
    var bmd;
    var props = {
        width: 800,
        height: 600
    };

    class StartState extends React.Component {
        constructor() {
            super();
            var self = this;

            this.stateHandler = function() {};

            this.stateHandler.prototype = {
                preload: function(gam) {
                    OrionV1.game.engine.load.image('chunk', '/Game/Assets/tmp/chunk.png');
                    OrionV1.game.engine.load.image('arrow', '/Game/Assets/tmp/asteroids_ship.png');
                },
                create: function(gam) {
                    function launch() {
                        if (OrionV1.game.engine.input.x < sprite.x) {
                            sprite.body.velocity.setTo(-200, -200);
                        }
                        else {
                            sprite.body.velocity.setTo(200, -200);
                        }
                    }

                    OrionV1.game.engine.physics.startSystem(Phaser.Physics.ARCADE);

                    //  Click on the left or right of the game to shoot the space ship in that direction

                    OrionV1.game.engine.stage.backgroundColor = '#124184';

                    bmd = OrionV1.game.engine.add.bitmapData(800, 600);
                    bmd.context.fillStyle = '#ffffff';

                    var bg = OrionV1.game.engine.add.sprite(0, 0, bmd);

                    OrionV1.game.engine.physics.arcade.gravity.y = 100;

                    sprite = OrionV1.game.engine.add.sprite(32, 450, 'arrow');
                    sprite.anchor.set(0.5);

                    OrionV1.game.engine.physics.enable(sprite, Phaser.Physics.ARCADE);

                    sprite.body.collideWorldBounds = true;
                    sprite.body.bounce.set(0.8);

                    OrionV1.game.engine.input.onDown.add(launch, this);
                },
                update: function(gam) {
                    sprite.rotation = sprite.body.angle;

                    bmd.context.fillRect(sprite.x, sprite.y, 2, 2);

                    bmd.dirty = true;
                },
                render: function(gam) {
                    OrionV1.game.engine.debug.bodyInfo(sprite, 32, 32);
                }
            };
        }

        componentDidMount() {
            OrionV1.game.engine.state.add('Start', this.stateHandler);
            OrionV1.game.engine.state.start('Start');
        }

        render() {
            return <View></View>;
        }
    }

    class AwesomeGame extends React.Component {
        constructor() {
            super();
        }

        onInit = (engine) => {
            OrionV1.game = {engine: engine};
            this.screenKey = 'start';
            this.forceUpdate();
        }

        render() {
            return (
                <Game {...props} onInit={this.onInit}>
                    {this.screenKey === 'start' && <StartState />}
                </Game>
            );
        }
    }
    <AwesomeGame />


RPG:

    return;
    var OrionV1 = {};
    OrionV1.GAME_WIDTH = 400; // Game originally designed for 800px
    OrionV1.GAME_HEIGHT = 400; // Game originally designed for 800px
    OrionV1.UI_WIDTH = 800; // UI originally designed for 800px
    OrionV1.UI_HEIGHT = 800; // UI originally designed for 800px
    OrionV1.IngameState = function(game) {
    };

    var PLAYER_SPEED = 200;
    var UPDATE_INTERVAL = 100;
    var POWERUP_SPAWN_INTERVAL = 1500;

    var updateTimeout;

    class IngameState extends React.Component {
        constructor() {
            super();
            var self = this;

            this.stateHandler = function() {};

            this.stateHandler.prototype = {
                toggleFullscreen: function() {
                    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
                    if (this.game.scale.isFullScreen) {
                        this.game.scale.stopFullScreen();
                    } else {
                        this.game.scale.startFullScreen();
                    }
                },

                getTileAt: function(params) {
                    if (!typeof(params) === 'object') { throw new Error('Invalid args'); }

                    for(var i = 0; i < this.map.collideTiles.length; i++) {
                        var tile = this.map.collideTiles[i];
                        if (tile.x === params.x * 16 && tile.y === params.y * 16) {
                            return tile;
                        }
                    }

                    return null;
                },

                getValidPosition: function() {
                    var position = null;
                    var currentPositon = 0;
                    var totalPositions = 32 * 32;

                    while (!position && currentPositon < totalPositions) {
                        var x = this.game.rnd.integerInRange(1, 32);
                        var y = this.game.rnd.integerInRange(1, 32);
                        // mapData goes top to down and left to right
                        var tile = this.getTileAt({x: x, y: y});

                        // Check it's a floor tile with no power up there yet
                        if (!tile && !this.powerups[x][y]) {
                            position = {x: x, y: y};
                        }

                        totalPositions++;
                    }

                    // We tried once for each tile on the map, with no success
                    // Lets just put them at 1,1
                    if (!position) {
                        position = {x: 1, y: 1};
                    }

                    //console.log(position);

                    return position;
                },

                resizeGame: function (width, height) {
                    this.game.width = width;
                    this.game.height = height;

                    if (this.game.renderType === 1) {
                        this.game.renderer.resize(width, height);
                        Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
                    }
                },

                create: function() {
                    self.stateInstance = this;
                    this.players = {};
                    this.socket = window.io.connect('http://127.0.0.1:8080');
                    this.events = [];
                    this.enemy = null;
                    this.hostId = null;
                    this.player = null;
                    this.blocks = [];

                    this.initPhysics();
                    this.initMap();
                    this.initPowerUps();
                    this.initPlayer();
                    this.initCountdown();
                    this.initSFX();
                    this.initHotkeys();

                    // Register to listen to events and inform
                    // other players that you have joined the game
                    this.registerToEvents();
                    this.joinGame();

                    this.initEvents();


                    //window.UI_state.screenKey = 'ingame';
                    //window.UI_controller.setState(window.UI_state);

                    this.game.world.resize(10000, 10000);
                    this.game.world.setBounds(0, 0, 10000, 10000);

                    //this.player.character.object.sprite.unlock();
                    self.forceUpdate();
                },

                initEvents: function() {
                    var self = this;

                    setInterval(this.broadcastEvents.bind(this), 100);

                    var lastUpdateInfo = null;

                    // Send player position every 50ms
                    setInterval(function() {
                        self.player.character.updatePos();

                        if (!self.player.character.object.dirty) { return; }

                        var info = {
                            id: self.player.id,
                            position: self.player.character.object.position,
                            direction: self.player.character.object.direction
                        };

                        // Don't send an event if its the same as last time
                        if (lastUpdateInfo && info.position.x == lastUpdateInfo.position.x
                            && info.position.y == lastUpdateInfo.position.y) {
                            return;
                        }

                        self.addEvent({key: 'updatePlayer', info: info});

                        lastUpdateInfo = info;
                    }, UPDATE_INTERVAL);

                    // If this is the host
                    // Send enemy position every 50ms
                    setInterval(function() {
                        if (self.enemy && self.player.id === self.hostId) {
                            //self.enemy.character.updatePos();

                            if (!self.enemy.character.object.dirty) { return; }

                            self.enemy.character.object.dirty = false;

                            var info = {
                                position: self.enemy.character.object.position,
                                direction: self.enemy.character.object.direction
                            };

                            self.addEvent({key: 'updateEnemy', info: info});
                        }
                    }, UPDATE_INTERVAL);
                },

                initPhysics: function() {
                    this.game.physics.startSystem(Phaser.Physics.ARCADE);
                },

                initHotkeys: function() {
                    this.fullscreenKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
                    this.fullscreenKey.onDown.add(this.toggleFullscreen, this);
                },

                runAiSystem: function() {
                    this.ai = new AI({game: this.game, player: this.player, enemy: this.enemy, map: this.map});
                },

                runEnemySystem: function() {
                    // Create enemy for the host
                    if (!this.enemy) {
                        var position = this.getValidPosition();

                        this.enemy = new Enemy({
                            game: this.game,
                            speed: PLAYER_SPEED,
                            position: {
                                x: position.x * 16,
                                y: position.y * 16
                            },
                            keys: {
                                up: Phaser.Keyboard.W,
                                down: Phaser.Keyboard.S,
                                left: Phaser.Keyboard.A,
                                right: Phaser.Keyboard.D
                            }
                        });
                    }
                },

                initPlayer: function() {
                    var position = this.getValidPosition();

                    var playerParams = {
                        id: Utils.generateId(),
                        game: this.game,
                        name: OrionV1.playerName,
                        speed: PLAYER_SPEED,
                        position: {
                            x: position.x * 16,
                            y: position.y * 16
                        },
                        keys: {
                            up: Phaser.Keyboard.UP,
                            down: Phaser.Keyboard.DOWN,
                            left: Phaser.Keyboard.LEFT,
                            right: Phaser.Keyboard.RIGHT,
                            att: Phaser.Keyboard.SPACEBAR
                        }
                    };

                    this.playerElement = <Player params={playerParams} onInit={(player) => {
                        this.player = player;
                        this.game.camera.follow(this.player.character.object.sprite, Phaser.Camera.FOLLOW_LOCKON);
                    }} />;
                },

                initMap: function() {
                    this.map = new Map2D({game: this.game, player: this.player, enemy: this.enemy});

                    // var start = this.map.tilemap.objects['GameObjects'][0];
                    // var end = this.map.tilemap.objects['GameObjects'][1];

                    // var teleStart = new Phaser.Rectangle(start.x, start.y, start.width, start.height);
                    // var teleEnd = new Phaser.Rectangle(end.x, end.y, end.width, end.height);
                    // TODO: do stuff with tele points

                },

                initCountdown: function() {
                    var countdown = new Countdown(this.game);
                    countdown.start();
                },

                initSFX: function() {
                    this.musicKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
                    // var fx = this.game.add.audio('sfx');
                    // fx.addMarker('monsterRoar', 2, 1.2);
                    // fx.addMarker('playerEaten', 5, 0.5);
                    // fx.addMarker('playerInWater', 7, 0.5);
                    // fx.addMarker('jump', 0, 0.24);
                },

                initPowerUps: function() {
                    var self = this;

                    this.powerups = [];
                    for (var i = 0; i <= 32; i++) {
                        this.powerups.push([]);
                    }

                    setInterval(function() {
                        self.powerups.forEach(function(_, row) {
                            self.powerups[row].forEach(function(_, column) {
                                var powerup = self.powerups[row][column];
                                if (powerup && powerup.handler.ended) {
                                    self.powerups[row][column] = null;
                                }
                            });
                        });
                    }.bind(this), 1000);
                },

                runPowerUpSystem: function() {
                    var self = this;
                    setInterval(function() {
                        var powerupHandlers = Object.keys(Powerup.handlers);
                        var randomHandler = powerupHandlers[this.game.rnd.integerInRange(0, powerupHandlers.length-1)];
                        var powerup = new Powerup({key: randomHandler, game: this.game, map: this.map, player: this.player});
                        powerup.handler.on('started', () => { self.addEvent({key: 'foundPowerup', info: {state: powerup.handler.state, player: {id: self.player.id}}}); });
                        powerup.handler.on('destroyed', (params) => { params.positions.forEach((position) => { self.powerups[position.x][position.y] = null; }); });

                        this.powerups[powerup.handler.state.position.x][powerup.handler.state.position.y] = powerup;

                        this.addEvent({key: 'powerupSpawned', info: {handler: {key: randomHandler, state: powerup.handler.state}}});
                    }.bind(this), POWERUP_SPAWN_INTERVAL);
                },

                // TODO: causing some errors, not sure why
                createExplodingParticles: function(sprite, cb) {
                    var self = this;

                    // create a Phaser.Group for all the particles of the explosion
                    self.explodingGroup = self.game.add.group();
                    self.explodingGroup.enableBody = true;
                    self.explodingGroup.physicsBodyType = Phaser.Physics.ARCADE;
                    var colors = ['#77DD77', '#B39EB5', '#C23B22', '#FFB347', '#FDFD96', '#836953', '#779ECB', '#FFD1DC'];

                    // create a black square as gfx for the particles
                    var explodingRect = self.game.make.bitmapData(5, 5);
                    explodingRect.ctx.fillStyle = colors[self.game.rnd.integerInRange(0, colors.length-1)];
                    explodingRect.ctx.fillRect(0, 0, 5, 5);

                    var explodingSprite = new Phaser.Sprite(self.game, sprite.x, sprite.y, explodingRect);
                    self.explodingGroup.add(explodingSprite);

                    explodingSprite = new Phaser.Sprite(self.game, sprite.x, sprite.y, explodingRect);
                    self.explodingGroup.add(explodingSprite);

                    // setup the animation for the particles. make them "jump" by setting a negative velocity
                    // and set timeout to make the blink before being finally destroyed
                    self.explodingGroup.forEach(function (sprite) {
                        sprite.body.gravity.y = 35;
                        sprite.body.velocity.setTo(self.game.rnd.integerInRange(-20, 20), self.game.rnd.integerInRange(-35, -50));

                        setTimeout(function () {
                            sprite.visible = false;
                            setTimeout(function () {
                                sprite.visible = true;
                                setTimeout(function () {
                                    sprite.destroy();
                                    cb && cb();
                                }, 100);
                            }, 100);
                        }, 10);
                    });
                },
                addEvent: function(event) {
                    this.events.push(event);
                },
                broadcastEvents: function() {
                    if (!this.events.length) { return; }

                    //console.log('Broadcasting events...', JSON.stringify({events: this.events}));

                    this.socket.emit('events', JSON.stringify({events: this.events}));
                    this.events = [];
                },
                update: function() {
                    var self = this;

                    if (this.musicKey.isDown) {
                        this.game.music.mute = !this.game.music.mute;
                    }

                    if (this.game.input.mousePointer.isDown) {
                        this.player.character.inputRight = false;
                        this.player.character.inputLeft = false;
                        this.player.character.inputUp = false;
                        this.player.character.inputDown = false;

                        //  400 is the speed it will move towards the mouse
                        //this.game.physics.arcade.moveToPointer(this.player.character.object.sprite, PLAYER_SPEED);

                        // top = -1.25
                        // bottom = 1
                        // left = 2.5
                        // right = 0
                        // http://phaser.io/examples/v2/arcade-physics/angle-to-pointer
                        var angle = this.game.physics.arcade.angleToPointer(this.player.character.object.sprite) * (180/Math.PI);

                        // right
                        if (Math.abs(angle) > 0 && Math.abs(angle) <= 45) {
                            this.player.character.inputRight = true;
                            //this.player.character.object.sprite.body.velocity.x = PLAYER_SPEED;
                        }
                        // left
                        if (Math.abs(angle) > 135 && Math.abs(angle) <= 180) {
                            this.player.character.inputLeft = true;
                            //this.player.character.object.sprite.body.velocity.x = -PLAYER_SPEED;
                        }
                        // up
                        if (Math.abs(angle) > 45 && Math.abs(angle) <= 135 && angle < 0) {
                            this.player.character.inputUp = true;
                            //this.player.character.object.sprite.body.velocity.y = -PLAYER_SPEED;
                        }
                        // down
                        if (Math.abs(angle) > 45 && Math.abs(angle) <= 135 && angle > 0) {
                            this.player.character.inputDown = true;
                            //this.player.character.object.sprite.body.velocity.y = PLAYER_SPEED;
                        }

                        //  if it's overlapping the mouse, don't move any more
                        // if (Phaser.Rectangle.contains(this.player.character.object.sprite.body, this.game.input.x, this.game.input.y)) {
                        //     this.player.character.object.sprite.body.velocity.x = 0;
                        //     this.player.character.object.sprite.body.velocity.y = 0;
                        // }
                    }
                    else {
                        this.player.character.inputRight = false;
                        this.player.character.inputLeft = false;
                        this.player.character.inputUp = false;
                        this.player.character.inputDown = false;
                        // this.player.character.object.sprite.body.velocity.x = 0;
                        // this.player.character.object.sprite.body.velocity.y = 0;
                    }

                    var collideEnemyHandler = function() {
                        // Scope: this = Phaser.Game
                        if (self.player.character.invincible) { return; }

                        //self.game.fx.play('monsterRoar');
                        self.player.kill();

                        if (self.enemy) {
                            self.enemy.character.addPoints(self.player.character.points);
                        }

                        self.addEvent({key: 'playerKilled', info: {
                            player: {id: self.player.id}
                        }});

                        if (self.ai) {
                            self.ai.stopPathFinding();
                        }
                    };

                    var block = self.player.character.handler.triggerAttack(self.blocks);

                    if (block !== null) {
                        this.addEvent({key: 'blockSpawned', info: {
                            x: block.x,
                            y: block.y
                        }})

                        self.blocks.push(block);
                    }

                    var SLIDE_SPEED = 200;
                    var REPOSITION_DELAY = 200;
                    var repositionTimeout = null;

                    var closestInRangeOf = (params) => {
                        var dir = params.range > 0 ? 1 : -1; // are we going backwards?
                        var startPos = params.position[params.align];
                        var endPos = startPos + params.range;

                        for(var i = startPos; i != endPos; i+= dir) {
                            var x = params.align === 'x' ? i : params.position.x;
                            var y = params.align === 'y' ? i : params.position.y;
                            var tile = this.getTileAt({x: x, y: y});
                            if (!tile || !tile.collides) {
                                return i;
                            }
                        }

                        return null;
                    };

                    var getNearestOpening = (params) => {
                        clearTimeout(repositionTimeout);

                        var align;
                        var dir;
                        var index;
                        var direction = params.direction;
                        var position = params.position;

                        if (direction === 'walkLeft') { align = 'y'; dir = -1; }
                        if (direction === 'walkRight') { align = 'y'; dir = +1; }
                        if (direction === 'walkUp') { align = 'x'; dir = -1; }
                        if (direction === 'walkDown') { align = 'x'; dir = +1; }

                        var seekPosition = {x: position.x, y: position.y};
                        seekPosition[align === 'x' ? 'y' : 'x'] += dir; // get the beside row/column

                        var closestLeft = closestInRangeOf({position: seekPosition, align: align, range: -5});
                        var closestRight = closestInRangeOf({position: seekPosition, align: align, range: 5});

                        // must be all blocked
                        if (!closestLeft && !closestRight) {
                            return;
                        }

                        var diffLeft = Math.abs(params.position[align] - closestLeft);
                        var diffRight = Math.abs(params.position[align] - closestRight);

                        return {align: align, left: diffLeft, right: diffRight};
                    };

                    var collideWallHandler = () => {
                        if (!self.player.character.object.direction) {
                            return;
                        }
                        // Find nearest opening and go that way
                        // Get current world position
                        // Check if direction is up, down, left, or right
                        // If direction is up,
                        //   check from my position to 0 for the closest opening
                        //   check from my position to mapWidth for the closest opening
                        // If closest is left, set velocity x = -500
                        // If closest is right, set velocity x = 500
                        var position = self.player.character.object.worldPosition;
                        var direction = self.player.character.object.direction;
                        var diff = getNearestOpening({position: position, direction: direction});

                        if (!diff) {
                            return;
                        }

                        //var goToPosition = null;

                        if (diff.left < diff.right) {
                            // going left or up
                            self.player.character.object.sprite.body.velocity[diff.align] = -SLIDE_SPEED; // the -SLIDE_SPEED / 5 * diff.left part lets us base the speed we move with how far it is
                            //goToPosition = closest * 16 + 8;
                        } else if (diff.right < diff.left) {
                            // going right or down
                            self.player.character.object.sprite.body.velocity[diff.align] = SLIDE_SPEED;
                            //goToPosition = closest * 16 - 8;
                        } else {
                            // He's probably stuck because a few pixels are touching
                            // Lets him him out
                            self.player.character.object.sprite[diff.align] = position[diff.align] * 16;
                        }

                        //if (goToPosition) {
                            //repositionTimeout = setTimeout(() => { self.player.character.object.sprite.body.velocity.y = 0; self.player.character.object.sprite.y = goToPosition; }, REPOSITION_DELAY);
                        //}
                    };

                    this.map.collideTiles.forEach((tile) => {
                        // TODO: Throttle collideWallHandler
                        this.game.physics.arcade.collide(this.player.character.object.sprite, tile, collideWallHandler); // tile is an object of Phaser.Sprite
                    });

                    if (self.enemy) {
                        self.game.physics.arcade.collide(self.enemy.character.object.sprite, self.map.tilemap.layer);
                        self.game.physics.arcade.overlap(self.enemy.character.object.sprite, self.player.character.object.sprite, collideEnemyHandler);
                    }

                    self.powerups.forEach(function(row) {
                        row.forEach(function(powerup) {
                            if (powerup) {
                                powerup.handler.update();
                            }
                        });
                    });

                    self.blocks.forEach((block) => {
                        //console.log(block);
                        self.game.physics.arcade.collide(self.player.character.object.sprite, block);
                        if (this.enemy) {
                            self.game.physics.arcade.collide(self.enemy.character.object.sprite, block);
                        }
                    });

                    self.game.world.bringToTop(self.player.character.object.sprite);
                },

                fitToWindow: function() {
                    this.game.canvas.style['width'] = '100%';
                    this.game.canvas.style['height'] = '100%';
                    //OrionV1.gameContainer.style['width'] = OrionV1.getWidthRatioScale() * 100 + '%';
                    //OrionV1.gameContainer.style['height'] = OrionV1.getHeightRatioScale() * 100 + '%';
                    //OrionV1.gameContainer.style['transform'] = 'perspective(900px) rotateX(10deg) rotate(-3deg)';

                //         width: 100%;
                // margin-top: -100px;
                // margin-left: -50px;
                // transform: perspective(900px) rotateX(10deg) rotate(-3deg);
                // height: 90%;
                    //window.onresize();
                },

                render: function() {
                    this.fitToWindow();
                },

                enableCollisionDebugging: function() {
                    this.game.debug.bodyInfo(this.player.character.object.sprite, 32, 32);

                    this.game.debug.body(this.player.character.object.sprite);
                    //this.game.debug.body(this.map.layer);
                },

                pelletHelper: function(mapArray){
            //        var pelletArr = [];
                    var x = 0;
                    var y = 0;
                    var pos = 1;
                    for (pos = 1; pos < mapArray.length ; pos++) {
                        if (pos % 32 === 0) {
                            x = 0;
                            y++;
                        }
                        else {
                            x++;
                        }
                        if (mapArray[pos] === 0) {
                            var pellet = this.add.sprite(x*16+2, y*16+2, 'gfx/effects/pellet');
                            pellet.scale.x = 0.005;
                            pellet.scale.y = 0.005;
                        }
                    }
                },
                getPlayerById: function(playerId) {
                    if (playerId == this.player.id) {
                        return this.player;
                    }
                    if (this.players[playerId]) {
                        return this.players[playerId];
                    }

                    // var player = new Player({
                    //     id: playerId,
                    //     name: playerId.substring(0, 2),
                    //     game: this.game,
                    //     speed: PLAYER_SPEED
                    // });

                    // this.players[playerId] = player;

                    // // We probably don't need physics for other players - they are telling us where they are already
                    // //this.game.physics.arcade.collide(player.character.object.sprite, this.map.layer);
                    // this.game.physics.arcade.collide(player.character.object.sprite, this.player.character.object.sprite, null, null, this.game);

                    return player;
                },

            // ============================================================================
            //                          Socket Event Handlers
            // ============================================================================
                parseEvent: function(event) {
                    var self = this;
                    //console.log('Receiving.. ' + event.key + ' ' + JSON.stringify(event.info));

                    // Method for updating board local client game state using info
                    // broadcasted to all players. The info variable contains the
                    // following keys:
                    // {player: {id: 1}, position: {x, y}, direction: 'walkRight'}
                    if (event.key === 'updatePlayer') {
                        var id = event.info.id;
                        var position = event.info.position;

                        // Don't update ourself (bug?)
                        if (event.info.id === self.player.id) { return; }

                        var player = self.getPlayerById(id);

                        // disable animations for now - lag?
                        if (player.character.object.sprite.body) {
                            clearTimeout(updateTimeout);

                            switch(event.info.direction) {
                                case 'walkUp':
                                    player.character.inputUp = true;
                                    player.character.updatePos();
                                    break;

                                case 'walkDown':
                                    player.character.inputDown = true;
                                    player.character.updatePos();
                                    break;

                                case 'walkLeft':
                                    player.character.inputLeft = true;
                                    player.character.updatePos();
                                    break;

                                case 'walkRight':
                                    player.character.inputRight = true;
                                    player.character.updatePos();
                                    break;
                               default:
                                    player.character.inputRight = false;
                                    player.character.inputLeft = false;
                                    player.character.inputUp = false;
                                    player.character.inputDown = false;
                                    break;
                            }

                            updateTimeout = setTimeout(function() {
                                player.character.object.position = position;
                                player.character.object.sprite.body.velocity.x = 0;
                                player.character.object.sprite.body.velocity.y = 0;
                            }, 200);
                        }
                    } else if (event.key === 'updateEnemy') {
                        if (self.player.id !== self.hostId) {
                            if (self.enemy) {
                                self.enemy.character.object.position = event.info.position;
                            }
                        }
                    // When new player joins, host shall send them data about the 'position'
                    } else if (event.key === 'newPlayer') {
                        if (self.player.id === self.hostId) {
                            var players = [];
                            for(playerId in self.players) {
                                var player = self.players[playerId];

                                players.push({
                                    id: player.id,
                                    name: player.name,
                                    position: player.character.object.position
                                });
                            }

                            var powerups = [];
                            for(row in self.powerups) {
                                for(column in self.powerups[row]) {
                                    var powerup = self.powerups[row][column];

                                    if (!powerup) { continue; }

                                    powerups.push({handler: {key: powerup.handler.key, state: powerup.handler.state}});
                                }
                            }

                            var gameData = {
                                player: {id: event.info.player.id},
                                enemy: {position: self.enemy.character.object.position},
                                powerups: powerups,
                                players: players
                            };

                            self.addEvent({key: 'welcomePlayer', info: gameData});
                        }

                        var player = self.getPlayerById(event.info.player.id);
                        player.name = event.info.player.name;
                        player.character.object.position = event.info.player.position;

                        console.log(event.info.player.id + ' has joined the game!');
                    // Set up game state as a new player receiving game data from host
                    } else if (event.key === 'welcomePlayer') {
                        if (self.player.id === event.info.player.id) {
                            // Setup players
                            event.info.players.forEach(function() {
                                var player = self.getPlayerById(event.info.player.id);
                                player.name = event.info.player.name;
                                if (event.info.player.position)
                                player.character.object.position = event.info.player.position;
                            });

                            // Setup enemy
                            self.enemy = new Enemy({
                                game: self.game,
                                speed: PLAYER_SPEED,
                                position: event.info.enemy.position
                            });

                            // Setup powerups
                            event.info.powerups.forEach(function(powerupInfo) {
                                var powerup = new Powerup({key: powerupInfo.handler.key, game: self.game, map: self.map, player: self.player, state: powerupInfo.handler.state});
                                powerup.handler.on('destroyed', (params) => { params.positions.forEach((position) => { self.powerups[position.x][position.y] = null; }); });

                                self.powerups[powerup.handler.state.position.x][powerup.handler.state.position.y] = powerup;
                            });
                        }


                    // Method for handling received deaths of other clients
                    } else if (event.key === 'playerKilled') {
                        var player = self.getPlayerById(event.info.player.id);
                        self.enemy.addPoints(player.points);
                        player.kill();
                    // Method for handling player leaves
                    } else if (event.key === 'removePlayer') {
                        if (self.players[event.info.player.id]) {
                            var player = self.players[event.info.player.id];
                            player.kill();

                            delete self.players[event.info.player.id];
                        }
                    // Method for handling spawned power ups by the host
                    } else if (event.key === 'powerupSpawned') {
                        // TODO: we already do this above, refactor it out
                        var powerup = new Powerup({key: event.info.handler.key, game: self.game, map: self.map, player: self.player, state: event.info.handler.state});
                        powerup.handler.on('started', () => { self.addEvent({key: 'foundPowerup', info: {player: {id: self.player.id}, state: powerup.handler.state}}); });
                        powerup.handler.on('destroyed', (params) => { params.positions.forEach((position) => { self.powerups[position.x][position.y] = null; }); });

                        self.powerups[powerup.handler.state.position.x][powerup.handler.state.position.y] = powerup;
                    // Method for handling spawned blocks by other players
                    } else if (event.key === 'foundPowerup') {
                        // TODO: we already do this above, refactor it out
                        var powerup = self.powerups[event.info.state.position.x][event.info.state.position.y];

                        if (powerup) {
                            self.powerups[event.info.state.position.x][event.info.state.position.y] = null;
                            powerup.player = self.getPlayerById(event.info.player.id);
                            powerup.handler.start();
                        }
                    // Method for handling spawned blocks by other players
                    } else if (event.key === 'blockSpawned') {
                        var block = self.game.add.sprite(event.info.x, event.info.y, 'gfx/blocks/glitch');
                        // block.key.copyRect('powerups', getRect(5, 4), 0, 0);
                        self.game.physics.arcade.enable(block, Phaser.Physics.ARCADE);
                        block.animations.add('glitch', [0,1,2], 12, true, true);
                        block.animations.play('glitch');
                        block.scale.x = 1.25;
                        block.scale.y = 1.25;
                        block.body.immovable = true;

                        // Make block fade in 2.0 seconds
                        self.game.add.tween(block).to({ alpha: 0 }, 2000, 'Linear', true, 0, -1);

                        self.blocks.push(block);
                        setTimeout(function() {
                            self.blocks = self.blocks.filter(function(b) {
                                return (b !== block);
                            });

                            block.destroy();
                        }, 2000);
                    } else if (event.key === 'setHost') {
                        self.hostId = event.info.player.id;

                        // If this player is the new host, lets set them up
                        if (self.hostId === self.player.id) {
                            console.log('Hey now the host, lets do this!');
                            self.runEnemySystem();
                            //self.runAiSystem();
                            self.runPowerUpSystem();
                        }
                    }
                },
                registerToEvents: function () {
                    var self = this;

                    // Method for receiving multiple events at once
                    // {events: [{key: 'eventName', info: {...data here...}]}
                    self.socket.on('events', function(data) {
                        data.events.forEach(function(event) { self.parseEvent(event); });
                    });

                    // Route all the events to the event parser
                    ['updatePlayer',
                     'updateEnemy',
                     'newPlayer',
                     'removePlayer',
                     'welcomePlayer',
                     'playerKilled',
                     'powerupSpawned',
                     'blockSpawned',
                     'foundPowerup',
                     'setHost'].forEach(function(key) {
                        self.socket.on(key, function(info) { self.parseEvent({key: key, info: info}); });
                    });
                },

                // Method to broadcast to  other clients (if there are any) that you have
                // joined the game
                joinGame: function () {return; // TODO: fix later
                    this.addEvent({key: 'newPlayer', info: {
                        player: {
                            id: this.player.id,
                            name: this.player.name,
                            position: this.player.character.object.position
                        }
                    }});
                }
            };
        }

        componentDidMount() {
            OrionV1.game.engine.state.add('Ingame', this.stateHandler);
            OrionV1.game.engine.state.start('Ingame');
        }

        render() {
            return (
                <View>
                    {this.stateInstance && this.stateInstance.playerElement}
                </View>
            );
        }
    }
    // class PreloadState extends React.Component {
    //     constructor() {
    //         super()

    //         this.stateHandler = function() {};

    //         this.stateHandler.prototype.preload = function(engine) {
    //         };

    //         this.stateHandler.prototype.create = function() {
    //         }
    //     }

    //     render() {
    //         return <View>preload state handler</View>;
    //     }
    // }
    class PreloadState extends React.Component {
        constructor() {
            super();
            var self = this;

            this.stateHandler = function() {};

            this.stateHandler.prototype.preload = function() {
                OrionV1.game.engine.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
                OrionV1.game.engine.scale.setUserScale(window.innerWidth / OrionV1.GAME_WIDTH, window.innerWidth / OrionV1.GAME_WIDTH);

                // enable crisp rendering
                OrionV1.game.engine.renderer.renderSession.roundPixels = true;
                Phaser.Canvas.setImageRenderingCrisp(OrionV1.game.engine.canvas);

                OrionV1.game.engine.add.plugin(Phaser.Plugin.Tiled);
            };

            this.stateHandler.prototype.create = function() {
                //  Progress report
                text = OrionV1.game.engine.add.text(32, 32, '', { fill: '#ffffff' });

                var text;
                function loadStart() {
                    text.setText("Loading ...");
                }
                function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
                    text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
                }
                function loadComplete() {
                    text.setText("Load Complete");
                    console.log('load complete!');
                    // OrionV1.game.engine.load.onLoadStart.removeAll();
                    // OrionV1.game.engine.load.onFileComplete.removeAll();
                    // OrionV1.game.engine.load.onLoadComplete.removeAll();
                    // switch to start screen
                    self.props.onLoad();
                }
                // OrionV1.game.engine.load.onLoadComplete.addOnce(OrionV1.game.engine.onLoadComplete, this);
                // OrionV1.game.engine.load.setPreloadSprite(OrionV1.game.engine.asset);
                OrionV1.game.engine.load.onLoadStart.addOnce(loadStart, this);
                OrionV1.game.engine.load.onFileComplete.add(fileComplete, this);
                OrionV1.game.engine.load.onLoadComplete.addOnce(loadComplete, this);

                var assetsPath = 'Game/Assets/';

                // Screens
                OrionV1.game.engine.load.image('ui/screens/launch', assetsPath + 'UI/screens/launch.png');

                // Effects
                OrionV1.game.engine.load.image('gfx/effects/pellet', assetsPath + 'GFX/effects/pellet.png');

                // Emitters
                OrionV1.game.engine.load.image('gfx/emitters/blueball', assetsPath + 'GFX/emitters/blueball.png');
                OrionV1.game.engine.load.image('gfx/emitters/brownie', assetsPath + 'GFX/emitters/brownie.png');

                // UI
                OrionV1.game.engine.load.spritesheet('gfx/overlays/countdown', assetsPath + 'GFX/overlays/countdown.png', 29, 27, 3);

                // Buffs
                OrionV1.game.engine.load.image('gfx/buffs/general', assetsPath + 'GFX/buffs/general.png');
                OrionV1.game.engine.load.spritesheet('gfx/buffs/aura-1', assetsPath + 'GFX/buffs/aura-1.png', 1, 2, 3, 4, 5, 6);
                OrionV1.game.engine.load.spritesheet('gfx/buffs/speed-boost', assetsPath + 'GFX/buffs/speed-boost.png', 32, 32, 6);
                OrionV1.game.engine.load.spritesheet('gfx/buffs/saiyan', assetsPath + 'GFX/buffs/saiyan.png', 32, 32, 7);

                // Blocks
                OrionV1.game.engine.load.spritesheet('gfx/blocks/glitch', assetsPath + 'GFX/blocks/glitch.png', 32, 32, 3);

                // Map
                OrionV1.game.engine.load.pack('map', assetsPath + 'GFX/maps/general.json');

                // Characters
                OrionV1.game.engine.load.atlasJSONHash('gfx/characters', assetsPath + 'GFX/Characters/characters.png', assetsPath + 'GFX/Characters/characters.json');

                // Audio
                OrionV1.game.engine.load.audio('audio/bg-0002', [assetsPath + 'audio/bg-0002.mp3']);

                OrionV1.game.engine.load.start();
            }
        }

        componentDidMount() {
            OrionV1.game.engine.state.add('Preload', this.stateHandler);
            OrionV1.game.engine.state.start('Preload');
        }

        render() {
            return <View>preload state handler</View>;
        }
    }
    class StartState extends React.Component {
        constructor() {
            super();
            var self = this;

            this.stateHandler = function() {};

            this.stateHandler.prototype.create = function() {
                if (OrionV1.debug) {
                    OrionV1.game.engine.add.plugin(Phaser.Plugin.Debug);
                }

                OrionV1.game.engine.stage.setBackgroundColor(0x000000);
                // var bg = OrionV1.game.engine.add.sprite(0, 0, 'ui/screens/launch');
                // var ratio = bg.height / bg.width;
                // bg.width = OrionV1.GAME_WIDTH;
                // bg.height = bg.width * ratio;

                OrionV1.game.startKey = OrionV1.game.engine.input.keyboard.addKey(Phaser.Keyboard.ENTER);
                OrionV1.game.musicKey = OrionV1.game.engine.input.keyboard.addKey(Phaser.Keyboard.M);

                //window.UI_state.screenKey = 'start';
                //window.UI_controller.setState(window.UI_state);

                //this.fitToWindow(game);

                OrionV1.game.engine.music = OrionV1.game.engine.add.audio('audio/bg-0002', 1, true);
                OrionV1.game.engine.music.play('', 0, 1, true);
            };

            this.stateHandler.prototype.update = function() {
                if (OrionV1.game.startKey.isDown) {
                    self.props.onStart();
                }

                if (OrionV1.game.musicKey.isDown) {
                    OrionV1.game.engine.music.mute = !OrionV1.game.engine.music.mute;
                }
            };

            this.stateHandler.prototype.fitToWindow = function() {
                OrionV1.game.engine.canvas.style['width'] = '100%';
                OrionV1.game.engine.canvas.style['height'] = '100%';
            };

            this.stateHandler.prototype.render = function() {
                this.fitToWindow();
            };
        }

        componentDidMount() {
            OrionV1.game.engine.state.add('Start', this.stateHandler);
            OrionV1.game.engine.state.start('Start');
        }

        render() {
            return <View>start state handler</View>;
        }
    }

    var props3 = {
        width: OrionV1.GAME_WIDTH,
        height: OrionV1.GAME_HEIGHT,
        onPreload: function(game) {
        },
        onCreate: function(game) {
        },
        onUpdate: function(game) {
        },
        onRender: function(game) {
            //this.fitToWindow(game);
        },
        fitToWindow: function(game) {
            game.engine.canvas.style['width'] = '100%';
            game.engine.canvas.style['height'] = '100%';
            //document.getElementById('game').style['width'] = OrionV1.getWidthRatioScale() * 100 + '%';
            //document.getElementById('game').style['height'] = OrionV1.getHeightRatioScale() * 100 + '%';
            //window.onresize();
        }
    };

    var props2 = {
        currentHealth: 700,
        maxHealth: 1000,
        currentMana: 500,
        maxMana: 750,
        currentExperience: 2000,
        maxExperience: 5000,
        menuItems: [
            {title: 'Character', menuId: 3},
            {title: 'Inventory', menuId: 43},
            {title: 'Skills', menuId: 3},
            {title: 'Party', menuId: 13},
            {title: 'Settings', menuId: 93}
        ],
        actionBar: {
            maxItems: 8,
            items: [
                {title: 'Attack', skillId: 43, slotId: 1},
                {title: 'Fireball', skillId: 74, slotId: 2},
                {title: 'Frozen Orb', skillId: 13, slotId: 4, isLeft: true},
                {title: 'Lightning Shield', skillId: 4, slotId: 6},
                {title: 'Static', skillId: 46, slotId: 7, isRight: true},
                {title: 'Health Potion', skillId: 86, slotId: 3}
            ]
        }
    };
    var StartScreen = React.createClass({
        getInitialState: function() {
            return {instantActionTimer: 5};
        },
        tick: function() {
            this.setState({instantActionTimer: this.state.instantActionTimer - 1});

            if (this.state.instantActionTimer === 0) {
                clearInterval(this.interval);

                this.props.onStart();
                //OrionV1.game.engine.state.start('Ingame');
            }
        },
        componentDidMount: function() {
            this.interval = setInterval(this.tick, 1000);
        },
        componentWillUnmount: function() {
            clearInterval(this.interval);
        },
        _clickHost: function() {console.log('click host');
            console.log(OrionV1.game.engine.state, OrionV1.game);
            //window.UI_state.screenKey = 'hostGame';
            //window.UI_controller.setState(window.UI_state);
        },
        _clickJoin: function() {console.log('click join');
            //window.UI_state.screenKey = 'joinGame';
            //window.UI_controller.setState(window.UI_state);
        },
        _clickInstantAction: function() {
            //OrionV1.game.engine.state.start('Ingame');
        },

        render: function() {
            return (
                <View style={styles.container}>
                    <View style={styles.hostButton} onClick={this._clickHost}>HOST GAME</View>
                    <View style={styles.joinButton} onClick={this._clickJoin}>JOIN GAME</View>
                    <View style={styles.instantActionButton} onClick={this._clickInstantAction}>INSTANT ACTION</View>
                    <View style={styles.countdown}><br />Instant action in... {this.state.instantActionTimer}</View>
                </View>
            );
        }
    });
    var styles = {
        container: {
            position: 'absolute',
            top: 320,
            left: 570,
            width: 235,
            height: 200,
            padding: '20px 0px 0px 10px',
            opacity: 0.9,
            background: '#01242C',
            border: '3px solid #fff',
            borderRadius: '0px'
        },
        hostButton: {
            width: 185,
            height: 55,
            'font-family': '"Press Start 2P"',
            'font-size': '17px',
            'text-align': 'center',
            'color': '#fff',
            'padding': '18px 15px',
        },
        joinButton: {
            width: 185,
            height: 55,
            'font-family': '"Press Start 2P"',
            'font-size': '17px',
            'text-align': 'center',
            'color': '#fff',
            'padding': '18px 15px',
        },
        instantActionButton: {
            width: 215,
            height: 55,
            'font-family': '"Press Start 2P"',
            'font-size': '14px',
            'text-align': 'center',
            'color': '#fff',
            'padding': '10px 15px',
            'line-height': '17px'
        },
        countdown: {
            'font-family': '"Press Start 2P"',
            'font-size': '8px',
            'padding': '12px 0 0 0',
            'text-align': 'center',
            'color': '#fff',
        }
    };
    class AwesomeGame extends React.Component {
        constructor() {
            super();
        }

        onInit = (engine) => {
            OrionV1.game = {engine: engine};
            this.screenKey = 'preload';
            this.forceUpdate();
        }

        onLoad = () => {
            this.screenKey = 'start';
            this.forceUpdate();
        }

        onStart = () => {
            this.screenKey = 'ingame';
            this.forceUpdate();
        }

        render() {
            return (
                <View style={{'position': 'relative', 'width': '800px', 'height': '800px'}}>
                    <Game {...props3} key="d" onInit={this.onInit}>
                        {this.screenKey === 'preload' && <PreloadState onLoad={this.onLoad} />}
                        {this.screenKey === 'start' && <StartState onStart={this.onStart} />}
                        {this.screenKey === 'ingame' && <IngameState />}
                    </Game>
                    <BottomMenu {...props2} style={{'position': 'absolute', 'top': '600px', 'left': '0px', 'width': '800px'}} />
                </View>
            );
        }
    }
    <AwesomeGame />
