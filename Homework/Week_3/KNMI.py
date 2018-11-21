import pandas
import csv
import json

INPUT_CSV = "KNMI.csv"
#"KNMI_min+max_temp_leeuwarden.csv"
reader = pandas.read_csv(INPUT_CSV)
print(reader)

reader = reader.set_index('Date')
reader = reader.to_json('x.json', orient="index")
