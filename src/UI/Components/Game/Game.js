import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');
import ReactDOM from 'react-dom';

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
        height: 0,
        onInit: null,
        onPreload: null,
        onCreate: null,
        onUpdate: null,
        onRender: null
    };

    init() {
        this.props.onInit && this.props.onInit(this);
    }

    preload () {
        this.engine.time.advancedTiming = true;
        this.engine.stage.backgroundColor = '#000';

        this.props.onPreload && this.props.onPreload(this);
    }

    create () {
        this.props.onCreate && this.props.onCreate(this);
    }

    update () {
        this.props.onUpdate && this.props.onUpdate(this);
    }

    render2() {
        this.props.onRender && this.props.onRender(this);
    }

    componentDidMount() {
        var self = this;
        this.engine = new Phaser.Game({parent: ReactDOM.findDOMNode(this.container), width: this.props.width, height: this.props.height, renderType: Phaser.CANVAS, forceSetTimeOut: true});
        function Main() {}
        Main.prototype.init = function() { self.init(); }
        Main.prototype.preload = function() { self.preload(); }
        Main.prototype.create = function() { self.create(); }
        Main.prototype.update = function() { self.update(); }
        Main.prototype.render = function() { self.render2(); }
        this.engine.state.add('Main', Main);
        this.engine.state.start('Main');
    }

    componentWillUnmount() {
        if (this.engine) {
            try {
                this.engine.destroy();
            } catch(e) {
                console.warn("Error in Phaser when destroying the game instance");
            }

            this.engine = null;
        }
    }

    render() {
        return <View ref={(c) => this.container = c } key={this.props.key}></View>;
    }
}

export default Game;