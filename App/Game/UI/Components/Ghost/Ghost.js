import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../Vendor/ReactFakeNative');

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
