# Liora Rosenberg
# Student number: 11036435

import pandas
import csv
import json

INPUT_CSV = "life.csv"
reader = pandas.read_csv(INPUT_CSV)

# remove data
reader = reader.drop(["Country Code","Indicator Name","Indicator Code","1960","1961","1962","1963","1964","1965","1966","1967","1968","1969","1970","1971","1972","1973","1974","1975","1976","1977","1978","1979","1980","1981","1982","1983","1984","1985","1986","1987","1988","1989","1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2017","x"],
                    axis=1)

print(reader)

reader = reader.set_index('Country Name')
reader = reader.to_json('life.json', orient="index")
