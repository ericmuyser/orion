import React from 'react';

class Col extends React.Component {
    render() {
        return (
            <View style={Object.assign({}, styles.col, { flex: parseInt(this.props.span) }, this.props.style)}>{this.props.children}</View>
        );
    }
}

const styles = React.StyleSheet.create({
    col: {
    }
});

export default Col;