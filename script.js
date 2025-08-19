document.addEventListener('DOMContentLoaded', () => {
    // List of words to be spelled
    const words = [
        "apple", "banana", "cat", "dog", "elephant",
        "flower", "guitar", "house", "internet", "jacket"
    ];

    let currentWord = "";
    let score = 0;
    let timer;
    let timeLeft = 10; // Time in seconds for each round

    // New API-related variables
    const speech = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();

    const speakButton = document.getElementById('speak-button');
    const userInput = document.getElementById('user-input');
    const submitButton = document.getElementById('submit-button');
    const nextButton = document.getElementById('next-button');
    const feedback = document.getElementById('feedback');
    const scoreDisplay = document.getElementById('score-display');
    const timerDisplay = document.getElementById('timer-display');

    // Function to get a random word from the list
    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    }

    // Function to speak the word using the API
    function speakWord() {
        utterance.text = currentWord;
        speech.speak(utterance);
    }

    // Function to start a new round
    function startNewRound() {
        clearInterval(timer);
        timeLeft = 10;
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        currentWord = getRandomWord();
        speakWord(); // Speak the word automatically at the start

        userInput.value = "";
        feedback.textContent = "";
        userInput.disabled = false;

        submitButton.style.display = 'block';
        nextButton.style.display = 'none';

        userInput.focus();

        startTimer();
    }

    // Function to update the score
    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = `Score: ${score}`;
    }

    // Function to start the timer
    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time: ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                endRound(false);
            }
        }, 1000);
    }

    // Function to end the round (correct or incorrect)
    function endRound(isCorrect) {
        clearInterval(timer);
        userInput.disabled = true;

        if (isCorrect) {
            feedback.textContent = "Correct! Well done!";
            feedback.classList.remove('incorrect');
            feedback.classList.add('correct');
            updateScore(10);

            submitButton.style.display = 'none';
            nextButton.style.display = 'block';
        } else {
            feedback.textContent = `Time's up! The correct spelling was "${currentWord}".`;
            feedback.classList.remove('correct');
            feedback.classList.add('incorrect');
            submitButton.style.display = 'none';
            nextButton.style.display = 'block';
        }
    }

    // Event listener for the submit button
    submitButton.addEventListener('click', () => {
        const userSpelling = userInput.value.trim().toLowerCase();
        if (userSpelling === currentWord) {
            endRound(true);
        } else {
            feedback.textContent = `Incorrect. The correct spelling was "${currentWord}".`;
            feedback.classList.remove('correct');
            feedback.classList.add('incorrect');
        }
    });

    // Event listener for the next word button
    nextButton.addEventListener('click', () => {
        startNewRound();
    });

    // Event listener for the "Play Word" button
    speakButton.addEventListener('click', () => {
        speakWord();
    });

    // Allow user to press 'Enter' key to submit
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            submitButton.click();
        }
    });

    // Initial call to start the game
    startNewRound();
});

