# word-search-generator
A word search generator

## usage

```
var generator = require('@sbj42/word-search-generator');
var puzzle = generator();
console.info(puzzle.toString());
console.info(puzzle.words.join(','));
```

That might print:

```
H T E S A D A N W O
A O W O R T R U N K
R E A D I O M P I G
D T O W D L Y D A M
L G I S E D H C A E
Y N O N D R R O C K
D C U D U A I Y N L
K T A T O D Y C E O
J U D G E O O T H U
E H T O B P R G W D

add,army,both,day,dog,door,dry,each,god,hardly,judge,let,loud,
mad,old,own,pet,pig,read,rich,ride,rock,row,sad,set,sock,the,
toe,trunk,tune,unit,when,win,wind
```

# options

The generator function takes an optional options object, with these options:

`diagonals` (boolean)

Defaults to `true`.  Determines whether words can be placed diagonally on
the puzzle.

`width` and `height` (integer)

Defaults to 10x10.  Sets the size of the puzzle.

`minLength` and `maxLength` (integer)

Useful for making sure the words aren't too short or too long.  The default
for `minLength` is 3, and for `maxLength` is undefined. 

`words` (array of strings)

Words will be chosen randomly from this list.  If this is not provided, it
uses a built-in set of around 2,000 words.

# puzzle api

The object returned from the generator function has the following properties:

`width` and `height` (integer)

The size of the puzzle.

`grid` (array of string)

The letters in the puzzle.  For row R and column C, the letter can be found at
`grid[R * width + C]`.

`words` (array of string)

The words placed in the puzzle, in alphabetical order.

`get(C, R)`

A helper function to fetch the letter at row R and column C.

`toString()`

Prints the puzzle to a string, for testing or command-line output.