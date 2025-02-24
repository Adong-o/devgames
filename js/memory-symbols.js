// Memory Game Symbols by Difficulty Level
const symbolsByLevel = {
    1: [
        '{ }',  // Object literal
        '[ ]',  // Array
        '( )',  // Function call
        '= >',  // Arrow function
        '+ +',  // Increment
        '= =',  // Equality
        '& &',  // Logical AND
        '| |'   // Logical OR
    ],
    2: [
        '/ /',  // Comment
        '< >',  // HTML tags
        '$ {}', // Template literal
        '# #',  // Hash/ID selector
        '! =',  // Not equal
        '= = =', // Strict equality
        '? :',  // Ternary operator
        '* *'   // Multiplication/Power
    ],
    3: [
        '@ @',  // Decorators
        '` `',  // Template string
        '% %',  // Modulo
        '^ ^',  // XOR
        '~ ~',  // Bitwise NOT
        '< <',  // Left shift
        '> >',  // Right shift
        '...'   // Spread operator
    ]
};

// Get symbols for current level
function getSymbols(level) {
    const levelSymbols = symbolsByLevel[level] || symbolsByLevel[1];
    // Each symbol needs a pair
    return [...levelSymbols, ...levelSymbols];
}

// Export symbols and functions
window.symbols = getSymbols(1); // Start with level 1 symbols
window.getSymbols = getSymbols;
window.symbolsByLevel = symbolsByLevel;