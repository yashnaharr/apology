// script.js
// IMPORTS: Import the comprehensive word list
import { ALL_FIVE_LETTER_WORDS } from './words.js';


// --- TEMPORARY DEBUGGING ELEMENT ---
// This div will appear at the top of your page if JavaScript is running.
// If you see "JS Running!" on your phone, then the script is loading.
// You can remove this entire block after you confirm JS is loading.
const debugDiv = document.createElement('div');
debugDiv.id = 'debug-indicator';
debugDiv.textContent = 'JS Running!';
debugDiv.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background-color: yellow;
    color: black;
    padding: 5px;
    border-radius: 3px;
    font-size: 0.8em;
    z-index: 9999;
`;
document.body.appendChild(debugDiv);
// --- END TEMPORARY DEBUGGING ELEMENT ---


const SECRET_WORD = "SMART"; // Your custom 5-letter word
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

let currentGuessIndex = 0; // Tracks which guess row we are on (0-5)
let currentLetterPos = 0;  // Tracks current letter position in the current guess (0-4)
let gameEnded = false;

// Convert the imported word list into a Set for faster lookups
const VALID_WORDS_SET = new Set(ALL_FIVE_LETTER_WORDS);

const gameBoard = document.getElementById('game-board');
const messageDisplay = document.getElementById('message');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const closeModalButton = document.getElementById('close-modal');
const keyboardContainer = document.getElementById('keyboard-container');

const keyboardKeys = {};

// --- Game Initialization ---
function initializeBoard() {
    for (let i = 0; i < MAX_GUESSES; i++) {
        const row = document.createElement('div');
        row.classList.add('word-row');
        row.id = `row-${i}`;
        for (let j = 0; j < WORD_LENGTH; j++) {
            const box = document.createElement('div');
            box.classList.add('letter-box');
            box.id = `box-${i}-${j}`;
            row.appendChild(box);
        }
        gameBoard.appendChild(row);
    }
    initializeKeyboard(); // Initialize the keyboard after the board

    // --- TEMPORARY DEBUGGING ELEMENT REMOVAL ---
    // Remove the debug indicator after the board and keyboard are initialized
    const debugIndicator = document.getElementById('debug-indicator');
    if (debugIndicator) {
        debugIndicator.textContent = 'JS Loaded & Init!';
        setTimeout(() => {
            debugIndicator.remove();
        }, 1500); // Remove after a short display
    }
    // --- END TEMPORARY DEBUGGING ELEMENT REMOVAL ---
}

// --- Message Handling ---
function showMessage(msg, isError = true) {
    messageDisplay.textContent = msg;
    messageDisplay.style.color = isError ? '#ff4d4d' : '#4CAF50'; // Red for error, Green for success
    // Clear message after a short delay if it's an error
    if (isError) {
        setTimeout(() => {
            messageDisplay.textContent = '';
        }, 2000); // Shorter display for error messages
    }
}

// --- Keyboard Initialization and Interaction ---
function initializeKeyboard() {
    const keyboardLayout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ];

    keyboardLayout.forEach(rowKeys => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');

        rowKeys.forEach(keyText => {
            const keyButton = document.createElement('div');
            keyButton.classList.add('keyboard-key');
            keyButton.id = `key-${keyText}`; // Assign ID for easy lookup later
            keyboardKeys[keyText] = keyButton; // Store reference

            if (keyText === 'ENTER') {
                keyButton.classList.add('wide');
                keyButton.textContent = keyText; // Keep ENTER text
            } else if (keyText === 'BACKSPACE') {
                keyButton.classList.add('wide');
                // Use an SVG for the backspace icon
                keyButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#e4e4e4">
                        <path d="M22 3H7c-.69 0-1.23.35-1.59.88L1 12l4.41 8.12c.36.53.9.88 1.59.88h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"/>
                    </svg>
                `;
            } else {
                keyButton.textContent = keyText; // For regular letters
            }

            keyButton.addEventListener('click', () => {
                // Simulate a keyboard event when a virtual key is clicked
                // This allows us to reuse the existing handleKeyboardInput logic
                const event = { key: keyText };
                if (keyText === 'ENTER') {
                    event.key = 'Enter'; // Match event.key for 'Enter'
                } else if (keyText === 'BACKSPACE') {
                    event.key = 'Backspace'; // Match event.key for 'Backspace'
                }
                handleKeyboardInput(event);
            });
            rowDiv.appendChild(keyButton);
        });
        keyboardContainer.appendChild(rowDiv);
    });
}

