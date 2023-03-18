
const FILE = 'dictionary.txt';
const LETTERS = ['e', 'r', 't', 'e', 'm', 's'];
let allWords;

// put all words of length between 3 and 6 (inclusive) in a set
const getAllWordsPromise = () => {
    const fs = require('fs');
    const words = new Set();

    return new Promise((resolve, reject) => {
        // read the file
        fs.readFile(FILE, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                // add each word into a hashSet where the length of each word has to be less than or equal to 6
                data.trim().split('\n').map(word => word.trim()).forEach(word => {
                    if (word.length < 7 && word.length > 2) words.add(word)
                });
                allWords = words;
                resolve(words);
            }
        });
    });
}

// sort a set by length in descending order
const sortByLength = (wordSet) => Array.from(wordSet).sort((a, b) => b.length - a.length);

// main game loop
const anagrams = (letters) => {
    const output = new Set();
    for (const start of new Set(letters)) { // start exploring from each unique letter
        console.log(`Starting with ${start}`);
        modifiedDFS(letters, start, start, output);
    }

    return output;
};

//
const modifiedDFS = (words, start, cur, output) => {
    // add word into output if it exists in the dictionary
    if (allWords.has(cur)) output.add(cur);

    // find the neighbors of start
    const neighbors = findNeighbors(start, words);

    // loop through the neighbors and add
    for (const node of neighbors) {
        const curStr = cur + node;

        // check if there are words with curStr as the prefix
        if (!earlyStop(curStr)) {
            modifiedDFS(neighbors, node, curStr, output);
        }
    }
};

// find the neighbors of a given node
const findNeighbors = (curNode, words) => {
    const firstIndex = words.indexOf(curNode);
    const lastIndex = words.lastIndexOf(curNode);

    // if there are multiple curNodes in words
    if (firstIndex !== lastIndex) {
        return words.slice(0, firstIndex).concat(words.slice(firstIndex + 1));
    } else {
        return words.filter(word => word !== curNode);
    }
}

// checks if the prefix is in any of the words (true if need to stop early)
const earlyStop = (prefix) => {
    for (const word of allWords) {
        if (word.startsWith(prefix)) return false;
    }
    return true
};

// run the promise
getAllWordsPromise().then(
    allWords => {
        console.log(sortByLength(anagrams(LETTERS, allWords)));
    },
    err => console.log(err)
);