// Selecting HTML elements for displaying target color and score, and buttons for game mode selection
const displayColor = document.querySelector("#displayColor");
const displayScore = document.querySelector("#displayScore");
const actionButtons = document.querySelectorAll("button[data-mode]");
const boxes = document.querySelectorAll(".box");

// Configuration object storing game state and settings
const config = {
  answer: -1, // Index of the correct color
  count: 0, // Number of colored boxes to display
  score: 0, // Player's current score
  mode: "", // Current game mode
  countMap: {
    // Map of box counts for each difficulty level
    easy: 3,
    medium: 6,
    hard: 9,
    extreme: 9,
  },
  scoreMap: {
    // Map of score values for each difficulty level
    easy: 10,
    medium: 20,
    hard: 50,
    extreme: 200,
  },
};

// Adding click event listeners to each box
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    // Check if a game mode is selected
    if (config.answer === -1 || config.count === 0) {
      displayAlert("First pick mode", "warning");
      return;
    }

    // Check if the clicked box is valid based on the current count
    if (config.count <= index) {
      displayAlert("Pick colored box", "warning");
      return;
    }

    // Check if the box has already been clicked
    const alreadyClicked = box.getAttribute("data-clicked");
    if (alreadyClicked) {
      displayAlert("You already clicked here, try other", "info");
      return;
    }

    // Call different game mode logic based on the current mode
    if (config.mode === "extreme") {
      extremeGameMode(box, index);
      return;
    }

    standartGameMode(box, index);
  });
});

// Adding click event listeners to each game mode button
actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.getAttribute("data-mode");
    initGame(mode);
  });
});

// Function to initialize the game with a specified mode
function initGame(mode) {
  initStyles(); // Reset box styles
  initDefaultAttributes(); // Reset box attributes
  const count = config.countMap[mode] || 3; // Get the number of boxes based on the selected mode or default to 3
  const colors = getRandomRGBColors(count); // Generate random RGB colors
  const answer = getRandomNumber(count); // Select a random index as the correct answer
  for (const [index, box] of boxes.entries()) {
    if (count === index) {
      break;
    }
    setBoxStyle(box, colors[index], "pointer"); // Set style for each box
  }
  displayColor.textContent = colors[answer]; // Display the target RGB color
  config.count = count;
  config.answer = answer;
  config.mode = mode;
}

// Function containing game logic for standard mode
function standartGameMode(box, index) {
  const hasWon = index === config.answer; // Check if the clicked box is correct

  updateScore(hasWon); // Update the player's score

  if (hasWon) {
    initGame(config.mode); // Start a new game if the correct box is clicked
    displayAlert("You guesed color", "success");
    return;
  }

  displayAlert("You missed correct color", "error");
  box.setAttribute("data-clicked", true); // Mark the clicked box
  setBoxStyle(box);

  const clickedCount = document.querySelectorAll(
    "div.box[data-clicked]"
  ).length;

  // Check if all boxes have been clicked incorrectly
  if (clickedCount + 1 === config.count) {
    initGame(config.mode); // Start a new game
    displayAlert("Skiped", "info", "You picked all wrong color");
  }
}

// Function containing game logic for extreme mode
function extremeGameMode(box, index) {
  const isCorrectClick = index === config.answer; // Check if the clicked box is correct

  if (isCorrectClick) {
    updateScore(false); // Update the player's score negatively
    initGame(config.mode); // Start a new game
    displayAlert(
      "Oops",
      "error",
      "You clicked the correct color, game idea was to not click here"
    );
    return;
  }

  displayAlert(
    "Correct",
    "success",
    "You clicked the wrong box, keep going that way"
  );
  box.setAttribute("data-clicked", true); // Mark the clicked box
  setBoxStyle(box);

  const clickedCount = document.querySelectorAll(
    "div.box[data-clicked]"
  ).length;

  // Check if all boxes have been clicked incorrectly
  if (clickedCount + 1 === config.count) {
    updateScore(true); // Update the player's score positively
    initGame(config.mode); // Start a new game
    displayAlert("Congrats", "success", "You clicked all wrong color");
  }
}

// Utility function to generate a random number within a specified range
function getRandomNumber(max = 256) {
  return Math.floor(Math.random() * max);
}

// Utility function to generate a random RGB color string
function getRandomRGB() {
  const r = getRandomNumber();
  const g = getRandomNumber();
  const b = getRandomNumber();
  return `rgb(${r},${g},${b})`;
}

// Utility function to generate an array of random RGB colors
function getRandomRGBColors(count) {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(getRandomRGB());
  }
  return array;
}

// Function to update the player's score
function updateScore(hasWon) {
  const baseScore = config.scoreMap[config.mode]; // Get base score for the current mode
  let score = hasWon ? baseScore : (baseScore / 2 + 3) * -1; // Calculate score based on win/loss

  // Ensure score doesn't go below 0
  if (config.score + score < 0) {
    score = 0;
  }

  config.score += score; // Update player's score
  displayScore.textContent = config.score; // Update displayed score
}

// Function to reset box styles
function initStyles() {
  boxes.forEach((box) => {
    setBoxStyle(box);
  });
}

// Function to reset box attributes
function initDefaultAttributes() {
  boxes.forEach((box) => {
    box.removeAttribute("data-clicked");
  });
}

// Function to display alerts to the player
function displayAlert(title, icon, text = "") {
  Swal.fire({ title, icon, text });
}

// Function to set box styles
function setBoxStyle(box, color = "transparent", cursor = "not-allowed") {
  box.style.backgroundColor = color;
  box.style.cursor = cursor;
}
