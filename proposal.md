# CS4241 Final Project - Memory Flashcard Webapp

## Members:
Khuyen Cao, Quyen Hoang, Hung Hong, Hannah Jauris

## Overall description:
- The user will create a profile on this website where you can upload your picture, name, and choose account type (professor or student). All accounts can modify their information (picture and name only, not account type).
- All accounts will share a list of available courses. Each account will have their own personal list of courses they are enrolled in or teaching. A “professor” account can modify (add, update or remove) an available course they are teaching in their personal list. A “student” account can only modify their personal list.
- All the information of users who have the same course in their personal list, both professor and student, will be added to the course database and will be able to play the flashcard game to get to know others enrolled in the class. This is a single player game that creates multiple choice quizzes where you need to match the correct picture with name and vice versa. There will be a timer and score to keep track of your progress. The highest score will be saved and updated when you play the game.
- There is a “View all” option where the user can take a look at the list of all people in the same courses and search for a certain name.

## Potential expansion of the project:

### Technical achievements:
- Handle different types of players through appropriate web interface (e.g. teacher’s account has more options to customize the game)
- Include the possibility of guest/spectator account which does not need to register, can view the game but cannot participate in it
- Create different modes (easy-medium-hard) for the game where the time limit for each mode differs.
- Different variation of the original quiz where you have to match a list of names to a list of pictures.
- Additional multiplayer mode where you can compete to see who has the highest score.
- Collect the data of the 10 highest score and create a “Hall of fame” page with the name of the users and their highest score.
- Live search for sorting through the View all list.
- Pop up explanation of the game before it starts.
- Q&A form page.
- Sound panel to handle volume of the music/sound and the option to mute

### Design achievements:
- The overall theme, colors, interface that is eye-catching and user-friendly.
- Use Bootstrap to make the site even more eye-catching
- Different types of users will have different theme/layout (to differentiate)
- The image can flip and show information flashcard-like when browsing through the list.
- Sound effects to make the game fun to play and elevate game experience
- If we were to initiate the “match a list of name to a list of pictures” variation, the card can be dragged and drop into place.

## What we are planning to use:
HTML, CSS, Bootstrap, AJAX, JavaScript, jQuery, Postgres
