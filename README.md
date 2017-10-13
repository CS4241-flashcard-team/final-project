# CS4241 Final Project - Memory Flashcard Webapp - Game of Faces

## Members:
Khuyen Cao, Quyen Hoang, Hung Hong, Hannah Jauris

## Overall Description:
- The user can:
    - Sign up, login, and update their profile information
    - Join a course if they are a student or create a course if they are a professor
    - View all the members of their enrolled course in a yearbook-like page to get to know their classmates or students
    - Play a multiple choice game with three different levels of difficulties to help with memorizing the names and faces of others in the course.

## Backend implementation:
### API
- All requests are documented  in `api.md`, which includes paths, required parameters, optional parameters, and examples
### Data storage:
- **Amazon S3**:
    - Actual images
- **PostgreSQL**: has 3 tables
    - users: username (Primary key), password, firstname, lastname, picname, acctype
    - courses: code (Primary key), name
    - enrollments: coursecode (Foreign key), username (Foreign key)
- **Local Storage**:
    - stores the `username` of the current logged in user
    - saves when the user has successfully logged in or signed up
    - clears when the user logs out
- **Session Storage**:
    - stores the `coursecode` of the chosen course
    - saves when the user clicks on the `Play` or `View Class` button

## How to navigate through the WebApp:

###	Main index page:
- The users can either log in if they already have their accounts or sign up for an account.
- A simple, overall description of the game is displayed here for people to better understand the functions of this website.
- Upon clicking Log In, the user enters their Username and password in the pop up form. An alarm message will display if any field is missing or incorrect. If the log in attempt is successful,
the user will be redirected to his or her account's dashboard.

### Sign up:
- When the user signs up through the sign-up form, they are required to enter a username, password, first and last name, and upload a profile image as well as set the account type (professor or student).
    - Professor: A “professor” account can modify (add, remove) an available course they are teaching in their personal list.
    - Student: A “student” account can choose to join from a list of available courses and modify (add, delete) their personal list.
- As the user types in their username, it is actively checked to ensure that it is a unique username, and a message is displayed alerting them if that username is already taken.
- Similarly, with the password, there is a password and password confirmation box. Whenever the user enters text into either box, they are checked to ensure they are the same, and a message is displayed if they do not match.
- When the sign up button is clicked, if any of the fields are not valid (i.e. already taken username, mismatching passwords, empty fields), the submit does not go through. In the case of already taken usernames and mismatching passwords, the color behind the text with the messages alerting the user to the problem changes to highlight the issue until the user provides acceptable input.
- The user will be redirected to the newly created account's dashboard.

### Your dashboard:
- If the users have already been enrolled in a course, a list of users' courses will show up in the dashboard. If not, this page is empty.
- The users can:
    - Join a course (if the account type is student): choose a course to join from a list of available courses.
    - Create a course (if the account type is teacher): create a course with name, select from a list of available department, course id, term and year of the course.
- After joining or creating courses, click-able folders of the course appear with the name of the course underneath. Upon clicking on the folder, the user can choose to view the course catalog or play the game.
- From the dashboard, you can either sign out or edit your profile in the navigation bar.

### Edit your profile:
- Click “Your Profile" in the top navigation bar to go to a page where the users have the option to change their current information.
- On this page, the user's current information (excepting the password) is displayed for the user to view. Below their information are fields to change their information.
- To update the password, the user is required to enter their old password, as well as the new password (twice to ensure they spelled it correctly). If the old password is incorrect or the new password does not match the password confirmation, the password will not be updated and messages will be displayed indicating their error.
- The name fields are pre-filled for user convenience, such as if they only want to change their last name and keep their first name the same. The profile image can be updated by uploading a new image.
- **Important**: The username and account type cannot be changed.

### The course catalog:
- Display a list of the professor on top and all students underneath with their names. After the user is done viewing the members of the class, clicking the back button at the top of the page navigates to the dashboard.

