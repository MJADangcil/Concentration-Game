//List of icons and creation of cards array
let icons = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let cards = icons.concat(icons);

let moves = 0;
let winCondition = (cards.length) / 2;
let moveCounter = document.querySelector('.moves');

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function generateCard(card) {
  return `<li class='card' data-card='${card}'><i class='fa ${card}'></i></li>`
}

function initGame() {
  let deck = document.querySelector('.deck');
  let cardHTML = shuffle(cards).map(function(card) {
    return generateCard(card);
  });

  deck.innerHTML = cardHTML.join('');
}

initGame();

let allCards = document.querySelectorAll('.card');
let winScreen = document.querySelector('.win-screen');
let winMessage = document.querySelector('.win-message');
let game = document.querySelector('.container');
let reset = document.querySelector('.restart');
let openCards = [];

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
    
    let movesToWin = document.createElement('span');
    movesToWin.innerHTML = `<span>You had ${moves} moves and 1 Star! Woooooo!</span>`

    winMessage.appendChild(movesToWin);
    
  }, 1000);
}