let deck, playerHand, dealerHand, playerWager;
let playerWins = 0, dealerWins = 0, bank = 10000, score = 0, startTime;

// Function to create a deck of cards
function createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    deck = shuffle(deck);
}

// Function to shuffle the deck
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to draw a card
function drawCard() {
    return deck.pop();
}

// Function to start the game
function startGame() {
    createDeck();
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
    resetActionDisplays();
    startTime = new Date().getTime();
}

// Function to display the hands
function displayHands() {
    const playerHandDiv = document.getElementById('player-hand');
    const dealerHandDiv = document.getElementById('dealer-hand');
    playerHandDiv.innerHTML = '';
    dealerHandDiv.innerHTML = '';
    for (let card of playerHand) {
        const cardImage = createCardImage(card);
        playerHandDiv.appendChild(cardImage);
    }
    for (let card of dealerHand) {
        const cardImage = createCardImage(card);
        dealerHandDiv.appendChild(cardImage);
    }
}

// Function to create a card image element
function createCardImage(card) {
    let cardImage = document.createElement('img');
    let fileName = `${card.value}_of_${card.suit}.png`;
    cardImage.src = `Card Images/${fileName}`;
    cardImage.alt = `${card.value} of ${card.suit}`;
    cardImage.className = 'card';
    return cardImage;
}

// Function to update points
function updatePoints() {
    // Implementation of points calculation
}

// Function to update the scoreboard
function updateScoreboard() {
    document.getElementById('player-wins').innerText = playerWins;
    document.getElementById('dealer-wins').innerText = dealerWins;
    document.getElementById('dealer-bank').innerText = bank;
    document.getElementById('score').innerText = score;
}

// Function to display the wager
function displayWager() {
    document.getElementById('player-wager').innerText = playerWager;
}

// Function to reset action displays
function resetActionDisplays() {
    document.getElementById('player-action-text').innerText = '';
    document.getElementById('dealer-hint-text').innerText = '';
    document.getElementById('dealer-action-text').innerText = '';
}

// Event listeners
document.getElementById('start-game-button').addEventListener('click', startGame);

document.getElementById('player-action-button').addEventListener('click', () => {
    let action = determinePlayerAction();
    document.getElementById('player-action-text').innerText = action;
    if (action === 'Hit') {
        playerHand.push(drawCard());
        displayHands();
        updatePoints();
        if (calculateHandValue(playerHand) > 21) {
            endGame('Dealer Wins');
        }
    } else {
        document.getElementById('dealer-hit-button').disabled = false;
        document.getElementById('dealer-stay-button').disabled = false;
        document.getElementById('player-action-button').disabled = true;
    }
});

// Function to determine player action based on basic strategy
function determinePlayerAction() {
    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand, true);
    if (playerValue < 17) {
        return 'Hit';
    } else {
        return 'Stay';
    }
}

// Function to calculate hand value
function calculateHandValue(hand, dealer = false) {
    let value = 0;
    let aces = 0;
    for (let card of hand) {
        if (card.value === 'A') {
            aces++;
            value += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    return value;
}

// Function to end the game
function endGame(result) {
    if (result === 'Player Wins') {
        playerWins++;
        bank -= playerWager;
        score += playerWager;
    } else {
        dealerWins++;
        bank += playerWager;
        score -= playerWager;
    }
    updateScoreboard();
    document.getElementById('status').innerText = result;
    document.getElementById('player-action-button').disabled = true;
    document.getElementById('dealer-hit-button').disabled = true;
    document.getElementById('dealer-stay-button').disabled = true;
    document.getElementById('dealer-hint-button').disabled = true;
}

// Event listeners for dealer actions
document.getElementById('dealer-hit-button').addEventListener('click', () => {
    dealerHand.push(drawCard());
    displayHands();
    updatePoints();
    if (calculateHandValue(dealerHand) > 21) {
        endGame('Player Wins');
    }
});

document.getElementById('dealer-stay-button').addEventListener('click', () => {
    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);
    if (dealerValue > playerValue) {
        endGame('Dealer Wins');
    } else {
        endGame('Player Wins');
    }
});

document.getElementById('dealer-hint-button').addEventListener('click', () => {
    let dealerValue = calculateHandValue(dealerHand);
    let hint = dealerValue < 17 ? 'Hit' : 'Stay';
    document.getElementById('dealer-hint-text').innerText = hint;
});
