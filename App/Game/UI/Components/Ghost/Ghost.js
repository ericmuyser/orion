import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../../vendor/react-fake-native');

import GameObject from '../GameObject';

class Ghost extends Component {
    toString() { '[Ghost]' };

    constructor(params) {
        super();

        this.object = <GameObject {...params} />;
    }

    render() {
        return (
            <View>{this.object}</View>
        );
    }
}

export default Ghost;
