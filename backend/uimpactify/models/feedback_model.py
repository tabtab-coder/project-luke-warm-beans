# mongo-engine packages
from mongoengine import (Document,
                         EmbeddedDocument,
                         EmbeddedDocumentField,
                         ListField,
                         StringField,
                         EmailField,
                         BooleanField,
                         ReferenceField,
                         CASCADE,
                         PULL)

# project resources
from uimpactify.models.users import Users
from uimpactify.models.courses import Courses

class Feedback(Document):
    """
    Template for a mongoengine document, which represents feedback for a course provided by a user.

    :param comment: The feedback provided by the user
    :param user: The user providing feedback
    :param course: The course for which the user is providing feedback
    :param public: Whether the feedback should be public (similar to a review) or private
    """
    comment = StringField(required=True)
    user = ReferenceField('Users', reverse_delete_rule=CASCADE, required=True)
    course = ReferenceField('Courses', reverse_delete_rule=CASCADE, required=True)
    public = BooleanField(required=True)