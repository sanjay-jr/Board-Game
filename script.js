// Game variables
const boardSize = 20; // Number of cells in the linear path
const cellsPerRow = 5; // Number of cells per row
let player1Position = 0;
let player2Position = 0;
let currentPlayer = 1;
const diceResultElement = document.getElementById('diceResult');
const turnElement = document.getElementById('turn');
const boardElement = document.getElementById('board');

// Audio elements
const backgroundMusic = document.getElementById('backgroundMusic');
const diceRollSound = document.getElementById('diceRollSound');
const winSound = document.getElementById('winSound');

// Play background music
backgroundMusic.play();

// Create the board with a snaking path
function createBoard() {
  let rowCount = 0;
  for (let i = 0; i < boardSize; i++) {
    if (i % cellsPerRow === 0) {
      // Create a new row every `cellsPerRow` cells
      const row = document.createElement('div');
      row.classList.add('row');
      if (rowCount % 2 === 1) {
        row.classList.add('reverse'); // Alternate direction for snaking effect
      }
      boardElement.appendChild(row);
      rowCount++;
    }

    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.id = `cell-${i}`;
    cell.textContent = i + 1; // Display cell number
    boardElement.lastChild.appendChild(cell);
  }
}

// Update player positions on the board
function updatePlayers() {
  // Clear previous positions
  document.querySelectorAll('.player').forEach(player => player.remove());

  // Add Player 1
  const player1Cell = document.getElementById(`cell-${player1Position}`);
  const player1 = document.createElement('div');
  player1.classList.add('player');
  player1.textContent = '1'; // Player 1 indicator
  player1Cell.appendChild(player1);

  // Add Player 2
  const player2Cell = document.getElementById(`cell-${player2Position}`);
  const player2 = document.createElement('div');
  player2.classList.add('player', 'player2');
  player2.textContent = '2'; // Player 2 indicator
  player2Cell.appendChild(player2);
}

// Roll the dice
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// Handle dice roll button click
document.getElementById('rollDice').addEventListener('click', () => {
  const dice = rollDice();
  diceResultElement.textContent = `Rolling...`;

  // Play dice roll sound
  diceRollSound.play();

  setTimeout(() => {
    diceResultElement.textContent = `You rolled a ${dice}`;

    if (currentPlayer === 1) {
      player1Position += dice;
      if (player1Position >= boardSize) player1Position = boardSize - 1;
      currentPlayer = 2;
      turnElement.textContent = "Player 2's Turn";
    } else {
      player2Position += dice;
      if (player2Position >= boardSize) player2Position = boardSize - 1;
      currentPlayer = 1;
      turnElement.textContent = "Player 1's Turn";
    }

    updatePlayers();
    checkWin();
  }, 1000); // Simulate a rolling delay
});

// Check if a player has won
function checkWin() {
  if (player1Position >= boardSize - 1) {
    winSound.play(); // Play win sound
    alert('Player 1 wins!');
    resetGame();
  } else if (player2Position >= boardSize - 1) {
    winSound.play(); // Play win sound
    alert('Player 2 wins!');
    resetGame();
  }
}

// Reset the game
function resetGame() {
  player1Position = 0;
  player2Position = 0;
  currentPlayer = 1;
  updatePlayers();
  turnElement.textContent = "Player 1's Turn";
  diceResultElement.textContent = '';
}

// Initialize the game
createBoard();
updatePlayers();
turnElement.textContent = "Player 1's Turn";