class Powerup extends GameObject {
    toString() { `[Powerup handler={this.key}]` }

    static get handlers() {
        return {
            'SaiyanMode': SaiyanMode,
            'GhostMode': GhostMode,
            'InvincibleMode': InvincibleMode,
            'SpeedBoost': SpeedBoost,
            'ReverseMode': ReverseMode,
            'RageMode': RageMode,
            'Teleport': Teleport,
            'Portal': Portal
        }
    }

    init(params) {
        super.init(params);

        // Events
        this.onStarted = params.onStarted;
        this.onDestroyed = params.onDestroyed;

        // TODO: this guy should move a lot of this logic over to GamePlugin
        this.key = params.key;
        this.handler = new Powerup.handlers[params.key](params);
        this.handler.setup();
    }
}



class PowerupHandler {
    constructor(params) {
        this.spriteMode = null;
        this.finished = false;
        this.claimed = false;
        this.state = {};
        this.fadeTime = 15000;
        this.durationTime = 4000;

        Object.assign(this, params);
    }

    on(type, cb) {
        this['_on' + type] = this['_on' + type] || [];
        this['_on' + type].push(cb);
    }

    emit(type, args) {
        this['_on' + type] && this['_on' + type].forEach((cb) => { cb(args) });
    }

    _getRect(x, y) {
        return new Phaser.Rectangle(16 * (x-1), 16 * (y-1), 16, 16);
    }

    setup() {
        if (!this.state.position) {
            this.state.position = Hackatron.game.state.states.Game.getValidPosition();
        }

        if (this.spriteMode === 'key') {
            this.sprite = this.game.add.sprite(this.state.position.x * 16, this.state.position.y * 16, this.spriteKey);
            this.sprite.animations.add('buffLoop', this.spriteLoop, 6, true, true);
            this.sprite.animations.play('buffLoop');
            this.sprite.scale.x = 0.8;
            this.sprite.scale.y = 0.8;
        } else if (this.spriteMode === 'tilemap') {
            this.sprite = this.game.add.sprite(this.state.position.x * 16, this.state.position.y * 16, this.game.add.bitmapData(16, 16));
            this.sprite.key.copyRect(this.spriteTilemap, this._getRect(this.spritePosition.row, this.spritePosition.column), 0, 0);
            this.sprite.scale.x = 1.2;
            this.sprite.scale.y = 1.2;
        }

        this.game.add.tween(this.sprite).to({alpha: 0}, this.fadeTime, 'Linear', true, 0, -1);
        this.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);

        this.onSetup();

        setTimeout(this.destroy.bind(this), this.fadeTime);
    }

    update() {
        this.game.physics.arcade.overlap(this.player.character.sprite, this.sprite, this.start.bind(this), null, this.game);

        this.onUpdated();
    }

    start() {
        if (this.claimed) { return; }

        this.claimed = true;
        this.destroy();

        this.onStarted();
        this.emit('started');

        setTimeout(this.stop.bind(this), this.durationTime);

        console.log('Powerup START: ' + this.name);
    }

    stop() {
        this.finished = true;
        console.log('Powerup STOP: ' + this.name);
    }

    destroy() {
        this.sprite.destroy();

        this.onDestroyed();
        this.emit('destroyed');
    }

    onSetup() {}
    onStarted() {}
    onStopped() {}
    onUpdated() {}
    onDestroyed() {}
}

// Handlers

class SaiyanMode extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Saiyan mode';
        this.spriteMode = 'key';
        this.spriteKey = 'saiyanMode';
        this.spriteLoop = [0,1,2,3,4,5,6];
    }
}


class GhostMode extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Ghost mode';
        this.spriteMode = 'tilemap';
        this.spriteTilemap = 'powerups';
        this.spritePosition = {row: 1, column: 2};
    }
}


class InvincibleMode extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Invincible mode';
        this.spriteMode = 'tilemap';
        this.spriteTilemap = 'powerups';
        this.spritePosition = {row: 1, column: 2};
    }

    onStarted() {
        this.tween = this.game.add.tween(this.player.character.sprite).to({alpha: 0}, 400, 'Linear', true, 0, -1);
    }

    onStopped() {
        this.tween.stop();
        this.tween = this.game.add.tween(this.player.character.sprite).to({alpha: 1}, 0, 'Linear', true, 0);
    }
}


