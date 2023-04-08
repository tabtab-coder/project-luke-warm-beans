import click

import requests
import json

from flask import current_app, g, url_for
from flask.cli import with_appcontext

from uimpactify.cli.db import ADMIN_USER
from uimpactify.cli import auth_util
from uimpactify.cli import course_util
from uimpactify.cli import user_util
from uimpactify.cli import feedback_util
from uimpactify.cli import opportunity_util
from uimpactify.cli import quiz_util
from uimpactify.cli import page_util
from uimpactify.cli import analytics_util
from uimpactify.cli import submission_util

from uimpactify.controller import routes


@click.command("auth-test")
@with_appcontext
def auth_test():
    auth_run_test()

def auth_run_test():
    # Create a new user, sign in as the user, and delete the user
    user = {
        "email": "test_user@uimpactify.com",
        "password": "password",
        "name": "Jeffarious",
        "phone": "1112223333"
        }
    user_id = auth_util.signup(user)
    user_token = auth_util.login(user)
    user_util.get_self(user_token)
    user_util.delete_self(user_token)

@click.command("page-test")
@with_appcontext
def page_test():
    page_run_test()

def page_run_test():
    # this should fail because course with id "fakeid" does not exist
    page_util.update_count('~courses~fakeid')

    # create some courses for testing
    c1_json = { "name": "testCourseOne", }
    c2_json = { "name": "testCourseTwo", "published": True, }

    access_token = auth_util.login()
    c1 = course_util.create_course(access_token, c1_json)
    c2 = course_util.create_course(access_token, c2_json)

    # this should fail, id is real but course is not published
    page_util.update_count(f'~courses~{c1}')

    # this should pass, id is real and course is published
    # update the count 3 times
    for i in range(3):
        page_util.update_count(f'~courses~{c2}')
    
    # removing courses
    course_util.delete_course(access_token, c1)
    course_util.delete_course(access_token, c2)

@click.command("course-test")
@with_appcontext
def course_test():
    course_run_test()

