import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../Vendor/ReactFakeNative');

import GameObject from '../GameObject';

class Character extends Component {
    toString() { '[Character]' }

    static propTypes = {
        key: PropTypes.string
    };

    static defaultProps = {
        key: 'tron'
    };

    componentDidMount() {
        this.handler = this.props.params.handler;
        this.isAlive = true;
        this.dirty = false;
        this.points = 0;
        this.game = this.props.params.game;
        this.speed = this.props.params.speed;
        this.emitterKey = this.props.params.emitterKey;
        this.assetKey = this.props.params.assetKey;

        this.objectElement = <GameObject {...this.props.params} onInit={(object) => {
            this.object = object;
            //this._addEmitterToSprite();
            this._addAnimationsToSprite();
            this.props.onInit(this);
        }} />;
        this.forceUpdate();
    }

    removePoints() {
        this.points -= points;

        if (this.points < 0) {
            this.points = 0;
        }
    }

    addPoints(points) {
        this.points += points;
    }

    kill() {
        this.isAlive = false;
        this.points = 0;

        if (this.object.sprite.emitter) {
            this.object.sprite.emitter.destroy();
        }

        this.object.sprite.destroy();
    }

    _addEmitterToSprite() {
        var emitter = this.game.add.emitter(this.object.sprite.x, this.object.sprite.y, 50);
        emitter.width = 5;
        emitter.makeParticles(this.emitterKey);
        emitter.setXSpeed();
        emitter.setYSpeed();
        emitter.setRotation();
        emitter.setAlpha(1, 0.4, 800);
        emitter.setScale(0.2, 0.05, 0.2, 0.05, 2000, Phaser.Easing.Quintic.Out);
        emitter.start(false, 250, 1);

        this.object.sprite.emitter = emitter;

        this.aura = this.game.add.object.sprite(this.position.x, this.position.y, 'gfx/buffs/aura-1');
        this.aura.scale.x = 0.8;
        this.aura.scale.y = 0.8;

        this.object.sprite.addChild(this.aura);
    }

    changeSkin(key) {
        var oldKey = this.assetKey;
        var oldFrameName = this.object.sprite.frameName;

        this.object.sprite.animations.getAnimation('walkUp').destroy();
        this.object.sprite.animations.getAnimation('walkDown').destroy();
        this.object.sprite.animations.getAnimation('walkLeft').destroy();
        this.object.sprite.animations.getAnimation('walkRight').destroy();

        this.assetKey = key;

        this._addAnimationsToSprite();
        this.object.sprite.frameName = oldFrameName.replace(oldKey, key);
    }

    _addAnimationsToSprite() {
        // Phaser.Animation.generateFrameNames(this.assetKey + '/walkDown/', 1, 3, '', 2)
        // is equal to: [
        // this.assetKey + '/walkDown/0001', 
        // this.assetKey + '/walkDown/0002', 
        // this.assetKey + '/walkDown/0003'
        // ]

        this.object.sprite.animations.add('walkUp', Phaser.Animation.generateFrameNames(this.assetKey + '/walkUp-', 1, 3, '', 4), 3, false, false);
        this.object.sprite.animations.add('walkDown', Phaser.Animation.generateFrameNames(this.assetKey + '/walkDown-', 1, 3, '', 4), 3, false, false);
        this.object.sprite.animations.add('walkLeft', Phaser.Animation.generateFrameNames(this.assetKey + '/walkLeft-', 1, 3, '', 4), 3, false, false);
        this.object.sprite.animations.add('walkRight', Phaser.Animation.generateFrameNames(this.assetKey + '/walkRight-', 1, 3, '', 4), 3, false, false);
    }

    lock() {
        this.object.sprite.body.velocity.x = 0;
        this.object.sprite.body.velocity.y = 0;
        this.locked = true;
    }

    unlock() {
        this.locked = false;
    }

    updatePos() {
        if (this.locked) { return; }
        if (!this.isAlive) { return; }

        this.inputDown = this.inputDown || (this.object.sprite.downKey && this.object.sprite.downKey.isDown);
        this.inputUp = this.inputUp || (this.object.sprite.upKey && this.object.sprite.upKey.isDown);
        this.inputLeft = this.inputLeft || (this.object.sprite.leftKey && this.object.sprite.leftKey.isDown);
        this.inputRight = this.inputRight || (this.object.sprite.rightKey && this.object.sprite.rightKey.isDown);

        if (!(this.object.sprite &&
            this.object.sprite.body)) {
            return;
        }

        this.object.sprite.body.velocity.x = 0;
        this.object.sprite.body.velocity.y = 0;

        if (this.object.sprite.emitter) {
            this.object.sprite.emitter.on = true;
        }

        //console.log(this.name + ' ' + this.object.sprite.x + ',' + this.object.sprite.y);

        if (this.inputUp) {
            this.object.sprite.animations.play('walkUp', 3, false);
            this.object.sprite.body.velocity.y = -this.speed;
            this.direction = 'walkUp';
            this.dirty = true;
            if (this.object.sprite.emitter) {
                this.object.sprite.emitter.x = this.object.sprite.x + 15;
                this.object.sprite.emitter.y = this.object.sprite.y + 35;
            }
        } else if (this.inputDown) {
            this.object.sprite.animations.play('walkDown', 3, false);
            this.object.sprite.body.velocity.y = this.speed;
            this.direction = 'walkDown';
            this.dirty = true;
            if (this.object.sprite.emitter) {
                this.object.sprite.emitter.x = this.object.sprite.x + 15;
                this.object.sprite.emitter.y = this.object.sprite.y + -5;
            }
        } else if (this.inputLeft) {
            this.object.sprite.animations.play('walkLeft', 3, false);
            this.object.sprite.body.velocity.x = -this.speed;
            this.direction = 'walkLeft';
            this.dirty = true;
            if (this.object.sprite.emitter) {
                this.object.sprite.emitter.x = this.object.sprite.x + 30;
                this.object.sprite.emitter.y = this.object.sprite.y + 15;
            }
        } else if (this.inputRight) {
            this.object.sprite.animations.play('walkRight', 3, false);
            this.object.sprite.body.velocity.x = this.speed;
            this.direction = 'walkRight';
            this.dirty = true;
            if (this.object.sprite.emitter) {
                this.object.sprite.emitter.x = this.object.sprite.x;
                this.object.sprite.emitter.y = this.object.sprite.y + 15;
            }
        } else {
            if (this.object.sprite.emitter) {
                this.object.sprite.emitter.on = false;
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.objectElement}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        width: 50,
        padding: 5,
        opacity: 0.9,
        background: '#01242C',
        'backgroundSize': '285% auto',
        border: '2px solid #fff',
        borderRadius: '4px'
    },
});

export default Character;
