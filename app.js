const characterEndPoint = 'http://gateway.marvel.com/v1/public/characters';
const key = 'fd3ce76143a66b2909ac5f79125aae8a';

let fullCharactersArray = [];

const getAllCharacters = async () => {
    const requestParams = `?apikey=${key}`;
    const urlToFetch = `${characterEndPoint}${requestParams}`;
    try {
        const response = await fetch(urlToFetch + '&limit=100&offset=0')
        const response2 = await fetch(urlToFetch + '&limit=100&offset=100')
        const response3 = await fetch(urlToFetch + '&limit=100&offset=200')
        const response4 = await fetch(urlToFetch + '&limit=100&offset=300')
        const response5 = await fetch(urlToFetch + '&limit=100&offset=400')
        const response6 = await fetch(urlToFetch + '&limit=100&offset=500')
        const response7 = await fetch(urlToFetch + '&limit=100&offset=600')
        const response8 = await fetch(urlToFetch + '&limit=100&offset=700')
        const response9 = await fetch(urlToFetch + '&limit=100&offset=800')
        const response10 = await fetch(urlToFetch + '&limit=100&offset=900')
        const response11 = await fetch(urlToFetch + '&limit=100&offset=1000')  
        const response12 = await fetch(urlToFetch + '&limit=100&offset=1100')
        const response13 = await fetch(urlToFetch + '&limit=100&offset=1200')
        const response14 = await fetch(urlToFetch + '&limit=100&offset=1300')
        const response15 = await fetch(urlToFetch + '&limit=100&offset=1400')      
        if (response.ok) {
            const jsonResponse = await response.json();
            const jsonResponse2 = await response2.json();
            const jsonResponse3 = await response3.json();
            const jsonResponse4 = await response4.json();
            const jsonResponse5 = await response5.json();
            const jsonResponse6 = await response6.json();
            const jsonResponse7 = await response7.json();
            const jsonResponse8 = await response8.json();
            const jsonResponse9 = await response9.json();
            const jsonResponse10 = await response10.json();
            const jsonResponse11 = await response11.json();
            const jsonResponse12 = await response12.json();
            const jsonResponse13 = await response13.json();
            const jsonResponse14 = await response14.json();
            const jsonResponse15 = await response15.json();
            const allData = [
                ...jsonResponse.data.results, 
                ...jsonResponse2.data.results, 
                ...jsonResponse3.data.results,
                ...jsonResponse4.data.results,
                ...jsonResponse5.data.results,
                ...jsonResponse6.data.results,
                ...jsonResponse7.data.results,
                ...jsonResponse8.data.results,
                ...jsonResponse9.data.results,
                ...jsonResponse10.data.results,
                ...jsonResponse11.data.results,
                ...jsonResponse12.data.results,
                ...jsonResponse13.data.results,
                ...jsonResponse14.data.results,
                ...jsonResponse15.data.results
            ];
            const filteredData = allData.filter(character => !character.thumbnail.path.includes("image_not_available"));
            const randomOrderData = filteredData.sort(() => 0.5 - Math.random());
            const selectedCharacters = randomOrderData.slice(0, 9);
            console.log(selectedCharacters);
            selectedCharacters.forEach(character => {
                for (let i = 0; i < 2; i++) {
                    fullCharactersArray.push(
                        {
                            name: character.name,
                            img: character.thumbnail.path + '/standard_large.' + character.thumbnail.extension
                        }
                    )
                }
            });
            fullCharactersArray.sort(() => 0.5 - Math.random());
            console.log(fullCharactersArray);
        }
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
    await getAllCharacters();
    for (let i = 0; i < fullCharactersArray.length; i++) {
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
    if (matchesCounter == fullCharactersArray.length / 2) {
        party.confetti(gridDisplay);
        showWin();
        if (savedScore == "-") {
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
    cardsChosen.push(fullCharactersArray[cardId].name) // add the card 'name' into the cardsChosen array so that we can then compare them
    cardsChosenIds.push(cardId);
    this.setAttribute('src', fullCharactersArray[cardId].img) // changes the image of the card to the image associated with the cardId

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
















