import boto3
from instagrapi import Client
import shutil
import datetime
import re
import json
import os
from dotenv import load_dotenv
load_dotenv()

#  INITIAL DOWNLOAD
# 1. Fetch all posts with hashtag
#   1b. Convert to dictionary
# 2. Filter by username, format
#   2b. Save resulting data to a data.json to be read by the JS FE/compare updates to
# 3. For all posts, download resources into ./data/tmp
#   3a. For image albums, album_download
#   3b. For videos, skip entirely or download thumbnails
# 4. Upload resources to S3 (using only extracted resource ids)
# 5. Delete ./data/tmp contents os.rmdir("myfolder")

#  On loading data, we must also switch on media_type
#  as Albums and photos have different paths for their resources.

# UPDATING DATA
# 1. Fetch latest ~50 posts of bogiaranyi
# 2. Filter by hashtag, format
# 3. Filter by data already in data.json
#   3b. add new data to data.json
# 4. Repeat steps 3-4-5 above for the new data


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


def filter_data(posts, ids):
    posts_dicts = []
    for post in posts:
        post_dict = post.dict()
        match = re.search(r'(\d+\s?\.?\,?\d?)\/(\s?10)',
                          post_dict["caption_text"])
        match_hashtag = re.search(r'#onemovieaday', post_dict["caption_text"])

        if match and match_hashtag and post_dict["user"]["username"] == "bogiaranyi" and not post_dict["id"] in ids:
            posts_dicts.append(post_dict)
        else:
            if post_dict["user"]["username"] != "bogiaranyi":
                print(f"user {post_dict['user']['username']} filtered out")
                continue
            if not match_hashtag:
                print(f"post {post_dict['code']} not relevant")
                continue
            if match == None:
                print(f"post {post_dict['code']} does not have a rating")
                continue
            if post_dict["id"] in ids:
                print(f"post {post_dict['code']} already in the list")
                continue
    return posts_dicts


def write_post_data_to_json_initial(post, path):
    with open(path, 'a') as f:
        json.dump(post, f)
        f.write(',\n')


def extract_number_from_filename(string):
    match = re.search(r'_(.*?)\.(jpg)?(webp)?', string)
    if match:
        return match.group(1)
    return None


def upload_files_to_S3(s3, folder_path):
    print(f'Uploading {folder_path} to S3')
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            s3.upload_file(
                Filename=file_path,
                Bucket="onemovieaday",
                Key=extract_number_from_filename(file_path)
            )


def extract_ids(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)
    return [item['id'] for item in data]


def initial_download():
    cl = get_login()
    s3 = boto3.client("s3")

    tmp_folder_path = './data/tmp'
    cursor = None
    no_posts = cl.hashtag_info('mindennapegyfilm').dict()['media_count']
    found = 0
    ids = []
    count = 0
    batch_size = 32

    while count <= no_posts:
        if not os.path.exists(tmp_folder_path):
            os.makedirs(tmp_folder_path)

        # Initial download
        posts, cursor = cl.hashtag_medias_v1_chunk(
            'mindennapegyfilm', max_amount=batch_size, tab_key='recent', max_id=cursor)

        # Filtering and unwrapping into a list of dicts
        posts_dicts = filter_data(posts, ids)

        for post in posts_dicts:
            # Adding to IDs list
            ids.append(post["id"])

            # Formatting datetime
            post["taken_at"] = post["taken_at"].isoformat()

            print(post["code"], post["media_type"], post["taken_at"])

            if post["media_type"] == 1:
                #  This will create a bogiaranyi_postpk.jpg file
                cl.photo_download(post["pk"], folder=tmp_folder_path)
            elif post["media_type"] == 2 and post["product_type"] == "feed":
                #  This will create a bogiaranyi_postpk.jpg file from video thumbnail
                cl.photo_download_by_url(
                    post["thumbnail_url"], filename="bogiaranyi_" + post["pk"] + ".jpg", folder=tmp_folder_path)
            elif post["media_type"] == 8:
                #  This will create many bogiaranyi_RESOURCEPK.jpgs
                if any(val["media_type"] == 2 for val in post["resources"]):
                    #  Skipping video albums
                    continue
                else:
                    #  This is the most common
                    cl.album_download(post["pk"], folder=tmp_folder_path)

            # Writing to data.json
            # TODO: update path once everything is working
            write_post_data_to_json_initial(post, './data/data.json')

        # Uploading tmp folder contents to S3
        upload_files_to_S3(s3, tmp_folder_path)

        # Cleaning tmp folder
        shutil.rmtree(tmp_folder_path)

        found += len(posts_dicts)
        print("found: ", found)
        print("count: ", count)
        count += batch_size


