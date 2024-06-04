// game.js

// Card deck and game variables
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerPoints = 0;
let dealerPoints = 0;
let playerWins = 0;
let dealerWins = 0;
let dealerBank = 10000;
let playerWager = 0;

function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function startGame() {
    createDeck();
    shuffleDeck();
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];
    playerWager = Math.floor(Math.random() * 20 + 1) * 25;
    updatePoints();
    displayHands();
    updateScoreboard();
    displayWager();
    document.getElementById('status').innerText = '';
    document.getElementById('player-action-button').disabled = false;
    document.getElementById('dealer-hit-button').disabled = true;
    document.getElementById('dealer-stay-button').disabled = true;
    document.getElementById('dealer-hint-button').disabled = true;
}

function drawCard() {
    return deck.pop();
}

function updatePoints() {
    playerPoints = calculatePoints(playerHand);
    dealerPoints = calculatePoints(dealerHand);
}

function calculatePoints(hand) {
    let points = 0;
    let aces = 0;
    for (let card of hand) {
        if (card.value === 'A') {
            aces++;
            points += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            points += 10;
        } else {
            points += parseInt(card.value);
        }
    }
    while (points > 21 && aces > 0) {
        points -= 10;
        aces--;
    }
    return points;
}

function displayHands() {
    const playerHandDiv = document.getElementById('player-hand');
    const dealerHandDiv = document.getElementById('dealer-hand');
    playerHandDiv.innerHTML = '';
    dealerHandDiv.innerHTML = '';
    for (let card of playerHand) {
        playerHandDiv.innerHTML += `${card.value} of ${card.suit}<br>`;
    }
    for (let card of dealerHand) {
        dealerHandDiv.innerHTML += `${card.value} of ${card.suit}<br>`;
    }
}

function playerAction() {
    if (playerPoints <= 16) {
        playerHand.push(drawCard());
        updatePoints();
        displayHands();
        if (playerPoints > 21) {
            document.getElementById('status').innerText = 'Player busts! Dealer wins.';
            dealerWins++;
            updateScoreboard();
            document.getElementById('player-action-button').disabled = true;
        }
    } else {
        addMessage('Player: Stay');
        document.getElementById('player-action-button').disabled = true;
        document.getElementById('dealer-hit-button').disabled = false;
        document.getElementById('dealer-stay-button').disabled = false;
        document.getElementById('dealer-hint-button').disabled = false;
    }
}

function dealerAction(action) {
    if (action === 'hit') {
        dealerHand.push(drawCard());
        updatePoints();
        displayHands();
        if (dealerPoints > 21) {
            document.getElementById('status').innerText = 'Dealer busts! Player wins.';
            playerWins++;
            dealerBank -= playerWager;
            updateScoreboard();
            document.getElementById('dealer-hit-button').disabled = true;
            document.getElementById('dealer-stay-button').disabled = true;
            document.getElementById('dealer-hint-button').disabled = true;
            setTimeout(startGame, 2000);
        }
    } else if (action === 'stay') {
        determineWinner();
    }
}

function determineWinner() {
    if (dealerPoints > 21 || playerPoints > dealerPoints) {
        document.getElementById('status').innerText = 'Player wins!';
        playerWins++;
        dealerBank -= playerWager;
    } else if (dealerPoints > playerPoints) {
        document.getElementById('status').innerText = 'Dealer wins!';
        dealerWins++;
        dealerBank += playerWager;
    } else {
        document.getElementById('status').innerText = 'Push!';
    }
    updateScoreboard();
    setTimeout(startGame, 2000);
}

function addMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageP = document.createElement('p');
    messageP.innerText = message;
    messagesDiv.appendChild(messageP);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function updateScoreboard() {
    document.getElementById('player-wins').innerText = playerWins;
    document.getElementById('dealer-wins').innerText = dealerWins;
    document.getElementById('dealer-bank').innerText = dealerBank;
}

function displayWager() {
    document.getElementById('player-wager').innerText = playerWager;
}

function showHint() {
    addMessage('Hint: Dealer should hit on soft 17.');
}

// Event listeners for controls
document.getElementById('start-game-button').addEventListener('click', startGame);
document.getElementById('player-action-button').addEventListener('click', playerAction);
document.getElementById('dealer-hit-button').addEventListener('click', () => dealerAction('hit'));
document.getElementById('dealer-stay-button').addEventListener('click', () => dealerAction('stay'));
document.getElementById('dealer-hint-button').addEventListener('click', showHint);

// Initialize the game
startGame();
