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
        const query = req.query.path || '',
            currentDir = query ? path.join(rootDir, query) : rootDir;

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
                            path: path.join(query, file),
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