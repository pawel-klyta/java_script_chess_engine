const unique = [];

const double = [];

const isDuplicate = (array, currentBoardString) => {
    for (let index = 0; index < array.length; index++) {
        if (array[index] === currentBoardString) {
            return index;
        }
    }
    return false;
}

const is3TimeRepetition = (currentBoard) => {
    const currentBoardString = JSON.stringify(currentBoard);
    const uniqueIndex = isDuplicate(unique, currentBoardString);
    const doubleIndex = isDuplicate(double, currentBoardString);

    if (uniqueIndex || uniqueIndex === 0) {
        double.push(unique[uniqueIndex]);
        unique.splice(uniqueIndex, 1);
    } else if (doubleIndex || doubleIndex === 0) {
        return true;
    } else {
        unique.push(currentBoardString);
    } 
    return false;
}

module.exports = { is3TimeRepetition }