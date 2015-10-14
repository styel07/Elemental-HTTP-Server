// import File storage
var fs = require('fs');

// import http
var http = require('http');

// import query string
var qs = require('querystring');

// import url
var url = require('url');
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

  request.on('end', function() {
    // parses the input from the browser
    var inputFromBrowser = url.parse(request.url);

    // read files
    fs.readFile('./public' + inputFromBrowser.path, function(err,data) {
      // returns the 404.html
      if (err) {
        fs.readFile('./public/404.html', function(err2, data2) {
          response.end(data2.toString());
        });
      } else {
        response.end(data.toString());
      }
    });
  });


});

// start the server
server.listen(PORT, function() {
  console.log('server listening on port 3000');
});

console.log('complete');

// create files [POST]
// Write code
  // checks if directory exists
  //fs.exists('/css', function (exists) {
  //console.log(exists ? 'it\'s there' : 'no passwd!');
  // fs.mkdirSync('public/css');
  // make directory css
  //});

// var filename = 'public/css/styles.css';

// if (request.url === '/') {
//   // creates styles.css
//   fs.writeFile(filename, stylesContents, function(err) {
//     if (err) throw new Error('Could not write to styles.css: ' + error.message);
//     console.log('Done writing to styles.css');
//     response.end('finish writing file!');
//   });
//}

// // creates helium.html
// fs.write('helium.html', heliumContents, function(err) {
//   if (err) throw new Error('Could not write to helium.html ' + error.message);
//   console.log('Done writing to helium');
// });

// // creates hydrogen.html
// fs.write('hydrogen.html', hydrogenContents, function(err) {
//   if (err) throw new Error('Could not write to hydrogen.html ' + error.message);
//   console.log('Dont writing to hydrogen');
// });

// fs.write('index.html', indexContents, function(err) {
//   if (err) throw new Error('Could not write to index.html ' + error.message);
//   console.log('');
// })

// // reading files [GET]
// fs.readFile('styles.csss', function(err, stylesContentsBuffer) {
//   if (err) throw new Error('Could not read styles.css: ' + err.message);
//   console.log(stylesContentsBuffer.toString());
// });