def load_json(path):
    with open(path) as f:
        data = json.load(f)
    return data


def write_json(path, data):
    with open(path, 'w') as f:
        json.dump(data, f)

# Update data fetch


def main():
    cl = get_login()
    s3 = boto3.client("s3")

    userid = 653898766
    data_file_path = './data/data.json'
    tmp_folder_path = './data/tmp'
    if not os.path.exists(tmp_folder_path):
        os.makedirs(tmp_folder_path)

    ids = extract_ids(data_file_path)
    json_data = load_json(data_file_path)

    posts = cl.user_medias(user_id=userid, amount=50)

    posts_dicts = filter_data(posts, ids)
    print(len(posts_dicts))

    processed = 0

    for post in posts_dicts:
        # Formatting datetime
        post["taken_at"] = post["taken_at"].isoformat()

        processed += 1
        print(f"{processed}/{len(posts_dicts)} :",
              post["code"], post["media_type"], post["taken_at"])

        if post["media_type"] == 1:
            filename = f"bogiaranyi_{post['pk']}.jpg"
            if os.path.exists(os.path.join(tmp_folder_path, filename)):
                print(f'file {filename} already exists')
                continue
            else:
                try:
                    #  This will create a bogiaranyi_postpk.jpg file
                    cl.photo_download(post["pk"], folder=tmp_folder_path)
                except:
                    print(f'error downloading {filename}')
                    continue
        elif post["media_type"] == 2 and post["product_type"] == "feed":
            #  This will create a bogiaranyi_postpk.jpg file from video thumbnail
            continue
            cl.photo_download_by_url(
                post["thumbnail_url"], filename="bogiaranyi_" + post["pk"] + ".jpg", folder=tmp_folder_path)
        elif post["media_type"] == 8:
            if any(val["media_type"] == 2 for val in post["resources"]):
                #  Skipping video albums
                continue
            else:
                #  This will create many bogiaranyi_RESOURCEPK.jpgs
                #  This is the most common
                filenames = [
                    f"bogiaranyi_{res['pk']}.jpg" for res in post["resources"]]
                filenames.extend(
                    [f"bogiaranyi_{res['pk']}.webp" for res in post["resources"]])

                if any(os.path.isFile(os.path.join(tmp_folder_path, file)) for file in filenames):
                    print(f'files for post {post["pk"]} already exist')
                    continue
                else:
                    try:
                        cl.album_download(post["pk"], folder=tmp_folder_path)
                    except:
                        print(f'error downloading {post["pk"]} album')
                        continue

    # Adding new elements to the front
    json_data = posts_dicts + json_data
    # Writing updated data to file
    write_json(data_file_path, json_data)

    # Uploading tmp folder contents to S3
    upload_files_to_S3(s3, tmp_folder_path)

    # Cleaning tmp folder
    shutil.rmtree(tmp_folder_path)


if __name__ == "__main__":
    main()


#  i used this to flatten the json structure
# json_data = load_json(data_file_path)

#     # Modify the JSON structure
#     new_data = []
#     for item in json_data:
#         if isinstance(item, list):  # If item is an array
#             if item:  # If item is not empty
#                 new_data.extend(item)  # Move contents up one level
#         else:
#             # If item is an object, add it to the new_data list
#             new_data.append(item)

#     # Write the modified JSON back to a file
#     with open('output.json', 'w') as output_file:
#         json.dump(new_data, output_file, indent=4)
