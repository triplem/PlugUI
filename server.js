/*
 * PlugUI server backend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */ 
var os		= require('os');
var fs		= require('fs');
var util	= require('util');
var express = require('express');
var mime	= require('mime');
var winston = require('winston');

var clientSessions = require('client-sessions');
var crypto	= require('crypto');

//configuration	
var configFile = require('yaml-config');
var config = configFile.readConfig("config/app.yaml");	
	
//pam auth connector
var unixlib = require('unixlib');

// secret used for cookie encryption, needs to be stored once in the filesystem if it doesnt exist already
var secret;
var secretPath = os.tmpDir() + "/plugui.secret";

if (fs.existsSync(secretPath)) {
	secret = fs.readFileSync(secretPath);
} else {
	try {
		secret = crypto.randomBytes(256);
		fs.writeFileSync(secretPath, secret);
	} catch (ex) {
		console.log('Error generating random bytes for secret!');
	}		
}

// read version information
var packageJson = JSON.parse(fs.readFileSync("package.json", "UTF-8"));

// create an application 
var app = module.exports = express.createServer(

);

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'info' }),
    new (winston.transports.File)({ filename: 'logs/plugui-node.log' })
  ]
});

// enable web server logging; pipe those log messages through winston
var winstonStream = {
    write: function(str){
        logger.info(str);
    }
};


app.configure(function(){
	app.use(express.logger({stream:winstonStream}));

	app.use(express.bodyParser());
	
	//sessions in memory at the moment
/*
	app.use(express.cookieParser());
	app.use(
		clientSessions({
			cookieName: 'session_state',
			secret: secret, 
			duration: 24 * 60 * 60 * 1000, // 1 day
		})
	);
*/

	app.use(express.methodOverride());
	app.use(app.router);
	app.use("/public", express.static(__dirname + '/public'));

	// disable layout
	app.set("view options", {layout: false});
	
	// enable cross routes settings
	app.set("secret", secret);
	app.set("config", config);
	app.set("packageJson", packageJson);
	app.set("logger", logger);

	app.register('.html', {
		compile: function(str, options){
			return function(locals){
				return str;
			};
		}
	});
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// allow dynamic routes
require('./controller')(app);

// only one page, all views and transitions handled client-side
app.get('/', function(req, res){
	logger.info("render index");
	res.render('index.html');
});


// authorization, leave in server.js because this is central
/*
app.post('/api/auth', function(req, res) {
	response = {};
	response.success = false;
	apicmd = req.body.apicmd;
	if (apicmd == "check") {
		response.authenticated = req.session.authenticated;
		response.username = req.session.username;
		response.success = true;
		res.json(response);	
	}
	else if ( apicmd == "login" ) {
		var username = req.body.username;
		var password = req.body.password;
		unixlib.pamauth("login", username, password, function(result) {
			req.session.authenticated = result;
			req.session.username = username;
			res.json({ success: true, authenticated: result, username: username });
		});
	}
	else if ( apicmd == "logout" ) {
		req.session.reset(['csrf']);
		res.json({ success: true });
	}	
	
});							
*/

// GO! :D
logger.info('Starting PlugUI on port: ' +  config.app.port);
app.listen(config.app.port);