khi chuyen page, tao 1 page moi
moi page co trang thai in, out
van ho tro rendered, destroyed

THINKING ABOUT CODE STYLE

var homeController = new SceneController({
    'page1': PageOneScene,       // inherits from Scene.js
    'page2': PageTwoScene,       // inherits from Scene.js
    'page3': PageThreeScene,     // inherits from Scene.js
});

homeController.setDefaultOptions({ 
    'page1': {
        transition: { 
            curve: 'outBack',
            duration: 500
        }
    },
    'page2': { 
        // data to replace PageTwoScene.DEFAULT_OPTIONS
    }, 
    // pass options data retrieved from an ajax call 
    'page3': function (callback) {
        $.ajax('/some/url',  function (data) {
            callback(data);
        };
    }
});