import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../../vendor/react-fake-native');

class Row extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired
    };

    render() {
        return (
            <View style={Object.assign({}, styles.container, this.props.style)}>
                {this.props.children}
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
    }
});

export default Row;