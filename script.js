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

// Roll the dice
document.getElementById('rollDice').addEventListener('click', () => {
  const dice = Math.floor(Math.random() * 6) + 1;
  diceResultElement.textContent = `Rolling...`;
  diceRollSound.play();
  setTimeout(() => {
    diceResultElement.textContent = `You rolled a ${dice}`;
    if (currentPlayer === 1) {
      player1Position = Math.min(player1Position + dice, boardSize - 1);
      if (player1Position === boardSize - 1) unlockAchievement("Player 1 Wins! 🎉");
      currentPlayer = 2;
      turnElement.textContent = "Player 2's Turn";
    } else {
      player2Position = Math.min(player2Position + dice, boardSize - 1);
      if (player2Position === boardSize - 1) unlockAchievement("Player 2 Wins! 🎉");
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
