"use strict";
exports.__esModule = true;
var WordSearch = /** @class */ (function () {
    function WordSearch(width, height, grid, words) {
        this.width = width;
        this.height = height;
        this.grid = grid;
        this.words = words;
    }
    WordSearch.prototype.get = function (x, y) {
        return this.grid[y * this.width + x];
    };
    WordSearch.prototype.toString = function () {
        var result = '';
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                result += this.get(x, y) + ' ';
            }
            result += '\n';
        }
        return result;
    };
    return WordSearch;
}());
var defaultMinLength = 3;
var defaultSize = 10;
var effort = 10000;
function generate(options) {
    if (options == null)
        options = {};
    if (options.words == null) {
        var fs = require("fs");
        options.words = fs.readFileSync(__dirname + "/../data/words-gsl.txt", "utf-8")
            .split(/\r?\n/);
    }
    if (options.diagonals == null)
        options.diagonals = true;
    if (options.minLength == null)
        options.minLength = defaultMinLength;
    if (options.maxLength != null && options.maxLength < options.minLength)
        options.maxLength = options.minLength;
    if (options.width == null) {
        if (options.height != null)
            options.width = options.height;
        else
            options.width = defaultSize;
    }
    if (options.height == null)
        options.height = options.width;
    var words = options.words.slice()
        .filter(function (w) { return w.length >= options.minLength && (options.maxLength == null || w.length <= options.maxLength); })
        .filter(function (w) { return /^[a-z]*/.test(w); });
    // console.info(`${words.length} words`);
    // console.info(`size: ${options.width} x ${options.height}`);
    // console.info(`diagonals: ${options.diagonals}`);
    // console.info(`minimum word length: ${options.minLength}`);
    // console.info(`maximum word length: ${options.maxLength}`);
    // console.info(`effort: ${effort}`);
    var width = options.width, height = options.height, diagonals = options.diagonals;
    var grid = [];
    var used = [];
    var usedMap = {};
    for (var i = 0; i < width * height; i++) {
        grid[i] = ' ';
    }
    var dxs;
    var dys;
    if (diagonals) {
        dxs = [0, 1, 1, 1, 0, -1, -1, -1];
        dys = [-1, -1, 0, 1, 1, 1, 0, -1];
    }
    else {
        dxs = [0, 1, 0, -1];
        dys = [-1, 0, 1, 0];
    }
    function rand(max) {
        return Math.floor(Math.random() * max);
    }
    function get(x, y) {
        return grid[y * width + x];
    }
    function set(x, y, letter) {
        grid[y * width + x] = letter;
    }
    function tryword(x, y, dx, dy, word) {
        var ok = false;
        for (var i = 0; i < word.length; i++) {
            var l = word[i].toUpperCase();
            if (x < 0 || y < 0 || x >= width || y >= height)
                return false;
            var cur = get(x, y);
            if (cur != ' ' && cur != l)
                return false;
            if (cur == ' ')
                ok = true;
            x += dx;
            y += dy;
        }
        return ok;
    }
    function putword(x, y, dx, dy, word) {
        for (var i = 0; i < word.length; i++) {
            var l = word[i].toUpperCase();
            set(x, y, l);
            x += dx;
            y += dy;
        }
        used.push(word);
        usedMap[word] = true;
    }
    for (var i = 0; i < width * height * effort; i++) {
        if (used.length == words.length)
            break;
        var word = words[rand(words.length)];
        if (usedMap[word])
            continue;
        var x = rand(width);
        var y = rand(height);
        var d = rand(dxs.length);
        var dx = dxs[d];
        var dy = dys[d];
        if (tryword(x, y, dx, dy, word))
            putword(x, y, dx, dy, word);
    }
    //const fillage = grid.reduce((t, c) => t + (c == ' ' ? 0 : 1), 0);
    for (var i = 0; i < grid.length; i++) {
        if (grid[i] == ' ')
            grid[i] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[rand(26)];
    }
    used.sort();
    //console.info(`${used.length} words`);
    //console.info(`${fillage}/${width * height} filled (${(fillage*100/width/height).toFixed(1)}%)`);
    //print();
    //console.info(used.join(','));
    return new WordSearch(width, height, grid, used);
}
exports.generate = generate;
