# Liora Rosenberg
# Student number: 11036435

import pandas
import csv
import json

INPUT_CSV = "voting8.csv"
reader = pandas.read_csv(INPUT_CSV)

#reader = reader.replace(".", ",")
#reader = reader.replace(";", ",")
#reader['Voter Turnout'] = reader['Voter Turnout'].str.remove("%")

# change format of reader and remove data
reader = reader.drop(["Year", "Freedom House", "Election type", "Total vote", "Registration", "VAP Turnout", "Voting age population", "Population", "Invalid votes", "Freedom House - Political Rights", "Freedom House - Civil liberties"],
                     axis=1)

reader['Voter Turnout'] = pandas.to_numeric(reader['Voter Turnout'],  errors='coerce')

reader = reader.pivot_table(values='Voter Turnout', index='Country', columns=None, aggfunc='mean')
print (reader)

#reader = reader.set_index('Country')
reader = reader.to_json('turnout.json', orient="index")
