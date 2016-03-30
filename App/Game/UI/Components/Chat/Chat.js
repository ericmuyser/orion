import { Component, PropTypes as T, StyleSheet } from 'react'; require('../../../../Vendor/ReactFakeNative');
import ReactList from 'react-list';

import ChatMessage from '../ChatMessage';

class Chat extends React.Component {
    static propTypes = {
        title: T.string,
        messages: T.array
    };

    static defaultProps = {
        title: '',
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
