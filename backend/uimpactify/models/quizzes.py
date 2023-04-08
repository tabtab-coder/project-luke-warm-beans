# mongo-engine packages
from mongoengine import (Document,
                         EmbeddedDocument,
                         EmbeddedDocumentField,
                         ListField,
                         StringField,
                         IntField,
                         BooleanField,
                         ReferenceField,
                         CASCADE)

# project resources
from uimpactify.models.courses import Courses

class Options(EmbeddedDocument):
    """
    Custom EmbeddedDocument which represents a answers to a quiz question

    :param option: the actual content of the potential answer
    :param index: the index of the option
    """
    option = StringField(required=True, min_length=1)
    index = IntField(required=True)

class Questions(EmbeddedDocument):
    """
    Custom EmbeddedDocument which represents a quiz question.

    :param question: the actual content of the question
    :param index: the index of the question
    :param options: list of Options (possible answers) for the question
    :param answer: index of the correct answer
    """
    question = StringField(required=True, min_length=1)
    index = IntField(required=True)
    options = ListField(EmbeddedDocumentField(Options), required=True)
    answer = IntField(required=True)

class Quizzes(Document):
    """
    a mongoengine document, which represents a quiz.

    :param name: required name of the quiz
    :param quizQuestions: list of Questions in the quiz
    :param published: boolean stating whether the quiz is public
    :param course: course that the quiz is for
    """
    name = StringField(required=True, min_length=1)
    quizQuestions = ListField(EmbeddedDocumentField(Questions))
    published = BooleanField(default=False)
    course = ReferenceField('Courses', reverse_delete_rule=CASCADE, required=True)
