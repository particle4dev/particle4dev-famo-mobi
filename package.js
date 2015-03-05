Package.describe({
    summary: "open source front-end framework for developing mobile apps with famous and meteor",
    version: "0.8.3",
    name: "particle4dev:famo-mobi",
    git: "https://particle4dev@bitbucket.org/particle4devs-team/famo-mobi.git"
});

// meteor test-packages ./
var both = ['client', 'server'];
var client = ['client'];
var server = ['server'];

Package.on_use(function(api) {
    if (api.versionsFrom)
        api.versionsFrom('METEOR@0.9.2');
    api.use(['underscore', 'tracker', 'reactive-var', 'observe-sequence', 'ui', 'blaze', 'templating'], client);
    api.use(['ejson'], both);
    api.use(['particle4dev:famous@2.0.0'], client);
    api.use(['particle4dev:famous-flex@0.1.9'], client);

    api.use(['particle4dev:sass@1.2.0'], both);
    api.imply(['particle4dev:sass@1.2.0'], both);
    api.use(['iron:router@1.0.7'], client, {weak: true});

    api.add_files([
        /**
        'stylesheets/fonts/ionicons.eot',
        'stylesheets/fonts/ionicons.svg',
        'stylesheets/fonts/ionicons.ttf',
        'stylesheets/fonts/ionicons.woff',

        'stylesheets/css/ionic.css',
        'stylesheets/css/famous-reset.scss',
        */

        // utils
        'src/utils/helpers.js',
        'src/utils/pipeline.js',
        'src/utils/register.js',
        'src/utils/eventemitter2.js',

        // reactive
        'src/reactive/ReactiveSession.js', // upgraded
        'src/reactive/ReactiveCursor.js', // upgraded
        'src/reactive/ReactiveSurface.js', // upgraded
        'src/reactive/ReactiveTemplate.js', // upgraded
        'src/reactive/SurfaceIf.js', // upgraded
        'src/reactive/Each.js', // upgraded
        
        // famous
        'src/Node.js', // upgraded
        'src/core/Node.js',
        'src/Modifier.js', // upgraded
        'src/Utils.js', // upgraded
        'src/core/Scrollview.js', // upgraded
        'src/Lightbox.js', // upgraded
        'src/Modal.js', // upgraded

        // ui
        'src/ui/tabs/TabBar.js', // upgraded
        'src/ui/tabs/TabButton.js', // upgraded
        'src/ui/Slidershow.js', // upgraded [DEPRECATED]
        'src/ui/Button.js', // upgraded stable v0.3.0

        'src/ui/RippleEffect.js', // upgraded
        'src/ui/SizeAwareView.js', // upgraded

        'src/ui/toast/source.js', // upgraded
        'src/ui/toast/ToastsCenter.js', // upgraded

        'src/ui/papers/Paper.js', // upgraded
        'src/ui/papers/PapersSystem.js', // upgraded


        // 
        'src/ui/pages/Scene.js',
        'src/ui/pages/SceneController.js',
        'src/ui/pages/Transitions.js',
        // 'src/ui/pages/test.js',
        // 'src/ui/PagesManager.js', // [DEPRECATED] draft v0.4.0


        // from famous carousel

        // app
        'src/app/EventsCenter.js', // upgraded
        'src/app/PagesManager.js', // upgraded

        'src/app/AppView.js', // upgraded

        'src/router.js'
    ], client);
    if (typeof api.export !== 'undefined') {
        api.export('Application', client);
    }
});

Package.on_test(function(api) {
    api.use(['test-helpers', 'tinytest'], client);
    api.add_files([
    ], client);
});