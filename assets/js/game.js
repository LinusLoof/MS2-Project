const topLeft = document.querySelector('.box1');
const topRight = document.querySelector('.box2');
const bottomLeft = document.querySelector('.box3');
const bottomRight = document.querySelector('.box4');
const level = document.getElementById('#level');
let gameOverElem = document.getElementsByClassName("game-over-container")[0];
let containerGameElem = document.getElementsByClassName("game-container")[0];
let countdownElement = document.getElementsByClassName("countdown-container")[0];
let scoreElement = document.getElementsByClassName("score-container")[0];
const flashTime = 250;
const flashDelay = 1000;
let score = 0;
let sequenceIsPlaying = false;
// Populated on reset
let sequence;
let sequenceToGuess;
let count = 4;
let interval;

/*
Returns a random box for the user to click
*/
const getRandomBox = () => {
	const boxes = [topLeft, topRight, bottomLeft, bottomRight]
	return boxes[parseInt(Math.random() * boxes.length)];
};

// This resets the sequence
function resetSequence() {
	sequence = [getRandomBox()];
	sequenceToGuess = [...sequence];
}

/*
Sets a timer for the box in the sequence to flash
*/
const flash = (box) => {
	return new Promise((resolve, reject) => {
		box.className += ' active';
		setTimeout(() => {
			// This is where the box is flashed via the class
			box.className = box.className.replace(
				'active',
				''
			);
			// This is where the box is flashed
			setTimeout(() => {
				resolve();
			}, flashTime);
		}, flashDelay);
	});
};


const boxClicked = boxClicked => {
	// If game is not in game mode, don't do anything
	if (!sequenceIsPlaying) return;

	const expectedBox = sequenceToGuess.shift();
	if (expectedBox === boxClicked) {
		// If the correct boxes are clicked
		if (sequenceToGuess.length === 0) {
			// Start new round and add score point
			sequence.push(getRandomBox());
			sequenceToGuess = [...sequence];
			score += 1;
			setScore(score);
			setTimeout(() => {
				startFlashing();
			}, flashDelay);

		}
	} else {
		// If the wrong box is clicked = end game
		handleGameOver();
	}
};

function resetScore() {
	// Reset the score variable and insert it in the HTML
	score = 0;
	scoreElement.children[0].innerHTML = score;
}

function setScore(score) {
	// Insert the score variable in the HTML
	scoreElement.children[0].innerHTML = score;
}

function handleGameOver() {
	// Display the game over pop-up and insert text
	gameOverElem.children[0].innerHTML = `<h2>Game Over</h2> <br> Your score: ${score} <br> Press Start to try again <br> Press Back for homepage`;
	gameOverElem.style.display = "flex";
	// Add blur to background
	containerGameElem.style.filter = "blur(6px)";
	resetScore();
	sequenceIsPlaying = false;
}

const startFlashing = async() => {
	// Add flashing class to game container
	containerGameElem.classList.add("flashing");
	// Show flash for boxes
	sequenceIsPlaying = false;
	for (const box of sequence) {
		await flash(box);
	}
	// Flashes is done, user can now click and remove flashing class
	containerGameElem.classList.remove("flashing");
	sequenceIsPlaying = true;
};

function playGame() {
	// Reset any variables and the sequence, score etc.
	resetScore();
	hideGameOverPopUp();
	resetSequence();
	count = 4;
	// Start countdown interval every 1 second
	interval = setInterval(countDown, 1000);

	setTimeout(() => {
		startFlashing();
	}, 4200);
}

function countDown() {
	// Fetch popup element called countdown and display it
	console.log(countdownElement)
	countdownElement.style.display = "flex";
	// count variable is one less everytime this loops
	count = count - 1;
	if (count <= 0) {
		// if count is down to 0, hide popup element and clear interval
		countdownElement.style.display = "none";
		clearInterval(interval);

		return;
	}
	// display count in the HTML
	countdownElement.children[0].innerHTML = count;
}


function hideGameOverPopUp() {
	// Remove blur from game container
	containerGameElem.style.filter = "blur(0px)";
	if (gameOverElem.style.display === "flex") {
		// Set display to none if the game-over element is visible
		gameOverElem.style.display = 'none';
		sequenceIsPlaying = true;
	}
}