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

function createCardImage(card) {
    let cardImage = document.createElement('img');
    let fileName = `${card.value.toUpperCase()}_of_${card.suit.toLowerCase()}`;
    cardImage.src = `Card Images/${fileName}.png`;
    cardImage.alt = `${card.value} of ${card.suit}`;
    cardImage.className = 'card';
    return cardImage;
}