def course_run_test():
    # CREATING SAMPLE DATA
    access_token = auth_util.login()

    # creating a separate instructor user
    inst_json = {
        "name": "test instructor",
        "email": "test_instructor@uimpactify.com",
        "password": "password",
        "roles": {"student": True, "instructor": True},
        }
    inst_id = auth_util.signup(inst_json)
    inst_token = auth_util.login(inst_json)

    # creating a test student
    s_json = {
        "name": "test student",
        "email": "test_student@uimpactify.com",
        "password": "password",
        }
    s_id = auth_util.signup(s_json)
    s_token = auth_util.login(s_json)

    # creating a test organization
    npo_json= {
        "name": "test organization", 
        "email": "test_organization@uimpactify.com", 
        "password": "password",
        "roles": {"organization": True},
        }
    npo = auth_util.signup(npo_json)
    npo_token = auth_util.login(npo_json)

    # creating a bunch of courses
    c1_json = { "name": "testCourseOne", }
    c2_json = { "name": "testCourseTwo", "published": True, }
    c3_json = { "name": "testCourseThree", "published": True, }

    c1 = course_util.create_course(access_token, c1_json)
    c2 = course_util.create_course(access_token, c2_json)
    c3 = course_util.create_course(inst_token, c3_json)

    # enroll a student in some courses
    course_util.enroll_student(s_token, c2)
    course_util.enroll_student(s_token, c3)

    # endorse a course
    course_util.endorse_course(npo_token, c2)

    # getting info on the created courses
    course_util.get_all_courses(access_token)
    course_util.get_all_published_courses()
    course_util.get_courses_by_instructor(inst_token)
    course_util.get_courses_with_student(s_token)
    course_util.get_orgs_endorsing_course(c2)

    # create feedback for some courses
    f1_json = {
        "comment": "Hello readers of this public feedback",
        "course": c2,
        "public": True
    }
    f1 = feedback_util.create_feedback(s_token, f1_json)

    f2_json = {
        "comment": "Hello instructor! Moo!",
        "course": c3,
        "public": False
    }
    f2 = feedback_util.create_feedback(s_token, f2_json)

    # getting the public feedback
    feedback_util.get_feedback(s_token, c2)
    # getting private feedback (empty)
    feedback_util.get_feedback(s_token, c3)
    # getting private feedback as instructor (not empty)
    feedback_util.get_feedback(inst_token, c3)

    # create test quizzes
    q1_json = { "name": "Empty Quiz (by Student)", "course": c1, }
    q2_json = {
        "name": "Quiz 1 for Course 3",
        "course": c3,
        "published": True,
        "quizQuestions": [
                {
                    "question": "What is real?",
                    "index": 1,
                    "options":
                        [
                            { "option": "everything", "index": 1, },
                            { "option": "nothing", "index": 2, }
                        ],
                    "answer": 2,
                },
                {
                    "question": "What is truth?",
                    "index": 2,
                    "options": [ { "option": "subjective", "index": 1 } ],
                    "answer": 1,
                },
                {
                    "question": "What is beauty?",
                    "index": 3,
                    "options": [ { "option": "fleeting", "index": 1 } ],
                    "answer": 1,
                }
            ],
        }
    q3_json = {
        "name": "Help, Admin, I had a problem adding a quiz!",
        "course": c2,
        "quizQuestions": [
                {
                    "question": "The answer to this question is (c)",
                    "index": "1",
                    "options":
                        [
                            {"option": "(a)", "index": 3, },
                            {"option": "(b)", "index": 1, },
                            {"option": "(c)", "index": 2, }
                        ],
                    "answer": 2,
                }
            ],
        }
    q4_json = { "name": "Empty Unpublished Quiz", "course": c3, }
    q5_json = { "name": "Empty Quiz (by Instructor)", "course": c1, "published": True, }

    # q1 should fail because students can't make courses
    q1 = quiz_util.create_quiz(s_token, q1_json)
    q2 = quiz_util.create_quiz(inst_token, q2_json)
    q3 = quiz_util.create_quiz(access_token, q3_json)
    q4 = quiz_util.create_quiz(inst_token, q4_json)
    q5 = quiz_util.create_quiz(access_token, q5_json)


    ## ANALYTICS

    analytics_util.get_quizzes(access_token, c2)
    analytics_util.get_enrolled(access_token, c2)
    safe_course_page = '~courses~' + c2
    page_util.update_count(safe_course_page)
    page_util.update_count(safe_course_page)
    page_util.update_count(safe_course_page)
    analytics_util.get_views(access_token, c2)

    ## END OF ANALYTICS


    # should only return q2 for valid case and q3 for admin override
    quiz_util.get_quizzes(access_token)

    quiz_util.get_quizzes_by_course(access_token, c3)
    quiz_util.get_quizzes_by_course(inst_token, c3)
    quiz_util.get_quizzes_by_course(s_token, c3)
    
    # last call fails
    quiz_util.get_quizzes_by_course(access_token, c2)
    quiz_util.get_quizzes_by_course(inst_token, c2)

    # anyone can get quizzes atm
    quiz_util.get_quiz(s_token, q2)
    quiz_util.get_quiz(inst_token, q2)
    quiz_util.get_quiz(access_token, q2)
    quiz_util.get_quiz(s_token, q3)

    q3_update = { "published": True, }

    # fails because inst is not the inst of the course q3 is originally in
    quiz_util.update_quiz(inst_token, q3, q3_update)
    # runs because admin privilege
    quiz_util.update_quiz(access_token, q3, q3_update)
    # q3 is published now
    quiz_util.get_quiz(access_token, q3)

    ## SUBMISSIONS

    sub1_json = {
        "quiz": q5,
        "answers": [ { "question": -1, "answer": -1, } ],
    }

    sub2_json = {
        "quiz": q2,
        "answers": [
            { "question": 1, "answer": 1, },
            { "question": 2, "answer": 1, },
            { "question": 3, "answer": 1, }
        ],
    }

    sub3_json = {
        "quiz": q3,
        "answers": [
            { "question": 1, "answer": 3, }
        ],
    }

    # sub1 fails because student is not in c1 which q1 is part of
    # sub4 fails because a user can only have one submission per quiz
    sub1 = submission_util.create_submission(s_token, sub1_json)
    sub2 = submission_util.create_submission(s_token, sub2_json)
    sub3 = submission_util.create_submission(s_token, sub3_json)
    sub4 = submission_util.create_submission(s_token, sub2_json)

    submission_util.get_user_submissions(s_token)
    submission_util.get_quiz_submission(s_token, q2)
    submission_util.get_quiz_submission(s_token, q3)
    # submissions will be deleted with quizzes according to cascade delete

    ## END OF SUBMISSIONS


    # mass method test +
    # show instrucotrs can update their own quizzes
    q6_json = { "name": "testQuizFive", "course": c3, }
    q6 = quiz_util.create_quiz(inst_token, q6_json)
    quiz_util.get_quiz(access_token, q6)
    q6_update = { "published": True, }
    quiz_util.update_quiz(inst_token, q6, q6_update)
    quiz_util.get_quizzes_by_course(inst_token, c3)
    quiz_util.delete_quiz(inst_token, q6)
    quiz_util.get_quiz(access_token, q6)
    # other quizzes wil be deleted with courses according to cascade delete

    # CLEAN UP
    # disenroll a student
    course_util.disenroll_student(s_token, c2)

    # removing the new users
    user_util.delete_self(inst_token)
    user_util.delete_self(s_token)
    user_util.delete_self(npo_token)

    # removing new courses
    course_util.delete_course(access_token, c1)
    course_util.delete_course(access_token, c2)

    # getting all courses again to show that they are gone
    course_util.get_all_courses(access_token)


