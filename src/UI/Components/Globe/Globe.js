import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

import styles from './Globe.css';

class Globe extends Component {
    static propTypes = {
        color: PropTypes.oneOf(['white', 'black', 'red', 'green']),
        statueKey: PropTypes.string
    };

    static defaultProps = {
        color: 'red',
        statueKey: 'angel'
    };

    render() {
        return (
            <View className={styles.container + ' ' + (this.props.flip && styles.flip)}>
                {this.props.statueKey === 'angel' && <View className={styles.angelStatue}><Image src="http://localhost:8080/assets/ui/action-bar/angel-statue.png" /></View>}
                {this.props.statueKey === 'demon' && <View className={styles.demonStatue}><Image src="http://localhost:8080/assets/ui/action-bar/demon-statue.png" /></View>}
                <View className={styles.fill}><Image src={"http://localhost:8080/assets/ui/action-bar/globe-" + this.props.color + ".gif"} /></View>
            </View>
        );
    }
}

export default Globe;
