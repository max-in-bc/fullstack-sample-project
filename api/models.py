

import jwt  
from dotenv import dotenv_values  
import subprocess
from threading import Timer
import os,sys
dir_path = os.path.dirname(os.path.realpath(__file__))

config = dotenv_values(".env")  
secret_key = config.get('SECRET_KEY')
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
            payload = jwt.decode(auth_token, secret_key)
            return payload['permission'] 
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'
    


#Service Class - will contain info about the faux services and their related permissions
class Service:
    def __init__(self, id, name, permission): 
        self.id = id 
        self.name = name 
        self.permission = permission 

class FauxLogService:
    def __init__(self, service_id):
        self.service_id = service_id
        self.subprocess = None
        self.running = False

    def stop_faux_logs(self):
        self.running = False
        self.subprocess.terminate()
        self.subprocess = None
        # os.rmdir("logs") #remove the logs created during this session
 
    def start_faux_logs(self):
        self.running = True
        # subprocess.Popen(dir_path + "/run_faux_services.sh")
        self.subprocess = subprocess.Popen(dir_path + "/service" + self.service_id + ".py")

        t = Timer(600.0, self.stop_faux_logs)
        t.start() # after 5 minutes turn off the log
 

    