// ... (handleKeyboardInput, addLetter, deleteLetter, submitGuess, checkGuess, etc. functions - UNCHANGED) ...

// --- Typing and Deleting Letters (Direct to Grid & Keyboard) ---
function handleKeyboardInput(event) {
    if (gameEnded) {
        // Prevent any key input if the game has ended
        event.preventDefault();
        return;
    }

    const key = event.key.toUpperCase(); // Convert key to uppercase for consistency

    // Only allow single letters, Backspace, and Enter
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
        addLetter(key);
        event.preventDefault(); // Stop default browser actions like tabbing
    } else if (key === 'BACKSPACE') {
        deleteLetter();
        event.preventDefault(); // Stop browser back navigation
    } else if (key === 'ENTER') {
        submitGuess();
        event.preventDefault(); // Stop default form submission or other enter behaviors
    }
}

function addLetter(key) {
    if (currentLetterPos < WORD_LENGTH) {
        const currentBox = document.getElementById(`box-${currentGuessIndex}-${currentLetterPos}`);
        currentBox.textContent = key;
        currentBox.classList.add('filled', 'pop');
        // Remove pop class after animation to allow it to play again
        currentBox.addEventListener('animationend', () => {
            currentBox.classList.remove('pop');
        }, { once: true });
        currentLetterPos++;
    }
}

function deleteLetter() {
    if (currentLetterPos > 0) {
        currentLetterPos--;
        const currentBox = document.getElementById(`box-${currentGuessIndex}-${currentLetterPos}`);
        currentBox.textContent = '';
        currentBox.classList.remove('filled'); // Remove filled border
    }
}

// --- Guess Submission ---
async function submitGuess() {
    if (currentLetterPos !== WORD_LENGTH) {
        showMessage(`Guess must be ${WORD_LENGTH} letters long!`);
        shakeRow(document.getElementById(`row-${currentGuessIndex}`));
        return;
    }

    const currentGuess = getCurrentGuessWord();
    // CHANGED: Use the comprehensive VALID_WORDS_SET
    if (!VALID_WORDS_SET.has(currentGuess)) {
        showMessage('Not a valid word!');
        shakeRow(document.getElementById(`row-${currentGuessIndex}`));
        return;
    }

    // Clear any previous messages before processing guess
    showMessage('', false); // Clear with non-error color initially

    await checkGuess(currentGuess);
}

function getCurrentGuessWord() {
    let guess = '';
    for (let i = 0; i < WORD_LENGTH; i++) {
        const box = document.getElementById(`box-${currentGuessIndex}-${i}`);
        guess += box.textContent;
    }
    return guess;
}

// Apply shake animation to a row
function shakeRow(rowElement) {
    rowElement.classList.add('shake');
    rowElement.addEventListener('animationend', () => {
        rowElement.classList.remove('shake');
    }, { once: true });
}

