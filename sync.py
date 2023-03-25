from instagram_utils import get_login, download_post_data
from json_utils import load_json
from s3_utils import upload_files_to_S3
import botocore
import boto3
from dotenv import load_dotenv
load_dotenv()


s3 = boto3.resource('s3')


def check_S3(key):
    try:
        s3.Object('onemovieaday', f'{key}').load()
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "404":
            # print(f'{key} does not exist in S3')
            return False
        else:
            raise
    else:
        # print(f'{key} already exists')
        return True


def check_post_data(post):
    if post["media_type"] == 1:
        return check_S3(post["pk"])
    elif post["media_type"] == 8:
        # Only checking the first resource
        return check_S3(post["resources"][0]["pk"])

# This module is useful AFTER the data.json has been updated already
# It will check if the post is already in S3, if not, it will download the necessary data


def sync_json_to_S3():
    cl = get_login()
    data_file_path = './data/data.json'
    tmp_path = './data/tmp'
    json_data = load_json(data_file_path)

    for post in json_data:
        print(post["code"], post["media_type"], post["taken_at"])

        if check_post_data(post):
            continue
        else:
            print(f'Need to download {post["code"]}')
            # Downloading the post's images
            download_post_data(cl, post, tmp_path)

    upload_files_to_S3(boto3.client("s3"), tmp_path)

    # Cleaning tmp folder
    # shutil.rmtree(tmp_folder_path)


if __name__ == "__main__":
    sync_json_to_S3()
