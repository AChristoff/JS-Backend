const http = require('http');
const url = require('url');
const port = 3000;
const handles = require('./handlers/index')

http.createServer((req, res) => {
    req.path = url.parse(req.url).pathname;
    res.write('Server is ON!');
    for (const handler in handles) {

        if (handler === false) {
            break;
        }
    }

    res.end();
}).listen(port);