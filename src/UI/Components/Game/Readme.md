Basic game:

    var props = {
        width: 500,
        height: 500
    };

    <Game {...props} />

Ship Trail:

    var sprite;
    var bmd;
    var props = {
        width: 800,
        height: 600,
        onPreload: function(game) {
            game.engine.load.image('chunk', 'Assets/tmp/chunk.png');
            game.engine.load.image('arrow', 'Assets/tmp/asteroids_ship.png');
        },
        onCreate: function(game) {
            function launch() {
                if (game.engine.input.x < sprite.x)
                {
                    sprite.body.velocity.setTo(-200, -200);
                }
                else
                {
                    sprite.body.velocity.setTo(200, -200);
                }
            }

            game.engine.physics.startSystem(Phaser.Physics.ARCADE);

            //  Click on the left or right of the game to shoot the space ship in that direction

            game.engine.stage.backgroundColor = '#124184';

            bmd = game.engine.add.bitmapData(800, 600);
            bmd.context.fillStyle = '#ffffff';

            var bg = game.engine.add.sprite(0, 0, bmd);

            game.engine.physics.arcade.gravity.y = 100;

            sprite = game.engine.add.sprite(32, 450, 'arrow');
            sprite.anchor.set(0.5);

            game.engine.physics.enable(sprite, Phaser.Physics.ARCADE);

            sprite.body.collideWorldBounds = true;
            sprite.body.bounce.set(0.8);

            game.engine.input.onDown.add(launch, this);
        },
        onUpdate: function(game) {
            sprite.rotation = sprite.body.angle;

            bmd.context.fillRect(sprite.x, sprite.y, 2, 2);

            bmd.dirty = true;
        },
        onRender: function(game) {
            game.engine.debug.bodyInfo(sprite, 32, 32);
        }
    };
    
    <Game {...props} key="a" />


RPG:

    var sprite;
    var bmd;
    var props = {
        width: 800,
        height: 600,
        onPreload: function(game) {
            game.engine.load.image('chunk', 'Assets/tmp/chunk.png');
            game.engine.load.image('arrow', 'Assets/tmp/asteroids_ship.png');
        },
        onCreate: function(game) {
            function launch() {
                if (game.engine.input.x < sprite.x)
                {
                    sprite.body.velocity.setTo(-200, -200);
                }
                else
                {
                    sprite.body.velocity.setTo(200, -200);
                }
            }

            game.engine.physics.startSystem(Phaser.Physics.ARCADE);

            //  Click on the left or right of the game to shoot the space ship in that direction

            game.engine.stage.backgroundColor = '#124184';

            bmd = game.engine.add.bitmapData(800, 600);
            bmd.context.fillStyle = '#ffffff';

            var bg = game.engine.add.sprite(0, 0, bmd);

            game.engine.physics.arcade.gravity.y = 100;

            sprite = game.engine.add.sprite(32, 450, 'arrow');
            sprite.anchor.set(0.5);

            game.engine.physics.enable(sprite, Phaser.Physics.ARCADE);

            sprite.body.collideWorldBounds = true;
            sprite.body.bounce.set(0.8);

            game.engine.input.onDown.add(launch, this);
        },
        onUpdate: function(game) {
            sprite.rotation = sprite.body.angle;

            bmd.context.fillRect(sprite.x, sprite.y, 2, 2);

            bmd.dirty = true;
        },
        onRender: function(game) {
            game.engine.debug.bodyInfo(sprite, 32, 32);
        }
    };

    var props2 = {
        currentHealth: 500,
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

    <View>
        <Game {...props} key="b" />
        <BottomMenu {...props2} style={{'width': '800px', 'margin-top': '-150px'}} />
    </View>