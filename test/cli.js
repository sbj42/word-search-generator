var generator = require('../dist/generator.js');

var ws = generator.generate();

console.info(ws.toString());
console.info(ws.words.join(','));