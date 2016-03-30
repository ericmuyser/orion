import { Component, PropTypes, StyleSheet } from 'react'; require('../../../../Vendor/ReactFakeNative');

import Line from '../Line';

class GameObject extends Component {
    toString() { '[GameObject]' }

    static propTypes = {
        isDebug: PropTypes.bool,
        dimensions: PropTypes.object,
        worldPosition: PropTypes.object,
        position: PropTypes.object,
        rotation: PropTypes.number,
        properties: PropTypes.object,
        sprite: PropTypes.bool,
        visible: PropTypes.bool,
        assetKey: PropTypes.string,
    };

    static defaultProps = {
        isDebug: false,
        dimensions: {width: 32, height: 32},
        worldPosition: {x: 0, y: 0},
        position: {x: 0, y: 0},
        rotation: 0,
        properties: {},
        sprite: null,
        visible: false,
        assetKey: null,
        game: null
    };

    componentDidMount() {
        //Object.assign(this, GameObject.defaultProps, this.props.params); // extends this with the params

        this._initSprite();

        this.props.onInit(this);
    }

    _initSprite() {
        var padding = 0.5; // 35% padding

        if (this.props.assetKey) {
            this.sprite = this.props.game.add.sprite(this.props.position.x, this.props.position.y, 'gfx/characters', this.props.assetKey + '/' + this.props.defaultFrameKey);
        } else {
            this.sprite = this.props.game.add.sprite(this.props.position.x, this.props.position.y, this.props.assetKey);
        }
        this.sprite.scale.x = 0.8;
        this.sprite.scale.y = 0.8;

        this.props.game.physics.arcade.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.setSize(this.props.dimensions.width / 2, this.props.dimensions.height / 2, this.props.dimensions.width / 4, this.props.dimensions.height / 4);
    }

    set position(position) {
        if (!this.sprite) { return this._position = position; }

        this.sprite.x = Math.floor(position.x);
        this.sprite.y = Math.floor(position.y);
    }

    get position() {
        if (!this.sprite) { return this._position; }

        return {x: Math.floor(this.sprite.x), y: Math.floor(this.sprite.y)};
    }

    set worldPosition(worldPosition) {
        if (!this.sprite) { return this._worldPosition = worldPosition; }

        this.sprite.x = Math.floor(worldPosition.x * 16);
        this.sprite.y = Math.floor(worldPosition.y * 16);
    }

    get worldPosition() {
        if (!this.sprite) { return this._worldPosition; }

        return {x: Math.floor(this.sprite.x / 16) + 1, y: Math.floor(this.sprite.y / 16) + 1};
    }

    render() {
        if (this.props.isDebug) {
            return (
                <View>
                    Dimensions: {this.props.dimensions.width}x{this.props.dimensions.height}<Line />
                    Position: [{this.props.position.x}, {this.props.position.y}]<Line />
                    Rotation: {this.props.rotation}<Line />
                    Visible: {this.props.visible ? 'true' : 'false'}<Line />
                    Properties: {Object.keys(this.props.properties).map((key) => {
                        return <View key={key}>* {key}: {this.props.properties[key]}</View>
                    })}<Line />
                    Sprite: {this.sprite || 'null'}<Line />
                    Asset Key: {this.props.assetKey}<Line />
                </View>
            )
        } else {
            return (
                <View style={{width: 32, height: 32, background: '#01242C url("/Assets/GFX/Characters/' + this.props.assetKey + '/walkDown-0002.png") no-repeat 0 0'}}>

                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
});

export default GameObject;