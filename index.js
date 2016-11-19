#!/usr/bin/env node
const _ = require('lodash'),
    express = require('express'),
    fs = require('fs'),
    glob = require('glob'),
    path = require('path'),
    app = express(),
    // read in config file as json
    config = JSON.parse(fs.readFileSync('./config.json')),
    // if "test" was passed as argument to node, rootdir is test/directory, else downloadDirectory from config
    dir = process.argv.indexOf('test') > -1 ? 'testDownloadDirectory' : 'downloadDirectory',
    rootDir = config[dir];

app
    .use(express.static(process.cwd())) // app public directory
    .get('/', (req, res) => {
        res.redirect('app/index.html');
    })
    .get('/files', (req, res) => {
        const filePath = req.query.path || '',
            currentDir = getCurrentDir(filePath);

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
        const currentDir = getCurrentDir(req.query.path);

        glob(path.join(currentDir, '**/*.+(avi|flv|divx|m4v|mkv|mp4|wmv)'), (err, files) => {
            files = files.map((file) => {
                return directoryItem(file, currentDir, false);
            });

            res.json({
                path: currentDir,
                files: files
            });
        });
    })
    .listen(8080, () => {
        console.log(`Server running at http://localhost:8080`);
    });

function getCurrentDir(filePath) {
    return filePath ? path.join(rootDir, filePath) : rootDir
}

function directoryItem(name, filePath, isDir) {
    return {
        name: name,
        path: path.join(filePath, name),
        isDirectory: isDir,
        ext: isDir ? null : path.extname(name)
    };
}