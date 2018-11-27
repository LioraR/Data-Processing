# Liora Rosenberg
# Student number: 11036435

import pandas
import csv
import json

INPUT_CSV = "renewable_energy.csv"
reader = pandas.read_csv(INPUT_CSV)

# remove data
reader = reader.loc[reader['MEASURE'] == 'PC_PRYENRGSUPPLY']
reader = reader.drop(["INDICATOR", "SUBJECT", "MEASURE", "FREQUENCY", "Flag Codes"],
                     axis=1)
reader = reader.loc[reader['LOCATION'] == 'AUS']
print(reader)

reader = reader.set_index('TIME')
reader = reader.to_json('renewable_energy.json', orient="index")
