define(['jquery', 'firefly'], function($, ff) {
    'use strict';
    var localStorage = window.localStorage || {getItem:function(a){}, setItem:function(a,b){}};
    $(function(){
        var $form  = $('#start');
        var $token = $('#token');
        var $api = $('#api');

        $token.val(localStorage.getItem('token'));
        $api.val(localStorage.getItem('api'));
        $('#startCobrowse').on('click', function(){
            if($form[0].checkValidity()){
                localStorage.setItem('token', $token.val());
                localStorage.setItem('api', $api.val());
                ff($token.val(), $api.val());
            }
        });
    });
});
