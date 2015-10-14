// file storage
var fs = require('fs');

// http
var http = require('http');

// query string
var qs = require('querystring');

console.log('init');

var PORT = 3000;

// create the server
var server = http.createServer(function(request, response) {
  var dataBuffer = '';

  // attach events, listeners
  request.on('data', function(data) {
    // server receives data, it receives it chucks at a time
    dataBuffer += data;
    console.log(dataBuffer);
  });



  // server listens for the end of request
  request.on('end', function() {
    console.log('Pau');

    response.end('all done!');
  });

  // create files [POST]

  // checks if directory exists
  fs.exists('/css', function (exists) {
    console.log(exists ? 'it\'s there' : 'no passwd!');

    // make directory css
    fs.mkdirSync('public/css');
  });


});

// start the server
server.listen(PORT, function() {
  console.log('server listening on port 3000');
});

console.log('complete');
