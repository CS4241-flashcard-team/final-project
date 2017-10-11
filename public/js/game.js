// Example questions to test the code without database
var question1 = {
    answer: "pikachu",
    img: "https://i.ytimg.com/vi/iYyDbVUWgTI/hqdefault.jpg",
    choices: ["pikachu", "squirtle", "charmander", "bulbasaur"]
};
var question2 = {
    answer: "android",
    img: "http://www.jrtstudio.com/sites/default/files/ico_android.png",
    choices: ["android", "apple", "windows", "blackberry"]
};
var question3 = {
    answer: "25 / 5",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Dice-5.png",
    choices: ["1 + 3", "10 * 10", "25 / 5", "9 - 6"]
};

// Array of question - change it later
var aoq = [question1, question2, question3];

// Variable to keep
var choice = [maxQuestion];
var currentQuestion = 0;
var maxQuestion = 3; // Update this to 10 later when everything works

// Prepare question from the struct 'question' passed in
// Update image, question choices accordingly
function prepareQuestion(question) {
    // Prepare array of choices
    var aoc = shuffleArray(question.choices);

    // Assign value to choice
    document.getElementById("c1").value = aoc[0];
    document.getElementById("c2").value = aoc[1];
    document.getElementById("c3").value = aoc[2];
    document.getElementById("c4").value = aoc[3];

    // Assign label to choice
    // Need to change to show full name instead - NOTE!
    document.getElementById("l1").innerHTML = aoc[0];
    document.getElementById("l2").innerHTML = aoc[1];
    document.getElementById("l3").innerHTML = aoc[2];
    document.getElementById("l4").innerHTML = aoc[3];

    // Assign question number
    document.getElementById("qnum").innerHTML = (currentQuestion + 1).toString();

    // Clear all check
    document.getElementById("c1").checked = false;
    document.getElementById("c2").checked = false;
    document.getElementById("c3").checked = false;
    document.getElementById("c4").checked = false;

    // Assign image for question
    document.getElementById("avatar").src = question.img;
}

// Shuffle an array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// Analyze the choice, check whether it is a correct choice
function analyzeChoice() {
    // Get answer from choices
    var ans = "";
    if (document.getElementById("c1").checked === true) {
        ans = document.getElementById("c1").value;
    } else if (document.getElementById("c2").checked === true) {
        ans = document.getElementById("c2").value;
    } else if (document.getElementById("c3").checked === true) {
        ans = document.getElementById("c3").value;
    } else if (document.getElementById("c4").checked === true) {
        ans = document.getElementById("c4").value;
    }

    // Decide whether it is correct
    choice[currentQuestion] = (aoq[currentQuestion].answer === ans);

    // Update to next question
    if (currentQuestion < maxQuestion - 1) {
        currentQuestion++;
        prepareQuestion(aoq[currentQuestion]);
        clearTimeout(timeoutHandle);
        countdown();
    } else if (currentQuestion === maxQuestion - 1) {
        clearTimeout(timeoutHandle);
        displayResult();
    }
}

// Display result and hide everything else
function displayResult() {
    // Show result screen
    document.getElementById("result_screen").removeAttribute("hidden");

    // Hide other game elements
    document.getElementById("game_element").setAttribute("hidden", "");
    document.getElementById("game_zone").setAttribute("hidden", "");

    // Insert result into table
    for (i = 0; i < maxQuestion; i++) {
        document.getElementById("img"+(i+1).toString()).innerHTML = "<img src='" + aoq[i].img + "' />"
        document.getElementById("ca"+ (i+1).toString()).innerHTML = aoq[i].answer;
        document.getElementById("ya" + (i + 1).toString()).innerHTML = choice[i];
    }
}

// Countdown clock for the game
var timeoutHandle;
function countdown() {
    var seconds = 20;
    function tick() {
        seconds--;
        document.getElementById("timer").innerHTML = String(seconds);
        if (seconds > 0) {
            timeoutHandle = setTimeout(tick, 1000);
        }
        if (seconds === 0) {
            choice[currentQuestion] = false;
            if (currentQuestion < maxQuestion - 1) {
                currentQuestion++;
                prepareQuestion(aoq[currentQuestion]);
                clearTimeout(timeoutHandle);
                countdown();
            } else if (currentQuestion === maxQuestion - 1) {
                clearTimeout(timeoutHandle);
                displayResult();
            }
        }
    }
    tick();
}
countdown();


// Add event listeners to elements of page
document.addEventListener('DOMContentLoaded', prepareQuestion(aoq[currentQuestion]), false);
document.getElementById("nextbtn").addEventListener("click", analyzeChoice);