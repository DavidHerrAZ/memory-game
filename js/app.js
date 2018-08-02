/*
 * Global variables for managing the game board
 * Includes card list and order for shuffling
 */
const cardDeck = document.querySelector(".deck");
const cardList = document.querySelectorAll(".card");
const cardOrder = Array.from(Array(cardList.length).keys());

/*
 * List for cards needing validation after user interaction
 * List for all matched cards to trigger game completion
 */
let cardsToCheck = [];
let matchedCards = [];

/*
 * Global variables for managing the scoreboard
 */
const restartButton = document.querySelector(".restart");

const starRating = document.querySelectorAll(".stars li");
let userStars;

const moveText = document.querySelector(".moves");
let userMoves = 0;

const timerText = document.querySelector(".timer");
let userTime, rawUserTime, userTimeString, timeCounter;

/*
 * Global variables for managing game win modal
 */
const hideModal = document.querySelector(".hide");
const gameModal = document.querySelector(".modal");

const gameStars = document.querySelector(".game-stars");
const gameTime = document.querySelector(".game-time");
const gameMoves = document.querySelector(".game-moves");

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Functions to start and/or restart game scoreboard
function startOrResetGame() {
  initializeMoves();
  initializeStars();
  initializeTimer();
  initializeDeck();
}

function initializeMoves() {
  userMoves = 0;
  moveText.textContent = userMoves;
}

function initializeStars() {
  for (const star of starRating) {
    star.style.visibility = "visible";
  }
}

function initializeTimer() {
  // Set all timer variables to 0 and clear the set interval function
  stopTimer();
  userTime = 0;
  timerText.textContent = "00:00:00";

  // Reset the timer counter using the set interval function
  timeCounter = setInterval(gameTimer, 1000);
}

// Apply order to each card element based off shuffled deck
function initializeDeck() {
  shuffle(cardOrder);
  cardsToCheck = [];
  matchedCards = [];

  for (let i = 0; 0 < cardList.length; i++) {
    cardList[i].style.order = cardOrder[i];
    // When starting|resetting game, all card classes must be reset to 'card' to re-hide the symbol
    cardList[i].className = "card";
  }
}

// User card interaction functions for toggling and checking matches
function toggleCard(cardClicked) {
  // toggling open only shows the other side of the card
  cardClicked.classList.toggle("open");
  // toggling show actually shows the symbol
  cardClicked.classList.toggle("show");
}

function checkCards(cardClicked) {
  cardsToCheck.unshift(cardClicked);

  // If the user has clicked two cards
  if (cardsToCheck.length === 2) {
    // check first to see if they match. When they do, toggle match and pushed to matched cards array
    if (
      cardsToCheck[0].firstElementChild.classList.value ===
      cardsToCheck[1].firstElementChild.classList.value
    ) {
      for (const card of cardsToCheck) {
        card.classList.toggle("match");
        matchedCards.push(card);
      }
      cardsToCheck = [];
    }
    // then check to see if they are mismatched. Show cards briefly when not equal.
    else if (
      cardsToCheck[0].firstElementChild.classList.value !=
      cardsToCheck[1].firstElementChild.classList.value
    ) {
      // display both un-matched cards for 1.5 seconds
      // without delay, user only sees first card
      setTimeout(function misMatchedCards() {
        for (const card of cardsToCheck) {
          toggleCard(card);
        }
        cardsToCheck = [];
      }, 750);
    }
    updateMoves();
    checkStars();
  }
}

// Functions for managing scoreboard throughout game
function updateMoves() {
  userMoves++;
  moveText.textContent = userMoves;
}

function checkStars() {
  countStars();
  if (userMoves === 16 || userMoves === 24 || userMoves === 32) {
    updateStars();
  }
}

function countStars() {
  return (userStars = document.querySelectorAll(
    '.stars li:not([style*="visibility: hidden"])'
  ).length);
}

function updateStars() {
  const removeStar = userStars - 1;
  starRating[removeStar].style.visibility = "hidden";
}

// Functions for winning game and managing modal
function checkGame() {
  if (matchedCards.length === 16) {
    modalStats();
    toggleModal();
  }
}

function toggleModal() {
  hideModal.classList.toggle("hide");
}

function modalStats() {
  gameStars.textContent = userStars;
  gameMoves.textContent = userMoves;
  gameTime.textContent = userTimeString;
}

function stopTimer() {
  clearInterval(timeCounter);
}

/* 
*  Timer formatting https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
*/

function gameTimer() {
  userTime++;
  rawUserTime = new Date(null);
  rawUserTime.setSeconds(userTime);
  userTimeString = rawUserTime.toISOString().substr(11, 8);
  timerText.textContent = userTimeString;
}

/* 
*  For efficiency the event listener will be added to '.deck'
*  Functions for interactions with cards will use click targets
*/

cardDeck.addEventListener("click", function(clickevent) {
  const cardClicked = clickevent.target;
  if (cardClicked.classList.contains("card")) {
    toggleCard(cardClicked);
    checkCards(cardClicked);
    checkGame();
  }
});

restartButton.addEventListener("click", startOrResetGame);

gameModal.addEventListener("click", function(modalevent) {
  const modalClick = modalevent.target;
  if (modalClick.classList.contains("modal-close")) {
    toggleModal();
    stopTimer();
  } else if (modalClick.classList.contains("modal-replay")) {
    toggleModal();
    startOrResetGame();
  }
});

// Initialize game when the page loads
startOrResetGame();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
