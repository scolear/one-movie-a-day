
import os
import re


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
            print(f'Uploading {file_path} to S3')
            s3.upload_file(
                Filename=file_path,
                Bucket="onemovieaday",
                Key=extract_number_from_filename(file_path)
            )
