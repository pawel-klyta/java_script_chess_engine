const baseURL = 'http://localhost:3001';
const Board = '/board';
const Move = '/move'

const intoAlphabetic = (number) => {
    return String.fromCharCode(number + 96);
};

const inputRow = document.getElementById("inputRow");

let promoteToQueen = null;
let promoteToRook = null;
let promoteToBishop = null;
let promoteToKnight = null;

const clearInputRow = () => {
    if (!inputRow.endOfGame) {
    while (inputRow.firstChild) {
            inputRow.removeChild(inputRow.firstChild)
        }
        promoteToQueen = null;
        promoteToRook = null;
        promoteToBishop = null;
        promoteToKnight = null;
    }
}

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
    clearInputRow();
    const currentSquare = document.getElementById(x + y);
    if (currentSquare.isLegal) {
        if (currentSquare.isLegal.length === 1) {
            const moveObject = {
                coords: findToMove().coords,
                piece: findToMove().piece,
                move: currentSquare.isLegal[0]
            }
            await makeMove(moveObject)
            clearAllMarking();
            updateBoard();
            return
        } else {
            const pieceColor = findToMove().piece[0];
            let colorWord = 'black';
            if (pieceColor === 'w') {
                colorWord = "white";
            };

            promoteToQueen = document.createElement('img');
            promoteToRook = document.createElement('img');
            promoteToBishop = document.createElement('img');
            promoteToKnight = document.createElement('img');

            promoteToQueen.src = './assets/chess_pieces_set_0/' + colorWord + '/' + pieceColor + 'Q' + '.webp';
            promoteToRook.src = './assets/chess_pieces_set_0/' + colorWord + '/' + pieceColor + 'R' + '.webp';
            promoteToBishop.src = './assets/chess_pieces_set_0/' + colorWord + '/' + pieceColor + 'B' + '.webp';
            promoteToKnight.src = './assets/chess_pieces_set_0/' + colorWord + '/' + pieceColor + 'N' + '.webp';

            inputRow.appendChild(promoteToQueen);
            inputRow.appendChild(promoteToRook);
            inputRow.appendChild(promoteToBishop);
            inputRow.appendChild(promoteToKnight);

            promoteToQueen.addEventListener("click", () => {
                for (let i = 0; i < currentSquare.isLegal.length; i++) {
                    if (currentSquare.isLegal[i][3][1] === "Q") {
                        currentSquare.isLegal = [currentSquare.isLegal[i]];
                    };
                };
                handleClicks(x, y);
            });
            promoteToRook.addEventListener("click", () => {
                for (let i = 0; i < currentSquare.isLegal.length; i++) {
                    if (currentSquare.isLegal[i][3][1] === "R") {
                        currentSquare.isLegal = [currentSquare.isLegal[i]];
                    };
                };
                handleClicks(x, y);
            });
            promoteToBishop.addEventListener("click", () => {
                for (let i = 0; i < currentSquare.isLegal.length; i++) {
                    if (currentSquare.isLegal[i][3][1] === "B") {
                        currentSquare.isLegal = [currentSquare.isLegal[i]];
                    };
                };
                handleClicks(x, y);
            });
            promoteToKnight.addEventListener("click", () => {
                for (let i = 0; i < currentSquare.isLegal.length; i++) {
                    if (currentSquare.isLegal[i][3][1] === "N") {
                        currentSquare.isLegal = [currentSquare.isLegal[i]];
                    };
                };
                handleClicks(x, y);
            });
        };   
    };
    if (!(inputRow.hasChildNodes())) {
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
                
                if (legalSquare.isLegal) {
                    legalSquare.isLegal.push(data[index]);
                } else {
                    legalSquare.isLegal = [data[index]];
                }  
            };
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
                if (data.board[y][x]) {
                    const color = data.board[y][x][0];
                    const pieceType = data.board[y][x][1];
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
        if (data.endOfGame) {
            const endOfGameMessage = document.createElement("span");
            const playAgainButton = document.createElement("button");
            let message;

            switch (data.endOfGame) {
                case "draw":
                    message = "Draw!";
                    break;
                case "wWin":
                    message = "White Wins!";
                    break;
                case "bWin":
                    message = "Black Wins!";
                    break;
            }

            endOfGameMessage.innerHTML = message;
            playAgainButton.innerHTML = "Play Again!";
            playAgainButton.id = "playAgain";
            playAgainButton.addEventListener('click', resetBoard);

            inputRow.appendChild(endOfGameMessage);
            inputRow.appendChild(playAgainButton);

            inputRow.endOfGame = message;
        };
    } catch (error) {
        console.log(error);
    } ;
};

async function resetBoard() {
    try {
        await fetch(baseURL + Board + '/new', {
            method: "POST"
        });
        await updateBoard();
        inputRow.endOfGame = false;
        clearInputRow();
    } catch (error) {
        console.log(error);
    };
};

await updateBoard();
addEventListeners();
//await makeMove({ coords: [2, 2], piece: 'wP', move: [2, 3, false]});
//await updateBoard();


