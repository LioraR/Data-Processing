import pandas
import csv
import json
import matplotlib.pyplot as plt

INPUT_CSV = 'input.csv'


def cleaner(filename):
    """
    load data into pandas DataFrame and preprocess the rows
    """
    reader = pandas.read_csv(filename)

    reader['GDP ($ per capita) dollars'] = reader['GDP ($ per capita) dollars'].\
        str.strip(' dollars')
    reader['GDP ($ per capita) dollars'] = \
        pandas.to_numeric(reader['GDP ($ per capita) dollars'],  errors='coerce')

    reader['Infant mortality (per 1000 births)'] =\
        reader['Infant mortality (per 1000 births)'].str.replace(",", ".")
    reader['Infant mortality (per 1000 births)'] =\
        pandas.to_numeric(reader['Infant mortality (per 1000 births)'],  errors='coerce')

    reader.replace("unkown", None)

    return reader


def Central_Tendency(reader):
    """
    calculate the standard deviation, mean, median and mode of the GDP
    """
    mean = reader['GDP ($ per capita) dollars'].mean(axis=0)
    print(mean)
    standard_deviation = reader['GDP ($ per capita) dollars'].std()
    print(standard_deviation)
    median = reader['GDP ($ per capita) dollars'].median()
    print(median)
    mode = reader['GDP ($ per capita) dollars'].mode()[0]
    print(mode)

    # calculate outliers
    outliers_max = mean+3*standard_deviation
    outliers_min = mean-3*standard_deviation

    reader['GDP ($ per capita) dollars'].mask(reader['GDP ($ per capita) dollars']
                                              > outliers_max, inplace=True)
    reader['GDP ($ per capita) dollars'].mask(reader['GDP ($ per capita) dollars']
                                              < outliers_min, inplace=True)


def histogram(reader):
    """
    plot a formatted histogram
    """
    reader['GDP ($ per capita) dollars'].hist(bins=50)
    plt.xlabel('GDP', fontsize=12, fontweight='bold')
    plt.ylabel('Frequentie', fontsize=12, fontweight='bold')
    plt.title('by Liora Rosenberg')
    plt.suptitle('GDP ($ per capita) dollars', fontsize=16, fontweight='bold')
    plt.show()


def five_number_summary(reader):
    """
    calculate the five_number_summary of Infant mortality
    """
    five_number_summary = reader['Infant mortality (per 1000 births)'].describe()[["min","25%", "50%", "75%", "max"]]
    print(five_number_summary)


def boxplot(reader):
    """
    create a boxplot
    """
    plt.style.use('ggplot')
    reader['Infant mortality (per 1000 births)'].plot.box()
    plt.title('by Liora Rosenberg')
    plt.suptitle('Infant mortality (per 1000 births)', fontsize=16, fontweight='bold')
    plt.show()


def jason(reader):
    """
    cleane, preprocesse and analyze data to a jason file
    """
    # keep only the relevant columns
    reader = reader.drop(['Population', 'Area (sq. mi.)', 'Coastline (coast/area ratio)',
                          'Net migration', 'Literacy (%)', 'Phones (per 1000)', 'Arable (%)', 'Crops (%)',
                          'Other (%)', 'Climate', 'Birthrate', 'Deathrate', 'Agriculture', 'Industry', 'Service'], axis=1)
    reader['Region'] = reader['Region'].str.strip()

    reader = reader.set_index('Country')
    reader.to_json('x.json', orient="index")
    # json.dump()


if __name__ == "__main__":
    reader = cleaner(INPUT_CSV)
    Central_Tendency(reader)
    histogram(reader)
    five_number_summary(reader)
    boxplot(reader)
    jason(reader)
