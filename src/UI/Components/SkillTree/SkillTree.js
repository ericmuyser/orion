import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

class SkillTree extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired
    };

    render() {
        return (
            <View></View>
        );
    }
}

var styles = StyleSheet.create({
});

export default SkillTree;
