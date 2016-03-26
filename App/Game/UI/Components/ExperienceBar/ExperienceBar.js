import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../../vendor/react-fake-native');

import styles from './ExperienceBar.css';

class ExperienceBar extends Component {
    static propTypes = {
        current: PropTypes.number,
        max: PropTypes.number
    };

    static defaultProps = {
        current: 0,
        max: 0
    };

    render() {
        var perc = this.props.max > 0 ? Math.round(this.props.current / this.props.max * 100) : 0;

        return (
            <View className={styles.container}>
                <View className={styles.blocks} />
                <View className={styles.fill} style={{width: perc + '%'}} />
            </View>
        );
    }
}

export default ExperienceBar;