### The Game:
- This is a single player game that creates multiple choice quizzes where the user needs to match the correct picture with name. There will be a timer and numbered questions to keep track of the progress. There are three levels in the game and the timer will be shorter for each level (20, 10, and 5 seconds per question).
- The result will be displayed at the end with incorrect answers highlighted in red.
- Click back at the top of the page to be navigated to the dashboard if the user wants to quit or is done with the game.

###	Sign out:
- When closing the website and open it back, you will still be automatically logged in. Sign out to return to the home page.

## FAQ:
#### What type of image file can I upload to the website?
Currently, we only support images under .jpg and .png format.
#### Can I upgrade my account type later after I have created one?
Unfortunately, there is not an option to update your account type. If you want to switch your role, please create a new profile to have different options.
#### How many people should there be in a course for me to start playing the game?
If your courses only have less than 4 members, you cannot play the game. However, you can still view all the members of your course in the course catalog.

## Technical achievements:
- **Robust interface**: supports different types of users, in particular student account has the ability to join existing courses, while teacher account has the ability to create new courses for students to join.
- **3 different game modes**: Easy, Medium, and Hard. Mode can be selected as the user chooses to play the game from one course. The greater the difficulty, the less time the user has for each question.
- **Game interactive elements**: namely live countdown, sound effects and background music. These elements improve the experience of the user while playing the game and help a lot in making the game fun to play.
- **4 types of data storage**:
    - All information regarding courses, students, etc. are retrieved from Postgres Database
    - Images are uploaded to and retrieved from Amazon S3
    - Uses session storage for the course catalog and game pages to know which course has been chosen to update the data accordingly.
    - Uses local storage to retain which user is currently logged in, in order to access personalized information such as course lists or profile information. The username is stored when the user logs in or signs up, and is cleared when the user logs out.
- **Live input field checking**:
    - For the sign up page, while the user fills in the fields for the username and password, it is actively checked to make sure the user has not typed in a username already contained within the database, and that the two password fields (password and confirmation) are the same
    - Similarly, the profile page also has the same checking for passwords, and ensures the old password they entered is correct before updating to the new password.
- **Game constrains**: The game can only be played if the corresponding course have more than 4 members.
- **Use of templates**: fill in and update data dynamically using templates

## Design achievements:
- **Sorted data representation**: The courses in the dashboard is sorted by course ID and the names in the class catalog is sorted by lastname.
- **Consistency**: Create an eye-catching and user-friendly website with consistent color and theme.
- **Logo**: Little logo of the website that is designed from scratch in Photoshop in the header.
- **Bootstrap**: to make the site even more eye-catching.
- **Font choice**: Imported google fonts for the whole webpage.
- **Automated image carousel**: shown in the index page when you first see the website.
- **Warning alarms**: pop up when information is missing or incorrect while logging in, signing up, and editing profile.
- **Pre-filled forms**: pull and display old information (including image) when you choose to edit your profile to be more user friendly
- **Familiar page behavior**: When profile information is updated, the page jumps back to the top rather than being unresponsive and not moving.
- **Clickable image buttons**: show a pop up modal onclick with drop-down selection for both “Join course" and “Create course"
- **Dashboard course folders design**: Add corresponding course name, id, and big red leave button for courses for better user-experience.
- **Button color scheme choice**: Different colored buttons for three difficulty levels for better user experience.
- **Yearbook-style format course catalog**:
    - The professor is displayed bigger on top and students underneath
    - Every one is presented in a thumbnail, with corresponding full name and profile picture
- **Back button**: to easily navigate between game, profile, catalog page and the main dashboard.
- **Sound effects**: to make the game fun to play and elevate game experience.
- **Highlighted timer**: to draw attention during the game.
- **Game result display**:
    - Display results in a table format
    - Incorrect answers are highlighted in red
    - Display user's answer and correct answer side by side to help user better memorize their classmates or professor name and face

## What we used in this project:
HTML, CSS, Bootstrap, AJAX, JavaScript, jQuery, Postgres
