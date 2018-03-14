// Enkel webserver för att leverera spelets innehåll. dvs bilder, ljud, text osv.
var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();

let port = 1337;
console.log("Starting Web Server on port " + port);


app.use(serveStatic(__dirname, {'default': ['index.html']}));

var serveElec = serveStatic(__dirname, {'index': ['electron/index.html']});
app.use("/elec", function(req, res){
    serveElec(req, res);
}.bind(this));

app.listen(port);
