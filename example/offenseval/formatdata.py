import csv

import requests

training_file = open("olid-training-v1.0.tsv")
training = csv.reader(training_file, delimiter="\t")

AS_URL="http://localhost:8050"
BACKEND_URL="http://localhost:8080"

training_data = []
for index, row in enumerate(training):
    if index > 0:
        training_data.append({
            "project": "offenseval2019a",
            "id": row[0],
            "tweet": row[1],
            "label": row[2]
        })

print(training_data)

credentials = {
    "username": "admin",
    "password": "mysecretpassword"
}

tokens = requests.post(AS_URL + "/api/token/", json=credentials).json()
print(str(tokens))

headers = {
    "Authorization": "Bearer " + tokens["token"]
}

document_ids = requests.post(BACKEND_URL + "/api/v1/import/document", json=training_data, headers=headers).json()["documentIDs"]

training_data_with_ids = list(zip(document_ids, training_data))

for pair in training_data_with_ids:
    create_annotation = requests.post(BACKEND_URL + "/api/v1/import/annotation/project/OffensEval2019_a/document/" + pair[0], json={
        "annotations": {
            "IS_OFFENSIVE": {
                "values": [{"value": pair[1]["label"]}],
                "target": "document"
            }
        }
    }, headers=headers)

# Insert test data

test_file = open("testset-levela.tsv")
test = csv.reader(test_file, delimiter="\t")
test_data = []

for row in test:
    test_data.append({
        "id": row[0],
        "tweet": row[1]
    })

create_test_data = requests.post(BACKEND_URL + "/api/v1/import/document", json=test_data, headers=headers).json()
print(str(create_test_data))

print("Finish")
