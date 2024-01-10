        // This is a IIFE
const displayController = (() =>{
     const dialog = document.querySelector("dialog");
     const closeDialog = document.querySelector('#closeDialog');
    const renderMessage = (message) =>{
        document.querySelector("#message").innerHTML = message;
    }
     
    const renderScoreBoard = (player1 , player2) =>{
        document.querySelector("#player1Score").innerHTML = player1;
        document.querySelector("#player2Score").innerHTML = player2;
    }
    function openCheck (dialog){
        if (dialog.open) {
            console.log('Dialog open');
        }else {
            console.log('Dialog closed');
        }
    };
    const showModal = () =>{
        dialog.showModal();
    openCheck(dialog);
    }
    closeDialog.addEventListener('click',()=>{
        dialog.close("hide");
        openCheck(dialog);
    })
    return {
        renderMessage,
        renderScoreBoard,
        showModal,
    }
    
})();

        //This is also an IIFE that is responsible for holding methods for displaying and exporting gameboard info.
const Gameboard = (() =>{ 
    let _gameboard = ['','','','','','','','','']

    const render = () =>{
         let boardHTML = '';
         

         _gameboard.forEach((square , index) =>{
            boardHTML+= `<div class="square" id = "square-${index}">${square}</div>`;
        });
        document.querySelector('#Gameboard').innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) =>{
            square.addEventListener("click",Game.markSquare)
        });
    };
    
    const update = (index, value) => {
        _gameboard[index] = value;
        render();
    }

    const getGameboard = () => _gameboard;

    return{
        render,
        update,
        getGameboard,
        
    };
}) ();

        // This is a function factory!
const createPlayer = (name , mark) =>{
    return{
        name,
        mark,
    }
}

const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver ;
     let player1Score = 0;
     let player2Score = 0;

    const start = () =>{
        players = [
            createPlayer(document.querySelector('#player1').value , "X"),
            createPlayer(document.querySelector("#player2").value , "O"),
        ];

        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) =>{
            square.addEventListener("click",markSquare)
        });
    }

    const restart = () =>{
        for (let i = 0 ; i < 9 ; i++){
            Gameboard.update(i , "");
        }
        Gameboard.render();
        displayController.renderMessage("")
    }

    const markSquare = (event) =>{
        let index = parseInt(event.target.id.split("-")[1]);
        if (Gameboard.getGameboard()[index]!== ''){
            return
        };
        Gameboard.update(index , players[currentPlayerIndex].mark);

        if(checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)){
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} Won!`);
                if (players[currentPlayerIndex].mark === 'X'){
                     player1Score++
                     displayController.showModal();
                    displayController.renderScoreBoard(`${players[0].name}'s score is ${player1Score}`, `${players[1].name}'s score is ${player2Score}`);
                }else if (players[currentPlayerIndex].mark === "O"){ 
                    player2Score++
                    displayController.showModal();
                    displayController.renderScoreBoard(`${players[1].name}'s score is ${player1Score}`, `${players[0].name}'s score is ${player2Score}`)
                }
        }else if (checkForTie(Gameboard.getGameboard())){
            gameOver = true;
            displayController.showModal();
            displayController.renderMessage(`Its a Tie!`);
           
        }

        
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        
    }
    return{
        markSquare,
        start,
        restart,
    }
})();
function checkForWin(board){
    const winningCombinations =[
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]
    for (let i = 0 ; i<winningCombinations.length; i++){
        const [a,b,c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a]=== board[c]){
            const squares = document.querySelectorAll(".square")
           squares.forEach((square) =>{
                square.removeEventListener("click",Game.markSquare)})
            return true;
        } 
    }
    return false;
};

function checkForTie (board){
    
    return board.every(cell => cell !== "")
}

const restartButton = document.querySelector('#restart');
    restartButton.addEventListener("click", () =>{ Game.restart();
    })
const startButton = document.querySelector('#start');
    startButton.addEventListener("click", () =>{
        Game.start();
        startButton.style.display ="none";
        document.querySelector(".player1").style.display = "none";
        document.querySelector(".player2").style.display = "none";
        document.querySelector(".X").style.display="none";
        document.querySelector(".O").style.display = "none";
        restartButton.style.display = "block"

    })







