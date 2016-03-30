import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../Vendor/ReactFakeNative');
import ReactDOM from 'react-dom';

import styles from './Game.css';

if (window) {
    window.PIXI = require('phaser-shim/dist/pixi').PIXI;
    window.Phaser = require('phaser-shim/dist/phaser').Phaser;
    window.Phaser.Plugin.Tiled = require('./vendor/phaser-tiled');
    window.Utils = require('../../../Core/Utils');

    if (!document.getElementById('socketio')) {
        var script = document.createElement('script');
        script.id = 'socketio';
        script.src = 'http://localhost:8080/socket.io/socket.io.js';
        document.head.appendChild(script);
    }
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

        this.props.onInit(this.engine);

        // function Main() {}
        // Main.prototype.init = function() { self.init(); }
        // Main.prototype.preload = function() { self.preload(); }
        // Main.prototype.create = function() { self.create(); }
        // Main.prototype.update = function() { self.update(); }
        // Main.prototype.render = function() { self.render2(); }
        // Object.keys(this.props.states).forEach((key) => {
        //     this.engine.state.add(key, this.props.states[key]);
        // });
        // this.currentState = this.props.states['Preload'];
        //this.engine.state.start('Preload');
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
        return (
            <View>
                <View ref={(c) => this.container = c } key={this.props.key}></View>
                {this.props.children}
            </View>
        );
    }
}

export default Game;
