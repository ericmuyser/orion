import React from 'react';

var StartScreen = React.createClass({
    getInitialState: function() {
        return {instantActionTimer: 5};
    },
    tick: function() {
        this.setState({instantActionTimer: this.state.instantActionTimer - 1});

        if (this.state.instantActionTimer === 0) {
            clearInterval(this.interval);
            Orion.game.engine.state.start('Game');
        }
    },
    componentDidMount: function() {
        this.interval = setInterval(this.tick, 1000);
    },
    componentWillUnmount: function() {
        clearInterval(this.interval);
    },
    _clickHost: function() {
        window.UI_state.screenKey = 'hostGame';
        window.UI_controller.setState(window.UI_state);
    },
    _clickJoin: function() {
        window.UI_state.screenKey = 'joinGame';
        window.UI_controller.setState(window.UI_state);
    },
    _clickInstantAction: function() {
        Orion.game.engine.state.start('Game');
    },

    fitToWindow: function() {
        this.game.canvas.style['width'] = '100%';
        this.game.canvas.style['height'] = '100%';
        document.getElementById('game').style['width'] = Orion.getWidthRatioScale() * 100 + '%';
        document.getElementById('game').style['height'] = Orion.getHeightRatioScale() * 100 + '%';
        window.onresize();
    },

    create: function() {
        if (Orion.debug) {
            this.game.add.plugin(Phaser.Plugin.Debug);
        }

        this.stage.setBackgroundColor(0x2d2d2d);
        var bg = this.add.sprite(0, 0, 'ui/screens/launch');
        var ratio = bg.height / bg.width;
        bg.width = Orion.GAME_WIDTH;
        bg.height = bg.width * ratio;

        this.startKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.musicKey = this.input.keyboard.addKey(Phaser.Keyboard.M);

        window.UI_state.screenKey = 'start';
        window.UI_controller.setState(window.UI_state);

        this.fitToWindow();

        this.game.music = this.game.add.audio('audio/bg-0002', 1, true);
        this.game.music.play('', 0, 1, true);
    },

    update: function() {
        if (this.startKey.isDown) {
            this.game.state.start('Game');
        }

        if (this.musicKey.isDown) {
            this.game.music.mute = !this.game.music.mute;
        }
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
        //boxShadow: '3px 3px 0 #1DFFFE',
        borderRadius: '0px'
    },
    hostButton: {
        width: 185,
        height: 55,
        'font-family': '"Press Start 2P"',
        'font-size': '17px',
        'text-align': 'center',
        'color': '#fff',
        //'color': '#FE0313',
        'padding': '18px 15px',
    },
    joinButton: {
        width: 185,
        height: 55,
        'font-family': '"Press Start 2P"',
        'font-size': '17px',
        'text-align': 'center',
        'color': '#fff',
        //'color': '#FF9C2C',
        'padding': '18px 15px',
    },
    instantActionButton: {
        width: 215,
        height: 55,
        'font-family': '"Press Start 2P"',
        'font-size': '14px',
        'text-align': 'center',
        'color': '#fff',
        //'color': '#FFFFD5',
        'padding': '10px 15px',
        'line-height': '17px'
    },
    countdown: {
        'font-family': '"Press Start 2P"',
        'font-size': '8px',
        'padding': '12px 0 0 0',
        'text-align': 'center',
        'color': '#fff',
        //'color': '#FE0313',
    }
};

export default StartScreen;
