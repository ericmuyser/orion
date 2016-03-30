import { Component, PropTypes as T } from 'react'; require('../../../../Vendor/ReactFakeNative');

import styles from './GameEditor.css';

class GameEditor extends Component {
    toString() { '[GameEditor]' }

    static propTypes = {
        isDebug: T.bool,
    };

    static defaultProps = {
        isDebug: false,
    };

    componentDidMount() {
        this.props.onInit(this);
    }

    render() {
        return (
            <View className={styles.container}>
                <h2>Editor | State</h2>
                <p>"Innovation is rewarded. Execution is worshipped." – Eric Thomas</p>
                <hr />
                <h3>Selected</h3>
                <p>MyComponent</p>
                <strong>id</strong><br />
                <input type="text" value="text" />
            </View>
        );
    }
}

export default GameEditor;