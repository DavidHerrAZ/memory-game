/*
 * Create a list that holds all of your cards
 */
const cardList = document.querySelectorAll('.card');
const cardOrder = Array.from(Array(cardList.length).keys());

/*
 * Declare card deck variable for later use in card event listeners
 * Variable must be declared at top of block
 * Otherwise, console says the variable is anonymous at call time
 */
const cardDeck = document.querySelector('.deck');

let cardsToCheck = []
let matchedCards = []

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

// Apply order to each card element based off shuffled deck
function initializeDeck() {
    shuffle(cardOrder);

    for (let i=0; 0 < cardList.length; i++) {
        cardList[i].style.order = cardOrder[i];
    }
}

function initializeStars() {
    const starRating = document.querySelectorAll('.stars li');
    for (let i=0; 0 < starRating.length; i++) {
        starRating[i].style.visibility = "visible";
    }
}

function toggleCard(cardClicked) {
    // toggling open only shows the other side of the card
    cardClicked.classList.toggle('open');
    // toggling show actually shows the symbol
    cardClicked.classList.toggle('show');
};

function checkCards(cardClicked) {
    cardsToCheck.unshift(cardClicked);

    if (cardsToCheck.length === 2 && (cardsToCheck[0].firstElementChild.classList.value === cardsToCheck[1].firstElementChild.classList.value)) {
        for(const card of cardsToCheck) {
            card.classList.toggle('match');
            matchedCards.push(card);
        }
        cardsToCheck = [];
    }
    else if (cardsToCheck.length > 2) {
        cardsToCheck.splice(1,2);
        for(const card of cardsToCheck) {
            toggleCard(card);
        }
    }
}

/* 
*  For efficiency the event listener will be added to '.deck'
*  Functions for interactions with cards will use click targets
*  Event listener must be before function calls to work...?
*/ 
cardDeck.addEventListener('click', function(clickevent) {
    const cardClicked = clickevent.target;
    if (cardClicked.classList.contains('card')) {
        toggleCard(cardClicked);
        checkCards(cardClicked);
    }
});

// Initialize game when the page loads
initializeDeck();
initializeStars();

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
