# mongo-engine packages
from mongoengine import (Document, IntField, StringField)

class Pages(Document):
    """
    a mongoengine document, which represents a page on our website.

    :param name: name of the page
    :param views: the number of times this page has been viewed
    """
    name = StringField(required=True, min_length=1)
    views = IntField(default=0)
