import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../../vendor/react-fake-native');

class Col extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired
    };

    render() {
        return (
            <View style={Object.assign({}, styles.col, { flex: parseInt(this.props.span) }, this.props.style)}>{this.props.children}</View>
        );
    }
}

const styles = StyleSheet.create({
    col: {
    }
});

export default Col;