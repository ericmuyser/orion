import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../Vendor/ReactFakeNative');

import GameObject from '../GameObject';

class Pellet extends Component {
    toString() { '[Pellet]' };

    constructor(params) {
        super();

        this.object = <GameObject {...params} />;


        var pellet = game.add.sprite(x, y, key);
        pellet.isAlive = true;
        this.type = type;
        return pellet;
    }

    eaten() {
        this.isAlive = false;
    }

    getPoints() {
        switch (type) {
            case 'LOW': return 1;
            case 'MED': return 5;
            case 'HIGH': return 10;
        }
    }

    render() {
        return (
            <View>{this.object}</View>
        );
    }
}

export default Pellet;
