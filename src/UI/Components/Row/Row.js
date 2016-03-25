import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

class Row extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired
    };

    render() {
        return (
            <View style={Object.assign({}, styles.row, this.props.rowStyle)}>
                {this.props.children}
            </View>
        );
    };
}

const styles = StyleSheet.create({
    row: {
    }
});

export default Row;