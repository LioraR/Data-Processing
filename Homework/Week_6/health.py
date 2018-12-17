# Liora Rosenberg
# Student number: 11036435
# data used: https://stats.oecd.org/Index.aspx?DataSetCode=BLI
# this file distract life expectancy and income from the dataset

import pandas
import csv
import json

INPUT_CSV = "health.csv"

reader = pandas.read_csv(INPUT_CSV)

# remove data
reader = reader[(reader['Indicator'] == 'Household net adjusted disposable income') |
                (reader['Indicator'] == 'Life expectancy')]
reader = reader.drop(["LOCATION", "INDICATOR", "MEASURE", "Measure", "INEQUALITY", "Inequality",
                      "Unit Code", "Unit", "PowerCode Code", "PowerCode",
                      "Reference Period Code", "Reference Period", "Flag Codes", "Flags"],
                     axis=1)

# change format of reader
reader = reader.pivot_table(values='Value', index='Country', columns='Indicator', aggfunc='mean')

reader = reader.replace("null", None)

def jason(reader):
    """
    cleane, preprocesse and analyze data to a jason file
    """
    countries = []
    household_income = []
    life_expectancy = []

    # distract life expectancy and income
    for i in reader:
        if (i == "Life expectancy"):
            life_expectancy = reader[i].values
        else:
            household_income = reader[i].values

        index = reader[i].index
        for t in reader[i].index:
            countries.append(t)

    # put the data in the right format
    dict = {}
    for i in range(len(household_income)):
        dict[countries[i]] = {"life expectancy": life_expectancy[i], "household_income": household_income[i]}

    reader = reader.to_json('health.json', orient="index")


if __name__ == "__main__":
    jason(reader)
