#!/usr/bin/env node
const _ = require('lodash'),
    express = require('express'),
    fs = require('fs'),
    path = require('path'),
    app = express(),
    walk = require('walk'),
    rootDir = 'C:\\Users\\Andy\\Torrents';

app
    .use(express.static(process.cwd())) // app public directory
    .use(express.static(__dirname)) // module directory
    .get('/', (req, res) => {
        res.redirect('lib/index.html');
    })
    .get('/files', (req, res) => {
        const filePath = req.query.path || '',
            currentDir = filePath ? path.join(rootDir, filePath) : rootDir;

        let data = [];

        fs.readdir(currentDir, (err, files) => {
            if (err) {
                throw err;
            }

            files.forEach(file => {
                try {
                    const isDirectory = fs.statSync(path.join(currentDir, file)).isDirectory();

                    data.push(directoryItem(file, filePath, isDirectory));
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
    .get('/filter', (req, res) => {
        const filePath = req.query.path || '',
            currentDir = filePath ? path.join(rootDir, filePath) : rootDir;

        walk2(currentDir, (err, results) => {
            res.json(results);
        });
    })
    .listen(8080, () => {
        console.log(`Server running at http://localhost:8080`);
    });

function walk2(dir, done) {
    let results = [];

    fs.readdir(dir, (err, files) => {
        if (err) {
            return done(err);
        }

        let i = 0;

        (function next() {
            let fileName = files[i++];

            if (!fileName) {
                return done(null, results);
            }

            let filePath = dir + '/' + fileName;

            fs.stat(filePath, (err, stat) => {
                if (stat && stat.isDirectory()) {
                    walk2(filePath, (err, res) => {
                        results = results.concat(res);
                        next();
                    });
                }
                else {
                    let dirItem = directoryItem(fileName, filePath, false);
                    // only push video files
                    if (['.avi', '.flv', '.divx', '.m4v', '.mkv', '.mp4', '.wmv'].indexOf(dirItem.ext) > -1) {
                        results.push(dirItem);
                    }
                    next();
                }
            });
        })();
    });
}

function directoryItem(name, filePath, isDir) {
    return {
        name: name,
        path: path.join(filePath, name),
        isDirectory: isDir,
        ext: isDir ? null : path.extname(name)
    };
}