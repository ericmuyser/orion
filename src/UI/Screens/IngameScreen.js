import React from 'react';

import Globe from '../Components/Globe';
import Avatar from '../Components/Avatar';
import BuffBar from '../Components/BuffBar';
import Minimap from '../Components/Minimap';
import Chat from '../Components/Chat';
import BottomMenu from '../Components/BottomMenu';
import Row from '../Components/Row';
import Col from '../Components/Col';
import Grid from '../Components/Grid';

var IngameScreen = React.createClass({
    render: function() {
        return (
            <View>
                <Avatar />
            </View>
        );
    }
});

var styles = {
};

export default IngameScreen;
