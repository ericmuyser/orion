import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../Vendor/ReactFakeNative');

class Minimap extends Component {
    render() {
        return (
            <View style={styles.container}>
                MINIMAP
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        right: 50
    },
});

export default Minimap;
