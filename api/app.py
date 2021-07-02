
from flask import Flask, request

from flask_cors import CORS

import json
from flask.helpers import send_from_directory
from dotenv import dotenv_values

from models import *

from helpers import get_permission_string
from helpers import start_faux_logs, stop_faux_logs
import atexit



#config file contains static references to test users and test services
config = dotenv_values(".env")
app = Flask(__name__, static_folder='logs')
CORS(app)
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
        start_faux_logs()
        atexit.register(stop_faux_logs) #stop the logs from running forever
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


if __name__ == "__main__":
   app.run(host='0.0.0.0', port=5000)


