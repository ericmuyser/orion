import React from 'react'; require('../../../../../vendor/react-fake-native');

class BuffBar extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                BuffBar
            </View>
        );
    }
}

var styles = React.StyleSheet.create({
    container: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 500
    },
});

export default BuffBar;
