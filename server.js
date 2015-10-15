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

var elements = null; // null means your server just started

fs.readdir('./public', function(err,files) {
  if (err) throw new Error('./public dir does not exisit' + err.message);

  // only want element htlm files
  elements = files.filter(function(file) {
    return file.indexOf('.html') > 1  &&
    file !== '401.html' &&
    file !== 'index.html';
  }).map(function(elementFileName) {
    return elementFileName.substr(0, elementFileName.indexOf('.html'));
  }).map(function(lowerCasedElementName) {
    return lowerCasedElementName.substr(0, 1).toUpperCase() + lowerCasedElementName.substr(1);
  });

  writeIndex();
});

// elements array is initialized
// write our rendered index.html

function writeIndex() {
  fs.readFile('./templates/index.template.html', function(err, template) {
    if (err) throw new Error('The template for this file does not exists' + err.message);

    // render list of links for each element



    var renderedList = elements.map(function(element) {
      return ('<li>' +
                  '<a href="{{ filePath }}">' +
                  '{{ elementName }}' +
              '</li>').replace('{{ filePath }}', element.toLowerCase() + '.html')
                    .replace('{{ elementName }}', element);
    });
    console.log(renderedList);
    var rendered = template.toString().replace('{{ listOfElements }}', renderedList.join('\n'));

    //update the index.html
    fs.writeFile('./public/index.html', rendered, function(err) {
      if (err) throw new Error('is not writeable and is required by this application' + err.message);
    });
  });
}




// create the server
var server = http.createServer(function(request, response) {
  var dataBuffer = '';

  // attach events, listeners
  request.on('data', function(data) {
    // server receives data, it receives it chucks at a time
    dataBuffer += data;
    //console.log(dataBuffer);
  });

  request.on('end', function() {
  if (request.method === 'GET') {
    // do get methods here

    // parses the input from the browser
    var inputFromBrowser = url.parse(request.url);

    // if there are no errors then the response.end is not being called
    if (inputFromBrowser.path === '/') {
      inputFromBrowser.path = '/index.html';
    }

    // checks if file exists
    fs.exists('./public' + inputFromBrowser.path, function (exists) {
      console.log(exists ? 'it\'s there' : 'error file does not exist');
    });

    // read files
    fs.readFile('./public' + inputFromBrowser.path, function(err,data) {
      if (err) {
        if (err.code === 'ENOENT') {
          fs.readFile('./public/404.html', function(err2, data2) {
            response.end(data2.toString());
          });
        } else {
          throw new Error('There is an error');
        }

        // returns the 404.html if server could not find path
      } else {
        response.end(data.toString());
      }
    });
  }

  // create files [POST]
  // Write code

  if (request.method === 'POST') {
    // do post methods here
    if (request.url === '/element') {
      // creates file
      var data = qs.parse(dataBuffer.toString());
      console.log(data);
      var dataToHTML = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title>' + data.elementName + '</title> <link rel="stylesheet" href="/css/styles.css"> </head> <body> <h1>' + data.elementName + '</h1> <h2>' + data.elementSymbol + '</h2> <h3>Atomic number ' + data.elementAtomicNumber + '</h3> <p>' + data.elementDescription + '</p> <p><a href="/">back</a></p> </body> </html>';


      fs.writeFile('./public/' + data.elementName + '.html', dataToHTML, function(err) {
        if (err) throw err;
        response.end(JSON.stringify({ success : true }));
        console.log('Data has been stored ');

        // update the elements array
        elements.push(data.elementName);

        // after updating the elements rewrite them
        // check for duplicate entry
        writeIndex();
      });
    }
  }
});

});

// start the server
server.listen(PORT, function() {
  console.log('server listening on port 3000');
});

console.log('complete');


// original [post]

// if (request.method === 'POST') {
//     // do post methods here
//     if (request.url === '/element') {

//       // creates file
//       request.on('end', function() {
//         // write all parsed data onto a new file
//         fs.writeFile('./public/' + data.elementName + '.html', dataToHTML, function(err) {
//           if (err) throw new Error('./public/index.html is not writable and is required bt this application: ' + err.message);
//           console.log('Data has been stored ');

//           // update the elements array
//           elements.push(data.elementName);

//           // after updating the elements rewrite them
//           writeIndex();

//           response.end('finish writing file!');
//         });
//       });
//     }
//   }

// });