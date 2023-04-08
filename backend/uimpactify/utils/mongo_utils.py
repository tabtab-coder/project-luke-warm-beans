import json
import base64
import tempfile
from mongoengine.errors import DoesNotExist
from uimpactify.models.users import Users


# converts Document object fields to a jsonifiable dictionary that's
#  safe for client side consumption
def convert_doc(doc, include=None, save_as=None):
    # can throw DoesNotExist if an iddoes not correspond to a document in the database

    # problem: does not convert lists of DBRef
    # rename fields as requested
    if save_as:
        fields = {save_as[field]: getattr(doc, str(field)) for field in doc if ((include is None) or (str(field) in include))}
        if 'id' in save_as:
            fields[save_as['id']] = str(fields[save_as['id']])
    else:
        fields = {field: getattr(doc, str(field)) for field in doc if ((include is None) or (str(field) in include))}
    
    # serialized the object id into it's string version
    if 'id' in fields:
        fields['id'] = str(fields['id'])
    return fields
                

# converts QuerySet object containing multiple documents to a list of
# dictionaries safe for client side consumption
def convert_query(queryset, include=None):
    res = []
    for doc in queryset:
        try:
            c = convert_doc(doc, include=include)
            res.append(c)
        except DoesNotExist as e:
            print("some part of this document does not exist:", doc.to_json(), sep='\n')
        except Exception as e:
            print("document can't be parsed")
    return res


# gets data from the specified embedded documents so that embedded documents
# can be safely consumed on the client side
def get_embedded_attr(doc, embedded):
    result = {}
    for key in embedded:
        fields = convert_doc(getattr(doc, key), embedded[key].keys(), embedded[key])
        result.update(fields)
    return result

# converts an EmbeddedDoc to a dictionary safe for client side consumption
# embedded is a dictionary of {embedded doc name: {desired embedded doc fields: name to save field as}}
def convert_embedded_doc(doc, non_embedded, embedded):
    c = convert_doc(doc, include=non_embedded)
    embedded_objs = get_embedded_attr(doc, embedded)
    c.update(embedded_objs)
    return c

# converts QuerySet object containing multiple documents with embedded document objects
# to a list of dictionaries safe for client side consumption
# embedded is a dictionary of {embedded doc name: {desired embedded doc fields: name to save field as}}
def convert_embedded_query(queryset, non_embedded, embedded):
    res = []
    for doc in queryset:
        try:
            res.append(convert_embedded_doc(doc, non_embedded, embedded))
        except DoesNotExist as e:
            print("some part of this document does not exist:", doc.to_json(), sep='\n')
        except Exception as e:
            print("document can't be parsed")
    return res


def create_user(data):
    user = Users(**data)
    # Save password hash when creating new user
    user.generate_pw_hash()
    # set default image
    if not user.image:
        default_image = open('uimpactify/resources/default-profile-picture.png', 'rb')
        user.image.replace(default_image)
        default_image.close()

    user.save()
    return user


def update_user_image(user, img):
    img_binary = base64.b64decode(img)
    bytes_image = bytearray(img_binary)
    
    with tempfile.TemporaryFile() as f:
        f.write(bytes_image)
        f.flush()
        f.seek(0)
        user.image.replace(f)

    user.save()