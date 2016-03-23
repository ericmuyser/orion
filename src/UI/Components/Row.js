import React from 'react';
require('../../../vendor/react-fake-native');

class Row extends React.Component {
    render() {
        return (
            <View style={Object.assign({}, styles.row, this.props.rowStyle)}>
                {this.props.children}
            </View>
        );
    };
}

const styles = React.StyleSheet.create({
    row: {
    }
});

export default Row;