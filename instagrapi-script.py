from instagrapi import Client
import os
import json

if 'insta-session.json' in os.listdir():
    with open('insta-session.json', 'r') as f:
        print('loading session data from file')
        cl_session = json.load(f)
else:
    cl_session =  {}

cl = Client(cl_session)
cl.login('rhotauscolear', 'rS5D9?Tch?SFtgFJ')

with open('insta-session.json', 'w') as f:
    json.dump(cl.get_settings(), f)

cl.album_download(2724792305325435269, folder='./data/media')
