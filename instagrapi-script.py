from dotenv import load_dotenv
load_dotenv()
import os
import json
import re
from instagrapi import Client
import boto3

s3 = boto3.client("s3")

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

# cl.album_download(2942203398702886604, folder='./public/data/media')

def extract_number(string):
    match = re.search(r'_(.*?)\.jpg', string)
    if match:
        return match.group(1)
    return None

def upload_files_to_S3(folder_path):
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            with open(file_path, "r") as file:
                s3.upload_file(
                  Filename=file_path,
                  Bucket="onemovieaday",
                  Key=extract_number(file_path)
                )

upload_files_to_S3('./public/data/media')

# def filter_data(data):
#     ids = [o["id"] for o in data]
    # return [post for post in data if post["user"]["username"] == "bogiaranyi" and '\u27a1\ufe0f' in post["caption_text"] and not post["id"] in ids[:ids.index(post["id"])]]
