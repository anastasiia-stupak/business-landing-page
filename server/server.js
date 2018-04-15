var express = require('express');
var path = require('path');

var port = process.env.PORT || 5000;

var publicPath = path.join(__dirname, '..', 'build');
var app = express();

app.use(express.static(publicPath));

app.get('*', (req, res) => {
	res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
	console.log('server is run on 5000')
});