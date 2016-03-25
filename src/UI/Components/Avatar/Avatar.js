import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../vendor/react-fake-native');

class Avatar extends Component {
    static propTypes = {
        showOthers: PropTypes.bool,
        currentCharacter: PropTypes.string,
        allCharacters: PropTypes.array
    };

    static defaultProps = {
        showOthers: false,
        currentCharacter: 'tron',
        allCharacters: ['tron', 'ghost']
    };

    clickCharacter() {
        this.setState({showOthers: !this.state.showOthers});
    }

    changeCharacter(key) {
        this.setState({currentCharacter: key});
        Hackatron.game.player.character.changeSkin(key);
    }

    render() {
        var otherElements = null;

        if (this.props.showOthers) {
            var otherCharacters = this.props.allCharacters.slice(0);
            var index = otherCharacters.indexOf(this.props.currentCharacter);
            otherCharacters.splice(index, 1);

            otherElements = (
                <View style={styles.otherCharacterChooser}>
                    {otherCharacters.map((key) => {
                        return <View style={{width: 32, height: 32, marginBottom: 10, background: 'transparent url(http://localhost:8080/assets/gfx/characters/' + key + '/walkDown-0002.png) no-repeat 0 0'}} onClick={()=>this.changeCharacter(key)}></View>;
                    })}
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <View style={{width: 32, height: 32, background: '#01242C url(http://localhost:8080/assets/gfx/characters/' + this.props.currentCharacter + '/walkDown-0002.png) no-repeat 0 0'}} onClick={this.clickCharacter}></View>
                {this.props.showOthers && otherElements}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        width: 50,
        padding: 5,
        opacity: 0.9,
        background: '#01242C',
        'backgroundSize': '285% auto',
        border: '2px solid #fff',
        borderRadius: '4px'
    },
});

export default Avatar;
