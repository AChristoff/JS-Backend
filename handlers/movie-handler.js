const db = require('../config/dataBase');
const fs = require('fs');
const qs = require('querystring');

// function readHTML(res, replacementHTML) {
//     fs.readFile()
// }

module.exports = (req, res) => {

    if (req.path.startsWith('../views/viewAllMovies') && req.method === 'GET') {

        fs.readFile('../views/viewAllMovies', (err, data) => {

            if (err) {
                console.log(err);
                return;
            }

            let allMoviesHTML = '';

            for (const movie of db) {
                let movieHTML = `<div class="movie">
                                    <img class="moviePoster" src="${movie.moviePoster}" />
                                </div>`;
                allMoviesHTML += movieHTML;
            }

            let responseHTML = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', allMoviesHTML);

            res.writeHead('200', {
                'content-type': 'text/html'
            });

            res.write(responseHTML);
            res.end();
        });
    } else {
        return true;
    }

};