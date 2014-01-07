require.config({
    paths: {
        jquery: 'vendor/jquery/jquery',
        bootstrap: 'vendor/bootstrap/dist/js/bootstrap.js',
        lodash:'vendor/lodash/lodash',
        delay: 'delay',
        historyStack: 'historyStack',
        navigation: 'navigation',
        overrideLinks: 'overrideLinks',
        firefly: 'firefly',
        app: 'app'
    }
});

require(['app']);
