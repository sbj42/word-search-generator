interface Options {
    words?: string[];
    diagonals?: boolean;
    minLength?: number;
    maxLength?: number;
    width?: number;
    height?: number;
}

class WordSearch {
    readonly width: number;
    readonly height: number;
    readonly grid: string[];
    readonly words: string[];

    constructor(width: number, height: number, grid: string[], words: string[]) {
        this.width = width;
        this.height = height;
        this.grid = grid;
        this.words = words;
    }

    get(x: number, y: number) {
        return this.grid[y * this.width + x];
    }

    toString() {
        let result = '';
        for (let y = 0; y < this.height; y ++) {
            for (let x = 0; x < this.width; x ++) {
                result += this.get(x, y) + ' ';
            }
            result += '\n';
        }
        return result;
    }
}

const defaultMinLength = 3;
const defaultSize = 10;
const effort = 10000;

export function generate(options?: Options): WordSearch {
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
    let words = options.words.slice() 
        .filter((w) => w.length >= options.minLength && (options.maxLength == null || w.length <= options.maxLength))
        .filter((w) => /^[a-z]*/.test(w));
    // console.info(`${words.length} words`);
    // console.info(`size: ${options.width} x ${options.height}`);
    // console.info(`diagonals: ${options.diagonals}`);
    // console.info(`minimum word length: ${options.minLength}`);
    // console.info(`maximum word length: ${options.maxLength}`);
    // console.info(`effort: ${effort}`);

    let {width, height, diagonals} = options;

    let grid: string[] = [];
    let used: string[] = [];
    let usedMap: { [word: string]: boolean }  = {};
    for (let i = 0; i < width * height; i ++) {
        grid[i] = ' ';
    }

    let dxs: number[];
    let dys: number[];
    if (diagonals) {
        dxs = [0, 1, 1, 1, 0, -1, -1, -1];
        dys = [-1, -1, 0, 1, 1, 1, 0, -1];
    } else {
        dxs = [0, 1, 0, -1];
        dys = [-1, 0, 1, 0];
    }

    function rand(max: number) {
        return Math.floor(Math.random() * max);
    }

    function get(x: number, y: number) {
        return grid[y * width + x];
    }

    function set(x: number, y: number, letter: string) {
        grid[y * width + x] = letter;
    }

    function tryword(x: number, y: number, dx: number, dy: number, word: string) {
        let ok = false;
        for (let i = 0; i < word.length; i ++) {
            const l = word[i].toUpperCase();
            if (x < 0 || y < 0 || x >= width || y >= height)
                return false;
            const cur = get(x, y);
            if (cur != ' ' && cur != l)
                return false;
            if (cur == ' ')
                ok = true;
            x += dx;
            y += dy;
        }
        return ok;
    }

    function putword(x: number, y: number, dx: number, dy: number, word: string) {
        for (let i = 0; i < word.length; i ++) {
            const l = word[i].toUpperCase();
            set(x, y, l);
            x += dx;
            y += dy;
        }
        used.push(word);
        usedMap[word] = true;
    }

    for (let i = 0; i < width * height * effort; i ++) {
        if (used.length == words.length)
            break;
        const word = words[rand(words.length)];
        if (usedMap[word])
            continue;
        const x = rand(width);
        const y = rand(height);
        const d = rand(dxs.length);
        const dx = dxs[d];
        const dy = dys[d];
        if (tryword(x, y, dx, dy, word))
            putword(x, y, dx, dy, word);
    }

    //const fillage = grid.reduce((t, c) => t + (c == ' ' ? 0 : 1), 0);

    for (let i = 0; i < grid.length; i ++) {
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