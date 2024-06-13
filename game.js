document.addEventListener('DOMContentLoaded', () => {
    const playerHandElement = document.getElementById('player-hand');
    const dealerHandElement = document.getElementById('dealer-hand');
    const playerActionElement = document.getElementById('player-action');
    const hintElement = document.getElementById('hint');
    const resultElement = document.getElementById('result');
    const handResultElement = document.getElementById('hand-result');
    const playerWagerElement = document.getElementById('player-wager');
    const startGameButton = document.getElementById('start-game');
    const playerActionButton = document.getElementById('player-action-btn');
    const hitButton = document.getElementById('hit');
    const stayButton = document.getElementById('stay');
    const hintButton = document.getElementById('hint-btn');
    const chipButtons = document.querySelectorAll('#count-chips button');
    const playerInfoElement = document.getElementById('player-info');
    const dealerInfoElement = document.getElementById('dealer-info');
    const bankElement = document.getElementById('bank');
    const payoutAmountElement = document.getElementById('payout-amount');
    const completePayoutButton = document.getElementById('complete-payout');
    const payoutSection = document.getElementById('payout-section');
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
    let playerTurn = true;
    let payoutAmount = 0;
    let payoutInitiated = false;

    const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const cardSuits = ['hearts', 'diamonds', 'clubs', 'spades'];

    function getRandomCard() {
        const value = cardValues[Math.floor(Math.random() * cardValues.length)];
        const suit = cardSuits[Math.floor(Math.random() * cardSuits.length)];
        return { value, suit };
    }

    function displayCard(handElement, card) {
        const img = document.createElement('img');
        img.src = `Card Images/${card.value}_of_${card.suit}.png`;
        img.classList.add('card');
        handElement.appendChild(img);
    }

    function updateScoreboard() {
        document.getElementById('player-wins').textContent = scoreboard.playerWins;
        document.getElementById('dealer-wins').textContent = scoreboard.dealerWins;
        bankElement.textContent = scoreboard.bank;
        document.getElementById('score').textContent = scoreboard.score;
    }

    function resetHands() {
        playerHand = [];
        dealerHand = [];
        playerHandElement.innerHTML = '';
        dealerHandElement.innerHTML = '';
        playerActionElement.innerHTML = 'Player Action:';
        hintElement.innerHTML = 'Hint:';
        resultElement.innerHTML = 'Result:';
        handResultElement.innerHTML = 'Hand Result:';
        playerWagerElement.innerHTML = 'Player\'s Wager: 0';
        playerInfoElement.innerHTML = 'Player Info:';
        dealerInfoElement.innerHTML = 'Dealer Info:';
        payoutSection.style.display = 'none';
        payoutAmount = 0;
        payoutAmountElement.textContent = payoutAmount;
        payoutInitiated = false;
    }

    function dealInitialCards() {
        playerHand.push(getRandomCard());
        playerHand.push(getRandomCard());
        dealerHand.push(getRandomCard());
        dealerHand.push(getRandomCard());

        playerHand.forEach(card => displayCard(playerHandElement, card));
        dealerHand.forEach(card => displayCard(dealerHandElement, card));
    }

    function calculateHandValue(hand) {
        let value = 0;
        let aceCount = 0;
        hand.forEach(card => {
            if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
                value += 10;
            } else if (card.value === 'A') {
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

    function basicStrategy(playerHand, dealerCard) {
        const playerValue = calculateHandValue(playerHand);
        const dealerValue = dealerCard.value === 'A' ? 11 : (dealerCard.value === 'J' || dealerCard.value === 'Q' || dealerCard.value === 'K' ? 10 : parseInt(dealerCard.value));

        if (playerHand.length === 2 && playerHand[0].value === playerHand[1].value) {
            switch (playerHand[0].value) {
                case 'A': return 'split';
                case '8': return 'split';
                case '10': return 'stay';
                case '9': return (dealerValue >= 2 && dealerValue <= 6 || dealerValue === 8 || dealerValue === 9) ? 'split' : 'stay';
                case '7': return (dealerValue >= 2 && dealerValue <= 7) ? 'split' : 'hit';
                case '6': return (dealerValue >= 2 && dealerValue <= 6) ? 'split' : 'hit';
                case '5': return (dealerValue >= 2 && dealerValue <= 9) ? 'double' : 'hit';
                case '4': return (dealerValue >= 5 && dealerValue <= 6) ? 'split' : 'hit';
                case '3': case '2': return (dealerValue >= 2 && dealerValue <= 7) ? 'split' : 'hit';
            }
        }

        if (playerHand.some(card => card.value === 'A')) {
            switch (playerValue) {
                case 20: return 'stay';
                case 19: return 'stay';
                case 18: return (dealerValue >= 2 && dealerValue <= 6) ? 'double' : 'stay';
                case 17: case 16: case 15: case 14: case 13: return (dealerValue >= 3 && dealerValue <= 6) ? 'double' : 'hit';
            }
        }

        switch (playerValue) {
            case 17: case 18: case 19: case 20: return 'stay';
            case 16: case 15: case 14: case 13: return (dealerValue >= 2 && dealerValue <= 6) ? 'stay' : 'hit';
            case 12: return (dealerValue >= 4 && dealerValue <= 6) ? 'stay' : 'hit';
            case 11: return 'double';
            case 10: return (dealerValue >= 2 && dealerValue <= 9) ? 'double' : 'hit';
            case 9: return (dealerValue >= 3 && dealerValue <= 6) ? 'double' : 'hit';
            default: return 'hit';
        }
    }

    startGameButton.addEventListener('click', () => {
        if (gameActive) return;
        gameActive = true;
        resetHands();
        playerWager = randomWager();
        playerWagerElement.innerHTML = `Player's Wager: ${playerWager}`;
        dealInitialCards();
        playerTurn = true;
    });

    playerActionButton.addEventListener('click', () => {
        if (!gameActive || !playerTurn) return;
        const playerValue = calculateHandValue(playerHand);
        const dealerCard = dealerHand[0];
        const action = basicStrategy(playerHand, dealerCard);
        
        if (playerValue >= 21) {
            playerActionElement.innerHTML = 'Player Action: Stay';
            playerInfoElement.innerHTML = 'Player Info: Stay';
            playerTurn = false;
            hitButton.disabled = false;
            stayButton.disabled = false;
            dealerInfoElement.innerHTML = 'Dealer Info: Your Turn';
        } else if (action === 'hit') {
            playerActionElement.innerHTML = 'Player Action: Hit';
            playerHand.push(getRandomCard());
            displayCard(playerHandElement, playerHand[playerHand.length - 1]);
            playerInfoElement.innerHTML = 'Player Info: Hit';
            if (calculateHandValue(playerHand) > 21) {
                playerInfoElement.innerHTML = 'Player Info: Bust';
                resultElement.innerHTML = 'Result: Dealer Wins';
                handResultElement.innerHTML = `Hand Result: Dealer Wins - Player Busts`;
                scoreboard.dealerWins++;
                scoreboard.bank += playerWager;
                updateScoreboard();
                gameActive = false;
                return;
            }
        } else if (action === 'stay') {
            playerActionElement.innerHTML = 'Player Action: Stay';
            playerInfoElement.innerHTML = 'Player Info: Stay';
            playerTurn = false;
            hitButton.disabled = false;
            stayButton.disabled = false;
            dealerInfoElement.innerHTML = 'Dealer Info: Your Turn';
        } else if (action === 'double') {
            playerActionElement.innerHTML = 'Player Action: Double Down';
            playerHand.push(getRandomCard());
            displayCard(playerHandElement, playerHand[playerHand.length - 1]);
            playerInfoElement.innerHTML = 'Player Info: Double Down';
            playerWager *= 2;
            playerWagerElement.innerHTML = `Player's Wager: ${playerWager}`;
            if (calculateHandValue(playerHand) > 21) {
                playerInfoElement.innerHTML = 'Player Info: Bust';
                resultElement.innerHTML = 'Result: Dealer Wins';
                handResultElement.innerHTML = `Hand Result: Dealer Wins - Player Busts`;
                scoreboard.dealerWins++;
                scoreboard.bank += playerWager;
                updateScoreboard();
                gameActive = false;
                return;
            } else {
                playerActionElement.innerHTML = 'Player Action: Stay';
                playerInfoElement.innerHTML = 'Player Info: Stay';
                playerTurn = false;
                hitButton.disabled = false;
                stayButton.disabled = false;
                dealerInfoElement.innerHTML = 'Dealer Info: Your Turn';
            }
        } else if (action === 'split') {
            playerActionElement.innerHTML = 'Player Action: Split';
            playerInfoElement.innerHTML = 'Player Info: Split';
            // Handle the split logic as needed
        }
    });

    hitButton.addEventListener('click', () => {
        if (!gameActive || playerTurn) return;
        dealerHand.push(getRandomCard());
        displayCard(dealerHandElement, dealerHand[dealerHand.length - 1]);
        dealerInfoElement.innerHTML = 'Dealer Info: Hit';
        if (calculateHandValue(dealerHand) > 21) {
            dealerInfoElement.innerHTML = 'Dealer Info: Bust';
            endGame();
        }
    });

    stayButton.addEventListener('click', () => {
        if (!gameActive || playerTurn) return;
        dealerInfoElement.innerHTML = 'Dealer Info: Stay';
        endGame();
    });

    hintButton.addEventListener('click', () => {
        if (!gameActive) return;
        const playerValue = calculateHandValue(playerHand);
        const dealerCard = dealerHand[0];
        const action = basicStrategy(playerHand, dealerCard);
        hintElement.innerHTML = `Hint: You should ${action}`;
    });

    chipButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (gameActive) return;
            payoutAmount += parseInt(button.textContent, 10);
            payoutAmountElement.textContent = payoutAmount;
        });
    });

    completePayoutButton.addEventListener('click', () => {
        if (!gameActive && payoutAmount > 0 && payoutInitiated) {
            scoreboard.bank -= payoutAmount;
            payoutAmount = 0;
            payoutAmountElement.textContent = payoutAmount;
            updateScoreboard();
            payoutSection.style.display = 'none';
        }
    });

    function dealerPlay() {
        dealerInfoElement.innerHTML = 'Dealer Info: Your Turn';
        hitButton.disabled = false;
        stayButton.disabled = false;
    }

    function endGame() {
        gameActive = false;
        hitButton.disabled = true;
        stayButton.disabled = true;

        const playerValue = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue(dealerHand);

        if (playerValue > 21) {
            resultElement.innerHTML = 'Result: Player Busts';
            handResultElement.innerHTML = 'Hand Result: Dealer Wins - Player Busts';
            scoreboard.dealerWins++;
            scoreboard.bank += playerWager;  // Corrected to increase bank for dealer win
        } else if (dealerValue > 21) {
            resultElement.innerHTML = 'Result: Dealer Busts';
            handResultElement.innerHTML = 'Hand Result: Player Wins - Dealer Busts';
            scoreboard.playerWins++;
            scoreboard.bank -= playerWager;  // Corrected to decrease bank for dealer loss
        } else if (playerValue > dealerValue) {
            resultElement.innerHTML = 'Result: Player Wins';
            handResultElement.innerHTML = 'Hand Result: Player Wins';
            scoreboard.playerWins++;
            scoreboard.bank -= playerWager;  // Corrected to decrease bank for player win
        } else if (dealerValue > playerValue) {
            resultElement.innerHTML = 'Result: Dealer Wins';
            handResultElement.innerHTML = 'Hand Result: Dealer Wins';
            scoreboard.dealerWins++;
            scoreboard.bank += playerWager;  // Corrected to increase bank for dealer win
        } else {
            resultElement.innerHTML = 'Result: Push';
            handResultElement.innerHTML = 'Hand Result: Push';
        }

        updateScoreboard();

        if ((playerValue > dealerValue || dealerValue > 21) && !payoutInitiated) {
            payoutSection.style.display = 'block';
            payoutInitiated = true;
        }
    }

    function randomWager() {
        const wagers = [25, 50, 100, 500];
        return wagers[Math.floor(Math.random() * wagers.length)];
    }

    updateScoreboard();
});
