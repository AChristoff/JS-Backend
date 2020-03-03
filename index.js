const http = require('http')
const url = require('url')
const qs = require('querystring')
const port = process.env.PORT || 5000
const handlers = require('./handlers/handlerBlender')

require('./config/db')();

http
  .createServer((req, res) => {
    res.write('Server is ON');
    // req.pathname = url.parse(req.url).pathname
    // req.pathquery = qs.parse(url.parse(req.url).query)
    // for (let handler of handlers) {
    //   if (!handler(req, res)) {
    //     break
    //   }
    // }
    res.end();
  })
  .listen(port)

console.log(`Server listening on port ${port}`);