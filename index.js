#!/usr/bin/env node
const _ = require('lodash'),
    express = require('express'),
    fs = require('fs'),
    path = require('path'),
    app = express(),
    rootDir = process.argv[2] === 'test'? `${process.cwd()}\\test\\directory` : 'C:\\Users\\Andy\\Torrents';

app
    .use(express.static(process.cwd())) // app public directory
    .use(express.static(__dirname)) // module directory
    .get('/', (req, res) => {
        res.redirect('lib/index.html');
    })
    .get('/files', (req, res) => {
        const filePath = req.query.path || '',
            currentDir = filePath ? path.join(rootDir, filePath) : rootDir;

        let data = {
            path: currentDir,
            files: []
        };

        fs.readdir(currentDir, (err, files) => {
            if (err) {
                throw err;
            }

            files.forEach(file => {
                try {
                    const isDirectory = fs.statSync(path.join(currentDir, file)).isDirectory();

                    data.files.push(directoryItem(file, filePath, isDirectory));
                }
                catch (e) {
                    console.log(e);
                }
            });

            // sort by name
            data.files = _.sortBy(data.files, f => {
                return f.name
            });

            res.json(data);
        });
    })
    .get('/filter', (req, res) => {
        const filePath = req.query.path || '',
            currentDir = filePath ? path.join(rootDir, filePath) : rootDir;

        crawl(currentDir, (err, results) => {
            res.json({path: currentDir, files: results});
        });

        function crawl(dir, done) {
            let results = [];

            fs.readdir(dir, (err, files) => {
                if (err) {
                    return done(err);
                }

                let i = 0;

                (function next() {
                    let fileName = files[i++],
                        filePath;

                    if (fileName) {
                        filePath = dir + '/' + fileName;

                        // inspect the file/directory
                        fs.stat(filePath, (err, stat) => {
                            if (stat && stat.isDirectory()) {
                                // recursively crawl directory
                                crawl(filePath, (err, res) => {
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
                    }
                    else {
                        return done(null, results);
                    }
                })();
            });
        }
    })
    .listen(8080, () => {
        console.log(`Server running at http://localhost:8080`);
    });


function directoryItem(name, filePath, isDir) {
    return {
        name: name,
        path: path.join(filePath, name),
        isDirectory: isDir,
        ext: isDir ? null : path.extname(name)
    };
}