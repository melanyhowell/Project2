//Card selection/array is x 10 in total to enable use of extra difficulty if brought into game.
const animals = [
  { name: "squirel", image: "/assets/images/squirrel.svg" },
  { name: "sheep", image: "/assets/images/sheep.svg" },
  { name: "rooster", image: "/assets/images/rooster.svg" },
  { name: "pig", image: "/assets/images/pig.svg" },
  { name: "kangaroo", image: "/assets/images/kangaroo.svg" },
  { name: "hippo", image: "/assets/images/hippo.svg" },
  { name: "goat", image: "/assets/images/goat.svg" },
  { name: "elephant", image: "/assets/images/elephant.svg" },
  { name: "duck", image: "/assets/images/duck.svg" },
  { name: "donkey", image: "/assets/images/donkey.svg" },
];

//set initial state
let firstCard = false;
let secondCard = false;

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const moves = document.getElementById("moves-count");
const result = document.getElementById("result");
const timeValue = document.getElementById("time");
const controls = document.querySelector(".controls-container");



//For calculating the amount of moves taken by user
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

// Time, Moves starting place
let seconds = 0,
  minutes = 0;
  movesCount = 0,
  correctCount = 0;

//if there are more than 60 seconds on time the minute increases by 1 for every 60 seconds (taken from https://www.youtube.com/@CodingArtist)
const clockGenerator = () => {
  seconds += 1;

  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
//format time before displaying 
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
  };

let cards;
let interval;


//We need the game to pick random objects from the array of animals
const generateRandom = (size = 4) => {
  
  let tempArray = [...animals];
  //initialises cardValues array
  let cardValues = [];
  //grid size is 4x4 which means 16 cards and 8 pairs
  size = (size * size) / 2;
  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for(let i=0; i<size*size;i++){
    /*
    Create Cards
    before => front side (contains question mark)
    after => back side (contains actual image);
    data-card-values is a custom attribute which stores the names of the cards to match later
    */
   gameContainer.innerHTML +=`
   <div class="card-container" data-card-value="${cardValues[i].name}">
     <div class="card-before">?</div>
     <div class="card-after">
     <img src="${cardValues[i].image}" class="image"/></div>
   </div>
   `;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

//Cards
cards = document.querySelectorAll(".card-container");
cards.forEach((card) => {
  card.addEventListener("click", () => {
    //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
    if (!card.classList.contains("matched")) {
      //flip the cliked card
      card.classList.add("flipped");
      //if it is the firstcard (!firstCard since firstCard is initially false)
      if (!firstCard) {
        //so current card will become firstCard
        firstCard = card;
        //current cards value becomes firstCardValue
        firstCardValue = card.getAttribute("data-card-value");
      } else {
        //increment moves since user selected second card
        movesCounter();
        //secondCard and value
        secondCard = card;
        let secondCardValue = card.getAttribute("data-card-value");
        if (firstCardValue == secondCardValue) {
          //if both cards match add matched class so these cards would beignored next time
          firstCard.classList.add("matched");
          secondCard.classList.add("matched");
          //set firstCard to false since next card would be first now
          firstCard = false;
          //correctCount increment as user found a correct match
          correctCount += 1;
          //check if correctCount ==half of cardValues
          if (correctCount == Math.floor(cardValues.length / 2)) {
            result.innerHTML = `<h2>You Won</h2>
          <h4>Moves: ${movesCount}</h4>`;
            stopGame();
          }
        } else {
          //if the cards dont match
          //flip the cards back to normal
          let [tempFirst, tempSecond] = [firstCard, secondCard];
          firstCard = false;
          secondCard = false;
          let delay = setTimeout(() => {
            tempFirst.classList.remove("flipped");
            tempSecond.classList.remove("flipped");
          }, 900);
        }
      }
    }
  });
});
};

//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls amd buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Start timer
  interval = setInterval(clockGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});
//Stop game
stopButton.addEventListener("click",
  (stopGame = () => {
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
  })
);

//Initialise values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};