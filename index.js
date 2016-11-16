#!/usr/bin/env node
const _ = require('lodash'),
    express = require('express'),
    fs = require('fs'),
    path = require('path'),
    app = express(),
    rootDir = 'C:\\Users\\Andy\\Torrents';

app
    .use(express.static(process.cwd())) // app public directory
    .use(express.static(__dirname)) // module directory
    .get('/files', (req, res) => {
        const filePath = req.query.path || '',
            filterVideos = req.query.filterVideos || false,
            currentDir = filePath ? path.join(rootDir, filePath) : rootDir;

        fs.readdir(currentDir, (err, files) => {
            if (err) {
                throw err;
            }

            let data = [];
            files.forEach(file => {
                try {
                    const isDirectory = fs.statSync(path.join(currentDir, file)).isDirectory(),
                        dataFile = {
                            name: file,
                            path: path.join(filePath, file),
                            isDirectory: isDirectory
                        };

                    if (!isDirectory) {
                        dataFile.ext = path.extname(file);
                    }

                    data.push(dataFile);
                }
                catch (e) {
                    console.log(e);
                }
            });

            // sort by name
            data = _.sortBy(data, f => {
                return f.name
            });

            res.json(data);
        });
    })
    .get('/', (req, res) => {
        res.redirect('lib/index.html');
    })
    .listen(8080, () => {
        console.log(`Server running at http://localhost:8080`);
    });

function findBadFiles() {
    console.log('Finding bad file extensions..');

    const walker = walk.walk('F:\\TV Shows', {followLinks: false}),
        files = new Set(),
        validFileTypes = ['.avi', '.flv', '.divx', '.m4v', '.mkv', '.mp4', '.wmv'];

    walker.on('file', (root, stat, next) => {
        // Add this file to the list of files
        const name = stat.name,
            ext = path.extname(name);

        if (validFileTypes.indexOf(ext) === -1) {
            files.add(`${root}\\${name}`);
        }
        next();
    });

    walker.on('end', function () {
        console.log(files.size ? 'Bad extensions found:' : 'All file extesions are valid');
        for (let item of files) {
            console.log(item);
        }
    });
}