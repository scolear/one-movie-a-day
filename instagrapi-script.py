from dotenv import load_dotenv
load_dotenv()
import os
import json
from instagrapi import Client


if 'insta-session.json' in os.listdir():
    with open('insta-session.json', 'r') as f:
        print('loading session data from file')
        cl_session = json.load(f)
else:
    cl_session =  {}

cl = Client(cl_session)
cl.login(os.environ["INSTAGRAM_USERNAME"], os.environ["INSTAGRAM_PASSWORD"])

with open('insta-session.json', 'w') as f:
    json.dump(cl.get_settings(), f)

# cl.album_download(2724792305325435269, folder='./data/media')
