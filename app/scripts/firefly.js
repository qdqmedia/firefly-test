/**
 * @module: firefly
 * @creator: iknite
 * @date: 9/23/13-12:34 PM
 */

define('firefly', [], function (){
    'use strict';
    return function(token, apiKey) {
        var fireflyAPI = window.fireflyAPI || {};
        fireflyAPI.ready=function(x){
            if(typeof x==='function')x=[x];
            fireflyAPI.onLoaded=fireflyAPI.onLoaded || [];
            if(fireflyAPI.isLoaded) x.forEach(function(i){ i(); });
            else x.forEach(function(i){ fireflyAPI.onLoaded.push(i); });
        };
        fireflyAPI.token = token;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://firefly-071591.s3.amazonaws.com/scripts/loaders/loader.js';
        script.async = true;
        var firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(script, firstScript);

        fireflyAPI.ready(function(){
            fireflyAPI.startAPI(apiKey, function(){
                console.log('firefly is running');
            });
        });

        window.fireflyAPI = fireflyAPI;
    };
});
