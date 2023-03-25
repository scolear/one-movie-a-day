import boto3
import shutil
import re
import json
import time
from dotenv import load_dotenv
from instagram_utils import get_login, download_post_data
from json_utils import load_json, write_json
from s3_utils import upload_files_to_S3
load_dotenv()


def filter_data(posts, ids):
    posts_dicts = []
    for post in posts:
        post_dict = post.dict()
        match_hashtag = re.search(r'#onemovieaday', post_dict["caption_text"])
        match_hashtag2 = re.search(
            r'#mindennapegyfilm', post_dict["caption_text"])

        if (match_hashtag or match_hashtag2) and not post_dict["id"] in ids:
            posts_dicts.append(post_dict)
        else:
            if not (match_hashtag or match_hashtag2):
                # print(f"post {post_dict['code']} not relevant")
                continue
            if post_dict["id"] in ids:
                # print(f"post {post_dict['code']} already in the list")
                continue
    return posts_dicts


def extract_ids_from_data(data):
    return [item['id'] for item in data]


def main():
    cl = get_login()
    s3 = boto3.client("s3")

    userid = 653898766
    tmp_folder_path = './data/tmp'
    data_file_path = './data/data.json'
    json_data = load_json(data_file_path)

    # no_posts = 1670  # The first #mindennapegyfilm post was around this mark
    no_posts = 20
    batch_size = 20
    count = 0
    cursor = None

    ids = extract_ids_from_data(json_data)  # ids we already have

    while count <= no_posts:

        time.sleep(1)
        posts, cursor = cl.user_medias_paginated(
            userid, batch_size, end_cursor=cursor)
        print(len(posts))

        # Filtering and unwrapping into a list of dicts
        posts_dicts = filter_data(posts, ids)

        for post in posts_dicts:
            # Adding to IDs list
            ids.append(post["id"])

            # Formatting datetime
            post["taken_at"] = post["taken_at"].isoformat()

            # Downloading the post's images
            download_post_data(cl, post, tmp_folder_path)

        print("count: ", f"{count}/{no_posts}")
        count += batch_size

        # Adding new elements to the front
        json_data = posts_dicts + json_data
        # Writing updated data to file
        write_json(data_file_path, json_data)

        upload_files_to_S3(s3, tmp_folder_path)

        # Cleaning tmp folder
        shutil.rmtree(tmp_folder_path)


if __name__ == "__main__":
    main()
