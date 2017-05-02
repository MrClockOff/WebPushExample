/* 
* HTTPS server tutorial https://www.youtube.com/watch?v=8ptiZlO7ROs
*/

'use string'

const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');

const app = express();
const dirToServe = 'client';
const port = 3443;

app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '..', dirToServe)));

const httpsOptions = {
	cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
	key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'))
};

https.createServer(httpsOptions, app)
	.listen(port, function() {
		console.log(`Serving the ${dirToServe}/ directory at https://localhost:${port}`);
	});

app.post('/v1/pushPackages/:pushpackage', function(req, res) {
	console.log('Getting pushpackage for app Id: ', req.params.pushpackage);
	console.log(req.body);
	res.sendFile(path.join(__dirname, 'pushpackage', 'WebApp.pushpackage.zip'));
});

app.post('/v1/devices/:deviceToken/registrations/:pushpackage', function(req, res) {
	console.log('User registered for PN, app Id: ', req.params.pushpackage);
	console.log('User registered for PN, device token: ', req.params.deviceToken);
});

app.delete('/v1/devices/:deviceToken/registrations/:pushpackage', function(req, res) {
	console.log('User unregistered for PN, app Id: ', req.params.pushpackage);
	console.log('User unregistered for PN, device token: ', req.params.deviceToken);
});

app.post('/v1/log', function(req, res) {
	console.log('New log data available.');
	console.log(req.body);
});