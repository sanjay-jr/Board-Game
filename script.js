// Game variables
const boardSize = 48; // Double the board size
const cellsPerRow = 8; // Increased cells per row
let player1Position = 0; //position of player 1
let player2Position = 0;//position of player 2
let currentPlayer = 1; //current position
const diceResultElement = document.getElementById('diceResult'); 
const turnElement = document.getElementById('turn');
const boardElement = document.getElementById('board');
const achievementsElement = document.getElementById('achievements');
const winnerModal = document.getElementById("winnerModal");
const closeWinnerModal = document.getElementById("closeWinnerModal");
const winnerMessage = document.getElementById("winnerMessage");

// Audio elements
const backgroundMusic = document.getElementById('backgroundMusic')
const diceRollSound = new Audio('/wp-content/Rainbow/sound1.wav');
const winSound = new Audio('/wp-content/Rainbow/win-sound.wav'); 
// Grade Modal Elements
const gradeModal = document.getElementById("gradeModal");
const gradeButtons = document.querySelectorAll(".grade-button");
const closeGradeModal = document.getElementById("closeGradeModal");

  

let selectedGrade = null; // Global variable for the grade selector  grade was picked
let triviaQuestions = []; // Will be set after player picks a grade


// Achievement system
const achievements = [];
//function for pop message
    function unlockAchievement(message) {
    if (!achievements.includes(message)) {
        achievements.push(message);
        const achievement = document.createElement('div');
        achievement.classList.add('achievement');
        achievement.textContent = ` ${achievements.length}. ${message}`;
        achievementsElement.appendChild(achievement);
        //time set for message
        setTimeout(() => achievement.remove(), 5000);
    }
}

//Renaming the players
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

// Event listener for closing the how to play window closer
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

