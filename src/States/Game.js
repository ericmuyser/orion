Hackatron = {
    skipIntro: true
};

Hackatron.Game = function(game) {
    this.enemy = null;
    this.hostId = null;
    this.player = null;
    this.blocks = [];
    this.players = null;
};

var PLAYER_SPEED = 200;
var UPDATE_INTERVAL = 100;
var POWERUP_SPAWN_INTERVAL = 1000;

var updateTimeout;

Hackatron.Game.prototype = {
    preload: function() {
    },

    toggleFullscreen: function() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        } else {
            this.game.scale.startFullScreen();
        }
    },

    getValidPosition: function() {
        var position = null;

        while (!position) {
            var x = this.game.rnd.integerInRange(0, 31);
            var y = this.game.rnd.integerInRange(0, 31);
            // mapData goes top to down and left to right
            var cell = this.map.data[y][x].index;

            //console.log(cell);

            if (cell === Hackatron.mapConfig.floorTile) {
                position = {x: x, y: y};
            }
        }

        //console.log(position);

        return position;
    },

    create: function() {
        this.players = {};
        this.socket = io.connect();
        this.events = [];

        this.initPhysics();
        this.initMap();
        this.initPlayer();
        this.initCountdown();
        this.initSFX();
        this.initHotkeys();
        this.initPowerUps();

        // Register to listen to events and inform
        // other players that you have joined the game
        this.registerToEvents();
        this.joinGame();

        this.initEvents();
    },

    initEvents: function() {
        var self = this;

        setInterval(this.broadcastEvents.bind(this), 100);

        var lastUpdateInfo = null;

        // Send player position every 50ms
        setInterval(function() {
            self.player.character.updatePos();

            if (!self.player.character.dirty) { return; }

            var info = {
                id: self.player.id,
                position: self.player.character.position,
                direction: self.player.character.direction
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
            if (self.player.id === self.hostId) {
                self.enemy.character.updatePos();

                if (!self.enemy.character.dirty) { return; }

                self.enemy.character.dirty = false;

                var info = {
                    position: self.enemy.character.position,
                    direction: self.enemy.character.direction
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
        this.ai = new AI();
        this.ai.init({game: this.game, player: this.player, enemy: this.enemy, map: this.map});
    },

    runEnemySystem: function() {
        // Create enemy for the host
        if (!this.enemy) {
            var position = this.getValidPosition();

            this.enemy = new Enemy();
            this.enemy.init({
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
            name: Hackatron.playerName,
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

        this.player = new Player();
        this.player.init(playerParams);
    },

    initMap: function() {
        this.map = new Map2D();
        this.map.init({game: this.game, player: this.player, enemy: this.enemy});

        var start = this.map.tilemap.objects['GameObjects'][0];
        var end = this.map.tilemap.objects['GameObjects'][1];

        var teleStart = new Phaser.Rectangle(start.x, start.y, start.width, start.height);
        var teleEnd = new Phaser.Rectangle(end.x, end.y, end.width, end.height);

        // TODO: do stuff with tele points
    },

    initCountdown: function() {
        var countdown = new Countdown();
        countdown.init(this.game);
        countdown.start();
    },

    initSFX: function() {
        // var fx = this.game.add.audio('sfx');
        // fx.addMarker('monsterRoar', 2, 1.2);
        // fx.addMarker('playerEaten', 5, 0.5);
        // fx.addMarker('playerInWater', 7, 0.5);
        // fx.addMarker('jump', 0, 0.24);
    },

    initPowerUps: function() {
        var self = this;

        this.powerups = [];
        for (var i = 0; i < 32; i++) {
            this.powerups.push([]);
        }

        setInterval(function() {
            this.powerups.forEach(function(row) {
                row.forEach(function(powerup) {
                    if (powerup && powerup.handler.ended) {
                        self.powerups[row][powerup] = null;
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
            var powerup = new Powerup();
            powerup.init({key: randomHandler, game: this.game, map: this.map, player: this.player});
            powerup.handler.on('started', () => { self.addEvent({key: 'foundPowerup', info: {state: powerup.handler.state, player: {id: self.player.id}}}); });
            powerup.handler.on('destroyed', () => { self.powerups[powerup.handler.state.position.x][powerup.handler.state.position.y] = null; });

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

        console.log('Broadcasting events...', JSON.stringify({events: this.events}));

        this.socket.emit('events', JSON.stringify({events: this.events}));
        this.events = [];
    },
    update: function() {
        var self = this;

        var collisionHandler = function() {
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

        var block = self.player.character.triggerAttack(self.blocks);

        if (block !== null) {
            this.addEvent({key: 'blockSpawned', info: {
                x: block.x,
                y: block.y
            }})

            self.blocks.push(block);
        }

        self.game.physics.arcade.collide(self.player.character.sprite, self.map.layer);
        if (self.enemy) {
            self.game.physics.arcade.collide(self.enemy.character.sprite, self.map.layer);
            self.game.physics.arcade.overlap(self.enemy.character.sprite, self.player.character.sprite, collisionHandler, null, self.game);
        }

        self.powerups.forEach(function(row) {
            row.forEach(function(powerup) {
                if (powerup) {
                    powerup.handler.update();
                }
            });
        });

        self.blocks.forEach(function(block) {
            console.log(block);
            self.game.physics.arcade.collide(self.player.character.sprite, block);
        });
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
                var pellet = this.add.sprite(x*16+2, y*16+2, 'pellet');
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

        var player = new Player();

        player.init({
            id: playerId,
            name: playerId.substring(0, 2),
            game: this.game,
            speed: PLAYER_SPEED
        });

        this.players[playerId] = player;

        this.game.physics.arcade.collide(player.character.sprite, this.map.layer);
        this.game.physics.arcade.collide(player.character.sprite, this.player.character.sprite, null, null, this.game);

        return player;
    },

// ============================================================================
//                          Socket Event Handlers
// ============================================================================
    parseEvent: function(event) {
        var self = this;
        console.log('Receiving.. ' + event.key + ' ' + JSON.stringify(event.info));

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
            if (player.character.sprite.body) {
                clearTimeout(updateTimeout);

                player.character.sprite.animations.play(event.info.direction, 3, false);
                player.character.sprite.emitter.on = true;

                switch(event.info.direction) {
                    case 'walkUp':
                        player.character.sprite.body.velocity.x = 0;
                        player.character.sprite.body.velocity.y = -PLAYER_SPEED;
                        player.character.sprite.emitter.x = player.character.sprite.x + 15;
                        player.character.sprite.emitter.y = player.character.sprite.y + 35;
                        break;

                    case 'walkDown':
                        player.character.sprite.body.velocity.x = 0;
                        player.character.sprite.body.velocity.y = PLAYER_SPEED;
                        player.character.sprite.emitter.x = player.character.sprite.x + 15;
                        player.character.sprite.emitter.y = player.character.sprite.y + -5;
                        break;

                    case 'walkLeft':
                        player.character.sprite.body.velocity.y = 0;
                        player.character.sprite.body.velocity.x = -PLAYER_SPEED;
                        player.character.sprite.emitter.x = player.character.sprite.x + 30;
                        player.character.sprite.emitter.y = player.character.sprite.y + 15;
                        break;

                    case 'walkRight':
                        player.character.sprite.body.velocity.y = 0;
                        player.character.sprite.body.velocity.x = PLAYER_SPEED;
                        player.character.sprite.emitter.x = player.character.sprite.x;
                        player.character.sprite.emitter.y = player.character.sprite.y + 15;
                        break;
                   default:
                        player.character.sprite.emitter.on = false;
                        break;
                }

                updateTimeout = setTimeout(function() {
                    player.character.position = position;
                    player.character.sprite.body.velocity.x = 0;
                    player.character.sprite.body.velocity.y = 0;
                }, 200);
            }
        } else if (event.key === 'updateEnemy') {
            if (self.player.id !== self.hostId) {
                if (self.enemy) {
                    self.enemy.character.position = event.info.position;
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
                        position: player.character.position
                    });
                }

                var powerups = [];
                for(row in self.powerups) {
                    for(column in self.powerups[row]) {
                        var powerup = self.powerups[row][column];

                        if (!powerup) { continue; }

                        powerups.push({handler: { key: powerup.handler.key, state: powerup.handler.state }});
                    }
                }

                var gameData = {
                    player: {id: event.info.player.id},
                    enemy: {position: self.enemy.character.position},
                    powerups: powerups,
                    players: players
                };

                self.addEvent({key: 'welcomePlayer', info: gameData});
            }

            var player = self.getPlayerById(event.info.player.id);
            player.name = event.info.player.name;
            player.character.position = event.info.player.position;

            console.log(event.info.player.id + ' has joined the game!');
        // Set up game state as a new player receiving game data from host
        } else if (event.key === 'welcomePlayer') {
            if (self.player.id === event.info.player.id) {
                // Setup players
                event.info.players.forEach(function() {
                    var player = self.getPlayerById(event.info.player.id);
                    player.name = event.info.player.name;
                    player.character.position = event.info.player.position;
                });

                // Setup enemy 
                self.enemy = new Enemy();

                self.enemy.init({
                    game: self.game,
                    speed: PLAYER_SPEED,
                    position: event.info.enemy.position
                });

                // Setup powerups
                event.info.powerups.forEach(function(powerupInfo) {
                    var powerup = new Powerup();
                    powerup.init({key: powerupInfo.handler.key, game: self.game, map: self.map, player: self.player, state: powerupInfo.handler.state});
                    powerup.handler.on('destroyed', () => { self.powerups[powerup.handler.state.position.x][powerup.handler.state.position.y] = null; });

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
            var powerup = new Powerup();
            powerup.init({key: event.info.handler.key, game: self.game, map: self.map, player: self.player, state: event.info.handler.state});
            powerup.handler.on('started', () => { self.addEvent({key: 'foundPowerup', info: {player: {id: self.player.id}, state: powerup.handler.state}}); });
            powerup.handler.on('destroyed', () => { self.powerups[powerup.handler.state.position.x][powerup.handler.state.position.y] = null; });

            self.powerups[powerup.handler.state.position.x][powerup.handler.state.position.y] = powerup;
        // Method for handling spawned blocks by other players
        } else if (event.key === 'foundPowerup') {
            // TODO: we already do this above, refactor it out
            var powerup = self.powerups[event.info.handler.state.position.x][event.info.handler.state.position.y];

            if (powerup) {
                self.powerups[event.info.handler.state.position.x][event.info.handler.state.position.y] = null;
                powerup.player = self.getPlayerById(event.info.player.id);
                powerup.handler.start();
            }
        // Method for handling spawned blocks by other players
        } else if (event.key === 'blockSpawned') {
            var block = self.game.add.sprite(event.info.x, event.info.y, 'glitch');
            // block.key.copyRect('powerups', getRect(5, 4), 0, 0);
            self.game.physics.arcade.enable(block, Phaser.Physics.ARCADE);
            block.animations.add('glitchLoop', [0,1,2], 12, true, true);
            block.animations.play('glitchLoop');
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
                // self.runAiSystem();
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
    joinGame: function () {
        this.addEvent({key: 'newPlayer', info: {
            player: {
                id: this.player.id,
                name: this.player.name,
                position: this.player.character.position
            }
        }});
    }
};