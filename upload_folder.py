import boto3
from dotenv import load_dotenv
import re
import json
import os
load_dotenv()


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
            os.remove(file_path)


def main():
    s3 = boto3.client("s3")
    tmp_folder_path = './data/tmpcopy'
    upload_files_to_S3(s3, tmp_folder_path)


if __name__ == "__main__":
    main()
