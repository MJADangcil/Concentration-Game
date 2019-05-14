/*
 * Create a list that holds all of your cards
 */
var cards = [
  'fa-diamond', 'fa-diamond',
  'fa-paper-plane-o', 'fa-paper-plane-o',
  'fa-anchor', 'fa-anchor',
  'fa-bolt', 'fa-bolt',
  'fa-cube', 'fa-cube',
  'fa-leaf', 'fa-leaf',
  'fa-bicycle', 'fa-bicycle',
  'fa-bomb', 'fa-bomb'
];

function generateCard(card) {
  return `<li class='card' data-card='${card}'><i class='fa ${card}'></i></li>`
}

var moves = 0;
var winCondition = (cards.length) / 2;
var moveCounter = document.querySelector('.moves');

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

function initGame() {
  var deck = document.querySelector('.deck');
  var cardHTML = shuffle(cards).map(function(card) {
    return generateCard(card);
  });

  deck.innerHTML = cardHTML.join('');
}

initGame();

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

var allCards = document.querySelectorAll('.card');
var winScreen = document.querySelector('.win-screen');
var winMessage = document.querySelector('.win-message');
var game = document.querySelector('.container');
var reset = document.querySelector('.restart');
var openCards = [];

allCards.forEach(function(card) {
  card.addEventListener('click', function(e) {

    if (!card.classList.contains('open')  && !card.classList.contains('show') && !card.classList.contains('match')) {
      openCards.push(card);
      card.classList.add('open', 'show');

      if (openCards.length == 2) {
        // If cards match -> add match class
        if (openCards[0].dataset.card == openCards[1].dataset.card) {
          matchedCards(openCards);

          openCards = [];
          winCondition--;

          if (winCondition == 0) {
            winGame();
          }
        } else {
          // If card don't match -> hide
          setTimeout(function() {
            openCards.forEach(function(card) {
              card.classList.remove('open', 'show');
            });

            openCards = [];
          }, 1000);
        }

      moves++;
      moveCounter.innerText = moves;
      }
    }
  });
});

reset.addEventListener('click', function(e) {
  window.location.reload();
});

function matchedCards(openCards) {
  openCards[0].classList.add('match', 'open', 'show');
  openCards[1].classList.add('match', 'open', 'show');
}

function winGame() {
  setTimeout(function() {
    game.style.display = 'none';
    winScreen.style.display = 'block';
    
    var movesToWin = document.createElement('span');
    movesToWin.innerHTML = `<span>You had ${moves} moves and 1 Star! Woooooo!</span>`

    winMessage.appendChild(movesToWin);
    
  }, 1000);
}