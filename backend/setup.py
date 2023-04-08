from setuptools import setup, find_packages

setup(
    python_requires=">=3.8",
    name='uimpactify',
    version='1.1',
    long_description=__doc__,
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires= [
        'flask',
        'requests',
        'python-dotenv',
        'flask-mongoengine',
        'flask-bcrypt',
        'flask-restful',
        'flask-jwt-extended',
        'flask-cors',
        'pillow',
    ]
)
