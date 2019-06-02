//Variables for initializing the game board.
let icons = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let cards = icons.concat(icons);
let moves = 0;
let winCondition = (cards.length) / 2;

/**
 * @description Shuffles an array using Fisher-Yates (aka Knuth) Shuffle.
 * @param {string} array 
 * @return {string} 
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
 * @return {string} 
 */
function generateCard(card) {
  return `<li class='card' data-card='${card}'><i class='fa ${card}'></i></li>`
}

//Initialize the game board.
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
    if (!card.classList.contains('open')  && !card.classList.contains('show') && !card.classList.contains('match')) {
      openCards.push(card);
      card.classList.add('open', 'show');

      if (openCards.length == 2) {
        allCards.forEach(function(card) {
          if (!openCards.includes(card) && !card.classList.contains('match')) {
            card.classList.add('no-click');
          }
        });

        // If cards match -> add match class
        if (openCards[0].dataset.card == openCards[1].dataset.card) {
          openCards[0].classList.add('match');
          openCards[1].classList.add('match');
          winCondition--;

          if (winCondition == 0) {
            winGame();
          }

          setTimeout(function() {
            allCards.forEach(function(card) {
              card.classList.remove('no-click');
            });

            openCards = [];
          }, 1000);
        } else {
          // If card don't match -> hide
          setTimeout(function() {
            openCards.forEach(function(card) {
              card.classList.remove('open', 'show');
            });

            allCards.forEach(function(card) {
              card.classList.remove('no-click');
            });

            openCards = [];
          }, 1000);
        }

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
    }
  });
});

reset.addEventListener('click', function(e) {
  window.location.reload();
});

/**
 * @description Starts timer of the game as soon as window loads.
 * @param {}
 * @return {}
 */
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
 * @description Removes game board "off-screen" and renders win modal with the player's statistics.
 * @param {}
 * @return {} 
 */
function winGame() {
  clearInterval(time);
  setTimeout(function() {
    game.style.display = 'none';
    winScreen.style.display = 'block';
    
    let score = document.createElement('span');

    if (starRating == 1) {
      score.innerHTML = `<span>You had ${moves} moves and took ${timeCounter.textContent}! You had ${starRating} star!</span>`;
    } else {
      score.innerHTML = `<span>You had ${moves} moves and took ${timeCounter.textContent}! You had ${starRating} stars!</span>`;
    }
  
    winMessage.appendChild(score);
    
  }, 1000);
}