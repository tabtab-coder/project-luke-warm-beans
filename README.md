# Luke Warm Beans - UImpactify

An e-learning platform providing credible and relevant courses that teach valuable skills to all people in the social work ecosystem. This platform should bring together educators, students, and organizations in one community, improving the general quality of work in the ecosystem while reducing the financial burden on organizations and individuals.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Frontend: Some recent version of node.js
Backend: Python3, flask, monogodb

## Frontend

Install dependencies and run the app in development mode
```
$ cd frontend
$ npm install
$ npm start
```

See additional information in /frontend/frontend.md

## Backend

### Flask Installation 

Create virtual environment and activate it (Windows)
```
$ cd backend
$ py -3 -m venv venv
$ venv\Scripts\activate
```

Create virtual environment and activate it (Mac OS)
```
$ cd backend
$ python3 -m venv venv
$ source venv/bin/activate
```

Install dependencies

```
(venv) $ pip install -e .
```

### Run the Server
```
(venv) $ flask run
```

### Additional commands
Run these commands in a seperate tab **while the flask server and MongoDB server are running**

To generate test data on the database

```
# Create an admin user
(venv) $ flask init-db
# Create a bunch of test data (fails if data already exists)
(venv) $ flask init-data
```

To run various API tests (if tests fail, data may not get deleted so you would have to go in manually to delete it)

```
# Test signup and login 
(venv) $ flask auth-test
# Test course related APIs
(venv) $ flask course-test
# Test everything
(venv) $ flask test
```

### Adding a new python dependency

If you add a new dependency to the python environment, make sure to update requirements.txt
and the install_requirements in backend/setup.py

```
(venv) $ pip freeze > .\requirements.txt
```

=======

## Mongo Installation (Mac OS)

Follow the official MongoDB installation manual to install MongoDB here:
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#run-mongodb-community-edition

(Assuming you are using MacOS Catalina with zsh in which the root folder is no longer writable)
Create the directory your local data will be stored:

```
$ cd /Users/<your mac username>
$ mkdir -p /data/db
```

Open the MongoDB config file:

```
$ open /usr/local/etc/mongod.conf
```

Change the dbPath to the directory that was just created:

```
systemLog:
  destination: file
  path: /usr/local/var/log/mongodb/mongo.log
  logAppend: true
storage:
  dbPath: /Users/<your mac username>/data/db
net:
  bindIp: 127.0.0.1 
```

Save the file and Launch the database server with brew:

```
$ brew services start mongodb-community@4.4
```

Or alternatively Run MongoDB manually as a background process:

```
$ mongod --config /usr/local/etc/mongod.conf --fork
```

Launch mongo shell

```
$ mongo
```

Set up authentication for the database

```
> use admin
> db.createUser(
  {
    user: "admin",
    pwd: "password",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)
> db.adminCommand( { shutdown: 1 } )
```

Now you can run the database in authentication mode and log in as admin

```
$ mongod --auth
$ mongo localhost:27017/admin -u admin -p password
```
Reference: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#run-mongodb-community-edition


- Access endpoints using Postman for testing

- follow https://towardsdatascience.com/creating-a-beautiful-web-api-in-python-6415a40789af to get 
a better understanding of how the backend operates

## Mongo Installation (Windows)

Install the latest version of mongoDB community version here: https://www.mongodb.com/download-center/community and accept all default configuration. 

Let `mongo` represent the path to where you installed mongo.exe, ie `C:\"Program Files"\MongoDB\Server\4.4\bin\mongo.exe`. Similarly, `mongod` represents the path to `mongod.exe`.


Create the directory your local data will be stored:

```
$ md \data\db
```

Launch the database server:

```
$ mongod
```

Launch mongo shell

```
$ mongo
```

Set up authentication for the database

```
> use admin
> db.createUser(
  {
    user: "admin",
    pwd: "password",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)
> db.adminCommand( { shutdown: 1 } )
```

Now you can run the database in authentication mode and log in as admin

```
$ mongod --auth
$ mongo localhost:27017/admin -u admin -p password
```
