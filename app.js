const characterEndPoint = 'http://gateway.marvel.com/v1/public/characters';
const key = 'fd3ce76143a66b2909ac5f79125aae8a';

const charactersArray = [];

const getCharacters = async () => {
    const requestParams = `?apikey=${key}`;
    const urlToFetch = `${characterEndPoint}${requestParams}&limit=100&offset=0`;
    try {
        const response = await fetch(urlToFetch)
        if (response.ok) {
            const jsonResponse = await response.json();
            const data = jsonResponse.data.results;
            const filteredData = data.filter(character => !character.thumbnail.path.includes("image_not_available"));
            const randomOrderData = filteredData.sort(() => 0.5 - Math.random());
            const selectedCharacters = randomOrderData.slice(0, 9);
            selectedCharacters.forEach(character => {
                for (let i = 0; i < 2; i++) {
                    charactersArray.push(
                        {
                            name: character.name,
                            img: character.thumbnail.path + '/standard_large.' + character.thumbnail.extension
                        }
                    )
                }
            });
        }
        charactersArray.sort(() => 0.5 - Math.random());  // note, this is a nice 'trick' to randomly sort items.  When comparing to items, it will either be more than or less than 0.5, and sort accordingly
        console.log(charactersArray);
    } catch (error) {
        console.log(error);
    };
}

const gridDisplay = document.querySelector('#grid');
const attempts = document.getElementById('attempts');
const matches = document.getElementById('matches');
const bestScore = document.getElementById('bestScore');
const finalScore = document.getElementById('finalScore');
// on page load, check local storage for previious score, otherwise at dash
const savedScore = JSON.parse(localStorage.getItem('savedScore')) || "-";

//set initial score values
attempts.textContent = 0;
matches.textContent = 0;
bestScore.textContent = savedScore;

let cardsChosen = [];
let cardsChosenIds = [];
let cardsUsed = [];
let attemptCounter = 0;
let matchesCounter = 0;

async function createBoard() {
    await getCharacters();
    for (let i = 0; i < charactersArray.length; i++) {
        const card = document.createElement('img')
        card.setAttribute('class', "card")
        card.setAttribute('src', 'images/Marvel-Logo-Square.jpeg')
        card.setAttribute('data-id', i)
        card.addEventListener('click', flipCard);
        gridDisplay.appendChild(card)
    }
}

createBoard();


// To enable and disable the pop-up when a user matches a pair of cards
const match = document.getElementById('match');

function matchClose() {
    match.style.display = 'none';
}

function matchPop() {
    match.style.display = 'block';
    setTimeout(matchClose, 800);
}


// To enable and disable the pop-up when a user matches a pair of cards
const win = document.getElementById('win');

function showWin() {
    finalScore.textContent = attemptCounter;
    win.style.display = 'block';
}


// To check whether a set of cards match
function checkMatch() {
    const cards = document.querySelectorAll('#grid img');

    //if the EXACT same card if chosen twice - let the user know this is not allowed
    if (cardsChosenIds[0] === cardsChosenIds[1]) {
        alert('You cannot select the same card twice');
        cards[cardsChosenIds[0]].setAttribute('src', 'images/Marvel-Logo-Square.jpeg');
        cardsChosen = [];
        cardsChosenIds = [];
        return;
    }

    // if the user matches the cards, format the cards and remove eventlisteners to prevent re-clicking used cards
    if (cardsChosen[0] == cardsChosen[1]) {
        matchPop();
        matchesCounter++;
        cards[cardsChosenIds[0]].style.border = '3px solid Green';
        cards[cardsChosenIds[1]].style.border = '3px solid Green';
        cards[cardsChosenIds[0]].removeEventListener('click', flipCard);
        cards[cardsChosenIds[1]].removeEventListener('click', flipCard);
        // if no match, return cards to original blank image   
    } else {
        cards[cardsChosenIds[0]].setAttribute('src', 'images/Marvel-Logo-Square.jpeg');
        cards[cardsChosenIds[1]].setAttribute('src', 'images/Marvel-Logo-Square.jpeg');
    }

    attemptCounter++;

    //reset to empty arrays, ready for the next set of cards
    cardsChosen = [];
    cardsChosenIds = [];
    attempts.textContent = attemptCounter;
    matches.textContent = matchesCounter;


    //check if all pairs have been found
    if (matchesCounter == charactersArray.length / 2) {
        party.confetti(gridDisplay);
        showWin();
        if (savedScore == 0) {
            localStorage.setItem("savedScore", attemptCounter);
            bestScore.textContent = attemptCounter;
        } else if (attemptCounter < savedScore) {
            localStorage.setItem("savedScore", attemptCounter);
            bestScore.textContent = attemptCounter;
        }
    }
}

function flipCard() {
    const cardId = this.getAttribute('data-id');  // get the 'name' of the card
    cardsChosen.push(charactersArray[cardId].name) // add the card 'name' into the cardsChosen array so that we can then compare them
    cardsChosenIds.push(cardId);
    this.setAttribute('src', charactersArray[cardId].img) // changes the image of the card to the image associated with the cardId

    // now we want to check to see if cards match
    if (cardsChosen.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

const playBtn = document.getElementById('play-again');
playBtn.addEventListener('click', newGame);

function newGame() {
    win.style.display = 'none';
}
















