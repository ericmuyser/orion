import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

import Character from '../Character';

class Player extends Component {
    toString() { `[Player x=${this.position.x} y=${this.position.y}]` }

    static propTypes = {
    };

    static defaultProps = {
    };

    constructor() {
        super();

        this.character = new Tron(params);
        this.character.init(params);

        this.id = params.id;
        this.game = params.game;
        this.name = params.name;

        if (params.keys) {
            this.setupKeys(params.keys);
        }
    }


    // Method for registering hardware keys to a given sprite
    setupKeys(keys) {
        this.character.sprite.upKey = this.game.input.keyboard.addKey(keys.up);
        this.character.sprite.downKey = this.game.input.keyboard.addKey(keys.down);
        this.character.sprite.leftKey = this.game.input.keyboard.addKey(keys.left);
        this.character.sprite.rightKey = this.game.input.keyboard.addKey(keys.right);

        // register attack key if it exists
        if (keys.att) {
            this.character.sprite.attKey = this.game.input.keyboard.addKey(keys.att);
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

        this.character.sprite.addChild(this.nameText);
    }

    get name() {
        return this._name;
    }

    render() {
        return (
            <View style={styles.container}>
                Player here
                <Character key="ghost"></Character>
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