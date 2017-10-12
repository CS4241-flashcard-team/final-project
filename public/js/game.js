// Current course
var currentCourse = sessionStorage.getItem("courseCode");
var difficulty = sessionStorage.getItem("difficulty");


var aoq = [];               // Array of question
var aos = [];               // Array of students
var choice = [];            // Global array, save choice made during game
var currentQuestion = 0;    // Global variable, acts as itirator
var questionSize = 10;      // Default value, change if question is less than 10
var maxSeconds = 20;         // Default value, change according to difficulty
const maxQuestion = 10;     // Update this to 10 later when everything works
var timeoutHandle;          // Variable for timeout handling

// Change maximum time according to difficulty
switch (difficulty) {
    case "easy":
        maxSeconds = 21;
        break;
    case "normal":
        maxSeconds = 16;
        break;
    case "hard":
        maxSeconds = 11;
        break;
    default:
        maxSeconds = 21;
}

// Get the list of students in current course
function getStudentList() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    //xhr.open("GET", "/get?target=usersByCourseCode&courseCode=MU-101-A17&filter=student", true);
    xhr.open("GET", "/get?target=usersByCourseCode&courseCode="+currentCourse+"&filter=student", true);
    xhr.onload = function() {
        if (this.status === 200) {
            buildStudentsList(this.response);
            // Add event listeners to elements of page
            document.addEventListener('DOMContentLoaded', prepareQuestion(aoq[currentQuestion]), false);
            document.getElementById("nextbtn").addEventListener("click", analyzeChoice);
            document.getElementById("timer").innerHTML = String(maxQuestion);
            countdown();
        }
    };
    xhr.send();
}
getStudentList();

// Generate array of questions base on student list
function prepareArrayOfQuestions() {
    aoq = [];
    var temp = shuffleArray(aos);
    for (var i = 0; i < questionSize; i++) {
        var tempq = {answer: "", img: "", choices: []};
        tempq.answer = temp[i].fname + " " + temp[i].lname;
        tempq.img = temp[i].img;
        tempq.choices[0] = temp[i].fname + " " + temp[i].lname;

        var count = 0;
        for (var j = 0; j < questionSize; j++) {
            if (temp[j].fname + " " + temp[j].lname !== tempq.answer) {
                count++;
                //console.log(temp_choice[j]);
                tempq.choices[count] = temp[j].fname + " " + temp[j].lname;
            }
            if (count === 3) break;
        }
        aoq[i] = tempq;
        //console.log(aoq);
    }
}

// Pass student list into our array
function buildStudentsList(list) {
    for (var i = 0; i < list.length; i++) {
        var student = {name: "", fname: "", lname: "", img: ""};
        student.name = list[i].username;
        student.fname = list[i].firstname;
        student.lname = list[i].lastname;
        student.img = "https://s3.amazonaws.com/cs4241-fp/" + list[i].picname;
        aos[i] = student;
    }
    if (list.length > maxQuestion) {
        questionSize = maxQuestion;
    } else questionSize = list.length;
    prepareArrayOfQuestions();
}

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
    var array_temp = array;
    for (var i = array_temp.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array_temp[i];
        array_temp[i] = array_temp[j];
        array_temp[j] = temp;
    }
    return array_temp;
}

// Analyze the choice, check whether it is a correct choice
function analyzeChoice() {
    // Get answer from choices
    var ans = " ";
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
    if (ans !== " ") {
        choice[currentQuestion] = ans;
    } else choice[currentQuestion] = "No answer";

    // Update to next question
    if (currentQuestion < questionSize) {
        currentQuestion++;
        if (currentQuestion === questionSize) {
            clearTimeout(timeoutHandle);
            displayResult();
        } else {
            prepareQuestion(aoq[currentQuestion]);
            clearTimeout(timeoutHandle);
            countdown();
        }
    }
}

// Display result and hide everything else
function displayResult() {
    // Show result screen
    document.getElementById("result_screen").removeAttribute("hidden");

    // Hide other game elements
    document.getElementById("game_element").style.display = "none";
    document.getElementById("game_zone").style.display = "none";

    // Insert result into table
    for (i = 0; i < questionSize; i++) {
        document.getElementById("no"+ (i+1).toString()).innerHTML = i + 1;
        document.getElementById("img" +(i+1).toString()).innerHTML = "<img src='" + aoq[i].img + "' />";
        document.getElementById("ca"+ (i+1).toString()).innerHTML = aoq[i].answer;
        document.getElementById("ya" + (i + 1).toString()).innerHTML = choice[i];
        if (aoq[i].answer === choice[i]) {
        } else {
            document.getElementById("tab" + (i+1).toString()).style.backgroundColor = "#ffb3b3";
            document.getElementById("tab" + (i+1).toString()).onmouseover = function () {
                this.style.backgroundColor = "#ff9999";
            };
            document.getElementById("tab" + (i+1).toString()).onmouseout = function () {
                this.style.backgroundColor = "#ffb3b3";
            }
        }
    }
}

// Countdown clock for the game
function countdown() {
    var seconds = maxSeconds;
    function tick() {
        seconds--;
        document.getElementById("timer").innerHTML = String(seconds);
        if (seconds > 0) {
            timeoutHandle = setTimeout(tick, 1000);
        }
        if (seconds === 0) {
            choice[currentQuestion] = false;
            if (currentQuestion < questionSize) {
                currentQuestion++;
                if (currentQuestion === questionSize) {
                    clearTimeout(timeoutHandle);
                    displayResult();
                } else {
                    prepareQuestion(aoq[currentQuestion]);
                    clearTimeout(timeoutHandle);
                    countdown();
                }
            }
        }
    }
    tick();
}