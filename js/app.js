//Variables for initializing the game board.
let icons = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let cards = icons.concat(icons);
let moves = 0;
let winCondition = (cards.length) / 2;

/**
 * @description Shuffles an array using Fisher-Yates (aka Knuth) Shuffle.
 * @param {string} array 
 * @returns {string} 
 */
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

/**
 * @description Receives card info and builds an HTML string for ease of DOM manipulation.
 * @param {string} card
 * @returns {string} 
 */
function generateCard(card) {
  return `<li class='card' data-card='${card}'><i class='fa ${card}'></i></li>`
}

/** @description Initializes the game board and populates with shuffled cards. */
function initGame() {
  let deck = document.querySelector('.deck');
  let cardHTML = shuffle(cards).map(function(card) {
    return generateCard(card);
  });

  deck.innerHTML = cardHTML.join('');
}

initGame();

//Variables for DOM manipulation.
let game = document.querySelector('.container');
let allCards = document.querySelectorAll('.card');
let reset = document.querySelector('.restart');
let stars = document.querySelector('.stars');
let starRating = 3;
let moveCounter = document.querySelector('.moves');
let time;
let timeCounter = document.querySelector('.timer');
let winScreen = document.querySelector('.win-screen');
let winMessage = document.querySelector('.win-message');
let openCards = [];

startTimer();

allCards.forEach(function(card) {
  card.addEventListener('click', function(e) {
    showCard(card);
  });
});

reset.addEventListener('click', function(e) {
  window.location.reload();
});

/** @description Starts timer of the game as soon as window loads. */
function startTimer() {
  let s = 0;
  let m = 0;
  let h = 0;
  
  time = setInterval(incrementTime, 1000);

  function incrementTime() {
    s++;
    if (s == 60) {
      s = 0;
      m++;
      if (m == 60) {
        m = 0;
        h++;
      }
    }
    
    timeCounter.innerHTML = `<span>${h}h ${m}m ${s}s</span>`;
  }
}

/**
 * @description Shows the card through adding open and show classes to card element.
 * @param {Node} c
 */
function showCard(c) {
  if (!c.classList.contains('open')  && !c.classList.contains('show') && !c.classList.contains('match')) {
    openCards.push(c);
    c.classList.add('open', 'show');
  }

  if (openCards.length == 2) {
    checkCards();
    scoreCheck();
  }
}

/** @description Checks the openCards array (always two cards) and renders all cards unclickable. */
function checkCards() {
  allCards.forEach(function(card) {
    if (!openCards.includes(card)) {
      card.classList.add('no-click');
    }
  });

  if (openCards[0].dataset.card == openCards[1].dataset.card) {
    matchCards();
  } else {
    mismatchCards();
  }
}

/** @description Matches cards by adding match classes to card element and decrments the winCondition. */
function matchCards() {
  openCards.forEach(function(card) {
    card.classList.add('match');
  });

  winCondition--;

  if (winCondition == 0) {
    winGame();
  }

  openCards = [];

  allCards.forEach(function(card) {
    card.classList.remove('no-click');
  });
}

/** @description Mismatches cards and resets the choices. */
function mismatchCards() {
  openCards.forEach(function(card) {
    card.classList.add('mismatch', 'no-click');
  });

  setTimeout(function() {
    allCards.forEach(function (card) {
      card.classList.remove('no-click', 'open', 'show', 'mismatch');
    });

    openCards = [];
  }, 1000);
}

function scoreCheck() {
  moves++;
  if (moves == 1) {
    moveCounter.innerHTML = `<span>${moves} Move</span>`;
  } else {
    moveCounter.innerHTML = `<span>${moves} Moves</span>`;
  }

  if (moves <= 10) {
    stars.innerHTML = 
      `
      <li><i class='fa fa-star'></i></li>
      <li><i class='fa fa-star'></i></li>
      <li><i class='fa fa-star'></i></li>
      `
  } else if (moves <= 15) {
    starRating = 2;
    stars.innerHTML = 
      `
      <li><i class='fa fa-star'></i></li>
      <li><i class='fa fa-star'></i></li>
      <li><i class='fa fa-star-o'></i></li>
      `
  } else {
    starRating = 1;
    stars.innerHTML = 
      `
      <li><i class='fa fa-star'></i></li>
      <li><i class='fa fa-star-o'></i></li>
      <li><i class='fa fa-star-o'></i></li>
      `
  }
}

/** @description Removes game board "off-screen" and renders win modal with the player's statistics. */
function winGame() {
  clearInterval(time);
  setTimeout(function() {
    game.style.display = 'none';
    winScreen.style.display = 'block';
    
    let score = document.createElement('span');

    if (starRating == 1) {
      score.innerHTML = `<span>You had ${moves} moves and took ${timeCounter.textContent}!<br>You got ${starRating} star!</span>`;
    } else {
      score.innerHTML = `<span>You had ${moves} moves and took ${timeCounter.textContent}!<br>You got ${starRating} stars!</span>`;
    }
  
    winMessage.appendChild(score);
    
  }, 1000);
}