import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

import styles from './Game.css';

if (window) {
    window.PIXI = require('phaser-shim/dist/pixi').PIXI;
    window.Phaser = require('phaser-shim/dist/phaser').Phaser;
}

class Game extends Component {
    static propTypes = {
    };

    static defaultProps = {
        width: 0,
        height: 0
    };

    componentDidMount() {
        console.log(this.container);
        this.game = new Phaser.Game({parent: this.container.getDOMNode(), width: this.props.width, height: this.props.height, renderType: Phaser.CANVAS, forceSetTimeOut: true, state: {}});
        // this.game.renderType = Phaser.HEADLESS;
        // this.game.lockRender = true;
        //this.game.stage.disableVisibilityChange = true;

        var Main = function (game) {
            this.game = game;
        };

        Main.prototype = {
            init: function() {
                this.debugMode = true;
            },
            preload: function () {
                this.game.time.advancedTiming = true;
                this.game.stage.backgroundColor = '#000';
            },
            create: function () {
            },
            render: function() {
            }
        };

        this.game.state.add('Main', Main);
        this.game.state.start('Main');
    }

    render() {
        return <View ref={(c) => this.container = c }></View>;
    }
}

export default Game;