# Liora Rosenberg
# Student number: 11036435

import pandas
import csv
import json

INPUT_CSV = "data.csv"
reader = pandas.read_csv(INPUT_CSV)


# snijden data
reader = reader.loc[reader['MEASURE'] == 'PC_PRYENRGSUPPLY']
reader = reader.drop(["INDICATOR", "SUBJECT", "MEASURE", "FREQUENCY", "Flag Codes"], axis=1)
reader = reader.loc[reader['LOCATION'] == 'AUS']
print(reader)

reader = reader.set_index('TIME')
reader = reader.to_json('data.json', orient="index")
