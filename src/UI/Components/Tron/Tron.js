import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

import GameObject from '../GameObject';

class Tron extends Component {
    toString() { '[Tron]' };

    constructor(params) {
        super();

        params = Object.assign(params, {characterKey: 'tron', defaultFrameKey: 'walkDown-0002', emitterKey: 'gfx/emitters/blueball'});

        this.blocks = 1;
        this.teleported = false;
        this.object = <GameObject {...params} />;
    }

    eatPellet(pellet) {
        this.addPoints(pellet.getPoints());
        pellet.eaten();
    }

    triggerAttack(blockList) {
        var self = this;
        if (!self.isAlive) { return null; }

        if (this.sprite.attKey.isDown && this.blocks > 0) {
            self.blocks--;
            if (self.blocks < 0) self.blocks = 0;
            var offsetY = -10;
            var block = this.game.add.sprite(this.sprite.x, this.sprite.y + offsetY, 'gfx/blocks/glitch');
            block.animations.add('glitch', [0,1,2], 12, true, true);
            block.animations.play('glitch');
            this.game.physics.arcade.enable(block, Phaser.Physics.ARCADE);
            block.body.immovable = true;
            block.scale.x = 1.25;
            block.scale.y = 1.25;
            blockList.push(block);

            // makes block fade away within a 2.0 seconds
            var tween = this.game.add.tween(block).to( { alpha: 0 }, 2000, 'Linear', true);
            tween.onComplete.add(function() {
                tween.stop();
            });

            setTimeout(function() {
                block.destroy();
                self.blocks++;
                blockList.filter(function(b) {
                    return (b !== block);
                });
            }, 2000);

            return block;
        }

        return null;
    }

    teleport(destination) {
        if (this.teleported) { return; }

        this.sprite.x = destination.x;
        this.sprite.y = destination.y;

        this.teleported = true;

        setTimeout(() => { this.teleported = false; }, 2000);
    }

    render() {
        return (
            <View>{this.object}</View>
        );
    }
}

export default Tron;
