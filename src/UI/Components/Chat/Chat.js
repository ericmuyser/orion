import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');
import ReactList from 'react-list'

import ChatMessage from '../ChatMessage';


class Chat extends React.Component {
    static propTypes = {
        messages: PropTypes.array
    };

    static defaultProps = {
        messages: []
    };

    constructor(params) {
        super();

        Object.assign(this, Chat.defaultProps, params); // extends this with the params
    }

    renderItem = (index, key) => {
        var message = this.props.messages[index];
        return (
            <ChatMessage {...message} key={key} />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ReactList 
                    itemRenderer={this.renderItem}
                    length={this.props.messages.length}
                    type="uniform"
                />
            </View>
        );
    }
}

var styles = React.StyleSheet.create({
    container: {
         overflow: 'auto',
         maxHeight: 400
    },
});

export default Chat;
