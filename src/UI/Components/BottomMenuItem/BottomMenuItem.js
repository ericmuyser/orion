import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

class BottomMenuItem extends React.Component {
    static propTypes = {
        title: PropTypes.string
    };

    static defaultProps = {
        title: ''
    };

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

export default BottomMenuItem;
