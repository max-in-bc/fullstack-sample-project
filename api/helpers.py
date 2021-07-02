 
from threading import Timer


from models import *

Service1 = FauxLogService('1')
Service2 = FauxLogService('2')

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

def start_faux_logs():
    if Service1 and not Service1.running:
        Service1.start_faux_logs() 
    if Service2 and not Service2.running:
        Service2.start_faux_logs() 

def stop_faux_logs():
    if Service2 and Service2.running:
        Service1.stop_faux_logs() 
    if Service1 and Service1.running:
        Service2.stop_faux_logs() 


