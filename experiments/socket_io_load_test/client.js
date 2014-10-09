var io = require("socket.io-client");

for (i=0;i<parseInt(process.argv[2],10);i++) {
	console.log('user ' + i + ' connecting');

	var socket = io.connect('http://mysocket.io/connection:8080',{'force new connection':true});
	socket['cnt'] = i;
	
	socket.on('connect', function() {
		console.log('user ' + this.cnt + ' has connected');
		socket.emit('subscribe', 'tableMAYA');

		socket.on('event', function(data) {
			console.log('user ' + this.cnt + ' received' + syntaxHighlight(data));
		});

		socket.on('pong', function(data) {
			console.log('user ' + this.cnt + ' received pong');
		});
	});
};

function syntaxHighlight(json) {
 			if (typeof json != 'string') {
        		json = JSON.stringify(json, undefined, 2);
    		}
    		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    		return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
	        	var cls = 'number';
    	    	if (/^"/.test(match)) {
        	    	if (/:$/.test(match)) {
            		    cls = 'key';
            		} else {
                		cls = 'string';
            		}
        		} else if (/true|false/.test(match)) {
            		cls = 'boolean';
        		} else if (/null/.test(match)) {
            		cls = 'null';
        		}
        	return cls + ' > ' + match ;
    		});
};