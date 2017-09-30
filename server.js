var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , port = 8080;

var pg = require('pg');
var dbURL = "postgres://vzubeyfkqoywib:e586ac21dd40862bc90e9d3106d784699ffd47b1b5fb19f13c345ea30da069e4@ec2-54-225-236-102.compute-1.amazonaws.com:5432/d3fj7m875fjgja?ssl=true";

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)

  switch( uri.pathname ) {
    case '/':
      sendFile(res, 'public/index.html')
      break
    case '/index.html':
      sendFile(res, 'public/index.html')
      break
    case '/css/style.css':
      sendFile(res, 'public/css/style.css', 'text/css')
      break
    case '/js/scripts.js':
      sendFile(res, 'public/js/scripts.js', 'text/javascript')
      break
    default:
      res.end('404 not found')
  }
})

server.listen(process.env.PORT || port);
console.log('listening on 8080')

// subroutines

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })

}
