const baseURL = 'http://localhost:3001';
const Board = '/board';
console.log(baseURL + Board);

const intoAlphabetic = (number) => {
    return String.fromCharCode(number + 96);
};

fetch(baseURL + Board, {
    method: 'GET'
}).then((response) => {
    return response.json()
}).then((data) => {
    console.log(data);
    for (let y = 1; y <= 8; y++) {
        for (let x = 1; x <= 8; x++) {
            const currentSquare = document.getElementById(intoAlphabetic(x) + y);
            if (currentSquare.hasChildNodes()) {
                const currentPiece = currentSquare.firstChild;
                currentSquare.removeChild(currentPiece);
            };
            if (data[y][x]) {
                const color = data[y][x][0];
                const pieceType = data[y][x][1];
                const newIMG = document.createElement('img');
                let colorWord = 'white';
                if (color === 'b') {
                    colorWord = 'black';
                };
                newIMG.src = './assets/chess_pieces_set_0/' + colorWord + '/' + color + pieceType + '.webp';
                currentSquare.append(newIMG);
            };
        };
    };
}).catch((error) => {console.log(error)});