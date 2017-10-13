# CS4241 Final Project Evaluations - Memory Flashcard Webapp - Game of Faces

## Members:
Khuyen Cao, Quyen Hoang, Hung Hong, Hannah Jauris

## Evaluation 1:
- **Evaluation**:
    - Evaluator 1 was given the tasks of creating a student account, joining a class, viewing the class list, then playing the matching game
    - He created the account with little difficulty in finding the sign-up page and filling out the information
    - When joining a class, there was some difficulty finding the course he wanted since only the course code was displayed on the list, not the name of the course
    - He commented on how he appreciated when there was a pop-up prompting login or course selection, everything except for the pop-up darkened to draw focus to the pop-up
    - He also found the sign-up form’s automatic checking on keyup for if the username existed and if the passwords matched useful and helpful
    - In the game, he easily understood the interface and what to do, correctly being able to select an option and move to the next question
    - At the end, he understood the results screen and how the questions with red backgrounds were ones he had gotten incorrect
    - Overall, the experience went well with only minimal confusion that has since been addressed.
- **Modification**:
    - Join class menu was updated to include both course code and course name. The menu is sorted by course code

## Evaluation 2:
- **Evaluation**:
    - Evaluator 2 tried to introduce errors to our page to find bugs
    - When he logged in with an invalid username, the error alert showed up with a mysterious ‘undefined’ line on top of it
    - When he signed up with an empty First Name or Last Name, the page did not catch that error and crashed because the server was expecting some input
    - He also tried to navigate to other pages (for example: class catalog) without having logged in, which he was able to do even though he should not
    - He really liked that when he closed the page without logging out and returned to the main page, he was still logged in and was redirected to the dashboard
    - Lastly, when he tried to play the game with a course where he was the only member, the game was blank since there were no other members in the course
- **Modification**:
    - Fixed mysterious `undefined` line. (We found out it was because the html string was not initialized)
    - Added functions to prevent users from being able to submit empty forms and shows alerts accordingly
    - Added redirection to `index.html` if user is not logged in
    - Added constrains so that the game is only playable when there are at least 4 members in the course

## Evaluation 3:
- **Evaluation**:
    - Evaluator 3 succesfully signed up with all proper error messages displayed
    - He really liked the check password matching twice feature of the sign up form
    - He noticed that the side navigation bar moved along with pages and created weird blank space, which was distracting
    - When he wanted to edit his profile, the current username and pictures showed up but the first and last name forms were not prefilled. He suggested that we add this to make updating the name easier and we did
    - He was able to join a course without any confusion and enjoyed the dropdown menu to pick courses from
    - The view class catalog and game options worked fine but he noted a thin white space at top of the game page when he played the game
    - During the game, he suggested we add an actual “Back" button to quit the game instead of clicking back in the browser.
- **Modification**:
    - Changed side navbar to a navbar at the top of the page
    - Made user's firstname and lastname pre-filled to be more user friendly
    - Removed thin white space at the top of game page
    - Added "Back" button to both the game page and the course catalog page

## Evaluation 4:
- **Evaluation**:
    - Evaluator 4 was struggling to choose a course folder to play the game because the folders were in no particular order
    - She was also confused when she tried to update her profile information. Her information was updated successfully and was reflected on the page. However, since the page stayed the same, she thought that the update was unsuccessful (she was expecting the page to jump to the top)
    - Additionally, when she tried to update her image with a different file extension (original was .jpg and new was .png), her profile pic returned an error because it was expecting the old file extension
    - She also noted that the profile picture update time was very slow
    - She really liked the course catalog as it was divided into a professor section and a student section and all students were sorted by Last Name
    - She also really liked that the pages follow a set of color schemes
- **Modification**:
    - Made course folders sorted by course code
    - Made Update profile page jump to the top when the user successfully updates their info
    - Adjusted to have page accept both .jpg and .png
    - Improved profile picture update timing

## Evaluation 5:
- **Evaluation**:
    - Evaluator 5 signed up, signed out, edited the profile and logged back in successfully (all the warning alerts showed up as expected)
    - She gave minor comments to the game description in the home page
    - She liked the fonts of the website but suggested that the `<h2>` should be a bit bigger
    - Looking at the dashboard, she suggested that we should add a leave button under the course folder, in case the user is done with the course and wants to keep their dashboard clean
    - She also gave compliments to the Course Catalog page, with the display of the professor bigger and at the top
    - The game ran smoothly for her but she suggested the incorrect results in the end should be highlighted to draw attention
- **Modification**:
    - Revised game description to make it clearer and more concise
    - Changed font size
    - Added a button to leave the course for every course in the dashboard
    - Made all the incorrect answers highlighted in red now