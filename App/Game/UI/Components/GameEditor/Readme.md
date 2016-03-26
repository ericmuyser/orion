Basic game editor:

    var props = {
        isDebug: true
    };

    <GameEditor {...props} />


Full game editor:

    var props = {
        isDebug: true,
        onInit: function(editor) {
            console.log(editor);
        }
    };

    <GameEditor {...props}>

    </GameEditor>