import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../../vendor/react-fake-native');

import Character from '../Character';

class Player extends Component {
    toString() { `[Player x=${this.position.x} y=${this.position.y}]` }

    static propTypes = {
    };

    static defaultProps = {
    };

    componentDidMount() {
        // TODO: fix this up

        this.tronElement = <Tron params={this.props.params} onInit={(tron) => {
            this.tron = tron;
            this.character = tron.character;

            this.id = this.props.params.id;
            this.game = this.props.params.game;
            this.name = this.props.params.name;

            if (this.props.params.keys) {
                this.setupKeys(this.props.params.keys);
            }
            this.props.onInit(this);
        }} />;

        this.forceUpdate();
    }

    // Method for registering hardware keys to a given sprite
    setupKeys(keys) {
        this.character.object.sprite.upKey = this.game.input.keyboard.addKey(keys.up);
        this.character.object.sprite.downKey = this.game.input.keyboard.addKey(keys.down);
        this.character.object.sprite.leftKey = this.game.input.keyboard.addKey(keys.left);
        this.character.object.sprite.rightKey = this.game.input.keyboard.addKey(keys.right);

        // register attack key if it exists
        if (keys.att) {
            this.character.object.sprite.attKey = this.game.input.keyboard.addKey(keys.att);
        }
    }

    kill() {
        this.nameText.destroy();
        this.character.kill();
    }

    set name(name) {
        if (!name) {
            name = this.id.substring(0, 2);
        }

        var style = {
            font: '15px Arial',
            fill: '#ffffff',
            align: 'center',
            backgroundColor: '#000000'
        };

        this._name = name;

        this.nameText = this.game.add.text(0, 0, name, style);
        this.nameText.anchor.set(0.5);

        this.character.object.sprite.addChild(this.nameText);
    }

    get name() {
        return this._name;
    }

    render() {
        return (
            <View style={styles.container}>
                Player here
                {this.tronElement}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
    },
});

export default Player;


// Wow, we may want this for "logic scripts"
// 
// function createInterface(name) {
//   return class {
//     ['findBy' + name]() {
//       return 'Found by ' + name;
//     }
//   }
// }
 
// const Interface = createInterface('Email');
// const instance = new Interface();
 
// console.log(instance.findByEmail()); 