@click.command("opportunity-test")
@with_appcontext
def opportunity_test():
    opportunity_run_test()

def opportunity_run_test():
    # CREATING SAMPLE DATA
    access_token = auth_util.login()

    # creating a separate instructor user
    org_json = {
        "name": "organization person",
        "email": "organization_person@uimpactify.com",
        "password": "password",
        "roles": {"student": True, "organization": True},
        }
    org_id = auth_util.signup(org_json)
    org_token = auth_util.login(org_json)

    # Add opportunities
    O1_json = {
        "paid": False,
        "description": "bad job that doesnt pay",
        "published": True
    }
    O1 = opportunity_util.create_opportunity(org_token, O1_json)

    O2_json = {
        "paid": True,
        "description": "good job that make me richie",
        "published": True
    }
    O2 = opportunity_util.create_opportunity(org_token, O2_json)

    O3_json = {
        "paid": True,
        "description": "happier job that makes me happier but isnt published yet :(",
        "published": False
    }
    O3 = opportunity_util.create_opportunity(org_token, O3_json)

    opportunity_util.get_opportunities_by_org(org_token)

    # CLEAN UP

    # removing the new users
    user_util.delete_self(org_token)

@click.command("user-test")
@with_appcontext
def user_test():
    user_run_test()

def user_run_test():
    # Create instructors
    inst1_json = {
        "name": "Cool instructor!",
        "email": "testInstructor@uimpactify.com",
        "password": "password",
        "roles": {"student": True, "instructor": True},
        }
    inst1 = auth_util.signup(inst1_json)
    inst1_token = auth_util.login(inst1_json)

    # Create NPOs
    npo1_json = {
        "name": "Cool organization!",
        "email": "testNPO@uimpactify.com",
        "password": "password",
        "roles": {"organization": True},
        }
    npo1 = auth_util.signup(npo1_json)
    npo1_token = auth_util.login(npo1_json)

    # SETUP COURSES
    # Create courses taught by different instructors (with some being published)
    c1_json = { "name": "Course One (I1)", "published": True}
    c2_json = { "name": "Course Two (I1)", "published": True}
    c3_json = { "name": "Course Three (I2)", "published": True}

    c1 = course_util.create_course(inst1_token, c1_json)
    c2 = course_util.create_course(inst1_token, c2_json)
    c3 = course_util.create_course(inst1_token, c3_json)

    # Endorse a course
    course_util.endorse_course(npo1_token, c1)

    # Get all endorsed courses, should return just c1
    user_util.get_all_endorsed_courses(npo1_token);

    # Endorse a course
    course_util.endorse_course(npo1_token, c3)

    # Get all endorsed courses, should return c1 and c3
    user_util.get_all_endorsed_courses(npo1_token);

    # removing new courses
    course_util.delete_course(inst1_token, c1)
    course_util.delete_course(inst1_token, c2)
    course_util.delete_course(inst1_token, c3)

    # Get all endorsed courses, should return nothing
    user_util.get_all_endorsed_courses(npo1_token);


    # removing the new users
    user_util.delete_self(inst1_token)
    user_util.delete_self(npo1_token)

@click.command("picture-test")
@with_appcontext
def profile_picture_test():
    profile_picture_run_test()

def profile_picture_run_test():
    # create a test user
    user = {
        "email": "pic_test_user@uimpactify.com",
        "password": "password",
        "name": "Picture Guy",
        "phone": "1112223333",
        }
    user_id = auth_util.signup(user)
    user_token = auth_util.login(user)

    # show the default profile picture
    user_util.display_picture(user_token)

    # update the user's profile picture
    user_util.update_picture(user_token, 'uimpactify/resources/alternate-picture.png')

    # show the updated profile picture
    user_util.display_picture(user_token)

    # delete the test user
    user_util.delete_self(user_token)

