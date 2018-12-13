# Liora Rosenberg
# Student number: 11036435

import pandas
import csv
import json

INPUT_CSV = "health.csv"
reader = pandas.read_csv(INPUT_CSV)

# remove data
reader = reader[(reader['Indicator'] == 'Household net adjusted disposable income') | (reader['Indicator'] == 'Life expectancy')]
reader = reader.drop(["LOCATION","INDICATOR","MEASURE","Measure","INEQUALITY","Inequality","Unit Code", "Unit", "PowerCode Code", "PowerCode", "Reference Period Code", "Reference Period","Flag Codes","Flags"],
                     axis=1)

#countries = reader


# het zijn niet de juiste waarde. Vraag om hulp!
reader = reader.pivot_table(values='Value', index='Country', columns='Indicator', aggfunc='mean')

countries = []
household_income = []
life_expectancy = []

for i in reader:
    if (i == "Life expectancy"):
        life_expectancy = reader[i].values
    else:
        household_income = reader[i].values
    #print(reader[i].values)
    index = reader[i].index
    for t in reader[i].index:
        #print(reader[i])
        #print(t)
        countries.append(t)
print(countries)
# print(LE)
# print(household_income)

dict = {}

for i in range(len(household_income)):
    dict[countries[i]] = {"life expectancy": life_expectancy[i], "household_income": household_income[i]}
    # print(countries[i], LE[i], HHNADI[i])
#print(eindproduct)



#reader = reader.set_index('Indicator')
reader = reader.to_json('health.json', orient="index")
