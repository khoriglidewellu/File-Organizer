const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).options({
    path: {
        describe: 'Path to the directory whose files you want to organize',
        type: 'string',
        demandOption: true
    }
}).argv;

function organizeDirectory(dirPath) {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }

                if (stats.isFile()) {
                    const fileExt = path.extname(file).slice(1);
                    const destDir = path.join(dirPath, fileExt);

                    if (!fs.existsSync(destDir)) {
                        fs.mkdirSync(destDir);
                    }

                    const destPath = path.join(destDir, file);
                    fs.rename(filePath, destPath, err => {
                        if (err) {
                            console.error('Error moving file:', err);
                            return;
                        }
                        console.log(`Moved ${file} to ${destDir}/`);
                    });
                }
            });
        });
    });
}

organizeDirectory(argv.path);
