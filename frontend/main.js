const baseURL = 'http://localhost:3001';
const Board = '/board';
const Move = '/move'

const intoAlphabetic = (number) => {
    return String.fromCharCode(number + 96);
};

const getLegalMovesOfSpecificPiece = async (x, y) => {
    const coordinates = '/' + x + '/' + y;
    try {
        const response = await fetch(baseURL + Board + coordinates, {
            method: 'GET'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    };
};

const makeMove = async (object) => {
    try {
        const bodyJSON = JSON.stringify(object);
        const response = await fetch(baseURL + Board + Move, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bodyJSON
        });
    } catch (error) {
        console.log(error);
    }
};

const clearAllMarking = () => {
    for (let y = 1; y <= 8; y++) {
        for (let x = 1; x <= 8; x++) {
            const xAlphabet = intoAlphabetic(x);
            const currentSquare = document.getElementById(xAlphabet + y);
            currentSquare.style.boxShadow = '';
            currentSquare.isLegal = false;
            currentSquare.toMove = false;
        };
    }
};

const findToMove = () => {
    for (let y = 1; y <= 8; y++) {
        for (let x = 1; x <= 8; x++) {
            const xAlphabet = intoAlphabetic(x);
            const currentSquare = document.getElementById(xAlphabet + y);
            if (currentSquare.toMove) {
                return currentSquare;
            };
        };
    }
    return false;
};

const handleClicks = async (x, y) => {
    const currentSquare = document.getElementById(x + y);
    if (currentSquare.isLegal) {
        const moveObject = {
            coords: findToMove().coords,
            piece: findToMove().piece,
            move: currentSquare.isLegal
        }
        await makeMove(moveObject)
        clearAllMarking();
        updateBoard();
        return
    };
    clearAllMarking();
    currentSquare.style.boxShadow = 'inset 0 0 0 2px green';
    currentSquare.toMove = true;
    if (!(currentSquare.hasChildNodes())) {
        return false;
    } else {
        const data = await getLegalMovesOfSpecificPiece(x, y);
        for (let index = 0; index < data.length; index++) {
            const xAlphabet = intoAlphabetic(data[index][0]);
            const legalSquare = document.getElementById(xAlphabet + data[index][1]);
            legalSquare.style.boxShadow = 'inset 0 0 0 2px red';
            legalSquare.isLegal = data[index];
        };
    };
};

const addEventListeners = () => {
    for (let y = 1; y <= 8; y++) {
        for (let x = 1; x <= 8; x++) {
            const xAlphabet = intoAlphabetic(x);
            const currentSquare = document.getElementById(xAlphabet + y);
            currentSquare.addEventListener('click', () => {handleClicks(xAlphabet, y)});
            currentSquare.isLegal = false;
        };
    }
};

const updateBoard = async () => {
    try {
        const response = await fetch(baseURL + Board, {
            method: 'GET'
        });
        const data = await response.json();
        for (let y = 1; y <= 8; y++) {
            for (let x = 1; x <= 8; x++) {
                const xAlphabet = intoAlphabetic(x);
                const currentSquare = document.getElementById(xAlphabet + y);
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
                    currentSquare.piece = color + pieceType;
                    currentSquare.coords = [x, y];
                };
            };
        };
    } catch (error) {
        console.log(error);
    } ;
};

await updateBoard();
addEventListeners();
//await makeMove({ coords: [2, 2], piece: 'wP', move: [2, 3, false]});
//await updateBoard();


