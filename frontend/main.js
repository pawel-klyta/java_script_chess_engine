const baseURL = 'http://localhost:3001';
const Board = '/board';
const Move = '/move';
const cpuMove = '/cpumove';

const intoAlphabetic = (number) => {
    return String.fromCharCode(number + 96);
};

const intoNumber = (letter) => {
    return letter.codePointAt(0) - 96;
};

const isEven = (number) => {
    return Number.isInteger(number / 2);
};

const getOppositeColor = (pieceColor) => {
    if (pieceColor === 'w') {
        return 'b';
    } else {
        return 'w';
    };
};

let gameVsCpuAs = false;

let cpuTurn = false;

const moveEvent = new Event('moveEvent');

const inputRow = document.getElementById("inputRow");

const endOfGameMessage = document.createElement("span");
const playAgainButton = document.createElement("button");

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
        document.dispatchEvent(moveEvent);
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

let flipped = false;
const handleClicks = async (x, y) => {
    if (cpuTurn) {
        return;
    }

    clearInputRow();
    if (flipped) {
        x = intoAlphabetic(getOppositeNumber(intoNumber(x)));
        y = getOppositeNumber(y);
    };
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
            await updateBoard();
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

const getOppositeNumber = (number) => {
    const difference = 4 - number;
    return 5 + difference;
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

            if (inputRow.hasChildNodes()) {
                const currentPiece = inputRow.firstChild;
                inputRow.removeChild(currentPiece);
            };

            inputRow.appendChild(endOfGameMessage);
            inputRow.appendChild(playAgainButton);

            inputRow.endOfGame = message;

            gameVsCpuAs = false;
        };
    } catch (error) {
        console.log(error);
    } ;
};

const rotateBoard = () => {
    if (flipped) {
        flipped = false;
    } else {
        flipped = true;
    }

    const descriptionSquares = document.getElementsByClassName('descriptionSquare');
    for (let y = 1; y <= 8; y++) {
        const index = y - 1;
        const index2 = index + 8

        descriptionSquares[index].innerHTML = getOppositeNumber(descriptionSquares[index].innerHTML);
        descriptionSquares[index2].innerHTML = intoAlphabetic(getOppositeNumber(intoNumber(descriptionSquares[index2].innerHTML)));

        for (let x = 1; x <= 8; x++) {
            const xAlphabet = intoAlphabetic(x);
            const currentSquare = document.getElementsByClassName("board")[0].children[y - 1].children[x - 1];
            currentSquare.removeEventListener('click', () => {handleClicks(xAlphabet, y)});

            const newLetter = intoAlphabetic(getOppositeNumber(intoNumber(currentSquare.id[0])));
            const newNumber = getOppositeNumber(currentSquare.id[1]);

            currentSquare.id = `${newLetter}${newNumber}`;
        }
    }
    clearAllMarking();
    updateBoard();
};

const waitForCpuMove = async (color) => {
    const response = await fetch(baseURL + Board + cpuMove + '/' + getOppositeColor(color), {
        method: 'GET'
    });
    cpuTurn = false;
    await updateBoard();
    if (gameVsCpuAs) {
        await waitForHumanMove(color);
    };
};

const waitForHumanMove = async (color) => {
    await new Promise(
        (resolve) => {
            const moveIndicator = () => {
            document.removeEventListener('moveEvent', moveIndicator);
            resolve();
        };

            document.addEventListener('moveEvent', moveIndicator);
        }
    );

    await updateBoard();

    if (gameVsCpuAs) {
        cpuTurn = true;
        await waitForCpuMove(color);
    };
};

const startGameVsCpu = async (color) => {
    await resetBoard();
    gameVsCpuAs = color;

    if (color === 'w') {
        if (flipped) {
            rotateBoard();
        }
    } else {
        if (!flipped) {
            cpuTurn = true;
            rotateBoard();
            const response = await fetch(baseURL + Board + cpuMove + '/' + getOppositeColor(color), {
                method: 'GET'
            });
            cpuTurn = false;
            await updateBoard();
        }
    };

    await waitForHumanMove(color);
};

const confirmGameVsCpu = () => {
    if (cpuTurn) {
        return;
    }

    inputRow.innerHTML = 'What color would you like to play?';

    const chooseWhite = document.createElement('img');
    const chooseBlack = document.createElement('img');

    chooseWhite.src = './assets/chess_pieces_set_0/' + 'white/wK.webp';
    chooseBlack.src = './assets/chess_pieces_set_0/' + 'black/bK.webp';

    chooseWhite.addEventListener('click', () => {startGameVsCpu('w')});
    chooseBlack.addEventListener('click', () => {startGameVsCpu('b')});

    inputRow.appendChild(chooseWhite);
    inputRow.appendChild(chooseBlack);
};

const addControlColumnEventListeners = () => {
    const btnCpu = document.getElementById('btnCpu')
    const btnRotate = document.getElementById('btnRotate');
    const btnReset = document.getElementById('btnReset');

    btnCpu.addEventListener('click', confirmGameVsCpu);
    btnRotate.addEventListener('click', rotateBoard);
    btnReset.addEventListener('click', resetBoard);
};

async function resetBoard() {
    if (cpuTurn) {
        return;
    }

    try {
        await fetch(baseURL + Board + '/new', {
            method: "POST"
        });
        await updateBoard();
        inputRow.endOfGame = false;
        clearInputRow();
        gameVsCpuAs = false;
        cpuTurn = false;
    } catch (error) {
        console.log(error);
    };
};

await updateBoard();
addEventListeners();
addControlColumnEventListeners();