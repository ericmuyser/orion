import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../../vendor/react-fake-native');

import styles from './Globe.css';

class Globe extends Component {
    static propTypes = {
        color: PropTypes.oneOf(['white', 'black', 'red', 'blue', 'green']),
        statueKey: PropTypes.string,
        fill: PropTypes.number
    };

    static defaultProps = {
        color: 'red',
        statueKey: 'angel',
        fill: 0
    };

    constructor() {
        super();
        this.wildCard = 0;
    }

    handleClick = () => {
        this.wildCard -= 10;
        this.forceUpdate();
    }

    render() {
        return (
            <View className={styles.container + ' ' + (this.props.flip && styles.flip)} onClick={this.handleClick}>
                {this.props.statueKey === 'angel' && <View className={styles.angelStatue}><Img src="/Game/Assets/UI/ActionBar/angel-statue.png" /></View>}
                {this.props.statueKey === 'demon' && <View className={styles.demonStatue}><Img src="/Game/Assets/UI/ActionBar/demon-statue.png" /></View>}
                <View className={styles.fill} style={{'background-image': 'src("/Game/Assets/UI/ActionBar/globe-"' + this.props.color + '".gif")'}}>
                    <Img
                        className={styles.fillInner}
                        style={{'-webkit-clip-path': 'polygon(0 ' + (100 - this.props.fill - this.wildCard) + '%, 100% ' + (100 - this.props.fill - this.wildCard) + '%, 100% 100%, 0% 100%)'}}
                        src={"/Game/Assets/UI/ActionBar/globe-" + this.props.color + ".gif"}
                    />
                </View>
            </View>
        );
    }
}

export default Globe;
