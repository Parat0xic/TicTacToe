
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
    playerModule.initPlayers(player1Name, player2Name, startingPlayerSide);
    gameBoard.setCurrentPlayer(startingPlayerSide);
    })
}


function Player (name, side) {
    return { name, side };
}

const displayController = (function (){

    function handleClick(clickedSquare) {
        const squareIndex = clickedSquare.dataset.index;
        clickedSquare.textContent = gameBoard.getCurrentPlayer();
        gameBoard.updateBoardState(squareIndex);
        if (gameBoard.checkForWin()) {
            handleWin("win");
        }
        else if (gameBoard.checkForDraw()) {
            handleWin("draw");
        }
        gameBoard.switchPlayer();
    }

    function handleWin(status) { //and Draw
        winningside = gameBoard.getCurrentPlayer();
        let champion;
        const winBox = document.querySelector(".winbox");
        const gameElement = document.querySelector(".game");
        const winMsg = winBox.querySelector("#winmsg");
        const reset = document.querySelector("#reset");
        if (status === "win") {
             if (playerModule.player1.side === winningside) {
            champion = playerModule.player1.name;
            }
            else {
                champion = playerModule.player2.name;
            }
            winMsg.textContent = `${champion} is the winner!  `;
            
        }
        else if (status === "draw") {
            winMsg.textContent = `It's a draw!`;
        }
        gameElement.classList.add("hidden")
        winBox.classList.remove("hidden");
        reset.addEventListener("click", function(e) {
                displayController.reset();
            });  
    }

    function reset() {
        game = document.querySelector(".game")
        game.classList.add("hidden");
        gameboxes = game.querySelectorAll(".square");
        for (const i of gameboxes) {
            i.textContent = "";
        }
        document.querySelector(".winbox").classList.add("hidden");
        document.querySelector(".form").classList.remove("hidden");
        gameBoard.clearBoardState();
    }
    
    return {
        getStartingPlayerSide: () => startingPlayerSide,
        handleClick,
        handleWin,
        reset
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
    function checkForDraw() {
        return !boardState.includes("");
    }
    function updateBoardState(squareIndex) {
        if (boardState[squareIndex] === ""){
            boardState[squareIndex] = currentPlayer;
        }
    }

    function clearBoardState() {
        boardState.fill("");
    }

    return  {
        checkForWin, 
        switchPlayer, 
        getCurrentPlayer: () => currentPlayer,
        updateBoardState,
        setCurrentPlayer,
        clearBoardState,
        checkForDraw
    };
})();

const playerModule = (function () {
    const player1 = Player("", "");
    const player2 = Player("", "");

    function initPlayers(player1Name, player2Name, startingPlayerSide) {
        player1.name = player1Name;
        player2.name = player2Name;
        player1.side = startingPlayerSide;
        player2.side = startingPlayerSide === "X" ? "O" : "X";
    }
    return {
        player1,
        player2,
        initPlayers
    }
})();
