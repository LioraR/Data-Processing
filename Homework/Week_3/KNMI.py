# Liora Rosenberg
# Student number: 11036435

import pandas
import csv
import json

INPUT_CSV = "KNMI.csv"
reader = pandas.read_csv(INPUT_CSV)

reader = reader.set_index('Date')
reader = reader.to_json('KNMI.json', orient="index")
