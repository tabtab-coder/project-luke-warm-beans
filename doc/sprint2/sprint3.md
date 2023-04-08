# Sprint 3 Planning Meeting:

## Sprint Goal:
Our instructors should be able to create content for their courses. Students will be able to give their feedback on the courses they are enrolled in. NPOs will also get some distinct functionality.

## Spikes
Researching best ways to handle course content models and API interaction
Team members will try to get caught up on frontend/backend depending on which one they are least familiar with

## Team Capacity:
7 people ~ 65 story points

## Participants:
Batu, Case, darryI, Gordie, Joseph, Martin, Obaida

## User stories to complete:
### Add new quizzes and assignments as teacher for students [LUK-32]
User Story: As an Instructor (Zachary), I want the ability to put new quizzes or tests or assignments on the platform. This way students can test themselves and I can mark these to see which material the students are having problems with.
Creating/Editing courses should mirror course creation
Acceptance Criteria: Instructors should be able to create quizzes for students taking that course. Quizzes should just be multiple choice for now to allow auto-grading. Quizzes can be modified. Quizzes can be hidden from students (published option)

### Add ability to provide feedback on courses [LUK-10]
User Story: As a student (Jessica), I would like to be able to provide feedback to instructors on their courses so that they can make improvements for the future, thus improving overall course quality on U Impactify
Acceptance Criteria:
Given that I am logged in as a student and have paid for a course, when I take that course, then I should be learn whatever skills that course is teaching.
- Feedback left for a course should be deleted if a user's account is deleted
- If a course is deleted all feedback for that course should be deleted (in the database)
- Feedback model stores a reference to the course it was posted on
- On the course landing page there should be a form for submitting feedback
- - the form should require the following information:
- - The comment field and a checkbox for choosing whether the feedback will be public or private (viewable only by instructor)
- Feedback left for a course should have the option of being private or public
public feedback can be seen on the course page as a list of comments
private feedback also shows up on the course page but is only viewable by the instructor. (comments should have a visual indicator to show they are private)
- Feedback can not be deleted (no deletion)
- Feedback can not be changed from public to private (no update) 

### Add endorsing courses as a NPO [LUK-11]
User Story: As a user affiliated with an NPO (Josephine), I want the ability to endorse courses that teach content relevant and useful to my organization. This allows me to help potential volunteers gain skills needed at my organization without having to create the course myself.
 Acceptance Criteria: The user affiliated with an NPO should be able to click a button to endorse a course while browsing it's landing page. Once endorsed, the course should display on their homepage showing that they are endorsed by this specific NPO.

### Add ability to take courses [LUK-17]
User Story: As a student (Jessica), I want to be able to take a course on U Impactify after paying the required course fee so that I can learn new skills and generally acquire relevant knowledge in the non-profit sector.
Acceptance Criteria: Given that I am logged in to U Impactify as a student, when I pay for a course and take that course, I should be able  to learn the expected skills.
Create job posting as NPO [LUK-61]
User Story: As a member of an NPO I would like to be able to create a job posting for my organization, this will allow to find users of Impactify that are a good fit for my organization. 
Acceptance Criteria: There should be a creation form available in the NPO's dashboard for creating job postings. This posting should be editable

### Add a student dashboard [LUK-55]
User Story: As a student (Jessica), I want to see all of my relevant profile information when I login to U Impactify. This will provide a nice entrypoint to the platform and will help me keep track of my courses and join new ones.
Acceptance criteria: Students arrive on a user-specific 'dashboard' page upon logging in to the platform. Students can view courses they are signed up for.

## Task breakdown:
We created subtasks for each user story (on jira), primarily focusing on splitting tasks into a frontend (React) and backend (model / controller) portion. 
 
User Story tickets do not have a particular assignee, and instead we assign subtasks to a specific person and take collective ownership of the root (user story) ticket.

