body {
    font-family: Arial, sans-serif;
    background-color: #2e7d32;
    color: white;
    text-align: center;
    margin: 0;
    padding: 20px;
    background-image: url('Game Images/table.jpeg');  /* Correct path to your image */
    background-size: cover;  /* Ensure the image covers the entire background */
    background-position: center;  /* Center the background image */
    background-repeat: no-repeat;
    height: 100vh;  /* Ensure the body takes the full height of the viewport */
    overflow: hidden;  /* Prevent scrollbars */
}

#ticker {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7);  /* Semi-transparent background */
    color: white;
    padding: 10px;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-around;
    z-index: 10;  /* Ensure the ticker is always on top */
}

#scoreboard p {
    margin: 5px 10px;
    display: inline;
    font-size: 18px;
}

#game-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: calc(100vh - 200px);  /* Adjust height considering the ticker and control panel */
    overflow: hidden;  /* Prevent scrollbars */
}

#player-area, #dealer-area {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.hand {
    display: flex;
    justify-content: center;
    padding: 10px;
}

.card {
    width: 80px;  /* Adjust the width to balance visibility */
    height: auto;  /* Maintain aspect ratio */
    margin: 5px;  /* Add some space between cards */
}

.action-display {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid white;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.7);  /* Semi-transparent background for better readability */
    width: 60%;  /* Increase the width of the text broadcast boxes */
}

#controls {
    position: absolute;
    bottom: 10px;  /* Position controls at the bottom */
    width: 100%;  /* Ensure controls take full width */
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

#controls button {
    margin: 5px;
    padding: 10px;
}

#chip-counting {
    position: absolute;
    right: 20px;  /* Position it to the right of the dealer's hand */
    top: 40%;  /* Adjust vertical position */
    transform: translateY(-50%);  /* Center alignment adjustment */
    margin-top: 20px;
    background-color: rgba(0, 0, 0, 0.7);  /* Semi-transparent background */
    padding: 10px;
    border-radius: 5px;
}

#chip-counting button {
    margin: 5px;
    padding: 10px;
}

#status {
    margin-top: 10px;
    font-size: 24px;
    font-weight: bold;
}
