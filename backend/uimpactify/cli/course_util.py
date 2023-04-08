import requests
import json

from flask import current_app, g, url_for

from uimpactify.cli.db import ADMIN_USER

from uimpactify.controller import routes
from uimpactify.models.courses import Courses

def create_course(access_token, course_json):
    courses_url = url_for("coursesapi")

    print("*** CREATE COURSE ***\n")
    # use the token as authorization in the request headers to create a course with post call
    res = requests.post(
        courses_url,
        json=course_json,
        headers={'Authorization': f'Bearer {access_token}'}
        ).json()
    course_id = res['id']
    print("New course id: " + course_id + "\n")
    return course_id


def delete_course(access_token, course_id):
    course_url = url_for("courseapi", course_id=course_id)

    print(f"*** DELETE COURSE {course_id} ***\n")
    res = requests.delete(
        course_url,
        headers={'Authorization': f'Bearer {access_token}'}
        ).json()


def get_all_courses(access_token):
    courses_url = url_for("coursesapi")

    print("*** GET ALL COURSES ***\n")
    r = requests.get(
        courses_url,
        headers={'Authorization': f'Bearer {access_token}'}
        )
    print(json.dumps(r.json(), indent=4, sort_keys=True), "\n")


def get_all_published_courses():
    courses_url = url_for("publishedcoursesapi")

    print("*** GET ALL PUBLISHED COURSES ***\n")
    r = requests.get(
        courses_url,
        )
    print(json.dumps(r.json(), indent=4, sort_keys=True), "\n")


def get_courses_by_instructor(access_token):
    api_url = url_for("coursebyinstructorapi")

    print("*** GET ALL COURSES BY INSTRUCTOR ***\n")
    r = requests.get(
            api_url,
            headers={'Authorization': f'Bearer {access_token}'}
        )
    print(json.dumps(r.json(), indent=4, sort_keys=True), "\n")


def get_courses_with_student(access_token):
    api_url = url_for("courseswithstudentapi")

    print("*** GET ALL COURSES CONTAINING STUDENT ***\n")
    r = requests.get(
            api_url,
            headers={'Authorization': f'Bearer {access_token}'}
        )
    print(json.dumps(r.json(), indent=4, sort_keys=True), "\n")


def enroll_student(access_token, course_id):
    api_url = url_for("courseenrollmentapi")

    print(f"*** ENROLL STUDENT IN COURSE {course_id} ***\n")
    r = requests.post(
        api_url,
        json={"courseId": course_id},
        headers={'Authorization': f'Bearer {access_token}'}
    )

def disenroll_student(access_token, course_id):
    api_url = url_for("coursedisenrollmentapi", course_id=course_id)

    print(f"*** DISENROLL STUDENT FROM COURSE {course_id} ***\n")
    r = requests.delete(
        api_url,
        headers={'Authorization': f'Bearer {access_token}'}
    )

def endorse_course(access_token, course_id):
    api_url = url_for("courseendorsementapi")

    print(f"*** ENDORSE COURSE {course_id} ***\n")
    r = requests.post(
        api_url,
        json={"courseId": course_id},
        headers={'Authorization': f'Bearer {access_token}'}
    )


def get_orgs_endorsing_course(course_id):
    api_url = url_for("courseendorsedbyapi", course_id=course_id)

    print(f"*** GET ALL ORGANIZATIONS ENDORSING COURSE {course_id} ***\n")
    r = requests.get(
            api_url
        )
    print(json.dumps(r.json(), indent=4, sort_keys=True), "\n")
