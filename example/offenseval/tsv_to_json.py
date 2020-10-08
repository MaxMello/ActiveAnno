import csv
import json

training_file = open("testset-levela.tsv")
training = csv.reader(training_file, delimiter="\t")

training_data = []
for index, row in enumerate(training):
    if index > 0:
        training_data.append({
            "dataset": "offenseval2019_test_a",
            "id": row[0],
            "tweet": row[1]
        })

with open("offenseval2019_test_a.json", "w") as f:
    json.dump(training_data, f, indent=4, sort_keys=False)

