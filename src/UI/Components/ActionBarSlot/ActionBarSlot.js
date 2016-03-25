import React from 'react'; require('../../../../vendor/react-fake-native');

class ActionBarSlot extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                {this.props.title}
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

export default ActionBarSlot;
