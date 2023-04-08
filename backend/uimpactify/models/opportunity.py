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

class Opportunity(Document):
    """
    Template for a mongoengine document, which represents opportunities for a user by an organization.

    :param isPaid: Whether the job is paid
    :param description: The description of the job
    :param isPublished: Whether the job is published
    :param applicants: The current applicants for the job
    :param organization: The id of the organization account that created the job
    """
    paid = BooleanField(required=True)
    description = StringField(required=True)
    published = BooleanField(required=True)
    applicants: ListField(ReferenceField('Users', reverse_delete_rule=PULL))
    organization = ReferenceField('Users', reverse_delete_rule=CASCADE, required=True)