/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {// var express = require('express'),
	//     path = require('path'),
	//     routes = require('./conf/routes.js'),
	//     config = require('./conf/config.js'),
	// 	bodyParser = require('body-parser'),
	// 	cookieParser = require('cookie-parser'),
	// 	cookieSession = require('cookie-session'),
	//     app = express()
	"use strict";
	// app.use(express.static(path.join(__dirname, '../public')))
	// app.use(bodyParser.json())
	// app.use(cookieParser())
	// app.use(cookieSession({
	//   	name: 'session',
	// 	httpOnly: false,
	//   	keys: ['key1', 'key2']
	// }))
	// routes(app)
	// console.log('listen port ' + config.port)
	// app.listen(config.port)
	var http = __webpack_require__(1);
	var path = __webpack_require__(2);
	var express = __webpack_require__(3);
	var bodyParser = __webpack_require__(4);
	var cookieParser = __webpack_require__(5);
	var cookieSession = __webpack_require__(6);
	var terminal = __webpack_require__(7);
	var routes_1 = __webpack_require__(10);
	var config_1 = __webpack_require__(12);
	var app = express();
	app.use(express.static(path.join(__dirname, '../public')));
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(cookieSession({
	    name: 'session',
	    httpOnly: false,
	    keys: ['key1', 'key2']
	}));
	routes_1.routes(app);
	// app.listen(port)
	var server = http.createServer(app);
	server.listen(config_1.port);
	console.log('listen port ' + config_1.port);
	terminal(server);

	/* WEBPACK VAR INJECTION */}.call(exports, "server"))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("cookie-parser");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("cookie-session");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var pty = __webpack_require__(8);
	var sio = __webpack_require__(9);
	function fn(server) {
	    var tid = 0;
	    sio.listen(server).sockets.on('connection', function (socket) {
	        socket.on('createTerminal', function (term_id, func) {
	            console.log(term_id);
	            var name = term_id.split('§')[0];
	            var host_ip = term_id.split('§')[1];
	            var cmd = ['-H', host_ip + ':2375', 'exec', '-it', name, '/bin/bash'];
	            if (!process.env.PRODUCTION) {
	                name = "hello-world"; //'-H', host_ip+':2375', 
	                cmd = ['exec', '-it', name, '/bin/bash'];
	            }
	            term_id = tid++;
	            console.log('docker', cmd);
	            var term = pty.spawn('docker', cmd, { cwd: '/' })
	                .on('data', function (data) {
	                console.log(data);
	                socket.emit('data' + term_id, data);
	            })
	                .on('exit', function () {
	                socket.emit('exit', {});
	            });
	            socket.on('data' + term_id, function (data) {
	                term.write(data);
	            })
	                .on('resize' + term_id, function (data) {
	                console.log(data);
	                term.resize(data.cols, data.rows);
	            })
	                .on('disconnect', function () {
	                term.destroy();
	            });
	            func(term_id);
	        });
	    });
	}
	module.exports = fn;


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("pty.js");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("socket.io");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {"use strict";
	var path = __webpack_require__(2);
	var request = __webpack_require__(11);
	function routes(app) {
	    app.get('/', function (req, res, next) {
	        console.log(path.join(__dirname, '../public', 'index.html'));
	        // res.sendFile('../public/index.html');
	        next();
	    });
	}
	exports.routes = routes;

	/* WEBPACK VAR INJECTION */}.call(exports, "server/conf"))

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	exports.port = 8003;
	exports.BASE_CLOUD_API_URL = 'http://localhost:8001/api/v1/junjun16818';
	exports.endpoint = '192.168.59.103:2375';


/***/ }
/******/ ]);