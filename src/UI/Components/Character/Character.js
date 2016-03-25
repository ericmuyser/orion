import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

import GameObject from '../GameObject';

class Character extends Component {
    static propTypes = {
        key: PropTypes.string
    };

    static defaultProps = {
        key: 'tron'
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={{width: 32, height: 32, background: '#01242C url(http://localhost:8080/assets/gfx/characters/' + this.props.key + '/walkDown-0002.png) no-repeat 0 0'}}></View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        width: 50,
        padding: 5,
        opacity: 0.9,
        background: '#01242C',
        'backgroundSize': '285% auto',
        border: '2px solid #fff',
        borderRadius: '4px'
    },
});

export default Character;
