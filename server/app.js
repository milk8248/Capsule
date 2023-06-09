var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('capsule:server');
const http = require("http");

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const absolutePath = require('@milk8248/capsule-client-dist');

var app = express();

var port = normalizePort(process.env.PORT || '3030');
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

app.use(logger('dev'));
app.use(express.json());
app.use('/',express.static(absolutePath.default()));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', apiRouter);
app.get('*', (req, res) => {
    res.sendFile(absolutePath.default() + '/index.html');
});

process.on('uncaughtException', error => {
    console.log('uncaughtException', error.message);
});

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
});


module.exports = app;

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}