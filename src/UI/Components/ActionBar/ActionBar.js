import React from 'react'; require('../../../../vendor/react-fake-native');

class ActionBar extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <ActionBarSlot title="Fireball" />
                <ActionBarSlot title="Frozen Orb" />
                <ActionBarSlot title="Static" />
                <ActionBarSlot title="Health Potion" />
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

export default ActionBar;
