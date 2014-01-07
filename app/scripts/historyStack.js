
define('historyStack', ['jquery', 'underscore', 'delay', 'digestUrl'],function ($, _, delay, digestUrl) {
    'use strict';

    var session = window.sessionStorage;
    var history = window.history;
    var document = window.document;
    var c = window.console;

    return (function () {
            var api ={
                enabled:false,
                length:history.length,
                pushState: function(d,t,l){c.log(d,t,l);},
                replaceState: function(d,t,l){c.log(d,t,l);}
            };
            //if it's not available the HTML5 history api, return dummy functions
            if(!history.pushState || !history.replaceState) { return api; }

            var stack = JSON.parse(session.getItem('history.stack') || '[]');
            var stackIndex = session.getItem('history.stackIndex') || stack.length-1;

            if(window.DEBUG){
                window._stack = stack;
                window._stackIndex = stackIndex;
            }

            function pathName(url){
                var a = digestUrl(url);
                var ret = a.pathname;
                if('wizard' in a.params){
                    ret += '?wizard='+ a.params.wizard;
                }
                return ret;
            }

            function genId (){
                return (new Date()).getTime() + String(Math.random()).replace(/\D/g,'');
            }

            api.pushState = function (data, title, location){
                if (stackIndex < stack.length -1) {
                    stack = stack.slice(0, stackIndex +1);
                }
                data.meta.id = data.meta.id || genId();
                //c.log('>\tpush', data.meta.action, data.meta.location, stackIndex, stack.length);
                stack.push(data);
                stackIndex += 1;
                history.pushState(data, title, pathName(location));
                session.setItem('history.stack', JSON.stringify(stack));
            };

            api.replaceState = function (data, title, location){
                data.meta.id = data.meta.id || genId();
                //c.log('=\treplace', data.meta.action, data.meta.location, stackIndex, stack.length);
                stack[stackIndex] = data;
                history.replaceState(data, title, pathName(location));
                session.setItem('history.stack', JSON.stringify(stack));
            };

            function getIdByLocation (location){
                for (var i = stack.length -1; i >= 0; i -= 1) {
                    if (stack[i] && stack[i].meta && stack[i].meta.location === location) {
                        //c.warn('found_loc:', location, stack[i].meta.location);
                        return stack[i].meta.id;
                    }
                }
                //c.log('found_loc: None');
                return null;
            }

            function findStackIndex(id){
                for (var i = stack.length -1; i >= 0; i -= 1) {
                    if (stack[i] && stack[i].meta && stack[i].meta.id === id) {
                        //c.log('found_index:', i, stack[i].meta.location);
                        return i;
                    }
                }
                //c.log('found_index: None');
                return -1;
            }

            function updateStack(index, forceState){
                //popstateevent are bound to history stored events
                if(index < 0) { return; }

                if(forceState){
                    var delta = index - stackIndex;
                    //c.warn('forceState:', delta, index, stackIndex, stack[index].meta);
                    //we already made one history.back to trigger onpopstate
                    history.go(delta+1);
                }
                stackIndex = index;
                session.setItem('history.location', pathName(stack[index].meta.location));
                session.setItem('history.stackIndex', stackIndex);
            }

            window.onpopstate = function (event){
                var preUrl = session.getItem('history.location');
                var loc = pathName(location);

                //since we're overriding the event, we need to reload if we're
                //not storing the state -> we're leaving the stated area.
                if(!event.state || !event.state.meta) {
                    if(preUrl && preUrl !== loc){
                        session.removeItem('history.location');
                        window.location = loc;
                    }
                    return;
                }

                var data = JSON.parse(sessionStorage.getItem('history.data'));
                if (data) {
                    sessionStorage.removeItem('history.data');
                    data.meta.action = 'back';
                } else {
                    $.ajax({
                        url: location.href,
                        method: 'GET',
                        dataType: 'json',
                        async: false,
                        cache: false
                    }).done(function(newData){
                        //c.log(data);
                        data = newData;
                    });
                }

                stackIndex = Math.min(stackIndex, stack.length-1);

                //If don't exists actual id, find by location else create new
                //FIXME: collisions for duplicated locations.
                data.meta.id = data.meta.id || getIdByLocation(data.meta.location);

                //if we intend to go to other place than the browser knows
                var forceState = event.state && event.state.meta.id !== data.meta.id;

                //determine movement by foundIndex.
                var newIndex = findStackIndex(data.meta.id);
                var originalAction = data.meta.action;
                data.meta.action = newIndex < stackIndex ? 'back' : 'forward';

                if(newIndex < 0 || /blank|back/.test(originalAction) && data.meta.action === 'forward'){
                    data.meta.action = originalAction;
                }

                if(!preUrl && data.meta.action !== 'back'){
                    //if it's a reload.
                    data.meta.action = 'self';
                }

                if(stack[stackIndex] && data.meta.location === stack[stackIndex].meta.location){
                    //if it's the same resource
                    data.meta.action = 'self';
                }

                $(document).trigger('popStateEvent', data);
                updateStack(newIndex, forceState);

            };

            api.enabled = true;
            return api;
        }())
});
