// Game variables
const boardSize = 48; // Double the board size
const cellsPerRow = 8; // Increased cells per row
let player1Position = 0;
let player2Position = 0;
let currentPlayer = 1;
const diceResultElement = document.getElementById('diceResult');
const turnElement = document.getElementById('turn');
const boardElement = document.getElementById('board');
const achievementsElement = document.getElementById('achievements');

// Audio elements
const backgroundMusic = document.getElementById('backgroundMusic');
const diceRollSound = new Audio('sound1.wav');
const winSound = document.getElementById('winSound');

// Trophy system
const achievements = [];
function unlockAchievement(message) {
  if (!achievements.includes(message)) {
    achievements.push(message);
    const achievement = document.createElement('div');
    achievement.classList.add('achievement');
    achievement.textContent = ` ${achievements.length}. ${message}`;
    achievementsElement.appendChild(achievement);
    setTimeout(() => achievement.remove(), 5000);
  }
}

// Rename Modal Elements
const renameModal = document.getElementById("renameModal");
const player1NameInput = document.getElementById("player1Name");
const player2NameInput = document.getElementById("player2Name");
const saveNamesButton = document.getElementById("saveNames");

let player1Name = "Player 1";
let player2Name = "Player 2";

// How to Play Modal Elements
const howToPlayBtn = document.getElementById("howToPlayBtn");
const howToPlayModal = document.getElementById("howToPlayModal");

// Event listener for opening the "How to Play" modal
howToPlayBtn.addEventListener("click", () => {
    howToPlayModal.style.display = "block";
});

// Event listener for closing the "How to Play" modal
const howToPlayCloseBtn = howToPlayModal.querySelector(".close");
howToPlayCloseBtn.addEventListener("click", () => {
    howToPlayModal.style.display = "none";
});

// Event listener for closing the modal
const renameCloseBtn = renameModal.querySelector(".close");
renameCloseBtn.addEventListener("click", () => {
    renameModal.style.display = "none";
});

// Event listener for saving player names
saveNamesButton.addEventListener("click", () => {
    player1Name = player1NameInput.value || "Player 1";
    player2Name = player2NameInput.value || "Player 2";
    turnElement.textContent = `${player1Name}'s Turn`;
    renameModal.style.display = "none";
});

// Character Selection Modals
const characterModal1 = document.getElementById("characterModal1");
const characterModal2 = document.getElementById("characterModal2");
let player1Character = null;
let player2Character = null;

// Open character selection modals
function openCharacterModals() {
    characterModal1.style.display = "block";
}

// Event listeners for character selection
const characterImages1 = document.querySelectorAll("#characterModal1 .character-selection img");
const characterImages2 = document.querySelectorAll("#characterModal2 .character-selection img");

characterImages1.forEach(img => {
    img.addEventListener("click", () => {
        // Remove 'selected' class from all images
        characterImages1.forEach(i => i.classList.remove("selected"));
        // Add 'selected' class to the clicked image
        img.classList.add("selected");
        player1Character = img.src;
    });
});

characterImages2.forEach(img => {
    img.addEventListener("click", () => {
        // Remove 'selected' class from all images
        characterImages2.forEach(i => i.classList.remove("selected"));
        // Add 'selected' class to the clicked image
        img.classList.add("selected");
        player2Character = img.src;
    });
});

// Event listeners for select character buttons
document.getElementById("selectCharacter1").addEventListener("click", () => {
    if (player1Character) {
        characterModal1.style.display = "none";
        characterModal2.style.display = "block";
    } else {
        alert("Please select a character for Player 1.");
    }
});

document.getElementById("selectCharacter2").addEventListener("click", () => {
    if (player2Character) {
        characterModal2.style.display = "none";
        startGame(); // Start the game after both players have chosen
    } else {
        alert("Please select a character for Player 2.");
    }
});

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
    if (window.shortcuts && window.shortcuts[i] !== undefined) {
        cell.classList.add('shortcut');
        // Create a span to show where the shortcut leads to
        const shortcutIndicator = document.createElement('span');
        shortcutIndicator.classList.add('shortcut-indicator');
        shortcutIndicator.textContent = `\u2192 ${window.shortcuts[i] + 1}`; // Arrow and destination cell number
        cell.appendChild(shortcutIndicator);
    }
    if (window.traps && window.traps[i] !== undefined) cell.classList.add('trap');
    boardElement.lastChild.appendChild(cell);
  }
  updatePlayers(); // Ensure players are displayed after board creation
}

// Function to generate random shortcuts and traps
function generateRandomPositions(boardSize, maxShortcutLength = 10) {
    const numberOfShortcuts = 4;
    const numberOfTraps = 4;
    const shortcuts = {};
    const traps = {};
    const usedPositions = new Set();

    while (Object.keys(shortcuts).length < numberOfShortcuts) {
        let start = Math.floor(Math.random() * (boardSize / 2)); // Shortcuts start in first half
        let end = Math.min(start + Math.floor(Math.random() * maxShortcutLength) + 5, boardSize - 1);
        if (start !== end && !usedPositions.has(start) && !usedPositions.has(end)) {
            shortcuts[start] = end;
            usedPositions.add(start).add(end);
        }
    }
    while (Object.keys(traps).length < numberOfTraps) {
        let trap = Math.floor(Math.random() * (boardSize - 1));
        let destination = Math.floor(Math.random() * (boardSize / 2));
        if (trap !== destination && !usedPositions.has(trap) && !usedPositions.has(destination)) {
            traps[trap] = destination;
            usedPositions.add(trap).add(destination);
        }
    }
    return { shortcuts, traps };
}

