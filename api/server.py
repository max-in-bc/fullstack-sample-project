# Run within fully loaded venv:
# $gunicorn --bind 0.0.0.0:3000 wsgi:app

from flask import Flask, request

import json
from flask.helpers import send_from_directory
from dotenv import dotenv_values
import jwt

#User Class - will contain user info (including permissions) and logic for encoding/decoding their token using a secret key on the back-end
class User:
    def __init__(self,  name, permission):
        self.name = name
        self.permission = permission

    def encode_auth_token(self ):
        try:
            payload = {
                'name': self.name,
                'permission': self.permission
            }
            return jwt.encode(
                payload,
                config['SECRET_KEY'],
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_permission(auth_token):
        try:
            payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
            return payload['permission']
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'


#Service Class - will contain info about the faux services and their related permissions
class Service:
    def __init__(self, id, name, permission):
        self.id = id
        self.name = name
        self.permission = permission



#config file contains static references to test users and test services
config = dotenv_values(".env")
app = Flask(__name__, static_folder='logs')

#in preparation for using the session dicttionary to start/stop the faux services
app.secret_key = config['SECRET_KEY']
base_route = '/api'

#Login Endpoint
#params: username(string) and password(string)
#returns: string representing a base64 encrypted user token that contains permission claims
@app.route(base_route + '/login', methods=['POST'])
def login():
    request_data = request.get_json()

    try:
        username = request_data['username']
    except:
        return 'Error:  Username  cannot be blank', 500

    try:
        password = request_data['password']
    except:
        return 'Error: Password cannot be blank', 500

    try:
        saved_password =  config[username.upper() + '.PASSWORD']
    except:
        return 'Error: User not found', 404


    if password == saved_password:
        #successful auth
        try:
            user_permission =  config[username.upper() + '.PERMISSION']
        except:
            user_permission = 'regular'

        new_user = User(username, user_permission)
        return new_user.encode_auth_token( ), 200
    else:
        return 'Error: Password mismatch', 401

@app.route(base_route + '/services/<int:service_id>', methods=['GET'])
def get_service(service_id):

    #make sure the user can accesss that service
    user_permissions = get_permission_string(request);
    service_permission = config['SERVICE.' + str(service_id) + '.PERMISSION'].split(',')
    if user_permissions in service_permission :
        return send_from_directory(app.static_folder , 'service' + str(service_id) + '-debug.log')
    else:
        return 'User not allowed to access that service', 403

@app.route(base_route + '/services', methods=['GET'])
def get_all_services():
    user_permissions = get_permission_string(request);
    service_list = []

    for key in config.keys():
        if (key.startswith('SERVICE.')):
            service_id = key.split('.')[1]
            service_name = 'Service ' + service_id
            service_permission = config['SERVICE.' + service_id + '.PERMISSION'].split(',')
            if user_permissions in service_permission :
                service_list.append(Service(service_id, service_name, service_permission))

    return json.dumps(service_list, default=lambda x: x.__dict__)


def get_permission_string(request):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[1]
    else:
        auth_token = ''

    user_permissions = 'regular'
    if auth_token:
        user_permissions = User.decode_auth_permission(auth_token)
    return user_permissions
