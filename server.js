// run babel app/assets/frontend/main.jsx --presets es2015,react
// - /app
// - /app/main.js - Entry point for your app
// - /public
// - /public/index.html
// - /server
// - /server/bundle.js - Our workflow code
// - server.js - Express and proxies
// - webpack.config.js
// - webpack.production.config.js
// - package.json - Deployment and project configuration

var http = require('http');

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 8080 : process.env.PORT;
var app = express();


var server = http.createServer(app);
var io = require('socket.io').listen(server);
var clients = [];
var host = null;


if (isDeveloping) {
    config.devtool = 'eval'; // Speed up incremental builds
    config.entry['app'].unshift('webpack-hot-middleware/client?path=http://localhost:8080/__webpack_hmr');
    config.output.publicPath = 'http://localhost:8080/dist/';
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
    config.plugins.unshift(new webpack.NoErrorsPlugin());

    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    }));

    app.use(webpackHotMiddleware(compiler, {
        hot: true,
        historyApiFallback: true
    }));

    app.use(express.static(__dirname));
} else {
    app.use(express.static(__dirname));
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var setHost = function(client) {
    console.log('Setting host to player: ' + client.player.id);
    host = client;
};

var findNewHost = function() {
    if (clients.length > 0) {
        var i = getRandomInt(0, clients.length-1);
        var client = clients[i];

        // Make sure client had time to initialize the player
        if (client) {
            setHost(client);

            console.log('New host: ' + host.player.id);
            io.sockets.emit('setHost', {player: host.player});
        }
    }
};

var getClientHost = function() {
    if (!clients.length) { return; }
    return clients.reduce(function(previousClient, currentClient) { if (previousClient && previousClient.player.id === host.player.id) { return previousClient; } else if (currentClient.player.id === host.player.id) { return currentClient; }});
};

var findClientBySocket = function(socket) {
    if (!clients.length) { return; }
    return clients.reduce(function(previousClient, currentClient) { if (previousClient && previousClient.socket === socket) { return previousClient; } else if (currentClient.socket === socket) { return currentClient; }});
};

var addClient = function(client) {
    console.log('Adding player: ' + client.player.id);
    clients.push(client);
};

var removeClient = function(client) {
    console.log('Removing player: ' + client.player.id);

    clients.splice(clients.indexOf(client), 1);
};

// Monitor the clients to make sure they are still defined
var monitorHost = function() {
    if (host) {
        //console.log('Host: ', host.player.id);
    } else {
        findNewHost();
    }

    setTimeout(monitorHost, 100);
};

setTimeout(monitorHost, 100);

var parseEvent = function(socket, event) {
    if (event.key === 'newPlayer') {
        console.log('Handshaking...');

        addClient({socket: socket, player: event.info.player});

        // If it's the first client or there's no hosts, lets set it as the new host
        if (!host) {
            setHost(clients[clients.length-1]);
            console.log('New host: ' + host.player.id);
        }

        socket.emit('setHost', {player: host.player});
    } else {
        //socket.broadcast.emit(event.key, event.info);
    }
};

io.sockets.on('connection', function(socket) {
    console.log('New connection.. waiting for handshake');

    // TODO: give them 10 seconds to identify as a newPlayer, or cut them off

    socket.on('events', function(data) {
        //console.log('Incoming events: ' + data);
        data = JSON.parse(data);

        data.events.forEach(function(event) { parseEvent(socket, event); });

        socket.broadcast.emit('events', data);
    });

    socket.on('disconnect', function() {
        var client = findClientBySocket(socket);

        if (!client) { return; }

        removeClient(client);

        console.log('player left', client.player.id);

        // If this client was the host,
        // and there's at least one more client connected,
        // lets choose a new random host,
        // and broadcast it to everybody
        if (client.player.id === host.player.id) {
            host = null;
            findNewHost();
        }

        io.sockets.emit('removePlayer', {player: client.player});
    });
});

monitorHost();

server.listen(port, '0.0.0.0', function onStart(err) {
    if (err) {
        console.log(err);
    }

    console.info('==> Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
