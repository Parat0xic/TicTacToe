
document.addEventListener("DOMContentLoaded", function() { 
    const gameElement = document.querySelector(".game");
    initGame(gameElement);
    initForm(gameElement);
});
   
function initGame(gameElement) {
        gameElement.addEventListener("click", function(e) {
            if (e.target.classList.contains("square")) {
                const clickedSquare = e.target;
                if (clickedSquare.textContent === "") {
                    displayController.handleClick(clickedSquare);
                }
            }
        });
    }

function initForm(gameElement) {
    const form = document.querySelector(".form");
    form.addEventListener("submit", function(e) {
    e.preventDefault();
    const player1Name = form.querySelector("#player1").value;
    const player2Name = form.querySelector("#player2").value;
   let startingPlayerSide = form.querySelector('input[name="side"]:checked').value;
    form.classList.add("hidden");
    gameElement.classList.remove("hidden");
    const player1 = Player(player1Name, startingPlayerSide);
    const player2 = Player(player2Name, startingPlayerSide === "X" ? "O" : "X");
    gameBoard.setCurrentPlayer(startingPlayerSide);
    })
}

    const displayController = (function (){

    function handleClick(clickedSquare) {
        const squareIndex = clickedSquare.dataset.index;
        clickedSquare.textContent = gameBoard.getCurrentPlayer();
        gameBoard.updateBoardState(squareIndex);
        if (gameBoard.checkForWin()) {
            handleWin();
        }
        gameBoard.switchPlayer();
    }

    function handleWin() {
        const winBox = document.querySelector(".winbox");
        const gameElement = document.querySelector(".game");
        gameElement.classList.add("hidden")
        winBox.textContent = `${gameBoard.getCurrentPlayer()} is the winner! Play again?`;
        winBox.classList.remove("hidden");
    }
    
    const reset = document.querySelector(".reset");
    return {
        getStartingPlayerSide: () => startingPlayerSide,
        handleClick
    };
})();

const gameBoard = (function () {
    const boardState = ["","","","","","","","",""];

    const winningCominations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], //Rows
        [0, 3 ,6], [1, 4, 7], [2, 5, 8], //Columns
        [0, 4, 8], [2, 4, 6] //Diagonals
    ];
    let currentPlayer;
    function setCurrentPlayer(startingPlayerSide) {
        currentPlayer = startingPlayerSide;
    }
    function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
    function checkForWin() {
        for (const i of winningCominations) {
            const [a, b, c] = i;
            if (boardState[a] === currentPlayer && boardState[b] === currentPlayer && boardState[c] === currentPlayer) {
                return true;
            }
    
        }
    }
    function updateBoardState(squareIndex) {
        if (boardState[squareIndex] === ""){
            boardState[squareIndex] = currentPlayer;
        }
    }

    return  {
        checkForWin, 
        switchPlayer, 
        getCurrentPlayer: () => currentPlayer,
        updateBoardState,
        setCurrentPlayer
    };
})();

const Player = function (name, side) {
    this.name = name;
    this.side = side;
}
