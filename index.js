const http = require('http');
const url = require('url');
const port = 3000;

http.createServer((req, res) => {
    res.write('Server is working');
    res.end();
}).listen(port);