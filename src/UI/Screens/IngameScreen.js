import React from 'react';

// import Modal from '../Components/Modal';
// import Tooltip from '../Components/Tooltip';
// import ActionBar from '../Components/ActionBar';
// import ActionBarSlot from '../Components/ActionBarSlot';
// import BottomMenu from '../Components/BottomMenu';
// import BottomMenuItem from '../Components/BottomMenuItem';
import Globe from '../Components/Globe';
import Avatar from '../Components/Avatar';
import BuffBar from '../Components/BuffBar';
import Minimap from '../Components/Minimap';
import Chat from '../Components/Chat';
import BottomMenu from '../Components/BottomMenu';
// import MainActionBar from '../Components/MainActionBar';
// import SecondaryActionBar from '../Components/SecondaryActionBar';
// import Minimap from '../Components/Minimap';
// import Skillbar from '../Components/Skillbar';
// import SkillbarSlot from '../Components/SkillbarSlot';
// import SkillTree from '../Components/SkillTree';
// import SkillTreeItem from '../Components/SkillTreeItem';
import Row from '../Components/Row';
import Col from '../Components/Col';
import Grid from '../Components/Grid';

var IngameScreen = React.createClass({
    render: function() {
        return (
            <View>
                <Avatar />
                <BuffBar />
                <Minimap />
                <Chat />
                <BottomMenu />
            </View>
        );
    }
});

var styles = {
    bottom: {
        position: 'absolute',
        top: 700,
        left: 0,
        width: 960,
        height: 400,
        padding: 5,
        opacity: 0.9,
        background: 'transparent url(assets/ui/bottom.png) no-repeat 0 0'
    },
    otherCharacterChooser: {
        'backgroundSize': '285% auto',
        color: '#fff',
        padding: '15px 0 0 0',
        fontFamily: 'Press Start 2P'
    }
};

export default IngameScreen;
