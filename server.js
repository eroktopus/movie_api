const http = require('http');
const url = require('url');
const fs = require('fs');

http.createServer((request, response) => {
    // Parse the request URL
    const parsedUrl = url.parse(request.url, true);

    const logData = `${parsedUrl.pathname} - ${new Date().toISOString()}\n`;
    fs.appendFile('log.txt', logData, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
    
    // Check if the pathname contains the word "documentation"
    if (parsedUrl.pathname.includes('documentation')) {
        
        fs.readFile('documentation.html', (err, data) => {
            if (err) {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.end('Internal Server Error');
            } else {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(data);
            }
        });
    } else {
       
        fs.readFile('index.html', (err, data) => {
            if (err) {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.end('Internal Server Error');
            } else {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(data);
            }
        });
    }
}).listen(8080);