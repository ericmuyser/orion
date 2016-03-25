import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

import styles from './Globe.css';

class Globe extends Component {
    static propTypes = {
        color: PropTypes.oneOf(['white', 'black', 'red', 'green']),
        statueKey: PropTypes.string,
        fill: PropTypes.number
    };

    static defaultProps = {
        color: 'red',
        statueKey: 'angel',
        fill: 0
    };

    render() {
        return (
            <View className={styles.container + ' ' + (this.props.flip && styles.flip)}>
                {this.props.statueKey === 'angel' && <View className={styles.angelStatue}><Img src="http://localhost:8080/assets/ui/action-bar/angel-statue.png" /></View>}
                {this.props.statueKey === 'demon' && <View className={styles.demonStatue}><Img src="http://localhost:8080/assets/ui/action-bar/demon-statue.png" /></View>}
                <View className={styles.fill} style={{'background-image': 'src("http://localhost:8080/assets/ui/action-bar/globe-"' + this.props.color + '".gif")'}}>
                    <Img
                        className={styles.fillInner}
                        style={{'-webkit-clip-path': 'polygon(0 ' + (100 - this.props.fill) + '%, 100% ' + (100 - this.props.fill) + '%, 100% 100%, 0% 100%)'}}
                        src={"http://localhost:8080/assets/ui/action-bar/globe-" + this.props.color + ".gif"}
                    />
                </View>
            </View>
        );
    }
}

export default Globe;