@click.command("test")
@with_appcontext
def test_all():
    print(
        "----------------------------\n" +
        "RUNNING AUTHENTICATION TESTS\n" +
        "----------------------------\n"
        )
    auth_run_test()

    print(
        "----------------------------\n" +
        "RUNNING COURSE RELATED TESTS\n" +
        "----------------------------\n"
        )
    course_run_test()

    print(
        "----------------------------\n" +
        "RUNNING OPPORTUNITY RELATED TESTS\n" +
        "----------------------------\n"
        )
    opportunity_run_test()

    print(
        "----------------------------\n" +
        "RUNNING USER RELATED TESTS\n" +
        "----------------------------\n"
        )
    user_run_test()


@click.command("init-data")
@with_appcontext
def init_data():
    # SETUP USERS
    # Create instructors
    inst1_json = {
        "name": "Instructor 1",
        "email": "inst1@uimpactify.com",
        "password": "password",
        "roles": {"student": True, "instructor": True},
        }
    inst1 = auth_util.signup(inst1_json)
    inst1_token = auth_util.login(inst1_json)
    
    inst2_json = {
        "name": "Instructor 2",
        "email": "inst2@uimpactify.com",
        "password": "password",
        "roles": {"instructor": True},
        }
    inst2 = auth_util.signup(inst2_json)
    inst2_token = auth_util.login(inst2_json) 
    
    # Create students
    s1_json = {
        "name": "Student 1", 
        "email": "s1@uimpactify.com", 
        "password": "password",
        }
    s1 = auth_util.signup(s1_json)
    s1_token = auth_util.login(s1_json)
    
    s2_json = {
        "name": "Student 2", 
        "email": "s2@uimpactify.com", 
        "password": "password",
        }
    s2 = auth_util.signup(s2_json)
    s2_token = auth_util.login(s2_json)
    
    s3_json = {
        "name": "Student 3", 
        "email": "s3@uimpactify.com", 
        "password": "password",
        }
    s3 = auth_util.signup(s3_json)
    s3_token = auth_util.login(s3_json)
    
    # Create NPOs
    npo1_json = {
        "name": "Organization 1", 
        "email": "npo1@uimpactify.com", 
        "password": "password",
        "roles": {"organization": True},
        }
    npo1 = auth_util.signup(npo1_json)
    npo1_token = auth_util.login(npo1_json)

    npo2_json = {
        "name": "Organization 2", 
        "email": "npo2@uimpactify.com", 
        "password": "password",
        "roles": {"organization": True},
        }
    npo2 = auth_util.signup(npo2_json)
    npo2_token = auth_util.login(npo2_json)
    
    npo3_json = {
        "name": "Organization 3", 
        "email": "npo3@uimpactify.com", 
        "password": "password",
        "roles": {"organization": True},
        }
    npo3 = auth_util.signup(npo3_json)
    npo3_token = auth_util.login(npo3_json)


    # SETUP COURSES
    # Create courses taught by different instructors (with some being published)
    c1_json = { "name": "Course One (I1)", }
    c2_json = { "name": "Course Two (I1)", "published": True}
    c3_json = { "name": "Course Three (I2)", "published": True}

    c1 = course_util.create_course(inst1_token, c1_json)
    c2 = course_util.create_course(inst1_token, c2_json)
    c3 = course_util.create_course(inst2_token, c3_json)

    # Enroll students in courses
    course_util.enroll_student(s1_token, c1)
    course_util.enroll_student(s1_token, c2)
    course_util.enroll_student(s2_token, c2)
    course_util.enroll_student(s2_token, c3)
    course_util.enroll_student(s3_token, c2)
    course_util.enroll_student(s3_token, c3)

    # Endorse a course
    course_util.endorse_course(npo1_token, c2)
    course_util.endorse_course(npo2_token, c2)
    
    # Add feedback to courses
    f1_json = {
        "comment": "This course was the best course I've ever taken and I'm so glad it was able to provide so much value it's just absolutely insane I loved it and I feel like a better human being for taking it and I'm about to change the world by removing financial burgers one step at a time. Nom nom nom.",
        "course": c2,
        "public": True
    }
    f1 = feedback_util.create_feedback(s1_token, f1_json)

    f2_json = {
        "comment": "Sick course. Keep it up homie.",
        "course": c2,
        "public": False
    }
    f2 = feedback_util.create_feedback(s2_token, f2_json)

    f3_json = {
        "comment": "I HATE THIS COURSE AND I'M NEVER TAKING IT AGAIN :(",
        "course": c2,
        "public": True
    }
    f3 = feedback_util.create_feedback(s3_token, f3_json)

    f4_json = {
        "comment": "I haven't taken this course but I just want to let you know it kinda smells here",
        "course": c1,
        "public": False
    }
    f4 = feedback_util.create_feedback(s2_token, f4_json)

    # Add opportunities
    O1_json = {
        "paid": False,
        "description": "happy job that makes me happy",
        "published": True
    }
    O1 = opportunity_util.create_opportunity(npo1_token, O1_json)

    O2_json = {
        "paid": True,
        "description": "happier job that makes me happier",
        "published": True
    }
    O2 = opportunity_util.create_opportunity(npo1_token, O2_json)

    O3_json = {
        "paid": True,
        "description": "happier job that makes me happier but isnt published yet :(",
        "published": False
    }
    O3 = opportunity_util.create_opportunity(npo1_token, O3_json)
    
    # Add quizzes to different courses
    q1_json = { "name": "Empty Quiz 1 for Course 2", "course": c2, }
    q2_json = {
        "name": "Quiz 1 for Course 3",
        "course": c3,
        "quizQuestions": [
            {
                "question": "What is real?",
                "index": 1,
                "options":
                    [
                        { "option": "something", "index": 0, },
                        { "option": "everything", "index": 1, },
                        { "option": "nothing", "index": 2, },
                        { "option": "nothing", "index": 3, }
                    ],
                "answer": 2,
            },
            {
                "question": "What is truth?",
                "index": 2,
                "options": [ { "option": "subjective", "index": 1 } ],
                "answer": 1,
            },
            {
                "question": "What is beauty?",
                "index": 3,
                "options": 
                    [
                        { "option": "fleeting", "index": 0 },
                        { "option": "fleeting", "index": 1 },
                        { "option": "fleeting", "index": 2 },
                        { "option": "fleeting", "index": 3 },
                    ],
                "answer": 1,
            }
            ],
        }
    q3_json = {
        "name": "Quiz 1 for Course 2",
        "course": c2,
        "quizQuestions": [
                {
                    "question": "The answer to this question is (c)",
                    "index": "1",
                    "options":
                        [
                            {"option": "(b)", "index": 0, },
                            {"option": "(c)", "index": 1, },
                            {"option": "(a)", "index": 2, },
                            {"option": "(a)", "index": 3, },
                        ],
                    "answer": 2,
                }
            ],
        }
    q4_json = { "name": "Empty Quiz 2 for Course 2", "course": c2, "published": True }

    q1 = quiz_util.create_quiz(inst1_token, q1_json)
    q2 = quiz_util.create_quiz(inst2_token, q2_json)
    q3 = quiz_util.create_quiz(inst1_token, q3_json)
    q4 = quiz_util.create_quiz(inst1_token, q4_json)

    # Add student submissions for quizzes
    sub1_json = {
        "quiz": q1,
        "answers": [ { "question": -1, "answer": -1, } ],
    }

    sub2_json = {
        "quiz": q4,
        "answers": [ { "question": -1, "answer": -1, } ],
    }

    sub3_json = {
        "quiz": q3,
        "answers": [
            { "question": 1, "answer": 3, }
        ],
    }

    sub4_json = {
        "quiz": q3,
        "answers": [
            { "question": 1, "answer": 1, }
        ],
    }

    sub5_json = {
        "quiz": q3,
        "answers": [
            { "question": 1, "answer": 2, }
        ],
    }

    sub6_json = {
        "quiz": q2,
        "answers": [
            { "question": 1, "answer": 2, },
            { "question": 2, "answer": 1, },
            { "question": 3, "answer": 1, }
        ],
    }

    sub7_json = {
        "quiz": q2,
        "answers": [
            { "question": 1, "answer": 2, },
            { "question": 2, "answer": 1, },
            { "question": 3, "answer": 2, }
        ],
    }

    sub1 = submission_util.create_submission(s1_token, sub1_json)
    sub2 = submission_util.create_submission(s2_token, sub2_json)
    sub3 = submission_util.create_submission(s3_token, sub3_json)
    sub4 = submission_util.create_submission(s1_token, sub4_json)
    sub5 = submission_util.create_submission(s2_token, sub5_json)
    sub6 = submission_util.create_submission(s2_token, sub6_json)
    sub7 = submission_util.create_submission(s3_token, sub7_json)

def init_app(app):
    app.cli.add_command(page_test)
    app.cli.add_command(auth_test)
    app.cli.add_command(course_test)
    app.cli.add_command(opportunity_test)
    app.cli.add_command(profile_picture_test)
    app.cli.add_command(test_all)
    app.cli.add_command(init_data)
    app.cli.add_command(user_test)