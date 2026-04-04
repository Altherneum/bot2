const fs = require('fs');

function createFile(name, content, path) {
    const jsonData = JSON.stringify(content, null, 2); // The '2' adds indentation for readability
    
    let ScriptPath = process.cwd();

    if (!fs.existsSync(ScriptPath + path)) {
        fs.mkdirSync(ScriptPath + path, { recursive: true });
    }

    fs.writeFile(ScriptPath + path + name, jsonData, 'utf8', (err) => {
        if (err) {
            console.error('⚠️ Error writing file:', err);
            return;
        }
        console.log('📂 JSON data has been saved to ' + ScriptPath + path + name);
    });
}

module.exports = { createFile };