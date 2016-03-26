import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../../vendor/react-fake-native');

import styles from './ActionBarSlot.css';

class ActionBarSlot extends Component {
    static propTypes = {
        skillId: PropTypes.number,
        iconKey: PropTypes.string,
        title: PropTypes.string,
        isLeft: PropTypes.bool,
        isRight: PropTypes.bool
    };

    static defaultProps = {
        skillId: null,
        iconKey: null,
        title: '',
        isLeft: false,
        isRight: false
    };

    render() {
        var type = 'empty';
        if (this.props.isLeft) {
            type = 'left';
        } else if (this.props.isRight) {
            type = 'right';
        }

        var positions = {
            43: '52% 54%',
            74: '34% 33%',
            13: '14% 33%',
            4: '14% 20%',
            46: '14% 0%',
            86: '21% 0%'
        };

        return (
            <View className={styles.container}>
                {this.props.skillId && <View className={styles.overlay} style={{'background-position': positions[this.props.skillId]}} />}
                <View className={styles[type]}></View>
            </View>
        );
    }
}

export default ActionBarSlot;
