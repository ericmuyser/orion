import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

import Grid from '../Grid';
import Col from '../Col';
import BottomMenuItem from '../BottomMenuItem';
import Globe from '../Globe';

class BottomMenu extends Component {
    static propTypes = {
        items: PropTypes.array
    };

    static defaultProps = {
        items: []
    };

    render() {
        return (
            <View style={styles.container}>
                <Grid>
                    <Col span={4}>
                        <Globe />
                    </Col>
                    <Col span={16}>
                        {this.props.items.map((item) => {
                            return <BottomMenuItem {...item} />;
                        })}
                    </Col>
                    <Col span={4}>
                        <Globe />
                    </Col>
                </Grid>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
});

export default BottomMenu;