function resetAnswer() {
  let selectedAnswer = null;
  document
    .querySelectorAll(".selected-answer")
    .forEach((el) => el.classList.remove("selected-answer"));
}

// Update player positions
function updatePlayers() {
    document.querySelectorAll(".player").forEach((player) => player.remove());

    const player1Cell = document.getElementById(`cell-${player1Position}`);
    if (player1Cell) {
        const player1 = document.createElement("div");
        player1.classList.add("player");
        // Use character image if selected, otherwise use default text
        player1.innerHTML = player1Character ? `<img src="${player1Character}" alt="Player 1">` : "1";
        player1Cell.appendChild(player1);
    }

    const player2Cell = document.getElementById(`cell-${player2Position}`);
    if (player2Cell) {
        const player2 = document.createElement("div");
        player2.classList.add("player", "player2");
        // Use character image if selected, otherwise use default text
        player2.innerHTML = player2Character ? `<img src="${player2Character}" alt="Player 2">` : "2";
        player2Cell.appendChild(player2);
    }
}

// Roll the dice with animation
document.getElementById("rollDice").addEventListener("click", () => {
  diceResultElement.textContent = `Rolling...`;
  diceResultElement.style.animation = "shakeDice 0.5s ease-in-out"; // Apply dice shake animation
  diceRollSound.play();

  setTimeout(() => {
    const dice = weightedDiceRoll();
    diceResultElement.textContent = `You rolled a ${dice}`;
    diceResultElement.style.animation = ""; // Reset animation after it ends
    movePlayer(dice);
  }, 1000);
});

function weightedDiceRoll() {
    const randomNumber = Math.random();

    // Define weights (these should add up to 1)
    const weights = {
        1: 0.12,
        2: 0.15,
        3: 0.19,
        4: 0.19,
        5: 0.15,
        6: 0.20
    };

    let cumulativeWeight = 0;
    for (let i = 1; i <= 6; i++) {
        cumulativeWeight += weights[i];
        if (randomNumber < cumulativeWeight) {
            return i;
        }
    }

    // In case of any floating-point precision issues, return a default value
    return 1;
}

function movePlayer(dice) {
  let newPosition;
  if (currentPlayer === 1) {
    newPosition = player1Position + dice;
    player1Position = Math.min(newPosition, boardSize - 1);
    if (window.shortcuts && window.shortcuts[player1Position] !== undefined) {
      player1Position = window.shortcuts[player1Position];
      unlockAchievement(`${player1Name} found a shortcut!`);
    } else if (window.traps && window.traps[player1Position] !== undefined) {
      player1Position = window.traps[player1Position];
      unlockAchievement(`${player1Name} stepped on a trap!`);
    }
    if (player1Position === boardSize - 1) {
      unlockAchievement(`${player1Name} Wins! `);
      winSound.play(); // Play win sound for Player 1
      endGame();
    } else {
      currentPlayer = 2;
      turnElement.textContent = `${player2Name}'s Turn`;
    }
  } else {
    newPosition = player2Position + dice;
    player2Position = Math.min(newPosition, boardSize - 1);
    if (window.shortcuts && window.shortcuts[player2Position] !== undefined) {
      player2Position = window.shortcuts[player2Position];
      unlockAchievement(`${player2Name} found a shortcut!`);
    } else if (window.traps && window.traps[player2Position] !== undefined) {
      player2Position = window.traps[player2Position];
      unlockAchievement(`${player2Name} stepped on a trap!`);
    }
    if (player2Position === boardSize - 1) {
      unlockAchievement(`${player2Name} Wins! `);
      winSound.play(); // Play win sound for Player 2
      endGame();
    } else {
      currentPlayer = 1;
      turnElement.textContent = `${player1Name}'s Turn`;
    }
  }
  updatePlayers();
}

// End game state (disable dice roll)
function endGame() {
    document.getElementById('rollDice').disabled = true;
    document.getElementById('rollDice').style.opacity = 0.5;
}

// Reset game
document.getElementById('resetGame').addEventListener('click', resetGame);
function resetGame() {
  player1Position = 0;
  player2Position = 0;
  currentPlayer = 1;
  achievements.length = 0;
  achievementsElement.innerHTML = "";
  updatePlayers();
  turnElement.textContent = `${player1Name}'s Turn`;
  diceResultElement.textContent = '';
  document.getElementById('rollDice').disabled = false; // Enable dice roll
  document.getElementById('rollDice').style.opacity = 1;
}

// Initialize game - Modified to include Character Selection
document.getElementById('startGame').addEventListener('click', () => {
    renameModal.style.display = "none";
    openCharacterModals();
});

function startGame() {
    createBoard();
    resetGame();
    const { shortcuts: newShortcuts, traps: newTraps } = generateRandomPositions(boardSize);
    window.shortcuts = newShortcuts;
    window.traps = newTraps;
    createBoard();
    backgroundMusic.play();
}

// Initial display of the rename modal
renameModal.style.display = "block";

// Close the modal if the user clicks outside of it
window.addEventListener("click", (event) => {
    if (event.target == renameModal) {
        renameModal.style.display = "none";
    }
    if (event.target == howToPlayModal) {
        howToPlayModal.style.display = "none";
    }
    if (event.target == characterModal1) {
        characterModal1.style.display = "none";
    }
    if (event.target == characterModal2) {
        characterModal2.style.display = "none";
    }
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
.player img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
}
`;
document.head.appendChild(style);
