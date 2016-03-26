import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../../vendor/react-fake-native');

// shouldComponentUpdate = () => false;

class ChatMessage extends Component {
    static propTypes = {
        name: PropTypes.string,
        text: PropTypes.string
    };

    static defaultProps = {
        name: 'John Doe',
        text: ''
    };

    render() {
        return <div>{this.props.name}: {this.props.text}</div>;
    }
}

export default ChatMessage;