document.addEventListener('DOMContentLoaded', () => {
    const playerHandElement = document.getElementById('player-hand');
    const dealerHandElement = document.getElementById('dealer-hand');
    const playerActionElement = document.getElementById('player-action');
    const hintElement = document.getElementById('hint');
    const resultElement = document.getElementById('result');
    const playerWagerElement = document.getElementById('player-wager');
    const startGameButton = document.getElementById('start-game');
    const playerActionButton = document.getElementById('player-action-button');
    const hitButton = document.getElementById('hit');
    const stayButton = document.getElementById('stay');
    const hintButton = document.getElementById('hint-button');
    const chipButtons = document.querySelectorAll('.chip');
    const scoreboard = {
        playerWins: 0,
        dealerWins: 0,
        bank: 10000,
        score: 0
    };

    let playerHand = [];
    let dealerHand = [];
    let playerWager = 0;
    let gameActive = false;

    function displayCard(handElement, card) {
        const img = document.createElement('img');
        img.src = `Game Images/${card.value}_of_${card.suit}.png`;
        img.classList.add('card');
        handElement.appendChild(img);
    }

    function updateScoreboard() {
        document.querySelector('#scoreboard span:nth-child(1)').textContent = `Player Wins: ${scoreboard.playerWins}`;
        document.querySelector('#scoreboard span:nth-child(2)').textContent = `Dealer Wins: ${scoreboard.dealerWins}`;
        document.querySelector('#scoreboard span:nth-child(3)').textContent = `Bank: ${scoreboard.bank}`;
        document.querySelector('#scoreboard span:nth-child(4)').textContent = `Score: ${scoreboard.score}`;
    }

    function resetHands() {
        playerHand = [];
        dealerHand = [];
        playerHandElement.innerHTML = '<h2>Player\'s Hand</h2>';
        dealerHandElement.innerHTML = '<h2>Dealer\'s Hand</h2>';
        playerActionElement.innerHTML = 'Player Action:';
        hintElement.innerHTML = 'Hint:';
        resultElement.innerHTML = 'Result:';
        playerWagerElement.innerHTML = 'Player\'s Wager: 0';
    }

    function dealInitialCards() {
        playerHand.push({ value: '2', suit: 'hearts' });
        playerHand.push({ value: '7', suit: 'clubs' });
        dealerHand.push({ value: '9', suit: 'clubs' });
        dealerHand.push({ value: 'queen', suit: 'clubs' });

        playerHand.forEach(card => displayCard(playerHandElement, card));
        dealerHand.forEach(card => displayCard(dealerHandElement, card));
    }

    startGameButton.addEventListener('click', () => {
        if (gameActive) return;
        gameActive = true;
        resetHands();
        dealInitialCards();
    });

    playerActionButton.addEventListener('click', () => {
        // Implement player action logic here
    });

    hitButton.addEventListener('click', () => {
        if (!gameActive) return;
        // Implement hit logic here
    });

    stayButton.addEventListener('click', () => {
        if (!gameActive) return;
        // Implement stay logic here
    });

    hintButton.addEventListener('click', () => {
        if (!gameActive) return;
        // Implement hint logic here
    });

    chipButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!gameActive) return;
            playerWager = parseInt(button.value, 10);
            playerWagerElement.innerHTML = `Player's Wager: ${playerWager}`;
        });
    });

    function calculateHandValue(hand) {
        let value = 0;
        let aceCount = 0;
        hand.forEach(card => {
            if (card.value === 'jack' || card.value === 'queen' || card.value === 'king') {
                value += 10;
            } else if (card.value === 'ace') {
                aceCount++;
                value += 11;
            } else {
                value += parseInt(card.value, 10);
            }
        });
        while (value > 21 && aceCount > 0) {
            value -= 10;
            aceCount--;
        }
        return value;
    }

    function checkForBust(hand) {
        return calculateHandValue(hand) > 21;
    }

    function endGame() {
        gameActive = false;
        const playerValue = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue(dealerHand);
        if (playerValue > 21) {
            resultElement.innerHTML = 'Result: Player Busts';
            scoreboard.dealerWins++;
            scoreboard.bank -= playerWager;
        } else if (dealerValue > 21) {
            resultElement.innerHTML = 'Result: Dealer Busts';
            scoreboard.playerWins++;
            scoreboard.bank += playerWager;
        } else if (playerValue > dealerValue) {
            resultElement.innerHTML = 'Result: Player Wins';
            scoreboard.playerWins++;
            scoreboard.bank += playerWager;
        } else if (dealerValue > playerValue) {
            resultElement.innerHTML = 'Result: Dealer Wins';
            scoreboard.dealerWins++;
            scoreboard.bank -= playerWager;
        } else {
            resultElement.innerHTML = 'Result: Push';
        }
        updateScoreboard();
    }

    // Example implementation of player action and hint logic
    playerActionButton.addEventListener('click', () => {
        const playerValue = calculateHandValue(playerHand);
        const dealerCard = dealerHand[0];
        if (playerValue < 17) {
            playerActionElement.innerHTML = 'Player Action: Hit';
        } else {
            playerActionElement.innerHTML = 'Player Action: Stay';
        }
    });

    hintButton.addEventListener('click', () => {
        const playerValue = calculateHandValue(playerHand);
        const dealerCard = dealerHand[0];
        if (playerValue < 17) {
            hintElement.innerHTML = 'Hint: It is advisable to hit.';
        } else {
            hintElement.innerHTML = 'Hint: It is advisable to stay.';
        }
    });

    updateScoreboard();
});
