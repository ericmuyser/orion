import React from 'react';

import StartScreen from './Screens/StartScreen';
import HostScreen from './Screens/HostScreen';
import JoinScreen from './Screens/JoinScreen';
import IngameScreen from './Screens/IngameScreen';

window.UI_state = {
    screenKey: null
};

var UI = React.createClass({
  getInitialState: function() {
    window.UI_controller = this;
    return window.UI_state;
  },
  render: function() {
    return (
      <View style={styles.container}>
        {this.state.screenKey === 'start' && <StartScreen />}
        {this.state.screenKey === 'hostGame' && <HostScreen />}
        {this.state.screenKey === 'joinGame' && <JoinScreen />}
        {this.state.screenKey === 'ingame' && <IngameScreen />}
      </View>
    );
  }
});

var styles = {
    container: {
      position: 'relative',
      top: 0,
      left: 0
    }
};

export default UI;