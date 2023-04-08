# mongo-engine packages
from mongoengine import (Document,
                         EmbeddedDocument,
                         EmbeddedDocumentField,
                         ListField,
                         StringField,
                         EmailField,
                         BooleanField,
                         ReferenceField,
                         ImageField)

# flask packages
from flask_bcrypt import generate_password_hash, check_password_hash

# external packages
import re

class Roles(EmbeddedDocument):
    """
    Custom EmbeddedDocument to set user authorizations.

    :param student: boolean value to signify if user is a student
    :param instructor: boolean value to signify if user is a instructor
    :param organization: boolean value to signify if user is an organization
    :param admin: boolean value to signify if user is an admin
    """
    student = BooleanField(default=True)
    instructor = BooleanField(default=False)
    organization = BooleanField(default=False)
    admin = BooleanField(default=False)


class PhoneField(StringField):
    """
    Custom StringField to verify Phone numbers.

    # Modification of http://regexlib.com/REDetails.aspx?regexp_id=61
    #
    # US Phone number that accept a dot, a space, a dash, a forward slash, between the numbers.
    # Will Accept a 1 or 0 in front. Area Code not necessary
    """
    REGEX = re.compile(r"((\(\d{3}\)?)|(\d{3}))([-\s./]?)(\d{3})([-\s./]?)(\d{4})")

    def validate(self, value):
        # Overwrite StringField validate method to include regex phone number check.
        if not PhoneField.REGEX.match(string=value):
            self.error(f"ERROR: `{value}` Is An Invalid Phone Number.")
        super(PhoneField, self).validate(value=value)


class Users(Document):
    """
    Template for a mongoengine document, which represents a user.
    Password is automatically hashed before saving.

    :param email: unique required email-string value
    :param password: required string value, longer than 6 characters
    :param name: option unique string username
    :param phone: optional string phone-number, must be valid via regex
    :param roles: Roles object

    .. seealso:: :class:`Roles`, :class:`Phone`
    """
    
    email = EmailField(required=True, unique=True)
    password = StringField(required=True, min_length=6, regex=None)
    name = StringField()
    phone = PhoneField()
    image = ImageField(thumbnail_size=(128, 128, True))
    # default user is a student
    default_roles = {'student':True, 'instructor':False, 'organization':False, 'admin':False}
    roles = EmbeddedDocumentField(Roles, default=Roles(**default_roles))

    def generate_pw_hash(self):
        self.password = generate_password_hash(password=self.password).decode('utf-8')
    # Use documentation from BCrypt for password hashing
    generate_pw_hash.__doc__ = generate_password_hash.__doc__


    def check_pw_hash(self, password: str) -> bool:
        return check_password_hash(pw_hash=self.password, password=password)
    # Use documentation from BCrypt for password hashing
    check_pw_hash.__doc__ = check_password_hash.__doc__

