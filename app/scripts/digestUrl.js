define('digestUrl', ['jquery', 'lodash'], function (window, $, _, undefined){
    'use strict';

    var l = window.location;

    return function(url) {
        var a = window.document.createElement('a');
        a.href = url;
        a.protocol = (/\w+:?/.test(a.protocol)) ? a.protocol : l.protocol;
        a.pathname = (/^\//.test(a.pathname)) ? a.pathname : '/' + a.pathname;
        var path = _.compact(a.pathname.split('/'));
        if (!a.host && /:\//.test(url)){
            a.host = path.shift();
            a.pathname = '/'+path.join('/');
        }
        return {
            //window.location standard vars.
            hash: a.hash,
            host: a.host,
            hostname:a.hostname  || l.hostname,
            href:a.href,
            origin:a.origin || a.protocol  + '//' + a.host,
            pathname: a.pathname,
            port:a.port || l.port,
            protocol: a.protocol,
            search:a.search,

            //sintastic sugar
            source:url,
            params:_.omit(_.object(_.map(a.search.slice(1).split('&'),
              function (item) { return item.split('=') ; })
            ),''),
            path: path,
            sameOrigin: ((a.protocol + '//' + a.host) === (l.protocol+'//'+l.host))
        };
    };
});
