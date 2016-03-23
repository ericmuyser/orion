import React from 'react';

import Row from './Row';

class Grid extends React.Component {
    render() {
        let self = this;
        let children = this.props.children;

        children = Array.isArray(children) ? children : [children];

        let row = [];
        let rows = [];

        function isFullRow() {
            let span = 0;
            row.map(function(_row) {
                span += _row.props.span;
            })

            if (span === 24) return true;

            return false;
        }

        children.map(function(child, index) {
            row.push(child);

            if(isFullRow()) {
                rows.push(row);
                row = [];
            }
        });

        let GridComponent = rows.map(function(row, index) {
            let content = row.map(function(_row) {
                return _row;
            });
            return (
                <Row key={index} style={Object.assign({}, styles.row, self.props.style)}>
                    {content}
                </Row>
            );
        });

        if(GridComponent.length>1) {
            return (
                <View style={this.props.style}>
                    {GridComponent}
                </View>
            );
        } else if (GridComponent.length === 1) {
            return GridComponent[0];
        } else {
            return null;
        }
        
    }
}

const styles = React.StyleSheet.create({
    row: {
        flexDirection: 'row'
    }
});

export default Grid;
