
import os
import json
from instagrapi import Client


def get_login():
    if 'insta-session.json' in os.listdir():
        with open('insta-session.json', 'r') as f:
            print('loading session data from file')
            cl_session = json.load(f)
    else:
        cl_session = {}

    cl = Client(cl_session)
    cl.login(os.environ["INSTAGRAM_USERNAME"],
             os.environ["INSTAGRAM_PASSWORD"])

    with open('insta-session.json', 'w') as f:
        json.dump(cl.get_settings(), f)

    return cl


def download_post_data(cl, post, path):
    if post["media_type"] == 1:
        try:
            #  This will create a bogiaranyi_postpk.jpg file
            cl.photo_download(post["pk"], folder=path)
        except:
            print(f'error downloading {post["pk"]}')
    elif post["media_type"] == 8:
        if any(val["media_type"] == 2 for val in post["resources"]):
            #  Skipping video albums
            return
        try:
            #  This will create many bogiaranyi_RESOURCEPK.jpgs
            cl.album_download(post["pk"], folder=path)
        except:
            print(f'error downloading {post["pk"]} album')
