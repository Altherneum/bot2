const fs = require('fs');

function createFile(name, content, path) {
const jsonData = JSON.stringify(content, null, 2); // The '2' adds indentation for readability
    fs.writeFile(path + name, jsonData, 'utf8', (err) => {
        if (err) {
            console.error('⚠️ Error writing file:', err);
            return;
        }
        console.log('📂 JSON data has been saved to ' + path + name);
    });
}

module.exports = { createFile };