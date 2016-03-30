import { Component, PropTypes as T } from 'react'; require('../../../../Vendor/ReactFakeNative');

import styles from './Example.css';

class Example extends Component {
    toString() { '[Example]' }

    static propTypes = {
        isDebug: T.bool,
    };

    static defaultProps = {
        isDebug: false,
    };

    render() {
        return <View className={styles.container}>example</View>;
    }
}

export default Example;