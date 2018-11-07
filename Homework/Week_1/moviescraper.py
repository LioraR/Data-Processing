#!/usr/bin/env python
# Name:
# Student number:
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    list_actor = []
    list_actor_movies = ''
    list_title = []

    # extracting information about titles
    lines = dom.find_all('a')
    for line in lines:
        if "title" in line.get('href') and "adv_li_tt" in line.get('href'):
            list_title.append(line.string)

            # append when all actors in movie are scanned
            if len(list_title) > 1:
                list_actor.append(list_actor_movies[:-2])
                list_actor_movies = ''

        # extracting information about actors
        if "name" in line.get('href') and "adv_li_st" in line.get('href'):
            list_actor_movies += line.string + ', '

    list_actor.append(list_actor_movies[:-2])

    # extracting information about ratings
    list_rating = []
    ratings = dom.find_all("div", {"class": "inline-block ratings-imdb-rating"})
    for rating in ratings:
        list_rating.append(float(rating.attrs["data-value"]))

    # extracting information about year of release
    list_year_of_release = []
    year_of_releases = dom.find_all('span', class_= "lister-item-year")
    for year_of_release in year_of_releases:
        list_year_of_release.append(year_of_release.string.strip('()')[-4:])

    # extracting information about runtime
    list_runtime = []
    runtimes = dom.find_all('span')
    for runtime in runtimes:
        if runtime.get('class') is not None and "runtime" in runtime.get('class'):
            list_runtime.append(runtime.string.strip(' min'))

    # straks weghalen
    print(list_title)
    print(list_actor)
    print(list_rating)
    print(list_year_of_release)
    print(list_runtime)
    print(len(list_actor))

    return [list_title, list_rating, list_year_of_release, list_actor, list_runtime]

def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # movies are assigned to disk
    for movie in range(len(movies[0])):
        writer.writerow([movies[0][movie], movies[1][movie], movies[2][movie], movies[3][movie], movies[4][movie]])

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
