# Sprint 4 Planning Meeting

## Sprint Goal:
Add unique features like profile pictures, automatic quiz grading and analytics as well as UI updates

## Spikes
Figure out how to store pictures in MongoDB
Figure out how to track analytics for frontend interaction

## Team Capacity:
7 people ~ 50 story points

## Participants:
Batu, Case, darryI, Gordie, Joseph, Martin, Obaida

## User stories to complete:
### Add profile pictures for users [LUK-94]
As a user, I want to be able to provide a profile picture so people can see what I look like and relate better as a human being. This would provide a more comfortable environment for interacting with other users.
Acceptance Criteria:
A user will have a default profile picture on account creation
A user can upload a profile picture at any time, to update their account photo
Profile picture should be displayed on dashboard
Profile picture should be displayed instead of listing users generally (eg. list of organizations endorsing courses, users that created feedback)

### Interact with and complete quizzes [LUK-62]
User Story:
As a Student, I need to be able to interact with the quizzes created by my instructor for the courses I'm taking, still enables me to test my knowledge to the instructor.
Acceptance Criteria:
Should be able to click a button to start a new quiz
Students should be able to input their answers into text boxes and see all questions
there should be a submit button at the bottom of the page 
Answers from the user should be saved on the database 
Students should be able to see their answers for quizzes they previously took but they shouldn't be able to resubmit

### Add the ability to automatically grade tests and quizzes [LUK-23]
User Story:
As an Instructor (Zachary), I want the ability to grade a large number of students with efficiency. This will allow me to focus my time on improving my course, as well as giving direct feedback to the students who need more focused teaching.
Acceptance Criteria:
Zachary should be able to submit his answers to a quiz or test to be used as an answer sheet for automatic grading
A student taking Zachary's course should be able to submit their answers to a quiz or test and receive instant grading

### Add analytical feedback for course instructors [LUK-18]
User Story:
As a course instructor, I want to be able to see some analytics on the students that are taking my course. I would like to be able to see how many people have clicked on the intro video / landing page for my course vs. how many people have signed up. This will let me know if I'm engaging with potential students.
Acceptance Criteria:
From a course instructor's profile, the instructor should have access to an analytics page only they can access for their course
This page should display the information "# of clicks on intro video/ landing page vs. # of people signed up"

### Add an NPO dashboard [LUK-57]
As an organization (or member of an organization - Josephine), I want to see all of my relevant profile information when I login to U Impactify. This will provide a nice entrypoint to the platform and will help me keep track of my available job/volunteer opportunities and endorsed courses.
Acceptance criteria:
NPO members arrive on a user-specific 'dashboard' page upon logging in to the platform
NPO members can view courses they have endorsed

### Add an instructor dashboard [LUK-56]
As an instructor (Zachary), I want to see all of my relevant profile information when I login to U Impactify. This will provide a nice entrypoint to the platform and will help me keep track of my courses and create new ones.
Acceptance criteria:
Instructors arrive on a user-specific 'dashboard' page upon logging in to the platform

## Task breakdown:
We created subtasks for each user story (on jira), primarily focusing on splitting tasks into a frontend (React) and backend (model / controller) portion. 
 
User Story tickets do not have a particular assignee, and instead we assign subtasks to a specific person and take collective ownership of the root (user story) ticket.