// Check the guess against the secret word and update the UI
async function checkGuess(guess) {
    const secretWordLetters = SECRET_WORD.split('');
    const guessLetters = guess.split('');
    const letterStatus = Array(WORD_LENGTH).fill(''); // To track status for each letter

    // Create a mutable copy of secret word characters to "consume" them
    let tempSecret = [...secretWordLetters];

    // First pass: Mark correct (green) letters and consume them from tempSecret
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessLetters[i] === tempSecret[i]) {
            letterStatus[i] = 'correct';
            tempSecret[i] = null; // Mark as consumed
        }
    }

    // Second pass: Mark present (yellow) and absent (gray) letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (letterStatus[i] === 'correct') {
            continue; // Already handled
        }

        const char = guessLetters[i];
        const indexInSecret = tempSecret.indexOf(char);

        if (indexInSecret !== -1) {
            letterStatus[i] = 'present';
            tempSecret[indexInSecret] = null; // Consume this letter from the secret word
        } else {
            letterStatus[i] = 'absent';
        }
    }

    // Apply classes with a delay for flip animation and update keyboard
    const rowElements = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
        rowElements.push(document.getElementById(`box-${currentGuessIndex}-${i}`));
    }

    const FLIP_DURATION = 200; // CHANGED: Faster flip duration in ms (was 300)

    for (let i = 0; i < WORD_LENGTH; i++) {
        const box = rowElements[i];
        const letter = guessLetters[i];
        const status = letterStatus[i];
        const keyboardKey = keyboardKeys[letter]; // Get reference to the virtual keyboard key

        box.classList.add('flip'); // Add flip class to trigger the animation

        // Wait for the animation to start and reach halfway before changing color
        // CHANGED: Reduced delay for faster animation
        await new Promise(resolve => setTimeout(resolve, FLIP_DURATION / 2));

        box.classList.remove('filled'); // Remove the filled border before applying color
        box.classList.add(status); // Apply the final color class to the letter box

        // Update keyboard key color, only if the new status is 'better' than current
        // 'correct' > 'present' > 'absent' > default
        if (keyboardKey) {
            if (!keyboardKey.classList.contains('correct')) { // If not already green
                if (status === 'correct') {
                    keyboardKey.classList.remove('present', 'absent');
                    keyboardKey.classList.add('correct');
                } else if (status === 'present' && !keyboardKey.classList.contains('present')) { // If not already yellow or green
                    keyboardKey.classList.remove('absent');
                    keyboardKey.classList.add('present');
                } else if (status === 'absent' && !keyboardKey.classList.contains('present') && !keyboardKey.classList.contains('correct')) {
                    keyboardKey.classList.add('absent');
                }
            }
        }

        // Wait for the second half of the animation to complete
        // CHANGED: Reduced delay for faster animation
        await new Promise(resolve => setTimeout(resolve, FLIP_DURATION / 2));
    }


    // Check for win/lose conditions after all animations are complete
    setTimeout(() => {
        if (guess === SECRET_WORD) {
            winGame();
        } else if (currentGuessIndex === MAX_GUESSES - 1) {
            loseGame();
        } else {
            currentGuessIndex++;
            currentLetterPos = 0; // Reset letter position for next guess
        }
    // CHANGED: Reduced delay here slightly to follow animation faster
    }, FLIP_DURATION / 2);
}

// --- Game End Handling ---
function showModal(content) {
    modalContent.innerHTML = content;
    overlay.classList.remove('hidden');
    // Ensure modal is shown before adding the fade-in class
    setTimeout(() => {
        modal.classList.add('fade-in');
    }, 10);
}

function hideModal() {
    modal.classList.remove('fade-in');
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 300); // Match animation duration
}

function winGame() {
    gameEnded = true;
    showMessage('Awesome! You got it!', false);
    setTimeout(() => { // Small delay before showing modal after last animation
        showModal(`
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You guessed the word: <strong>${SECRET_WORD}</strong></p>
            <p>You are inception ready, register now!</p>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1" target="_blank">Register Here!</a>
        `);
    }, 1200); // Delay after last box flip completes
}

function loseGame() {
    gameEnded = true;
    showMessage('Game Over!', true);
    setTimeout(() => { // Small delay before showing modal after last animation
        showModal(`
            <h2>😔 Game Over 😔</h2>
            <p>You ran out of guesses!</p>
            <p>The word was: <strong>${SECRET_WORD}</strong></p>
            <a href="#" onclick="location.reload(); return false;">Play Again</a>
        `);
    }, 1200); // Delay after last box flip completes
}


// --- Event Listeners ---
// Listen for ALL keyboard input on the document (for desktop, or if mobile keyboard is manually invoked)
document.addEventListener('keydown', handleKeyboardInput);
closeModalButton.addEventListener('click', hideModal);

// Initialize the game when the page loads
initializeBoard(); // This now also calls initializeKeyboard
