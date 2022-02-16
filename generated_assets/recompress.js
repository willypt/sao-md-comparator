const fs = require('fs');

function writeFile(fileName, jsonData) {
  fs.writeFileSync(fileName, JSON.stringify({units: jsonData}))
}

const input = fs.readFileSync('./character.json');
const jsonObj = JSON.parse(input);

writeFile('character.json', jsonObj['f000']);
