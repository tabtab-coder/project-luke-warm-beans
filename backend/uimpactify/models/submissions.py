# mongo-engine packages
from mongoengine import (Document,
                         EmbeddedDocument,
                         EmbeddedDocumentField,
                         ListField,
                         StringField,
                         IntField,
                         ReferenceField,
                         CASCADE)

# project resources
from uimpactify.models.quizzes import Quizzes
from uimpactify.models.users import Users

class Answers(EmbeddedDocument):
    """
    Custom EmbeddedDocument which represents an answer choice.
    :param question: the index of the question being answered
    :param answer: the index of option being chosen
    """
    question = IntField(required=True)
    answer = IntField(required=True)

class Submissions(Document):
    """
    a mongoengine document, which represents a quiz submission.
    :param quiz: quiz that the submission is for
    :param usser: user that the submission was written by
    :param answers: choices that the user made
    :param grade: grade of the submission based on the answers
    """
    quiz = ReferenceField('Quizzes', reverse_delete_rule=CASCADE, required=True)
    user = ReferenceField('Users', reverse_delete_rule=CASCADE, required=True)
    answers = ListField(EmbeddedDocumentField(Answers), required=True)
    grade = IntField(default=0)
