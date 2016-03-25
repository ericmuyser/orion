import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

import ChatMessage from '../ChatMessage';

// import ReactList from 'react-list'
// <ReactList 
//  itemRenderer={this.renderItem}
//  length={this.props.items.length}
//  type="uniform"
//  />

//  _renderItem = (index, key) => {
    // return (
        // <div key={key}>
        //  {this.props.items[index].name}
        // </div>
    // );
// }
}
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

    render() {
        return (
            <View style={styles.container}>
                {this.props.messages.map((message) => {
                    return <ChatMessage {...message} />;
                })}
            </View>
        );
    }
}

var styles = React.StyleSheet.create({
    container: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 500
    },
});

export default Chat;
