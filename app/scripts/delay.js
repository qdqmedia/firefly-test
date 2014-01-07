define('delay', ['jquery', 'lodash'], function ($, _, undefined){
    'use strict';

    return function (timeout) {
        var $d = $.Deferred(),
            t = timeout || 0;

        setTimeout(function (){
            $d.resolve(timeout);
        }, t);

        return  $d.promise();
    };
});
