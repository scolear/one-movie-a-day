
import json


def load_json(path):
    with open(path) as f:
        data = json.load(f)
    return data


def sort_json_by_date(data, by='taken_at'):
    return sorted(data, key=lambda k: k[by], reverse=True)


def remove_duplicates(data):
    return list({v['pk']: v for v in data}.values())


def write_json(path, data):
    with open(path, 'w') as f:
        print(f'writing {len(data)} items to {path}')
        json.dump(data, f)
