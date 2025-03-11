// Game variables
const boardSize = 20;
const cellsPerRow = 5;
let player1Position = 0;
let player2Position = 0;
let currentPlayer = 1;
const diceResultElement = document.getElementById('diceResult');
const turnElement = document.getElementById('turn');
const boardElement = document.getElementById('board');
const achievementsElement = document.getElementById('achievements');

// Audio elements
const backgroundMusic = document.getElementById('backgroundMusic');
const diceRollSound = document.getElementById('diceRollSound');
const winSound = document.getElementById('winSound');

// Trophy system
const achievements = [];
function unlockAchievement(message) {
  if (!achievements.includes(message)) {
    achievements.push(message);
    const achievement = document.createElement('div');
    achievement.classList.add('achievement');
    achievement.textContent = `🏆 ${achievements.length}. ${message}`;
    achievementsElement.appendChild(achievement);
    setTimeout(() => achievement.remove(), 5000);
  }
}

// Play background music
backgroundMusic.play();

// Create the board
function createBoard() {
  boardElement.innerHTML = ""; // Prevent board duplication
  let rowCount = 0;
  for (let i = 0; i < boardSize; i++) {
    if (i % cellsPerRow === 0) {
      const row = document.createElement('div');
      row.classList.add('row');
      if (rowCount % 2 === 1) {
        row.classList.add('reverse');
      }
      boardElement.appendChild(row);
      rowCount++;
    }
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.id = `cell-${i}`;
    cell.textContent = i + 1;
    boardElement.lastChild.appendChild(cell);
  }
}

// Update player positions
function updatePlayers() {
  document.querySelectorAll('.player').forEach(player => player.remove());
  const player1Cell = document.getElementById(`cell-${player1Position}`);
  const player1 = document.createElement('div');
  player1.classList.add('player');
  player1.textContent = '1';
  player1Cell.appendChild(player1);

  const player2Cell = document.getElementById(`cell-${player2Position}`);
  const player2 = document.createElement('div');
  player2.classList.add('player', 'player2');
  player2.textContent = '2';
  player2Cell.appendChild(player2);
}

// Roll the dice with animation
document.getElementById('rollDice').addEventListener('click', () => {
  diceResultElement.textContent = `Rolling...`;
  diceResultElement.style.animation = 'shakeDice 0.5s ease-in-out'; // Apply dice shake animation
  diceRollSound.play();

  setTimeout(() => {
    const dice = Math.floor(Math.random() * 6) + 1;
    diceResultElement.textContent = `You rolled a ${dice}`;
    diceResultElement.style.animation = ''; // Reset animation after it ends
    if (currentPlayer === 1) {
      player1Position = Math.min(player1Position + dice, boardSize - 1);
      if (player1Position === boardSize - 1) {
        unlockAchievement("Player 1 Wins! 🎉");
        winSound.play(); // Play win sound for Player 1
      }
      currentPlayer = 2;
      turnElement.textContent = "Player 2's Turn";
    } else {
      player2Position = Math.min(player2Position + dice, boardSize - 1);
      if (player2Position === boardSize - 1) {
        unlockAchievement("Player 2 Wins! 🎉");
        winSound.play(); // Play win sound for Player 2
      }
      currentPlayer = 1;
      turnElement.textContent = "Player 1's Turn";
    }
    updatePlayers();
  }, 1000);
});

// Reset game
document.getElementById('resetGame').addEventListener('click', resetGame);
function resetGame() {
  player1Position = 0;
  player2Position = 0;
  currentPlayer = 1;
  achievements.length = 0;
  achievementsElement.innerHTML = "";
  updatePlayers();
  turnElement.textContent = "Player 1's Turn";
  diceResultElement.textContent = '';
}

// Initialize game
document.getElementById('startGame').addEventListener('click', () => {
  createBoard();
  resetGame();
  backgroundMusic.play();
});

// CSS for dice shake animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes shakeDice {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(30deg); }
    50% { transform: rotate(0deg); }
    75% { transform: rotate(-30deg); }
    100% { transform: rotate(0deg); }
}
`;
document.head.appendChild(style);
