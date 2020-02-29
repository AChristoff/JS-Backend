const fs = require('fs');

module.exports = (req, res) => {

    if (req.path.startsWith('../views/home') && req.method === 'GET') {

        fs.readFile('../views/home', (err, data) => {

            if (err) {
                console.log(err);
                return;
            }

            res.writeHead('200', {
                'content-type': 'text/html'
            });

            res.write(data);
            res.end();
        });
    } else {
        return true;
    }
}