var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var sslPath = '/home/testload/.cert/';

var options = {  
    key: fs.readFileSync(sslPath + 'privkey1.pem'),
    cert: fs.readFileSync(sslPath + 'fullchain1.pem')
};


var app = express();

// your express configuration here
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var paytm_config = require('./paytm/paytm_config').paytm_config;
var paytm_checksum = require('./paytm/checksum');
var querystring = require('querystring');

app.use('/pptm', (req, res) => {
	console.log(request.body);
	var paramarray = {};
	paramarray['MID'] = paytm_config.MID; //Provided by Paytm
	paramarray['ORDER_ID'] = req.body.ORDER_ID; //unique OrderId for every request
	paramarray['CUST_ID'] = req.body.CUST_ID;  // unique customer identifier 
	paramarray['INDUSTRY_TYPE_ID'] = paytm_config.INDUSTRY_TYPE_ID; //Provided by Paytm
	paramarray['CHANNEL_ID'] = req.body.CHANNEL_ID; //Provided by Paytm
	paramarray['TXN_AMOUNT'] = req.body.TXN_AMOUNT; // transaction amount
	paramarray['WEBSITE'] = paytm_config.WEBSITE; //Provided by Paytm
	paramarray['CALLBACK_URL'] = req.body.CALLBACK_URL;//Provided by Paytm
	paramarray['EMAIL'] = req.body.EMAIL; // customer email id
	paramarray['MOBILE_NO'] = req.body.MOBILE_NO; // customer 10 digit mobile no.

		
		paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, response) {
			res.writeHead(200, {'Content-type' : 'text/json','Cache-Control': 'no-cache'});
			res.write(JSON.stringify(res));
			res.end();
		});
});




app.use('*', (req, res) => {
	res.send('hi');
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);

httpServer.listen(8080);
httpsServer.listen(8443);