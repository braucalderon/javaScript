
let scores, roundScore, activePlayer, 
gamePlaying, lastDice_1, lastDice_2, setScore, win_0, win_1;

win_1 = 0;
win_0 = 0;

init();


// -------------------------------------
// FUNCTION ROLL DICE
// -------------------------------------
function btn(){
   
    
    document.getElementById('finalScore').disabled = true;
    document.getElementById('btnHold').disabled = true;
    
    if(gamePlaying){
        
        // Random number from 1 to 6
        let dice_1 = Math.floor(Math.random() * 6) + 1;
        let dice_2 = Math.floor(Math.random() * 6) + 1;
        

        // Display the result
        // changing the source attribute
        let dice_1DOM = document.querySelector('.dice_1');
        dice_1DOM.style.display = 'block';
        let dice_2DOM = document.querySelector('.dice_2');
        dice_2DOM.style.display = 'block';

        // change the image based in the dice number
        dice_1DOM.src = 'dice-' + dice_1 + '.png';
        dice_2DOM.src = 'dice-' + dice_2 + '.png';

        

        if(dice_1 === 1 && dice_2 === 1){
            // document.getElementById('btnHold').disabled = true;
            // lose the score
            scores[activePlayer] = 0;
            document.querySelector('#score_' + activePlayer).textContent = '0';
            setTimeout(() => nextPlayer(), 1100);
   
        }
        // Update the round score if the rolled number was not a 1
        else if (dice_1 !== 1 && dice_2 !== 1 && dice_1 !== dice_2) {
            // document.getElementById('btnHold').disabled = true;
            roundScore = dice_1 + dice_2;
            document.querySelector('#current_' + activePlayer).textContent = roundScore;
            setTimeout(() => hold(), 1100);
           
           
        }
        else if (dice_1 === dice_2){
            document.getElementById('btnHold').disabled = false;
            roundScore += dice_2 + dice_1;
            document.querySelector('#current_' + activePlayer).textContent = roundScore;
            
        
        }
        else {
            if (dice_1 === 1 || dice_2 === 1) {
                // document.getElementById('btnHold').disabled = true;
                setTimeout(() => nextPlayer(), 1100);
            }
        }
        
    }   
}
// -------------------------------------
// FUNCTION HOLD BTN
// -------------------------------------

function hold(){

    
    if(gamePlaying){
        // add current score to global score
        scores[activePlayer] += roundScore;

        // update the UI
        document.querySelector('#score_' + activePlayer).textContent = scores[activePlayer];

        // check if player won the game
        if (scores[activePlayer] >= setScore) {
            document.querySelector('#name_' + activePlayer).textContent = 'Winner !';
            getWinner(activePlayer);
            // console.log('active player'+activePlayer);
            diceM();
            totalWins(activePlayer);
            gamePlaying = false;

        } else {
            // next player
            nextPlayer();
        }
    }   
}
// -------------------------------------
// FUNCTION DICE    
// -------------------------------------
function diceM(){
    // makes the objects of the DOM disappear 
    document.querySelector('.dice_1').style.display = 'none';
    document.querySelector('.dice_2').style.display = 'none';
}
// -------------------------------------
// FUNCTION INIT
// -------------------------------------
function init(){

    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    gamePlaying = true;

    
    diceM();
    
    document.getElementById('score_0').textContent = '0';
    document.getElementById('current_0').textContent = '0';
    document.getElementById('score_1').textContent = '0';
    document.getElementById('current_1').textContent = '0';

    document.getElementById('name_0').textContent = 'Player 1';
    document.getElementById('name_1').textContent = 'Player 2';

    document.getElementById('finalScore').disabled = false;
    // console.log('setScore: ' + setScore);
}
// -------------------------------------
// FUNCTION NEW GAME
// -------------------------------------
function newGAME(player) {
   
    init();
    // get the element back into the DOM
    let player0DOM = document.getElementById('player_0');
    player0DOM.style.display = 'block';

    let player1DOM = document.getElementById('player_1');
    player1DOM.style.display = 'block';

    // start the new game with the winner
    if(player === 0) {
        document.querySelector('.player-0-panel').classList.add('active');
        activePlayer = 0;
        
    }else{
        document.querySelector('.player-1-panel').classList.add('active');
        activePlayer = 1;
        
    }
}
// -------------------------------------
// FUNCTION NEXT PLAYER
// -------------------------------------

function nextPlayer(){

    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    // set the score to 0 for the next player 
    roundScore = 0;

    document.getElementById('current_0').textContent = '0';
    document.getElementById('current_1').textContent = '0';

    // toggle remove or add an object if it is not present
    // classList to access the classes in html
    document.querySelector('.player-1-panel').classList.toggle('active');
    document.querySelector('.player-0-panel').classList.toggle('active');

    // makes the object in the dom to disappear 
    diceM();

}

// -------------------------------------
// FUNCTION TIMES OF WINS
// -------------------------------------
function totalWins(player){

    player === 0 ? win_0++ : win_1++ ;

    document.getElementById('win0').textContent = 'Wins: ' + win_0;
    document.getElementById('win1').textContent = 'Wins: ' + win_1;

}

// -------------------------------------
// FUNCTION SHOWING ONLY THE WINNER
// -------------------------------------
function getWinner(player){
    
    // disable and remove classes from html
    if(player === 0){
        
        // console.log('player 0 winner: ' + player);
        document.getElementById('player_1').style.display = 'none';
        document.querySelector('.player-0-panel').classList.remove('active');

    }else{
        // console.log('player 1 winner: ' + player);
        document.getElementById('player_0').style.display = 'none';
        document.querySelector('.player-1-panel').classList.remove('active');
    }
    
}

// -------------------------------------
// events notifications
// library MDN 
//  anonymous functions are functions without a name that can only be used 
// within the .addEventListener('click', function(){ do something here});
// -------------------------------------
document.querySelector('.btn-roll').addEventListener('click', btn);
document.querySelector('.btn-hold').addEventListener('click', hold);
document.querySelector('.btn-new').addEventListener('click', function(){

    newGAME(activePlayer); 
});
document.querySelector('.btn-setScore').addEventListener('click', function(){
    
    document.getElementById('btnHold').disabled = true;
    let input = document.querySelector('.final-score').value;

    // undefined will set the score to the value
    input ? setScore = input : setScore = 108;
    document.getElementById('finalScore').disabled = true;
});

document.querySelector('.btn-gameRules').addEventListener('click', function(){
    let gamerules1 = 'If the player rolls a 1, they score nothing and it becomes the next player\'s turn.\n';
    let gamerules2 = 'If the player rolls any other number, it is added to their total and the next player\'s turn continues.\n';
    let gamerules3 = 'If two 1s are rolled, the player\’s entire score is lost, and the turn ends.\n';
    let gamerules4 = 'If a double is rolled, the point total is added to the turn total as with any roll but the player can hold or play again';
    alert('TWO-DICE-RULES \n'+ gamerules1 + gamerules2 + gamerules3 + gamerules4);
});
