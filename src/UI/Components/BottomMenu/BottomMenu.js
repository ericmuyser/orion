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
                <Grid>
                    <Col span={4}>
                        <Globe color="red" statueKey="demon" flip={true} fill={this.props.currentHealth / this.props.maxHealth * 100} />
                    </Col>
                    <Col span={16} style={{'margin-top': 'auto'}}>
                        <ExperienceBar current={this.props.currentExperience} max={this.props.maxExperience} />
                        <ActionBar items={this.props.actionItems} maxItems={12} />
                        <Img className={styles.barLeft} src="http://localhost:8080/assets/ui/action-bar/bottom-bar.png" />
                        <Img className={styles.barRight} src="http://localhost:8080/assets/ui/action-bar/bottom-bar.png" />
                    </Col>
                    <Col span={4}>
                        <Globe color="blue" fill={this.props.currentMana / this.props.maxMana * 100} />
                    </Col>
                </Grid>
            </View>
        );
    }
}

export default BottomMenu;
