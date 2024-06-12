function endGame(result) {
    if (result === 'Player Wins') {
        playerWins++;
        bank -= playerWager;
        score += playerWager;
    } else if (result === 'Dealer Wins') {
        dealerWins++;
        bank += playerWager;
        score -= playerWager;
    } else if (result === 'Push') {
        // No change in bank or score
    }
    updateScoreboard();
    document.getElementById('status').innerText = result;
    document.getElementById('player-action-button').disabled = true;
    document.getElementById('dealer-hit-button').disabled = true;
    document.getElementById('dealer-stay-button').disabled = true;
    document.getElementById('dealer-hint-button').disabled = true;
}

document.getElementById('dealer-stay-button').addEventListener('click', () => {
    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);
    if (dealerValue > playerValue) {
        endGame('Dealer Wins');
    } else if (dealerValue < playerValue) {
        endGame('Player Wins');
    } else {
        endGame('Push');
    }
});
