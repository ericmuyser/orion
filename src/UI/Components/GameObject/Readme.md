Basic game object:

    var props = {
        isDebug: true,
        dimensions: {width: 100, height: 100},
        position: {x: 0, y: 0},
        rotation: 90,
        visible: true,
        properties: {test1: 1, test2: 2},
        sprite: null,
        assetKey: 'tron'
    };

    <GameObject {...props}></GameObject>