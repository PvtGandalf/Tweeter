/*
  Name: Jaiden Hodson
  Email: hodsonj@oregonstate.edu
  ONID: 932-999-014
*/

// Scan for modules
var http = require("http"); //HTTP server and client
var fs = require("fs"); // File System (readFileSync)

// Variables for storing file contents (synchronously)
var htmlContent = fs.readFileSync("public/index.html");
var cssContent = fs.readFileSync("public/style.css");
var jsContent = fs.readFileSync("public/index.js");
var fofContent = fs.readFileSync("public/404.html");

// Use port 3000 as default if none specified
const PORT = process.env.PORT || 3000;
console.log("Server is listening on port: ", PORT); //print port

// Request Handler for Server (request, response)
function requestHandler(req, res) {
    console.log("method: ", req.method);
    console.log("url: ", req.url);
    console.log("headers: ", req.headers);

    // Check for HTML
    if ((req.url == "/index.html") || (req.url == "/")) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(htmlContent);
    }

    // Check for CSS
    else if (req.url == "/style.css") {
        res.writeHead(200, {"Content-Type": "text/css"});
        res.write(cssContent);
    }

    // Check for Javascript
    else if (req.url == "/index.js") {
        res.writeHead(200, {"Content-Type": "application/javascript"});
        res.write(jsContent);
    }

    // Check for 404 (not found)
    else if (req.url == "/404.html") {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(fofContent);
    }

    // Else return 404 (not found)
    else {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.write(fofContent);
    }

    // End response process
    res.end();
}

// Create a basic server
var server = http.createServer(requestHandler);

// Listen on port
server.listen(PORT);
