import React from 'react';

require('../../../vendor/react-fake-native');
class Globe extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statue}>aaa</View>
        <View style={styles.fill}>aaa</View>
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
  fill: {
    zIndex: 1,
    width: 400,
    height: 300,
    background: 'transparent url(assets/ui/action-bar/right-globe.gif) no-repeat 0 0'
  },
  statue: {
    zIndex: 2,
    width: 600,
    height: 300,
    background: 'transparent url(assets/ui/action-bar/right-statue.png) no-repeat 0 0'
  }
});

export default Globe;