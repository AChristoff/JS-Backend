const Image = require('mongoose').model('Image');
const formidable = require('formidable');

function addImage(req, res) {
    const form = formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err;
        }

        const tags = fields.tagsId.split(',').reduce((acc, x, i, arr) => {
            if (acc.includes(x) || x.length === 0) {
                return acc;
            } else {
                acc.push(x);
                return acc;
            }
        }, []);

        const image = {
            url: fields.imageUrl,
            title: fields.imageTitle,
            description: fields.description,
            tags,
        };

        Image.create(image)
            .then(image => {
                res.writeHead(302, {
                    location: '/'
                });

                res.end();

            }).catch(err => {
            res.writeHead(500, {
                'content-type': 'text/plain'
            });
            res.write('500 Server error');
            res.end();
        });

    });
}

module.exports = (req, res) => {
    if (req.pathname === '/addImage' && req.method === 'POST') {
        addImage(req, res)
    } else if (req.pathname === '/delete' && req.method === 'GET') {
        deleteImg(req, res)
    } else {
        return true
    }
};
