import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

import Grid from '../Grid';
import Col from '../Col';
import Globe from '../Globe';
import ActionBar from '../ActionBar';
import ExperienceBar from '../ExperienceBar';

import styles from './BottomMenu.css';

class BottomMenu extends Component {
    static propTypes = {
        menuItems: PropTypes.array,
        actionItems: PropTypes.array,
        currentHealth: PropTypes.number,
        maxHealth: PropTypes.number,
        currentMana: PropTypes.number,
        maxMana: PropTypes.number,
        currentExperience: PropTypes.number,
        maxExperience: PropTypes.number
    };

    static defaultProps = {
        menuItems: [],
        actionItems: [],
        currentHealth: 0,
        maxHealth: 0,
        currentMana: 0,
        maxMana: 0,
        currentExperience: 0,
        maxExperience: 0
    };

    render() {
        return (
            <View className={styles.container}>
                <View>
                    <View className={styles.actions}><ActionBar items={this.props.actionItems} maxItems={12} /></View>
                    <View className={styles.experience}><ExperienceBar current={this.props.currentExperience} max={this.props.maxExperience} /></View>
                    <View className={styles.leftGlobe}>
                        <Globe color="red" statueKey="demon" />
                    </View>
                    <View className={styles.barLeft}><Image src="http://localhost:8080/assets/ui/action-bar/bottom-bar.png" /></View>
                    <View className={styles.barRight}><Image src="http://localhost:8080/assets/ui/action-bar/bottom-bar.png" /></View>
                    <View className={styles.rightGlobe}>
                        <Globe color="white" />
                    </View>
                </View>
            </View>
        );
    }
}

export default BottomMenu;
