/*
 * Global variables for managing the game board
 * Includes card list and order for shuffling
 */
const cardDeck = document.querySelector('.deck');
const cardList = document.querySelectorAll('.card');
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
const restartButton = document.querySelector('.restart');
const starRating = document.querySelectorAll('.stars li');
const moveText = document.querySelector('.moves');
let userMoves = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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
    // TODO: initializeTimer()
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

// TODO: initializeTimer()

// Apply order to each card element based off shuffled deck
function initializeDeck() {
    shuffle(cardOrder);

    for (let i=0; 0 < cardList.length; i++) {
        cardList[i].style.order = cardOrder[i];
        //When starting|resetting game, all card classes must reset to 'card'
        cardList[i].className = "card";
    }
}

// User card interaction functions for toggling and checking matches
function toggleCard(cardClicked) {
    // toggling open only shows the other side of the card
    cardClicked.classList.toggle('open');
    // toggling show actually shows the symbol
    cardClicked.classList.toggle('show');
};

function checkCards(cardClicked) {
    cardsToCheck.unshift(cardClicked);

    if (cardsToCheck.length === 2) {
        if (cardsToCheck[0].firstElementChild.classList.value === cardsToCheck[1].firstElementChild.classList.value) {
            for(const card of cardsToCheck) {
                card.classList.toggle('match');
                matchedCards.push(card);
            }
            cardsToCheck = [];
        }
        else if (cardsToCheck[0].firstElementChild.classList.value != cardsToCheck[1].firstElementChild.classList.value) {
            // display both un-matched cards for 1.5 seconds
            // without delay, user only sees first card
            setTimeout(function misMatchedCards() {
                for(const card of cardsToCheck) {
                    toggleCard(card);
                }
                cardsToCheck = [];
            }, 1500);
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
    if (userMoves === 16 || userMoves === 24 || userMoves === 32) {
        updateStars();
    }
}

function updateStars() {
    const currentStars = document.querySelectorAll('.stars li:not([style*="visibility: hidden"])');
    const removeStar = currentStars.length - 1;
    starRating[removeStar].style.visibility = "hidden";
}

/* 
*  For efficiency the event listener will be added to '.deck'
*  Functions for interactions with cards will use click targets
*/ 
cardDeck.addEventListener('click', function(clickevent) {
    const cardClicked = clickevent.target;
    if (cardClicked.classList.contains('card')) {
        toggleCard(cardClicked);
        checkCards(cardClicked);
    }
});

restartButton.addEventListener('click', startOrResetGame);

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
