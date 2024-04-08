function generateBlanks(randomWord) {
    var blank = "";
    var n = randomWord.length;
    let count = Math.ceil(Math.log(n));
    let c = Math.floor(Math.random() * n);
    for (var i = 0; i < n; i++) {
        let r = Math.floor(Math.random() * n)
        if (r == c && count >= 0) {
            blank = blank + randomWord[i];
            count--;
        }
        else {
            blank = blank + "_ ";
        }
    }
    return blank.trim();
}

export default generateBlanks;