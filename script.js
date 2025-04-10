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
const backgroundMusic = document.getElementById('backgroundMusic')
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



// Close the modal if the user clicks outside of it
window.addEventListener("click", (event) => {
    if (event.target == renameModal) {
        renameModal.style.display = "none";
    }
    if (event.target == howToPlayModal) {
        howToPlayModal.style.display = "none";
    }
});

// Character Selection Modals
const characterModal1 = document.getElementById("characterModal1");
const characterModal2 = document.getElementById("characterModal2");
let player1Character = null;
let player2Character = null;

// Trivia Modal Elements
const triviaModal = document.getElementById("triviaModal");
const triviaQuestion = document.getElementById("triviaQuestion");
const answerButtons = document.querySelectorAll(".answer-button");
const triviaResult = document.getElementById("triviaResult");
let correctAnswer = null; // To store the correct answer

// Score Variables
let player1Score = 0;
let player2Score = 0;

// Function to display scores
function updateScoreDisplay() {
    document.getElementById('player1Score').textContent = `Score: ${player1Score}`;
    document.getElementById('player2Score').textContent = `Score: ${player2Score}`;
}

// Function to update player name displays in scores
function updatePlayerNameDisplay() {
    document.getElementById('player1NameDisplay').textContent = player1Name;
    document.getElementById('player2NameDisplay').textContent = player2Name;
}

// Trivia Questions (Array of Objects)
const triviaQuestions = [
    {
        question: "Can your body remember some taste experiences?",
        answers: ["Yes", "No"],
        correctAnswer: "Yes"
    },
    {
        question: "Do we always forget what food tastes like?",
        answers: ["Yes", "No"],
        correctAnswer: "No"
    },
    {
        question: "Which of these is true?",
        answers: ["Our body remembers some tastes", "Our body forgets all tastes"],
        correctAnswer: "Our body remembers some tastes"
    },
    {
        question: "Do frozen foods hold more or less nutrients than fresh foods?",
        answers: ["More", "Less", "Both hold the same"],
        correctAnswer: "Both hold the same"
    },
    {
        question: "Are Fresh Foods more nutritious than frozen foods?",
        answers: ["Yes", "No"],
        correctAnswer: "No"
    }
];

// Function to populate trivia modal with a random question
function loadTriviaQuestion() {
    const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
    const questionData = triviaQuestions[randomIndex];

    triviaQuestion.textContent = questionData.question;
    correctAnswer = questionData.correctAnswer;

    answerButtons.forEach((button, index) => {
        const answer = questionData.answers[index];
        if (answer) {
            button.textContent = answer;
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
        button.classList.remove('correct', 'incorrect');
    });
}

// Function to handle answer selection
answerButtons.forEach(button => {
    button.addEventListener('click', function() {
        const selectedAnswer = this.textContent;
        const isCorrect = selectedAnswer === correctAnswer;

        // Provide immediate feedback
        if (isCorrect) {
            this.classList.add('correct');
            triviaResult.textContent = "Correct!";
        } else {
            this.classList.add('incorrect');
            triviaResult.textContent = "Incorrect. Try again next turn!";
        }

        // Disable all buttons after an answer is selected
        answerButtons.forEach(btn => btn.disabled = true);

        // Proceed after a delay (e.g., 2 seconds)
        setTimeout(() => {
            answerButtons.forEach(btn => btn.disabled = false); // Re-enable buttons
            triviaModal.style.display = "none";
            triviaResult.textContent = ""; // Clear the result message
            if (isCorrect) {
              if (currentPlayer === 1) {
                  player1Score += 50;
              } else {
                  player2Score += 50;
              }
              updateScoreDisplay();
              movePlayer(diceRoll); // if correct move the player
            }
            answerButtons.forEach(btn => btn.classList.remove('correct', 'incorrect'));
        }, 2000);
    });
});

// Function to show trivia modal
function showTriviaModal() {
    loadTriviaQuestion();
    triviaModal.style.display = "block";
}

// Close the Trivia modal
const triviaCloseBtn = triviaModal.querySelector(".close");
triviaCloseBtn.addEventListener("click", () => {
    triviaModal.style.display = "none";
});

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

// Function to generate random shortcuts and traps
function generateRandomPositions(boardSize, maxShortcutLength = 5) {
    const numberOfShortcuts = 4;
    const numberOfTraps = 4;
    const shortcuts = {};
    const traps = {};
    const usedPositions = new Set();
    let orangeTrap = Math.floor(Math.random() * (boardSize - 1)); // Generate orange trap position
    // Ensure orange trap is in the last three rows by adjusting the range
    const minOrangeTrapPosition = boardSize - (3 * cellsPerRow); // Minimum position for last 3 rows
    orangeTrap = minOrangeTrapPosition + Math.floor(Math.random() * (3 * cellsPerRow));
    // orange trap should not appear in the last tile which is 48
    orangeTrap = Math.min(orangeTrap, boardSize - 2);
    window.orangeTrapPosition = orangeTrap; // Store orange trap position

    while (Object.keys(shortcuts).length < numberOfShortcuts) {
        let start = Math.floor(Math.random() * (boardSize / 2)); // Shortcuts start in first half
        let end = Math.min(start + Math.floor(Math.random() * maxShortcutLength) + 5, boardSize - 1);
        if (start !== end && !usedPositions.has(start) && !usedPositions.has(end) && start !== orangeTrap && end !== orangeTrap) {
            shortcuts[start] = end;
            usedPositions.add(start).add(end);
        }
    }
    while (Object.keys(traps).length < numberOfTraps) {
        let trap = Math.floor(Math.random() * (boardSize - 1));
        let destination = Math.floor(Math.random() * (boardSize / 2));
        if (trap !== destination && !usedPositions.has(trap) && !usedPositions.has(destination) && trap !== orangeTrap && destination !== orangeTrap) {
            traps[trap] = destination;
            usedPositions.add(trap).add(destination);
        }
    }
    return { shortcuts, traps };
}

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

    const isShortcut = window.shortcuts && window.shortcuts[i] !== undefined;
    const isTrap = window.traps && window.traps[i] !== undefined;
    const isOrangeTrap = i === window.orangeTrapPosition;

// Only assign a random color if it's not a special tile
    if (!isShortcut && !isTrap && !isOrangeTrap) {
    const colorIndex = Math.floor(Math.random() * 5) + 1;
    cell.classList.add(`color${colorIndex}`);
    }
    
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
    //yellow tile
    if (window.traps && window.traps[i] !== undefined) {
        cell.classList.add('trap');
    
        const bananaIcon = document.createElement('span');
        bananaIcon.textContent = "🍌";
        bananaIcon.style.fontSize = "1.8em";
        bananaIcon.style.position = "absolute";
        bananaIcon.style.top = "5px";
        bananaIcon.style.left = "5px";
        cell.appendChild(bananaIcon);
    }
    //orange
    if (i === window.orangeTrapPosition) {
        cell.classList.add('orange-trap');
        
        const orangeIcon = document.createElement('span');
        orangeIcon.textContent = "🍊";
        orangeIcon.style.fontSize = "1.8em";
        orangeIcon.style.position = "absolute";
        orangeIcon.style.top = "5px";
        orangeIcon.style.right = "5px";
        cell.appendChild(orangeIcon);
    }
    

    boardElement.lastChild.appendChild(cell);
  }
  updatePlayers(); // Ensure players are displayed after board creation
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
let diceRoll = 0;

