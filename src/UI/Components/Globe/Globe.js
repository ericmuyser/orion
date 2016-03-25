import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

class Globe extends Component {
    static propTypes = {
    };

    static defaultProps = {
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.statue}><img src="http://localhost:8080/assets/ui/action-bar/right-statue.png" /></View>
                <View style={styles.fill}><img src="http://localhost:8080/assets/ui/action-bar/right-globe.gif" /></View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        position: 'relative'
    },
    fill: {
        position: 'absolute',
        left: '0px',
        top: '0px',
        'z-index': 1,
    },
    statue: {
        position: 'absolute',
        left: '-190px',
        top: '-81px',
        'z-index': 2,
    }
});

export default Globe;
