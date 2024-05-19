import fs from 'fs';
import http from 'http';
import url from 'url';

const hostname = '127.0.0.1';
const port = 3006;

const server = http.createServer((request, response) => {
    const path = url.parse(request.url).pathname;
    let content = '';

    switch (path) {
    case '/':
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        content = fs.readFileSync('client/index.html', 'utf8');
        console.log('HTTP', response.statusCode, request.url);
        break;
    case '/check.js':
    case '/index.js':
    case '/pattern.js':
    case '/sudoku.js':
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/javascript');
        content = fs.readFileSync('client' + path, 'utf8');
        break;
    case '/main.css':
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/css');
        content = fs.readFileSync('client' + path, 'utf8');
        break;
    case '/img/404.jpg':
        response.statusCode = 200;
        response.setHeader('Content-Type', 'image/jpeg');
        content = fs.readFileSync('client' + path);
        break;
    default:
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html');
        content = fs.readFileSync('client/404.html', 'utf8');
        console.log('HTTP', response.statusCode, request.url);
        break;
    }

    response.setHeader('Content-Length', Buffer.byteLength(content));
    response.setHeader('Expires', new Date().toUTCString());
    response.end(content);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
