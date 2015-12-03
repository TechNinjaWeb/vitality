var PORT = process.env.PORT || 3000,
    express = require('express'),
    path = require('path'),
    app = express(),
    compression = require('compression'),
    server = require('http').createServer(app);

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);

app.use(compression({
    filter: compressionFilter,
    level: -1
}));

var compressionFilter = function(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
};

app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/public'));

app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/scripts', express.static(__dirname + '/bower_components'));

app.get('/*', function(req, res, next) {
    res.render('index.html', {
        controller: 'AppCtrl'
    });
});


server.listen(PORT, function() {
    console.log("Socket & Express Server Started on port %d in %s mode", this.address().port, app.settings.env);
});