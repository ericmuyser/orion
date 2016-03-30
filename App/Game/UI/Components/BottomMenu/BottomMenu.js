import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../Vendor/ReactFakeNative');

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
        actionBar: {
            maxItems: 12,
            items: []
        },
        currentHealth: 0,
        maxHealth: 0,
        currentMana: 0,
        maxMana: 0,
        currentExperience: 0,
        maxExperience: 0
    };

    render() {
        return (
            <View className={styles.container} style={this.props.style}>
                <Grid>
                    <Col span={4}>
                        <Globe color="red" statueKey="demon" flip={true} fill={this.props.currentHealth / this.props.maxHealth * 100} />
                    </Col>
                    <Col span={16} style={{'margin-top': 'auto'}}>
                        <ExperienceBar current={this.props.currentExperience} max={this.props.maxExperience} />
                        <ActionBar items={this.props.actionBar.items} maxItems={this.props.actionBar.maxItems} />
                        <Img className={styles.barLeft} src="/Game/Assets/UI/ActionBar/bottom-bar.png" />
                        <Img className={styles.barRight} src="/Game/Assets/UI/ActionBar/bottom-bar.png" />
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
