import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

import Row from '../Row';

class Grid extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired
    };

    render() {
        let children = this.props.children;

        children = Array.isArray(children) ? children : [children];

        let row = [];
        let rows = [];

        function isFullRow() {
            let span = 0;
            row.map((_row) => {
                span += _row.props.span;
            });

            if (span === 24) return true;

            return false;
        }

        children.map((child, index) => {
            row.push(child);

            if (isFullRow()) {
                rows.push(row);
                row = [];
            }
        });

        // Push any remaining row into the rows
        if (row.length) {
            rows.push(row);
        }

        let GridComponent = rows.map((row, index) => {
            let content = row.map((_row) => {
                return _row;
            });
            return (
                <Row key={index} style={Object.assign({}, styles.row, this.props.style)}>
                    {content}
                </Row>
            );
        });

        if (GridComponent.length > 0) {
            return (
                <View style={this.props.style}>
                    {GridComponent}
                </View>
            );
        } else {
            return null;
        }
        
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    }
});

export default Grid;