class RageMode extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Rage mode';
        this.spriteMode = 'tilemap';
        this.spriteTilemap = 'powerups';
        this.spritePosition = {row: 1, column: 1};
    }

    onStarted() {
        var width = 32;
        var height = 32;
        var padding = 0.75; // 75% padding
        this.player.character.sprite.body.setSize(width * (1 - padding), height * (1 - padding), width * padding, height * padding);
        this.player.character.sprite.scale.x = 1.5;
        this.player.character.sprite.scale.y = 1.5;
    }

    onStopped() {
        // set back original
        var width = 32;
        var height = 32;
        var padding = 0.35; // 35% padding
        this.player.character.sprite.body.setSize(width * (1 - padding), height * (1 - padding), width * padding, height * padding);
        this.player.character.sprite.scale.x = 0.8;
        this.player.character.sprite.scale.y = 0.8;
    }
}


class SpeedBoost extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Speed boost';
        this.spriteMode = 'key';
        this.spriteTilemap = 'speedBoost';
        this.spriteLoop = [0,1,2,3,4,5];
    }

    onStarted() {
        this.player.character.speed *= 2;
    }

    onStopped() {
        this.player.character.speed /= 2;
    }
}


class ReverseMode extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Reverse mode';
        this.spriteMode = 'tilemap';
        this.spriteTilemap = 'powerups';
        this.spritePosition = {row: 2, column: 2};
    }

    onStarted() {
        this.player.character.speed *= -1;
    }

    onStopped() {
        this.player.character.speed *= -1;
    }
}


class Teleport extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Teleport';
        this.spriteMode = 'tilemap';
        this.spriteTilemap = 'powerups';
        this.spritePosition = {row: 1, column: 7};
    }

    onStarted() {
        this.player.character.teleport(Hackatron.game.state.states.Game.getValidPosition());
    }
}


class Portal extends PowerupHandler {
    constructor(params) {
        super(params);
        this.name = 'Portal';
        this.spriteMode = 'custom';
    }

    setup(state) {
        if (!this.state.entryPortalPosition) {
            this.state.entryPortalPosition = Hackatron.game.state.states.Game.getValidPosition();
        }

        if (!this.state.exitPortalPosition) {
            this.state.exitPortalPosition = Hackatron.game.state.states.Game.getValidPosition();
        }

        // kind of a hack.. doesn't put exit in the array of powerups :-/
        // TODO: should have an array of positions the powerup uses in an array in state and use that
        this.state.position = this.state.entryPortalPosition;

        //console.log('entry x: ' + entryPortalPosition.x * 16 + '\ny: ' + entryPortalPosition.y * 16);
        //console.log('exit x: ' + exitPortalPosition.x * 16 + '\ny: ' + exitPortalPosition.y * 16);

        this.entryPortal = this.game.add.sprite(this.state.entryPortalPosition.x * 16, this.state.entryPortalPosition.y * 16, this.game.add.bitmapData(16, 16));
        this.entryPortal.key.copyRect('powerups', this._getRect(1, 7), 0, 0);
        this.entryPortal.scale.x = 1.2;
        this.entryPortal.scale.y = 1.2;
        this.game.add.tween(this.entryPortal).to({alpha: 0}, this.fadeTime, 'Linear', true, 0, -1);

        this.exitPortal = this.game.add.sprite(this.state.exitPortalPosition.x * 16, this.state.exitPortalPosition.y * 16, this.game.add.bitmapData(16, 16));
        this.exitPortal.key.copyRect('powerups', this._getRect(17, 7), 0, 0);
        this.exitPortal.scale.x = 1.2;
        this.exitPortal.scale.y = 1.2;
        this.game.add.tween(this.exitPortal).to({alpha: 0}, this.fadeTime, 'Linear', true, 0, -1);

        this.game.physics.arcade.enable(this.entryPortal, Phaser.Physics.ARCADE);
        this.game.physics.arcade.enable(this.exitPortal, Phaser.Physics.ARCADE);

        this.onSetup();

        setTimeout(this.destroy.bind(this), this.fadeTime);
    }

    start(type) {
        if (this.claimed) { return; }

        this.claimed = true;
        if (type === 'entry') {
            this.player.character.teleport(this.exitPortal);
        } else if (type === 'exit') {
            this.player.character.teleport(this.entryPortal);
        }

        this.destroy();
        setTimeout(this.stop.bind(this), this.durationTime);

        this.onStarted();

        console.log('Powerup START: Portal');
    }

    update() {
        this.game.physics.arcade.overlap(this.player.character.sprite, this.entryPortal, this.start.bind(this, 'entry'), null, this.game);
        this.game.physics.arcade.overlap(this.player.character.sprite, this.exitPortal, this.start.bind(this, 'exit'), null, this.game);

        this.onUpdated();
    }

    stop() {
        this.finished = true;
        console.log('Powerup STOP: Portal');

        this.onStopped();
    }

    destroy() {
        this.entryPortal.destroy();
        this.exitPortal.destroy();

        this.onDestroyed();
    }
}

