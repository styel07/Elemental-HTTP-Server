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

  if (request.method === 'GET') {
    // do get methods here

    request.on('end', function() {
    // parses the input from the browser
    var inputFromBrowser = url.parse(request.url);

      // checks if file exists
      fs.exists('./public' + inputFromBrowser.path, function (exists) {
        console.log(exists ? 'it\'s there' : 'error file does not exist');
      });

      // read files
      fs.readFile('./public' + inputFromBrowser.path, function(err,data) {
        if (err) {
          // returns the 404.html if server could not find path
          fs.readFile('./public/404.html', function(err2, data2) {
            response.end(data2.toString());
          });
        } else {
          response.end(data.toString());
        }
      });
    });
  }

  // create files [POST]
  // Write code

  if (request.method === 'POST') {
    // do post methods here
    if (request.url === '/element') {

      // creates file
      request.on('end', function() {
        var data = qs.parse(dataBuffer.toString());
        var dataToHTML = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title>' + data.elementName + '</title> <link rel="stylesheet" href="/css/styles.css"> </head> <body> <h1>'+ data.elementName +'</h1> <h2>'+ data.elementSymbol +'</h2> <h3>Atomic number '+ data.elementAtomicNumber+'</h3> <p>'+ data.elementDescription +'</p> <p><a href="/">back</a></p> </body> </html>'
        // write all parsed data onto a new file
        fs.writeFile('./public/' + data.elementName + '.html', dataToHTML, function(err) {
          if (err) throw new Error('Could not write new file: ' + error.message);
          console.log('Done writing to ');
          response.end('finish writing file!');
        });
      });
    }
  }

});

// start the server
server.listen(PORT, function() {
  console.log('server listening on port 3000');
});

console.log('complete');


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
