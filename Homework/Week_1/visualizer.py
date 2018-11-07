#!/usr/bin/env python
# Name: Liora Rosenberg
# Student number: 110
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# open movies.CSV
with open('movies.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)

    # import year of release and rating to dictonary
    for row in reader:
        data_dict[row['Year']].append(float(row['Rating']))

# make list for x and y-axis
x=[]
y=[]

# calculate the average rating per year
for year in data_dict:
    value =data_dict[year]
    average_rating = sum(value)/len(value)
    x.append(year)
    y.append(average_rating)

# plot graph in matplotlib
plt.plot(x, y, color='g', linewidth=3.0)
plt.title('created by Liora Rosenberg')
plt.suptitle('Average Movie Rating per Year', fontsize=16, fontweight='bold')
plt.xlabel('Year', fontsize=12, fontweight='bold')
plt.ylabel('Rating', fontsize=12, fontweight='bold')

#background color
ax = plt.gca()
ax.set_facecolor('#b0fc64')

plt.show()

if __name__ == "__main__":
    print(data_dict)
