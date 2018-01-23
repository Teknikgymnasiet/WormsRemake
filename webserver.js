// Enkel webserver för att leverera spelets innehåll. dvs bilder, ljud, text osv.
var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();

let port = 1337;
console.log("Starting Web Server on port " + port);


app.use(serveStatic(__dirname, {'default': ['index.html']}));
app.listen(port);