// Trivia Questions for each grade level
const triviaQuestionsKindergarten = [
       // Adam Apple
       { question: "What color is Adam Apple?", answers: [ "Green", "Yellow","Red", "Blue"], correctAnswer: "Red" },
       { question: "Is green a color of an apple?", answers: ["Yes", "No" ], correctAnswer: "Yes" },
       { question: "Do apples help your muscles grow?", answers: ["No","Yes"], correctAnswer: "Yes" },
       { question: "Do apples grow in the ground?", answers: ["Yes", "No"], correctAnswer: "No" },
       { question: "Where do apples grow?", answers: ["Bush", "Ground", "Rock", "Tree"], correctAnswer: "Tree" },
       { question: "What is the oldest fruit in the world?", answers: ["Banana", "Apple", "Orange", "Lemon"], correctAnswer: "Apple" },
       { question: "Do worms live in apples?", answers: ["No", "Only in cartoons", "Yes"], correctAnswer: "Yes" },
       { question: "Where do apples come from?", answers: ["Water", "Seeds", "Clouds", "Rocks"], correctAnswer: "Seeds" },
       { question: "Do apples help make your teeth strong?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "What is Adam Apple’s middle name?", answers: ["Antioxidants", "Apple", "Crunchy"], correctAnswer: "Antioxidants" },
   
       // Nika-Queen of The Nuts
       { question: "What color is Nika-Queen of The Nuts?", answers: ["Brown", "Red", "Green",  "Yellow"], correctAnswer: "Green" },
       { question: "What nut looks like your brain?", answers: ["Walnut", "Almond", "Peanut", "Pecan"], correctAnswer: "Walnut" },
       { question: "What kind of nut is Nika-Queen of The Nuts?", answers: ["Cashew", "Almond", "Pistachio","Hazelnut"], correctAnswer: "Pistachio" },
       { question: "Where do nuts grow?", answers: [ "Ground", "Water", "Vine","Tree"], correctAnswer: "Tree" },
       { question: "Can nuts make some people itch?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Which nut grows in the ground?", answers: ["Pecan", "Hazelnut", "Peanut", "Almond"], correctAnswer: "Peanut" },
       { question: "Which nut lives in a shell?", answers: ["Cashew", "Almond", "Peanut", "Macadamia"], correctAnswer: "Peanut" },
       { question: "Do you cook nuts before you eat them?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Can you mix nuts together?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "What kind of food is a nut?", answers: [ "Fruit", "Protein", "Vegetable"], correctAnswer: "Protein" },
   
       // Toddy Tomato
       { question: "Are tomatoes a fruit or a vegetable?", answers: [ "Vegetable", "Both", "Fruit"], correctAnswer: "Fruit" },
       { question: "Is Toddy Tomato purple?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Are there orange tomatoes?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Are tomatoes healthier when you cook them?", answers: ["No","Yes"], correctAnswer: "Yes" },
       { question: "Do tomatoes grow in a tree?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Where do tomatoes grow?", answers: ["Tree", "Bush","Vine", "Ground"], correctAnswer: "Vine" },
       { question: "Can you eat green tomatoes?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "What is spaghetti sauce made of?", answers: ["Milk", "Cheese", "Peppers","Tomatoes"], correctAnswer: "Tomatoes" },
       { question: "What color is Toddy Tomato?", answers: ["Red", "Yellow", "Green", "Purple"], correctAnswer: "Red" },
       { question: "Name 3 different colors of tomatoes?", answers: [ "Red, blue, green", "Red, yellow, purple", "Pink, orange, white"], correctAnswer: "Red, yellow, purple" },
   
       // Garman Grape
       { question: "How many colors of grapes are there?", answers: ["1", "5", "3", "2"], correctAnswer: "3" },
       { question: "Is Garman Grape yellow?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "What part of your body are grapes good for?", answers: ["Feet", "Heart", "Eyes", "Ears"], correctAnswer: "Heart" },
       { question: "Garman Grape is what color?", answers: [ "Red", "Green", "Blue" , "Purple"], correctAnswer: "Purple" },
       { question: "Are grapes sweet?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Are raisins also grapes?", answers: ["No", "Yes"], correctAnswer: "Yes" },
       { question: "Do grapes grow in the dirt?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Name a type of food made with grapes?", answers: ["Apple Sauce", "Tomato Soup","Grape Jelly","Carrot Juice"], correctAnswer: "Grape Jelly" },
       { question: "Where do grapes grow?", answers: ["Tree", "Ground","Vine", "River"], correctAnswer: "Vine" },
       { question: "Name the 3 colors of grapes", answers: ["Red, Black, Green", "Red, Yellow, Blue", "Green, Orange, Purple"], correctAnswer: "Red, Black, Green" },
   
       // Mumu Mushroom
       { question: "What color is Mumu Mushroom?", answers: ["White", "Brown", "Red", "Black"], correctAnswer: "Brown" },
       { question: "What shape is a mushroom?", answers: [ "Square", "Triangle","Round", "Star"], correctAnswer: "Round" },
       { question: "Are mushrooms good for your tummy?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "What is another color of a mushroom?", answers: ["Pink", "Blue","White", "Green"], correctAnswer: "White" },
       { question: "Can you cook mushrooms?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Do mushrooms grow on trees?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "What food has mushrooms in it?", answers: ["Ice Cream", "Candy","Spaghetti", "Pancakes"], correctAnswer: "Spaghetti" },
       { question: "Can mushrooms grow in the forest on the ground?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Are mushrooms square?", answers: ["Yes", "No"], correctAnswer: "No" },
       { question: "What vitamin is found in mushrooms?", answers: ["Vitamin D", "Vitamin C", "Vitamin B"], correctAnswer: "Vitamin D" },
   
       // Lazarus The Lime
       { question: "What color is Lazarus The Lime?", answers: ["Yellow", "Green", "Red", "Purple"], correctAnswer: "Green" },
       { question: "Are limes sweet?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Can you put limes in water to drink?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "What food is popular with limes?", answers: ["Pizza", "Ice Cream", "Candy", "Mexican Food"], correctAnswer: "Mexican Food" },
       { question: "Where do limes grow?", answers: [ "Vine", "Bush","Tree", "Ground"], correctAnswer: "Tree" },
       { question: "Can limes make your heart healthy?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Are limes good for your tummy?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Will a lime turn your mouth green?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Do limes taste like ice cream?", answers: ["Yes", "No"], correctAnswer: "No" },
       { question: "What vitamin is found in limes?", answers: ["Vitamin A", "Vitamin C","Vitamin D"], correctAnswer: "Vitamin C" },
   
       // LuLu Lemon
       { question: "LuLu Lemon is what color?", answers: ["Green", "Red", "Purple","Yellow"], correctAnswer: "Yellow" },
       { question: "Do lemons grow in the dirt?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Where do lemons grow?", answers: ["Ground", "Bush", "Tree", "Rock"], correctAnswer: "Tree" },
       { question: "Do lemons grow in the snow?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Will smelling a lemon give you energy?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Name a drink that you can put a lemon in?", answers: [ "Milk", "Juice", "Tea", "Soda"], correctAnswer: "Tea" },
       { question: "Are lemons sweet or sour?", answers: ["Salty", "Sweet", "Both", "Sour"], correctAnswer: "Sour" },
       { question: "Can lemons help you be happy when you are sad?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Can you cook food with a lemon?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "What vitamin is found in lemons?", answers: ["Vitamin B", "Vitamin D", "Vitamin C"], correctAnswer: "Vitamin C" },
       { question: "What color is Nika—Queen of the Nuts?", answers: ["Red", "Green", "Yellow", "Blue"], correctAnswer: "Green" },


    // Add more Kindergarten questions here...
  ];

  const triviaQuestionsGrade1 = [
    
           // Adam Apple
       { question: "What color is Adam Apple?", answers: [ "Green", "Yellow","Red", "Blue"], correctAnswer: "Red" },
       { question: "Is green a color of an apple?", answers: ["Yes", "No" ], correctAnswer: "Yes" },
       { question: "Do apples help your muscles grow?", answers: ["No","Yes"], correctAnswer: "Yes" },
       { question: "Do apples grow in the ground?", answers: ["Yes", "No"], correctAnswer: "No" },
       { question: "Where do apples grow?", answers: ["Bush", "Ground", "Rock", "Tree"], correctAnswer: "Tree" },
       { question: "What is the oldest fruit in the world?", answers: ["Banana", "Apple", "Orange", "Lemon"], correctAnswer: "Apple" },
       { question: "Do worms live in apples?", answers: ["No", "Only in cartoons", "Yes"], correctAnswer: "Yes" },
       { question: "Where do apples come from?", answers: ["Water", "Seeds", "Clouds", "Rocks"], correctAnswer: "Seeds" },
       { question: "Do apples help make your teeth strong?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "What is Adam Apple’s middle name?", answers: ["Apple", "Antioxidants", "Crunchy"], correctAnswer: "Antioxidants" },
   
       // Nika-Queen of The Nuts
       { question: "What color is Nika-Queen of The Nuts?", answers: ["Brown", "Red", "Green",  "Yellow"], correctAnswer: "Green" },
       { question: "What nut looks like your brain?", answers: ["Walnut", "Almond", "Peanut", "Pecan"], correctAnswer: "Walnut" },
       { question: "What kind of nut is Nika-Queen of The Nuts?", answers: ["Cashew", "Almond", "Pistachio","Hazelnut"], correctAnswer: "Pistachio" },
       { question: "Where do nuts grow?", answers: [ "Ground", "Water", "Vine","Tree"], correctAnswer: "Tree" },
       { question: "Can nuts make some people itch?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Which nut grows in the ground?", answers: ["Pecan", "Hazelnut", "Peanut", "Almond"], correctAnswer: "Peanut" },
       { question: "Which nut lives in a shell?", answers: ["Cashew", "Almond", "Peanut", "Macadamia"], correctAnswer: "Peanut" },
       { question: "Do you cook nuts before you eat them?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Can you mix nuts together?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "What kind of food is a nut?", answers: [ "Fruit", "Protein", "Vegetable"], correctAnswer: "Protein" },
   
       // Toddy Tomato
       { question: "Are tomatoes a fruit or a vegetable?", answers: [ "Vegetable", "Both", "Fruit"], correctAnswer: "Fruit" },
       { question: "Is Toddy Tomato purple?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Are there orange tomatoes?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Are tomatoes healthier when you cook them?", answers: ["No","Yes"], correctAnswer: "Yes" },
       { question: "Do tomatoes grow in a tree?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Where do tomatoes grow?", answers: ["Tree", "Bush","Vine", "Ground"], correctAnswer: "Vine" },
       { question: "Can you eat green tomatoes?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "What is spaghetti sauce made of?", answers: ["Milk", "Cheese", "Peppers","Tomatoes"], correctAnswer: "Tomatoes" },
       { question: "What color is Toddy Tomato?", answers: ["Red", "Yellow", "Green", "Purple"], correctAnswer: "Red" },
       { question: "Name 3 different colors of tomatoes?", answers: [ "Red, blue, green", "Red, yellow, purple", "Pink, orange, white"], correctAnswer: "Red, yellow, purple" },
   
       // Garman Grape
       { question: "How many colors of grapes are there?", answers: ["1", "5", "3", "2"], correctAnswer: "3" },
       { question: "Is Garman Grape yellow?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "What part of your body are grapes good for?", answers: ["Feet", "Heart", "Eyes", "Ears"], correctAnswer: "Heart" },
       { question: "Garman Grape is what color?", answers: [ "Red", "Green", "Blue" , "Purple"], correctAnswer: "Purple" },
       { question: "Are grapes sweet?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Are raisins also grapes?", answers: ["No", "Yes"], correctAnswer: "Yes" },
       { question: "Do grapes grow in the dirt?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Name a type of food made with grapes?", answers: ["Apple Sauce", "Tomato Soup","Grape Jelly","Carrot Juice"], correctAnswer: "Grape Jelly" },
       { question: "Where do grapes grow?", answers: ["Tree", "Ground","Vine", "River"], correctAnswer: "Vine" },
       { question: "Name the 3 colors of grapes", answers: ["Red, Black, Green", "Red, Yellow, Blue", "Green, Orange, Purple"], correctAnswer: "Red, Black, Green" },
   
       // Mumu Mushroom
       { question: "What color is Mumu Mushroom?", answers: ["White", "Brown", "Red", "Black"], correctAnswer: "Brown" },
       { question: "What shape is a mushroom?", answers: [ "Square", "Triangle","Round", "Star"], correctAnswer: "Round" },
       { question: "Are mushrooms good for your tummy?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "What is another color of a mushroom?", answers: ["Pink", "Blue","White", "Green"], correctAnswer: "White" },
       { question: "Can you cook mushrooms?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Do mushrooms grow on trees?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "What food has mushrooms in it?", answers: ["Ice Cream", "Candy","Spaghetti", "Pancakes"], correctAnswer: "Spaghetti" },
       { question: "Can mushrooms grow in the forest on the ground?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Are mushrooms square?", answers: ["Yes", "No"], correctAnswer: "No" },
       { question: "What vitamin is found in mushrooms?", answers: ["Vitamin D", "Vitamin C", "Vitamin B"], correctAnswer: "Vitamin D" },
   
       // Lazarus The Lime
       { question: "What color is Lazarus The Lime?", answers: ["Yellow", "Green", "Red", "Purple"], correctAnswer: "Green" },
       { question: "Are limes sweet?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Can you put limes in water to drink?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "What food is popular with limes?", answers: ["Pizza", "Ice Cream", "Candy", "Mexican Food"], correctAnswer: "Mexican Food" },
       { question: "Where do limes grow?", answers: [ "Vine", "Bush","Tree", "Ground"], correctAnswer: "Tree" },
       { question: "Can limes make your heart healthy?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Are limes good for your tummy?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Will a lime turn your mouth green?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Do limes taste like ice cream?", answers: ["Yes", "No"], correctAnswer: "No" },
       { question: "What vitamin is found in limes?", answers: ["Vitamin A", "Vitamin C","Vitamin D"], correctAnswer: "Vitamin C" },
   
       // LuLu Lemon
       { question: "LuLu Lemon is what color?", answers: ["Green", "Red", "Purple","Yellow"], correctAnswer: "Yellow" },
       { question: "Do lemons grow in the dirt?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Where do lemons grow?", answers: ["Ground", "Bush", "Tree", "Rock"], correctAnswer: "Tree" },
       { question: "Do lemons grow in the snow?", answers: ["No", "Yes"], correctAnswer: "No" },
       { question: "Will smelling a lemon give you energy?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Name a drink that you can put a lemon in?", answers: [ "Milk", "Juice", "Tea", "Soda"], correctAnswer: "Tea" },
       { question: "Are lemons sweet or sour?", answers: ["Salty", "Sweet", "Both", "Sour"], correctAnswer: "Sour" },
       { question: "Can lemons help you be happy when you are sad?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "Can you cook food with a lemon?", answers: ["Yes", "No"], correctAnswer: "Yes" },
       { question: "What vitamin is found in lemons?", answers: ["Vitamin B", "Vitamin D", "Vitamin C"], correctAnswer: "Vitamin C" },
       { question: "What color is Nika—Queen of the Nuts?", answers: ["Red", "Green", "Yellow", "Blue"], correctAnswer: "Green" },


        // Extra Questions
       { question: "What is inside an Adam Apple?", answers: ["Juice", "Seeds", "Honey", "Water"], correctAnswer: "Seeds" },
       { question: "Fill in the blank: LuLu ________________?", answers: ["Lettuce", "Lemon", "Lollipop", "Lime"], correctAnswer: "Lemon" },
       { question: "What color is Garman Grape?", answers: [ "Green", "Red", "Orange", "Purple"], correctAnswer: "Purple" },
       { question: "How many Eat Like The Rainbow characters are there?", answers: ["5", "7", "8", "10"], correctAnswer: "8" },
       { question: "What sound does Big-A-Bee make?", answers: ["Woof", "Moo", "Buzzzzzzzzzzzzzzz", "Meow"], correctAnswer: "Buzzzzzzzzzzzzzzz" },
       { question: "What food does Big-A-Bee make?", answers: ["Sugar", "Milk", "Honey", "Jam"], correctAnswer: "Honey" },
       { question: "Are lemons and limes sweet?", answers: ["Yes", "No"], correctAnswer: "No" },
       { question: "Name a drink you make with lemons?", answers: ["Milkshake", "Lemonade", "Soda", "Smoothie"], correctAnswer: "Lemonade" },
       { question: "What is something in the daytime sky the same shape as Mumu Mushroom?", answers: ["Moon", "Balloon", "Sun", "Cloud"], correctAnswer: "Sun" }
   
    // Add more 1st Grade questions here...
  ];
  
  const triviaQuestionsGrade2 = [
   // Adam Apple

   {
    question: "What do apples grow from?",
    answers: ["Leaves", "Roots", "Seeds", "Branches"],
    correctAnswer: "Seeds"
  },
  {
    question: "Do apples grow in the ground?",
    answers: [ "Yes", "Sometimes", "Only in some places",  "No"],
    correctAnswer: "No"
  },
  {
    question: "Spell the word that grows apples?",
    answers: ["Bush", "Vine", "Tree", "Plant"],
    correctAnswer: "Tree"
  },
  {
    question: "Name a food that tastes good with apples?",
    answers: [ "Cheese","Peanut Butter", "Cucumber", "Rice"],
    correctAnswer: "Peanut Butter"
  },
  {
    question: "Name a snack that is made of apples?",
    answers: [ "Apple pie", "Apple chips", "Apple juice", "Applesauce"],
    correctAnswer: "Applesauce"
  },
  {
    question: "Why does an apple help you stay full?",
    answers: [ "Sugar", "Fiber", "Water", "Protein"],
    correctAnswer: "Fiber"
  },
  {
    question: "Which apple has the most antioxidants?",
    answers: ["Green Apple", "Gala Apple", "Red Delicious"],
    correctAnswer: "Red Delicious"
  },
  {
    question: "Are apples healthy?",
    answers: ["No", "Yes"],
    correctAnswer: "Yes"
  },
  {
    question: "Which is the healthiest apple?",
    answers: [ "Candy Apple", "Red Delicious", "Caramel Apple"],
    correctAnswer: "Red Delicious"
  },
  {
      question: "An ___________a day keeps the doctor away",
      answers: [ "Orange", "Banana", "Apple", "Grape"],
      correctAnswer: "Apple"
  },
  {
      question: "What is the oldest fruit on the planet?",
      answers: ["Banana", "Apple", "Peach", "Pineapple"],
      correctAnswer: "Apple"
  },
 // Nika-Queen of The Nuts
  {
    question: "Do nuts help your blood cells stay healthy?",
    answers: ["Yes", "No"],
    correctAnswer: "Yes"
  },
  {
      question: "Can some people itch when they eat nuts?",
      answers: ["No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "What is it called if you itch when eating nuts?",
      answers: [ "A rash", "An infection", "An allergy", "Food poisoning"],
      correctAnswer: "An allergy"
  },
  {
      question: "A handful of nuts a day keeps your___________strong",
      answers: [ "Heart", "Bones", "Muscles", "Brain"],
      correctAnswer: "Brain"
  },
  {
      question: "What kind of nut is Nika-Queen of The Nuts?",
      answers: ["Almond", "Pistachio",  "Cashew", "Walnut"],
      correctAnswer: "Pistachio"
  },
  {
      question: "Do walnuts have a shell?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "Which gives you energy? Nuts or candy?",
      answers: ["Both", "Candy", "Nuts", "Neither"],
      correctAnswer: "Nuts"
    },

  // Toddy Tomato
  {
      question: "Is a tomato a fruit or a vegetable?",
      answers: [ "Vegetable","Fruit", "Both", "Neither"],
      correctAnswer: "Fruit"
  },
  {
      question: "Name a food made with tomatoes?",
      answers: [ "Pickles", "Potato chips", "Ketchup", "Steak"],
      correctAnswer: "Ketchup"
  },
  {
      question: "Do tomatoes grow on a tree?",
      answers: [ "Yes", "Only in tropical areas", "Sometimes", "No",],
      correctAnswer: "No"
  },
  {
      question: "What is a food that has tomato and mushrooms?",
      answers: [ "Pizza", "Spaghetti sauce", "Cake", "Fruit salad"],
      correctAnswer: "Spaghetti sauce"
  },
  {
      question: "How many chambers do tomatoes have?",
      answers: ["2", "4", "6"],
      correctAnswer: "4"
  },
  {
      question: "Do tomatoes have the same number of chambers as the heart?",
      answers: ["No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "Do tomatoes get healthier when heated?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "Spell the last name of Toddy?",
      answers: ["Lemon", "Peach", "Tomato", "Cucumber"],
      correctAnswer: "Tomato"
  },
  {
      question: "Name a food that is good for your heart?",
      answers: [ "Banana", "Spinach", "Apple", "Tomato"],
      correctAnswer: "Tomato"
  },
  {
      question: "Which fruit has a similar number of chambers (4) like a heart inside?",
      answers: ["Apple", "Tomato", "Banana"],
      correctAnswer: "Tomato"
  },

  // Garman Grape
  {
      question: "Spell the color of Garman Grape",
      answers: [ "Green", "Red","Purple", "Yellow"],
      correctAnswer: "Purple"
  },
  {
      question: "Grapes are good for your heart. What other part of your body do grapes help?",
      answers: ["Lungs", "Stomach", "Skin", "Brain"],
      correctAnswer: "Brain"
  },
  {
      question: "Will you be stronger if you eat fruit like Garman Grape?",
      answers: ["No", "Yes",],
      correctAnswer: "Yes"
  },
  {
      question: "Name two fruits that you can put in a salad?",
      answers: ["Grapes and apples", "Bananas and celery", "Spinach and pears"],
      correctAnswer: "Grapes and apples"
  },
  {
      question: "Which fruit hangs like your heart?",
      answers: ["Grapes", "Apples", "Peaches"],
      correctAnswer: "Red Grapes"
  },
  {
      question: "What food is made from grapes?",
      answers: [ "Apple pie", "Jelly", "Carrot cake", "Potato chips"],
      correctAnswer: "Jelly"
  },
  {
      question: "Are grapes good for your heart?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "Do grapes grow in clusters?",
      answers: ["No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "Are grapes good for your brain?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "Name the three colors of grapes?",
      answers: ["Red, black, green", "Red, yellow, green", "Purple, blue, red", "Orange, green, purple"],
      correctAnswer: "Red, black, green"
  },
  {
      question: "Spell the colors of grapes?",
      answers: ["Red, black, green", "Green, yellow, orange", "Purple, green, blue", "Red, green, yellow"],
      correctAnswer: "Red, black, green"
  },
  {
      question: "Are grapes juicy?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "Are red grapes good for your heart?",
      answers: ["No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "Can you put apples and grapes in a salad?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "What is a dried grape called?",
      answers: ["Prune", "Cranberry", "Raisin", "Dried plum"],
      correctAnswer: "Raisin"
  },

  // Mumu Mushroom
  {
      question: "What color is Mumu Mushroom?",
      answers: ["Brown", "White", "Red", "Green"],
      correctAnswer: "Brown"
  },
  {
      question: "Can mushrooms grow in the dark?",
      answers: ["No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "Do mushrooms keep you from getting sick?",
      answers: ["No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "What shape is Mumu Mushroom?",
      answers: [ "Square", "Triangle", "Circle", "Oval"],
      correctAnswer: "Circle"
  },
  {
      question: "Name two places you can get vitamin D?",
      answers: [ "Sun and Milk", "Sun and Mushrooms", "Milk and Cheese", "Mushrooms and Fish"],
      correctAnswer: "Sun and Mushrooms"
  },
  {
      question: "Name a food that is good for your tummy?",
      answers: ["Lemon", "Carrot", "Spinach","Mushroom",],
      correctAnswer: "Mushroom"
  },
  {
      question: "Is a mushroom a fruit or a vegetable?",
      answers: ["Fruit", "Vegetable", "Neither", "Both"],
      correctAnswer: "Vegetable"
  },
  {
      question: "Are mushrooms good or bad for you?",
      answers: [ "Bad", "Neither","Good", "Sometimes"],
      correctAnswer: "Good"
  },
  {
      question: "What helps mushrooms grow?",
      answers: [ "Durt", "Dier", "Dirt", "Dirrt"],
      correctAnswer: "Dirt"
  },
  {
      question: "What vitamin do mushrooms have?",
      answers: ["Vitamin A", "Vitamin D", "Vitamin C"],
      correctAnswer: "Vitamin D"
  },
  {
      question: "Are mushrooms good for your body?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "What medicine came from mushrooms?",
      answers: ["Tylenol", "Penicillin", "Aspirin"],
      correctAnswer: "Penicillin"
  },

  // Lazarus The Lime
  {
      question: "Spell the color of Lazarus The Lime?",
      answers: [ "Yellow", "Red", "Blue", "Green"],
      correctAnswer: "Green"
  },
  {
      question: "How do limes taste? Sweet or sour?",
      answers: ["Sweet", "Salty", "Sour","Bitter"],
      correctAnswer: "Sour"
  },
  {
      question: "Will putting lemon and lime in your water help you stay healthy?",
      answers: ["No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "Are limes new or old fruits?",
      answers: ["New", "Both", "Old", "Neither"],
      correctAnswer: "Old"
  },
  {
      question: "Are limes fruit or a vegetable?",
      answers: ["Fruit", "Vegetable", "Both", "Neither"],
      correctAnswer: "Fruit"
  },
  {
      question: "What kind of fruit are lemons, limes and oranges?",
      answers: ["Berry", "Tropical","Citrus", "Stone"],
      correctAnswer: "Citrus"
  },
  {
      question: "Does putting lemon and lime in your water help you with energy when playing?",
      answers: ["No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "Name a citrus fruit?",
      answers: [ "Apple", "Banana", "Peach", "Lime",],
      correctAnswer: "Lime"
  },
  // LuLu Lemon
  {
      question: "What do you find in the middle of a lemon?",
      answers: ["Pulp", "Juice", "Seeds", "Skin"],
      correctAnswer: "Seeds"
  },
  {
      question: "Do lemons give you energy?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "Do lemons taste sweet?",
      answers: [ "Yes", "No", "Sometimes", "Only if ripe"],
      correctAnswer: "No"
  },
  {
      question: "Are lemons a fruit or vegetable?",
      answers: ["Vegetable", "Fruit", "Both", "Neither"],
      correctAnswer: "Fruit"
  },
  {
      question: "Name a fruit that helps you stay in a good mood?",
      answers: ["Apple","Lemon", "Banana", "Orange"],
      correctAnswer: "Lemon"
  },
  {
      question: "Name a state where LuLu Lemon grows?",
      answers: [ "Alaska", "Texas", "Florida", "New York"],
      correctAnswer: "Florida"
  },
  {
      question: "What spice helps your blood flow?",
      answers: [ "Sugar", "Lemon Pepper", "Cinnamon"],
      correctAnswer: "Lemon Pepper"
  },
  {
      question: "Can lemons help you lose weight or gain weight?",
      answers: [ "Gain", "Lose", "Neither", "Both"],
      correctAnswer: "Lose"
  },
  {
    question: "Which one of these grows in the ground?",
    answers: [ "Apples", "Candy","Seeds"],
    correctAnswer: "Seeds"
  },

  //Big-A-Bee
  {
      question: "How many colors are on Big-A-Bee?",
      answers: ["7", "6", "8", "5"],
      correctAnswer: "7"
  },
  {
      question: "Does honey ever go bad?",
      answers: [ "Yes", "No", "Sometimes", "It depends"],
      correctAnswer: "No"
  },
  {
      question: "Big-A-Bee flies around the garden. Is this important to plants?",
      answers: ["No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "What do bees do?",
      answers: [ "Dance", "Fly", "Buzz", "Pollinate"],
      correctAnswer: "Pollinate"
  },
  {
      question: "What does pollinate mean?",
      answers: ["Fertilizes plants so they grow", "Helps plants smell good", "Makes plants colorful", "Takes care of plants"],
      correctAnswer: "Fertilizes plants so they grow"
  },
  {
      question: "Spell the word that describes honey?",
      answers: ["Sweet", "Bitter", "Sour", "Salty"],
      correctAnswer: "Sweet"
  },

  // Extra Questions
  {
    question: "What are antioxidants?",
    answers: ["They cause disease", "They make food taste good","They help us stay healthy",  "They are a type of sugar"],
    correctAnswer: "They help us stay healthy"
  },
  {
    question: "How many chambers does your heart have?",
    answers: [ "2", "3","4", "5"],
    correctAnswer: "4"
  },
  {
    question: "What does vitamin D do?",
    answers: [ "Make us smarter", "Help us sleep", "Increase energy", "Keep our bones and teeth strong"],
    correctAnswer: "Keep our bones and teeth strong"
  },
  {
    question: "Where do the characters live?",
    answers: ["A treehouse", "In the jungle", "Under the sea","The Rainbow Garden"],
    correctAnswer: "The Rainbow Garden"
  },
  {
    question: "Name the colors of the rainbow in the garden?",
    answers: ["Red, yellow, pink, green, purple, orange, and blue", "Red, blue, yellow, green, white, purple, and orange", "Red, yellow, green, pink, purple, brown, and blue", "Pink, blue, green, purple, orange, yellow, and red"],
    correctAnswer: "Red, yellow, pink, green, purple, orange, and blue"
  },

  {
    question: "What does your brain help you do in school?",
    answers: [ "Sleep", "Learn", "Eat", "Play"],
    correctAnswer: "Learn"
  },
  {
    question: "Does a candy bar help you stay strong?",
    answers: [ "Yes", "No", "Sometimes"],
    correctAnswer: "No"
  },
  {
    question: "What kind of salad is made with apple and grapes?",
    answers: [ "Green Salad", "Fruit Salad", "Vegetable Salad"],
    correctAnswer: "Fruit Salad"
  },
{
    question: "What do kidneys do in your body?",
    answers: ["Keep your blood pressure healthy", "Help you breathe", "Give you energy", "Control your temperature"],
    correctAnswer: "Keep your blood pressure healthy"
},
{
    question: "What does it mean to be healthy?",
    answers: [ "You sleep a lot", "You eat junk food","You don’t get sick", "You exercise every day"],
    correctAnswer: "You don’t get sick"
},
{
    question: "Are fruits and vegetables good for you when you are sick?",
    answers: [ "No", "Yes"],
    correctAnswer: "Yes"
},
{
    question: "Do eating fruits and vegetables everyday keep you from getting sick?",
    answers: ["Yes", "No"],
    correctAnswer: "Yes"
},
{
    question: "Does citrus fruit grow in the snow?",
    answers: [ "Yes", "Only in winter", "No", "Sometimes"],
    correctAnswer: "No"
},
{
    question: "Do all fruits and vegetables need sun to grow?",
    answers: ["Yes", "No"],
    correctAnswer: "Yes"
},
{
    question: "Do you need sun to grow big and strong?",
    answers: ["No", "Yes"],
    correctAnswer: "Yes"
},
{
    question: "Where do pecans grow?",
    answers: ["Bush", "Tree", "Ground", "Vine"],
    correctAnswer: "Tree"
},
{
    question: "What kind of tree grows pecans?",
    answers: ["Oak tree", "Maple tree", "Pine tree", "Pecan tree"],
    correctAnswer: "Pecan tree"
},
{
    question: "What does digestive mean?",
    answers: ["Helps you breathe", "Breaks down our food in our body", "Keeps your heart pumping", "Keeps you awake"],
    correctAnswer: "Breaks down our food in our body"
},
{
    question: "Is a soda as good as water to help you when you are thirsty?",
    answers: ["Yes", "No", "Sometimes"],
    correctAnswer: "No"
},
{
    question: "When you sweat when you play, why do you need to drink water?",
    answers: [ "To cool down", "To feel better", "To lose weight", "To help us stay hydrated"],
    correctAnswer: "To help us stay hydrated"
},
{
    question: "What does it mean to be hydrated?",
    answers: [ "You need more food", "You have enough water in your body", "You have too much water", "Your body is hot"],
    correctAnswer: "You have enough water in your body"
},
{
    question: "Is high fructose corn syrup good for you?",
    answers: [ "Yes", "Sometimes",  "Only in small amounts", "No"],
    correctAnswer: "No"
},
{
    question: "What type of tree grows oranges?",
    answers: ["Banana Tree", "Sitrus Tree", "Citrus tree", "Apple tree"],
    correctAnswer: "Citrus tree"
},
{
    question: "Where do you see a rainbow?",
    answers: ["Sky", "On the ground", "In a field", "On a wall"],
    correctAnswer: "Sky"
},
{
    question: "Spell rainbow?",
    answers: [ "Rainbo", "Raibow", "Rainbow", "Rinbow"],
    correctAnswer: "Rainbow"
},
{
    question: "When does a rainbow appear?",
    answers: ["Before a storm", "During a sunset", "At night", "After a rain",],
    correctAnswer: "After a rain"
},
{
    question: "Can we grow strong without fruits and vegetables?",
    answers: ["Yes", "No", "Sometimes", "Only with exercise"],
    correctAnswer: "No"
},
{
    question: "How many servings of fruits and vegetables should you eat each day to stay healthy?",
    answers: ["12-15", "5-7", "2-4", "8-10"],
    correctAnswer: "12-15"
},
{
    question: "Which one of these is a fruit",
    answers: ["Pizza","Apple", "Burger", "Celery"],
    correctAnswer: "Apple"
},
{
    question: "Do bees fly around in water?",
    answers: [ "Yes", "Sometimes","No",  "Only if it's hot"],
    correctAnswer: "No"
},
{
    question: "Switch one is a fruit?",
    answers: [ "Pizza", "Burger", "Apple", "Pasta"],
    correctAnswer: "Apple"
},
{
    question: "Will eating fruits and vegetables keep me from getting cavities?",
    answers: ["No", "Yes"],
    correctAnswer: "Yes"
},
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
    answers: ["Our body forgets all tastes", "Our body remembers some tastes"],
    correctAnswer: "Our body remembers some tastes"
},
{
    question: "Do frozen foods hold more or less nutrients than fresh foods?",
    answers: ["More", "Less", "Both hold the same"],
    correctAnswer: "Both hold the same"
},
{
    question: "Are Fresh Foods more nutritious than frozen foods?",
    answers: [ "No", "Yes"],
    correctAnswer: "Yes"
},
{
    question: "Is cottage cheese a good source of protein?",
    answers: ["Yes", "No"],
    correctAnswer: "Yes"
},
{
    question: "What nutrients are in cottage cheese?",
    answers: ["Protein", "Calcium", "Amino Acids", "All of the above"],
    correctAnswer: "All of the above"
},
{
    question: "Which food has protein and calcium?",
    answers: ["Candy", "Cottage Cheese", "Soda"],
    correctAnswer: "Cottage Cheese"
},
{
    question: "Are strawberries and raspberries good for your body?",
    answers: [ "No", "Yes"],
    correctAnswer: "Yes"
},
{
    question: "Which of the following can help fight cancer?",
    answers: ["Chocolate Chips","Strawberries and Raspberries", "Marshmallows"],
    correctAnswer: "Strawberries and Raspberries"
},
{
    question: "Are baked potatoes high or low in calories?",
    answers: ["High", "Low"],
    correctAnswer: "Low"
},
{
    question: "Which food is good at absorbing simple sugars?",
    answers: [ "Ice Cream", "Baked Potatoes", "Soda"],
    correctAnswer: "Baked Potatoes"
},
{
    question: "Are baked potatoes healthy?",
    answers: ["Yes", "No"],
    correctAnswer: "Yes"
},
{
    question: "What is important for cancer patients to eat?",
    answers: ["Candy", "Protein", "Soda"],
    correctAnswer: "Protein"
},
{
    question: "Is protein good for people with cancer?",
    answers: ["Yes", "No"],
    correctAnswer: "Yes"
},
{
    question: "What keeps guacamole from turning brown?",
    answers: [ "Oil", "Sugar", "Water"],
    correctAnswer: "Water"
},
{
    question: "What should you put on guacamole to keep it green?",
    answers: ["Water", "Sugar"],
    correctAnswer: "Water"
},
{
    question: "Is plant-based milk healthy for adults?",
    answers: [ "No", "Yes"],
    correctAnswer: "Yes"
},
{
    question: "Which is better for adults?",
    answers: [ "Soda", "Plant-based milk", "Apple juice"],
    correctAnswer: "Plant-based milk"
},
{
    question: "What does 'from concentrate' mean?",
    answers: ["No sugar", "Added sugar"],
    correctAnswer: "Added sugar"
},
{
    question: "Is a drink that is 'from concentrate' better or worse than 'No concentrate'?",
    answers: ["Better", "Worse"],
    correctAnswer: "Worse"
},
{
    question: "What is the most eaten fish in America?",
    answers: ["Tuna", "Salmon", "Cod",],
    correctAnswer: "Salmon"
},
{
    question: "Do people eat a lot of salmon in America?",
    answers: ["Yes", "No"],
    correctAnswer: "Yes"
},
{
    question: "What happens if you cook food too fast?",
    answers: ["It tastes better", "It dries out"],
    correctAnswer: "It dries out"
},
{
    question: "Should you slowly cook food or heat it fast?",
    answers: ["Slowly", "Fast"],
    correctAnswer: "Slowly"
},
{
    question: "What juice helps you sleep?",
    answers: ["Apple Juice", "Dark Cherry Juice", "Orange Juice"],
    correctAnswer: "Dark Cherry Juice"
},
{
    question: "Is dark cherry juice good for sleep?",
    answers: ["Yes", "No"],
    correctAnswer: "Yes"
},
{
    question: "Which vegetable is one of the world’s healthiest foods?",
    answers: [ "French Fries","Sweet Potatoes", "Donuts"],
    correctAnswer: "Sweet Potatoes"
},
{
    question: "What vitamins are in sweet potatoes?",
    answers: ["A", "C", "Potassium", "All of them"],
    correctAnswer: "All of them"
},
{
    question: "What spice helps your tummy feel better?",
    answers: ["Pepper", "Cinnamon", "Salt"],
    correctAnswer: "Cinnamon"
},
{
    question: "Is cinnamon good for digestion?",
    answers: ["Yes", "No"],
    correctAnswer: "Yes"
},
{
    question: "What food helps your immune system?",
    answers: ["Candy", "Squash", "Cake"],
    correctAnswer: "Squash"
},
{
    question: "Does squash help keep you healthy?",
    answers: [ "No", "Yes"],
    correctAnswer: "Yes"
},
{
    question: "What food helps with heart health?",
    answers: ["Black Olives", "Chips", "Ice Cream"],
    correctAnswer: "Black Olives"
},
{
    question: "Are black olives good for your heart?",
    answers: ["Yes", "No"],
    correctAnswer: "Yes"
},

{
    question: "How should lamb be cooked?",
    answers: [ "Well Done", "Medium", "Raw"],
    correctAnswer: "Medium"
},
{
    question: "Is lamb a lean protein?",
    answers: ["Yes", "No"],
    correctAnswer: "Yes"
},
{
    question: "Which fruit is low in calories and gives you energy?",
    answers: ["Watermelon", "Cake", "Cookies"],
    correctAnswer: "Watermelon"
},
{
    question: "Which fruit has vitamin C?",
    answers: ["Ice Cream", "Cantaloupe",  "Chips"],
    correctAnswer: "Cantaloupe"
},
{
    question: "What helps with digestion?",
    answers: [ "Candy", "Soda", "Wild Rice"],
    correctAnswer: "Wild Rice"
},
{
    question: "What fruit helps your eyes and skin?",
    answers: ["Plums", "Donuts", "Cheese"],
    correctAnswer: "Plums"
},
{
    question: "How should you cook grass-fed meat?",
    answers: ["Fast and hot", "Slow and low"],
    correctAnswer: "Slow and low"
},
{
    question: "What spice helps with nausea?",
    answers: [ "Cinnamon", "Ginger", "Salt"],
    correctAnswer: "Ginger"
},
{
    question: "What helps your body digest food better?",
    answers: ["Spicy Food", "Candy", "Cold Food", ],
    correctAnswer: "Heat"
},
{
    question: "What herb protects your cells?",
    answers: ["Dried Basil", "Lettuce", "Parsley"],
    correctAnswer: "Dried Basil"
},
{
    question: "What food helps your heart stay healthy?",
    answers: ["Chocolate","Garlic", "Soda"],
    correctAnswer: "Garlic"
},
{
    question: "What fruit helps your bones grow strong?",
    answers: ["Chips", "Soda", "Bananas"],
    correctAnswer: "Bananas"
},
{
    question: "What’s a good breakfast food?",
    answers: ["Eggs", "Candy", "Cookies"],
    correctAnswer: "Eggs"
},
{
    question: "What fish has Omega-3?",
    answers: [ "Tuna", "Cod", "Salmon", "All of the above"],
    correctAnswer: "All of the above"
},
{
    question: "What vegetable looks like our cells?",
    answers: [ "Tomato", "Carrot", "Onion"],
    correctAnswer: "Onion"
},
{
    question: "How many servings of fish should you eat a week?",
    answers: ["1", "2", "5"],
    correctAnswer: "2"
},
{
    question: "What vegetable helps your bones?",
    answers: ["Celery", "Broccoli", "Pickles"],
    correctAnswer: "Celery"
},
{
    question: "What food helps keep you hydrated?",
    answers: ["Bread", "Chips", "Cucumbers"],
    correctAnswer: "Cucumbers"
},
{
    question: "Why should you eat different colors?",
    answers: ["To get different vitamins", "To make your plate pretty"],
    correctAnswer: "To get different vitamins"
}

];

  const triviaQuestionsGrade2to4 = [

     // Adam Apple

    {
      question: "What do apples grow from?",
      answers: ["Leaves", "Roots", "Seeds", "Branches"],
      correctAnswer: "Seeds"
    },
    {
      question: "Do apples grow in the ground?",
      answers: [ "Yes", "Sometimes", "Only in some places",  "No"],
      correctAnswer: "No"
    },
    {
      question: "Spell the word that grows apples?",
      answers: ["Bush", "Vine", "Tree", "Plant"],
      correctAnswer: "Tree"
    },
    {
      question: "Name a food that tastes good with apples?",
      answers: [ "Cheese","Peanut Butter", "Cucumber", "Rice"],
      correctAnswer: "Peanut Butter"
    },
    {
      question: "Name a snack that is made of apples?",
      answers: [ "Apple pie", "Apple chips", "Apple juice", "Applesauce"],
      correctAnswer: "Applesauce"
    },
    {
      question: "Why does an apple help you stay full?",
      answers: [ "Sugar", "Fiber", "Water", "Protein"],
      correctAnswer: "Fiber"
    },
    {
      question: "Which apple has the most antioxidants?",
      answers: ["Green Apple", "Gala Apple", "Red Delicious"],
      correctAnswer: "Red Delicious"
    },
    {
      question: "Are apples healthy?",
      answers: ["No", "Yes"],
      correctAnswer: "Yes"
    },
    {
      question: "Which is the healthiest apple?",
      answers: [ "Candy Apple", "Red Delicious", "Caramel Apple"],
      correctAnswer: "Red Delicious"
    },
    {
        question: "An ___________a day keeps the doctor away",
        answers: [ "Orange", "Banana", "Apple", "Grape"],
        correctAnswer: "Apple"
    },
    {
        question: "What is the oldest fruit on the planet?",
        answers: ["Banana", "Apple", "Peach", "Pineapple"],
        correctAnswer: "Apple"
    },
   // Nika-Queen of The Nuts
    {
      question: "Do nuts help your blood cells stay healthy?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
    },
    {
        question: "Can some people itch when they eat nuts?",
        answers: ["No", "Yes"],
        correctAnswer: "Yes"
    },
    {
        question: "What is it called if you itch when eating nuts?",
        answers: [ "A rash", "An infection", "An allergy", "Food poisoning"],
        correctAnswer: "An allergy"
    },
    {
        question: "A handful of nuts a day keeps your___________strong",
        answers: [ "Heart", "Bones", "Muscles", "Brain"],
        correctAnswer: "Brain"
    },
    {
        question: "What kind of nut is Nika-Queen of The Nuts?",
        answers: ["Almond", "Pistachio",  "Cashew", "Walnut"],
        correctAnswer: "Pistachio"
    },
    {
        question: "Do walnuts have a shell?",
        answers: ["Yes", "No"],
        correctAnswer: "Yes"
    },
    {
        question: "Which gives you energy? Nuts or candy?",
        answers: ["Both", "Candy", "Nuts", "Neither"],
        correctAnswer: "Nuts"
      },

    // Toddy Tomato
    {
        question: "Is a tomato a fruit or a vegetable?",
        answers: [ "Vegetable","Fruit", "Both", "Neither"],
        correctAnswer: "Fruit"
    },
    {
        question: "Name a food made with tomatoes?",
        answers: [ "Pickles", "Potato chips", "Ketchup", "Steak"],
        correctAnswer: "Ketchup"
    },
    {
        question: "Do tomatoes grow on a tree?",
        answers: [ "Yes", "Only in tropical areas", "Sometimes", "No",],
        correctAnswer: "No"
    },
    {
        question: "What is a food that has tomato and mushrooms?",
        answers: [ "Pizza", "Spaghetti sauce", "Cake", "Fruit salad"],
        correctAnswer: "Spaghetti sauce"
    },
    {
        question: "How many chambers do tomatoes have?",
        answers: ["2", "4", "6"],
        correctAnswer: "4"
    },
    {
        question: "Do tomatoes have the same number of chambers as the heart?",
        answers: ["No", "Yes"],
        correctAnswer: "Yes"
    },
    {
        question: "Do tomatoes get healthier when heated?",
        answers: ["Yes", "No"],
        correctAnswer: "Yes"
    },
    {
        question: "Spell the last name of Toddy?",
        answers: ["Lemon", "Peach", "Tomato", "Cucumber"],
        correctAnswer: "Tomato"
    },
    {
        question: "Name a food that is good for your heart?",
        answers: [ "Banana", "Spinach", "Apple", "Tomato"],
        correctAnswer: "Tomato"
    },
    {
        question: "Which fruit has a similar number of chambers (4) like a heart inside?",
        answers: ["Apple", "Tomato", "Banana"],
        correctAnswer: "Tomato"
    },

    // Garman Grape
    {
        question: "Spell the color of Garman Grape",
        answers: [ "Green", "Red","Purple", "Yellow"],
        correctAnswer: "Purple"
    },
    {
        question: "Grapes are good for your heart. What other part of your body do grapes help?",
        answers: ["Lungs", "Stomach", "Skin", "Brain"],
        correctAnswer: "Brain"
    },
    {
        question: "Will you be stronger if you eat fruit like Garman Grape?",
        answers: ["No", "Yes",],
        correctAnswer: "Yes"
    },
    {
        question: "Name two fruits that you can put in a salad?",
        answers: ["Grapes and apples", "Bananas and celery", "Spinach and pears"],
        correctAnswer: "Grapes and apples"
    },
    {
        question: "Which fruit hangs like your heart?",
        answers: ["Grapes", "Apples", "Peaches"],
        correctAnswer: "Red Grapes"
    },
    {
        question: "What food is made from grapes?",
        answers: [ "Apple pie", "Jelly", "Carrot cake", "Potato chips"],
        correctAnswer: "Jelly"
    },
    {
        question: "Are grapes good for your heart?",
        answers: ["Yes", "No"],
        correctAnswer: "Yes"
    },
    {
        question: "Do grapes grow in clusters?",
        answers: ["No", "Yes"],
        correctAnswer: "Yes"
    },
    {
        question: "Are grapes good for your brain?",
        answers: ["Yes", "No"],
        correctAnswer: "Yes"
    },
    {
        question: "Name the three colors of grapes?",
        answers: ["Red, black, green", "Red, yellow, green", "Purple, blue, red", "Orange, green, purple"],
        correctAnswer: "Red, black, green"
    },
    {
        question: "Spell the colors of grapes?",
        answers: ["Red, black, green", "Green, yellow, orange", "Purple, green, blue", "Red, green, yellow"],
        correctAnswer: "Red, black, green"
    },
    {
        question: "Are grapes juicy?",
        answers: ["Yes", "No"],
        correctAnswer: "Yes"
    },
    {
        question: "Are red grapes good for your heart?",
        answers: ["No", "Yes"],
        correctAnswer: "Yes"
    },
    {
        question: "Can you put apples and grapes in a salad?",
        answers: ["Yes", "No"],
        correctAnswer: "Yes"
    },
    {
        question: "What is a dried grape called?",
        answers: ["Prune", "Cranberry", "Raisin", "Dried plum"],
        correctAnswer: "Raisin"
    },

    // Mumu Mushroom
    {
        question: "What color is Mumu Mushroom?",
        answers: ["Brown", "White", "Red", "Green"],
        correctAnswer: "Brown"
    },
    {
        question: "Can mushrooms grow in the dark?",
        answers: ["No", "Yes"],
        correctAnswer: "Yes"
    },
    {
        question: "Do mushrooms keep you from getting sick?",
        answers: ["No", "Yes"],
        correctAnswer: "Yes"
    },
    {
        question: "What shape is Mumu Mushroom?",
        answers: [ "Square", "Triangle", "Circle", "Oval"],
        correctAnswer: "Circle"
    },
    {
        question: "Name two places you can get vitamin D?",
        answers: [ "Sun and Milk", "Sun and Mushrooms", "Milk and Cheese", "Mushrooms and Fish"],
        correctAnswer: "Sun and Mushrooms"
    },
    {
        question: "Name a food that is good for your tummy?",
        answers: ["Lemon", "Carrot", "Spinach","Mushroom",],
        correctAnswer: "Mushroom"
    },
    {
        question: "Is a mushroom a fruit or a vegetable?",
        answers: ["Fruit", "Vegetable", "Neither", "Both"],
        correctAnswer: "Vegetable"
    },
    {
        question: "Are mushrooms good or bad for you?",
        answers: [ "Bad", "Neither","Good", "Sometimes"],
        correctAnswer: "Good"
    },
    {
        question: "What helps mushrooms grow?",
        answers: [ "Durt", "Dier", "Dirt", "Dirrt"],
        correctAnswer: "Dirt"
    },
    {
        question: "What vitamin do mushrooms have?",
        answers: ["Vitamin A", "Vitamin D", "Vitamin C"],
        correctAnswer: "Vitamin D"
    },
    {
        question: "Are mushrooms good for your body?",
        answers: ["Yes", "No"],
        correctAnswer: "Yes"
    },
    {
        question: "What medicine came from mushrooms?",
        answers: ["Tylenol", "Penicillin", "Aspirin"],
        correctAnswer: "Penicillin"
    },

    // Lazarus The Lime
    {
        question: "Spell the color of Lazarus The Lime?",
        answers: [ "Yellow", "Red", "Blue", "Green"],
        correctAnswer: "Green"
    },
    {
        question: "How do limes taste? Sweet or sour?",
        answers: ["Sweet", "Salty", "Sour","Bitter"],
        correctAnswer: "Sour"
    },
    {
        question: "Will putting lemon and lime in your water help you stay healthy?",
        answers: ["No", "Yes"],
        correctAnswer: "Yes"
    },
    {
        question: "Are limes new or old fruits?",
        answers: ["New", "Both", "Old", "Neither"],
        correctAnswer: "Old"
    },
    {
        question: "Are limes fruit or a vegetable?",
        answers: ["Fruit", "Vegetable", "Both", "Neither"],
        correctAnswer: "Fruit"
    },
    {
        question: "What kind of fruit are lemons, limes and oranges?",
        answers: ["Berry", "Tropical","Citrus", "Stone"],
        correctAnswer: "Citrus"
    },
    {
        question: "Does putting lemon and lime in your water help you with energy when playing?",
        answers: ["No", "Yes"],
        correctAnswer: "Yes"
    },
    {
        question: "Name a citrus fruit?",
        answers: [ "Apple", "Banana", "Peach", "Lime",],
        correctAnswer: "Lime"
    },
    // LuLu Lemon
    {
        question: "What do you find in the middle of a lemon?",
        answers: ["Pulp", "Juice", "Seeds", "Skin"],
        correctAnswer: "Seeds"
    },
    {
        question: "Do lemons give you energy?",
        answers: ["Yes", "No"],
        correctAnswer: "Yes"
    },
    {
        question: "Do lemons taste sweet?",
        answers: [ "Yes", "No", "Sometimes", "Only if ripe"],
        correctAnswer: "No"
    },
    {
        question: "Are lemons a fruit or vegetable?",
        answers: ["Vegetable", "Fruit", "Both", "Neither"],
        correctAnswer: "Fruit"
    },
    {
        question: "Name a fruit that helps you stay in a good mood?",
        answers: ["Apple","Lemon", "Banana", "Orange"],
        correctAnswer: "Lemon"
    },
    {
        question: "Which fruit is good for your kidneys?",
        answers: ["Lemon", "Apple", "Banana", "Orange"],
        correctAnswer: "Lemon"
    },
    {
        question: "Name a state where LuLu Lemon grows?",
        answers: [ "Idaho", "Texas", "Florida", "New York"],
        correctAnswer: "Florida"
    },
    {
        question: "What spice helps your blood flow?",
        answers: [ "Sugar", "Lemon Pepper", "Cinnamon"],
        correctAnswer: "Lemon Pepper"
    },
    {
        question: "Can lemons help you lose weight or gain weight?",
        answers: [ "Gain", "Lose", "Neither", "Both"],
        correctAnswer: "Lose"
    },
    {
      question: "Which one of these grows in the ground?",
      answers: [ "Apples", "Candy","Seeds"],
      correctAnswer: "Seeds"
    },

    //Big-A-Bee
    {
        question: "How many colors are on Big-A-Bee?",
        answers: ["7", "6", "8", "5"],
        correctAnswer: "7"
    },
    {
        question: "Does honey ever go bad?",
        answers: [ "Yes", "No", "Sometimes", "It depends"],
        correctAnswer: "No"
    },
    {
        question: "Big-A-Bee flies around the garden. Is this important to plants?",
        answers: ["No", "Yes"],
        correctAnswer: "Yes"
    },
    {
        question: "What do bees do?",
        answers: [ "Dance", "Fly", "Buzz", "Pollinate"],
        correctAnswer: "Pollinate"
    },
    {
        question: "What does pollinate mean?",
        answers: ["Fertilizes plants so they grow", "Helps plants smell good", "Makes plants colorful", "Takes care of plants"],
        correctAnswer: "Fertilizes plants so they grow"
    },
    {
        question: "Spell the word that describes honey?",
        answers: ["Sweet", "Bitter", "Sour", "Salty"],
        correctAnswer: "Sweet"
    },

    // Extra Questions
    {
      question: "What does vitamin D do?",
      answers: [ "Make us smarter", "Help us sleep", "Increase energy", "Keep our bones and teeth strong"],
      correctAnswer: "Keep our bones and teeth strong"
    },
    {
      question: "Where do the characters live?",
      answers: ["A treehouse", "In the jungle", "Under the sea","The Rainbow Garden"],
      correctAnswer: "The Rainbow Garden"
    },
    {
      question: "Name the colors of the rainbow in the garden?",
      answers: ["Red, yellow, pink, green, purple, orange, and blue", "Red, blue, yellow, green, white, purple, and orange", "Red, yellow, green, pink, purple, brown, and blue", "Pink, blue, green, purple, orange, yellow, and red"],
      correctAnswer: "Red, yellow, pink, green, purple, orange, and blue"
    },
 
    {
      question: "What does your brain help you do in school?",
      answers: [ "Sleep", "Learn", "Eat", "Play"],
      correctAnswer: "Learn"
    },
    {
      question: "Does a candy bar help you stay strong?",
      answers: [ "Yes", "No", "Sometimes"],
      correctAnswer: "No"
    },
    {
      question: "What kind of salad is made with apple and grapes?",
      answers: [ "Green Salad", "Fruit Salad", "Vegetable Salad"],
      correctAnswer: "Fruit Salad"
    },
  {
      question: "What do kidneys do in your body?",
      answers: ["Keep your blood pressure healthy", "Help you breathe", "Give you energy", "Control your temperature"],
      correctAnswer: "Keep your blood pressure healthy"
  },
  {
      question: "What does it mean to be healthy?",
      answers: [ "You sleep a lot", "You eat junk food","You don’t get sick", "You exercise every day"],
      correctAnswer: "You don’t get sick"
  },
  {
      question: "Are fruits and vegetables good for you when you are sick?",
      answers: [ "No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "Do eating fruits and vegetables everyday keep you from getting sick?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "Does citrus fruit grow in the snow?",
      answers: [ "Yes", "Only in winter", "No", "Sometimes"],
      correctAnswer: "No"
  },
  {
      question: "Do all fruits and vegetables need sun to grow?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "Do you need sun to grow big and strong?",
      answers: ["No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "Where do pecans grow?",
      answers: ["Bush", "Tree", "Ground", "Vine"],
      correctAnswer: "Tree"
  },
  {
      question: "What kind of tree grows pecans?",
      answers: ["Oak tree", "Maple tree", "Pine tree", "Pecan tree"],
      correctAnswer: "Pecan tree"
  },
  {
      question: "Fiber is important for our____________",
      answers: ["Digestive system", "Muscles", "Bones", "Skin"],
      correctAnswer: "Digestive system"
  },
  {
      question: "What does digestive mean?",
      answers: ["Helps you breathe", "Breaks down our food in our body", "Keeps your heart pumping", "Keeps you awake"],
      correctAnswer: "Breaks down our food in our body"
  },
  {
      question: "Is a soda as good as water to help you when you are thirsty?",
      answers: ["Yes", "No", "Sometimes"],
      correctAnswer: "No"
  },
  {
      question: "When you sweat when you play, why do you need to drink water?",
      answers: [ "To cool down", "To feel better", "To lose weight", "To help us stay hydrated"],
      correctAnswer: "To help us stay hydrated"
  },
  {
      question: "What does it mean to be hydrated?",
      answers: [ "You need more food", "You have enough water in your body", "You have too much water", "Your body is hot"],
      correctAnswer: "You have enough water in your body"
  },
  {
      question: "What is the sugar called in our bodies?",
      answers: ["Fructose", "Glucose", "Sucrose", "Lactose"],
      correctAnswer: "Glucose"
  },
  {
      question: "Is high fructose corn syrup good for you?",
      answers: [ "Yes", "Sometimes",  "Only in small amounts", "No"],
      correctAnswer: "No"
  },
  {
      question: "What type of tree grows oranges?",
      answers: ["Banana Tree", "Sitrus Tree", "Citrus tree", "Apple tree"],
      correctAnswer: "Citrus tree"
  },
  {
      question: "Where do you see a rainbow?",
      answers: ["Sky", "On the ground", "In a field", "On a wall"],
      correctAnswer: "Sky"
  },
  {
      question: "Spell rainbow?",
      answers: [ "Rainbo", "Raibow", "Rainbow", "Rinbow"],
      correctAnswer: "Rainbow"
  },
  {
      question: "When does a rainbow appear?",
      answers: ["Before a storm", "During a sunset", "At night", "After a rain",],
      correctAnswer: "After a rain"
  },
  {
      question: "Can we grow strong without fruits and vegetables?",
      answers: ["Yes", "No", "Sometimes", "Only with exercise"],
      correctAnswer: "No"
  },
  {
      question: "How many servings of fruits and vegetables should you eat each day to stay healthy?",
      answers: ["12-15", "5-7", "2-4", "8-10"],
      correctAnswer: "12-15"
  },
  {
      question: "Which one of these is a fruit",
      answers: ["Pizza","Apple", "Burger", "Celery"],
      correctAnswer: "Apple"
  },
  {
      question: "Do bees fly around in water?",
      answers: [ "Yes", "Sometimes","No",  "Only if it's hot"],
      correctAnswer: "No"
  },
  {
      question: "Switch one is a fruit?",
      answers: [ "Pizza", "Burger", "Apple", "Pasta"],
      correctAnswer: "Apple"
  },
  {
      question: "Will eating fruits and vegetables keep me from getting cavities?",
      answers: ["No", "Yes"],
      correctAnswer: "Yes"
  },
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
      answers: ["Our body forgets all tastes", "Our body remembers some tastes"],
      correctAnswer: "Our body remembers some tastes"
  },
  {
      question: "Do frozen foods hold more or less nutrients than fresh foods?",
      answers: ["More", "Less", "Both hold the same"],
      correctAnswer: "Both hold the same"
  },
  {
      question: "Are Fresh Foods more nutritious than frozen foods?",
      answers: [ "No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "Is cottage cheese a good source of protein?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "What nutrients are in cottage cheese?",
      answers: ["Protein", "Calcium", "Amino Acids", "All of the above"],
      correctAnswer: "All of the above"
  },
  {
      question: "Which food has protein and calcium?",
      answers: ["Candy", "Cottage Cheese", "Soda"],
      correctAnswer: "Cottage Cheese"
  },
  {
      question: "Are strawberries and raspberries good for your body?",
      answers: [ "No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "Which of the following can help fight cancer?",
      answers: ["Chocolate Chips","Strawberries and Raspberries", "Marshmallows"],
      correctAnswer: "Strawberries and Raspberries"
  },
  {
      question: "What makes strawberries and raspberries healthy?",
      answers: [ "Sugar", "Antioxidants", "Food coloring"],
      correctAnswer: "Antioxidants"
  },
  {
      question: "Are baked potatoes high or low in calories?",
      answers: ["High", "Low"],
      correctAnswer: "Low"
  },
  {
      question: "Which food is good at absorbing simple sugars?",
      answers: [ "Ice Cream", "Baked Potatoes", "Soda"],
      correctAnswer: "Baked Potatoes"
  },
  {
      question: "Are baked potatoes healthy?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "What is important for cancer patients to eat?",
      answers: ["Candy", "Protein", "Soda"],
      correctAnswer: "Protein"
  },
  {
      question: "Is protein good for people with cancer?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "What keeps guacamole from turning brown?",
      answers: [ "Oil", "Sugar", "Water"],
      correctAnswer: "Water"
  },
  {
      question: "What should you put on guacamole to keep it green?",
      answers: ["Water", "Sugar"],
      correctAnswer: "Water"
  },
  {
      question: "Is plant-based milk healthy for adults?",
      answers: [ "No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "Which is better for adults?",
      answers: [ "Soda", "Plant-based milk", "Apple juice"],
      correctAnswer: "Plant-based milk"
  },
  {
      question: "What does 'from concentrate' mean?",
      answers: ["No sugar", "Added sugar"],
      correctAnswer: "Added sugar"
  },
  {
      question: "Is a drink that is 'from concentrate' better or worse than 'No concentrate'?",
      answers: ["Better", "Worse"],
      correctAnswer: "Worse"
  },
  {
      question: "What does chicken have that fights inflammation?",
      answers: ["Glucosamine", "Salt", "Butter"],
      correctAnswer: "Glucosamine"
  },
  {
      question: "Is glucosamine found in chicken?",
      answers: ["No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "What is the most eaten fish in America?",
      answers: ["Tuna", "Salmon", "Cod"],
      correctAnswer: "Salmon"
  },
  {
      question: "Do people eat a lot of salmon in America?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "What happens if you cook food too fast?",
      answers: ["It tastes better", "It dries out"],
      correctAnswer: "It dries out"
  },
  {
      question: "Should you slowly cook food or heat it fast?",
      answers: ["Slowly", "Fast"],
      correctAnswer: "Slowly"
  },
  {
      question: "What juice helps you sleep?",
      answers: ["Apple Juice", "Dark Cherry Juice", "Orange Juice"],
      correctAnswer: "Dark Cherry Juice"
  },
  {
      question: "Is dark cherry juice good for sleep?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "Which vegetable is one of the world’s healthiest foods?",
      answers: [ "French Fries","Sweet Potatoes", "Donuts"],
      correctAnswer: "Sweet Potatoes"
  },
  {
      question: "What vitamins are in sweet potatoes?",
      answers: ["A", "C", "Potassium", "All of them"],
      correctAnswer: "All of them"
  },
  {
      question: "What spice helps your tummy feel better?",
      answers: ["Pepper", "Cinnamon", "Salt"],
      correctAnswer: "Cinnamon"
  },
  {
      question: "Is cinnamon good for digestion?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "What food helps your immune system?",
      answers: ["Candy", "Squash", "Cake"],
      correctAnswer: "Squash"
  },
  {
      question: "Does squash help keep you healthy?",
      answers: [ "No", "Yes"],
      correctAnswer: "Yes"
  },
  {
      question: "What food helps with heart health?",
      answers: ["Black Olives", "Chips", "Ice Cream"],
      correctAnswer: "Black Olives"
  },
  {
      question: "Are black olives good for your heart?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "What gives mustard its yellow color?",
      answers: ["Cheese", "Lemon", "Turmeric"],
      correctAnswer: "Turmeric"
  },
  {
      question: "What part of mustard helps fight disease?",
      answers: [ "Sugar", "Mustard Seeds", "Butter"],
      correctAnswer: "Mustard Seeds"
  },
  {
      question: "Is mustard a super food?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "How should lamb be cooked?",
      answers: [ "Well Done", "Medium", "Raw"],
      correctAnswer: "Medium"
  },
  {
      question: "Is lamb a lean protein?",
      answers: ["Yes", "No"],
      correctAnswer: "Yes"
  },
  {
      question: "How should pork be cooked?",
      answers: [ "Burnt", "Rare", "Medium" ],
      correctAnswer: "Medium"
  },
  {
      question: "What should you avoid when fighting cancer?",
      answers: ["Nitrates", "Apples", "Water"],
      correctAnswer: "Nitrates"
  },
  {
      question: "Which fruit is low in calories and gives you energy?",
      answers: ["Watermelon", "Cake", "Cookies"],
      correctAnswer: "Watermelon"
  },
  {
      question: "Which fruit has vitamin C?",
      answers: ["Ice Cream", "Cantaloupe",  "Chips"],
      correctAnswer: "Cantaloupe"
  },
  {
      question: "What helps with digestion?",
      answers: [ "Candy", "Soda", "Wild Rice"],
      correctAnswer: "Wild Rice"
  },
  {
      question: "What fruit helps your eyes and skin?",
      answers: ["Plums", "Donuts", "Cheese"],
      correctAnswer: "Plums"
  },
  {
      question: "How should you cook grass-fed meat?",
      answers: ["Fast and hot", "Slow and low"],
      correctAnswer: "Slow and low"
  },
  {
      question: "What spice helps with nausea?",
      answers: [ "Cinnamon", "Ginger", "Salt"],
      correctAnswer: "Ginger"
  },
  {
      question: "What helps your body digest food better?",
      answers: ["Spicy Food", "Candy", "Cold Food", ],
      correctAnswer: "Heat"
  },
  {
      question: "What herb protects your cells?",
      answers: ["Dried Basil", "Lettuce", "Parsley"],
      correctAnswer: "Dried Basil"
  },
  {
      question: "What food helps your heart stay healthy?",
      answers: ["Chocolate","Garlic", "Soda"],
      correctAnswer: "Garlic"
  },
  {
      question: "What fruit helps your bones grow strong?",
      answers: ["Chips", "Soda", "Bananas"],
      correctAnswer: "Bananas"
  },
  {
      question: "What’s a good breakfast food?",
      answers: ["Eggs", "Candy", "Cookies"],
      correctAnswer: "Eggs"
  },
  {
      question: "What fish has Omega-3?",
      answers: [ "Tuna", "Cod", "Salmon", "All of the above"],
      correctAnswer: "All of the above"
  },
  {
      question: "What vegetable looks like our cells?",
      answers: [ "Tomato", "Carrot", "Onion"],
      correctAnswer: "Onion"
  },
  {
      question: "How many servings of fish should you eat a week?",
      answers: ["1", "2", "5"],
      correctAnswer: "2"
  },
  {
      question: "What vegetable helps your bones?",
      answers: ["Celery", "Broccoli", "Pickles"],
      correctAnswer: "Celery"
  },
  {
      question: "What food helps keep you hydrated?",
      answers: ["Bread", "Chips", "Cucumbers"],
      correctAnswer: "Cucumbers"
  },
  {
      question: "Why should you eat different colors?",
      answers: ["To get different vitamins", "To make your plate pretty"],
      correctAnswer: "To get different vitamins"
  }
   
    // Add more 3nd–4th Grade questions here...
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
       let destination = Math.max(trap - 2, 0); // Push back 2 tiles or to start
if (trap !== destination && !usedPositions.has(trap) && trap !== orangeTrap && destination !== orangeTrap) {
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

//Player movement
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
      const winSound = new Audio('/wp-content/Rainbow/win-sound.wav');
      winSound.play();
      winnerMessage.textContent = `🎉 ${player1Name} Wins! 🎉`;
      winnerModal.style.display = "block";
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
      const winSound = new Audio('/wp-content/Rainbow/win-sound.wav');
      winSound.play();
      winnerMessage.textContent = `🎉 ${player2Name} Wins! 🎉`;
      winnerModal.style.display = "block";
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



document.getElementById('startGame').addEventListener('click', () => {
    gradeModal.style.display = "block"; // Open the Grade Selection modal first
  });


  gradeButtons.forEach(button => {
    button.addEventListener('click', () => {
      selectedGrade = button.getAttribute('data-grade'); // Save the selected grade
  
      // Set the correct questions array based on grade
      if (selectedGrade === "K") {
        triviaQuestions = triviaQuestionsKindergarten;
      } else if (selectedGrade === "1") {
        triviaQuestions = triviaQuestionsGrade1;
      } else if (selectedGrade === "2") {
        triviaQuestions = triviaQuestionsGrade2;
    }
         else if (["3", "4"].includes(selectedGrade)) {
        triviaQuestions = triviaQuestionsGrade2to4;
      }
  
      gradeModal.style.display = "none"; // Close grade modal
      renameModal.style.display = "block"; // Open rename modal
    });
  });
  
  closeGradeModal.addEventListener("click", () => {
    gradeModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === gradeModal) {
      gradeModal.style.display = "none";
    }
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

closeWinnerModal.addEventListener("click", () => {
    winnerModal.style.display = "none";
  });
  
  window.addEventListener("click", (event) => {
    if (event.target === winnerModal) {
      winnerModal.style.display = "none";
    }
  });


const closeFriends = document.getElementById("closeFriends");
const friendsLabel = document.getElementById("friendsLabel");

closeFriends.addEventListener("click", () => {
    friendsLabel.style.display = "none";
});

window.addEventListener('DOMContentLoaded', () => {
  const closeFriends = document.getElementById("closeFriends");
  const friendsLabel = document.getElementById("friendsLabel");

  closeFriends.addEventListener("click", () => {
      friendsLabel.style.display = "none";
  });
});