document.getElementById("rollDice").addEventListener("click", () => {
  diceResultElement.textContent = `Rolling...`;
  diceResultElement.style.animation = "shakeDice 0.5s ease-in-out"; // Apply dice shake animation
  diceRollSound.play();

  setTimeout(() => {
    diceRoll = weightedDiceRoll();
    diceResultElement.textContent = `You rolled a ${diceRoll}`;
    diceResultElement.style.animation = ""; // Reset animation after it ends
    //movePlayer(dice);  // call move player function only on correct answer on trivia
    showTriviaModal(); // show the trivia question
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
    } else if (player1Position === window.orangeTrapPosition) {
        player1Position = 0; // Send back to start
        unlockAchievement(`${player1Name} landed on an orange trap and goes back to start!`);
    }
    if (player1Position === boardSize - 1) {
      unlockAchievement(`${player1Name} Wins! `);
      const winSound = new Audio('win-sound.wav');
      winSound.play();
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
    } else if (player2Position === window.orangeTrapPosition) {
        player2Position = 0; // Send back to start
        unlockAchievement(`${player2Name} landed on an orange trap and goes back to start!`);
    }
    if (player2Position === boardSize - 1) {
      unlockAchievement(`${player2Name} Wins! `);
      const winSound = new Audio('win-sound.wav');
      winSound.play();
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
  player1Score = 0;
  player2Score = 0;
  updateScoreDisplay();
}


// Initialize game - Modified to show rename first
document.getElementById('startGame').addEventListener('click', () => {
  renameModal.style.display = "block"; // Show rename modal first
});

saveNamesButton.addEventListener("click", () => {
    player1Name = player1NameInput.value || "Player 1";
    player2Name = player2NameInput.value || "Player 2";
    turnElement.textContent = `${player1Name}'s Turn`;
    renameModal.style.display = "none";
    updatePlayerNameDisplay();
    openCharacterModals(); // Move to character selection after names
});



function startGame() {
  createBoard();
  resetGame();
  const { shortcuts: newShortcuts, traps: newTraps } = generateRandomPositions(boardSize);
  window.shortcuts = newShortcuts;
  window.traps = newTraps;
  createBoard();
  backgroundMusic.play();
  updatePlayerNameDisplay(); // Initial update of player names
  document.querySelectorAll('.player-score-side').forEach(el => el.style.display = 'block');
}

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
    if (event.target == triviaModal) {
        triviaModal.style.display = "none";
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
`;
document.head.appendChild(style);
