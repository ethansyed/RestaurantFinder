import praw
import spacy
import re
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Reddit API credentials
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
USERNAME = os.getenv('USERNAME')
PASSWORD = os.getenv('PASSWORD')
USER_AGENT = os.getenv('USER_AGENT')

# Initialize PRAW instance
reddit = praw.Reddit(client_id=CLIENT_ID,
                     client_secret=CLIENT_SECRET,
                     username=USERNAME,
                     password=PASSWORD,
                     user_agent=USER_AGENT)

# Load English NLP model from spaCy
nlp = spacy.load("en_core_web_sm")

def extract_restaurant_name(text):
    doc = nlp(text)
    restaurant_name = doc.ents[0].text if doc.ents else None
    if restaurant_name:
        restaurant_name = re.sub(r'[^a-zA-Z0-9]', '', restaurant_name)
        restaurant_name = restaurant_name.lower()
    return restaurant_name

def extract_multiple_mentions(rest_name_arr):
    string_count = {}
    result_array = []
    for item in rest_name_arr:
        string_count[item] = string_count.get(item, 0) + 1
        if string_count[item] == 2:
            result_array.append(item)
    return result_array

def main():
    rest_name_arr = []

    # Input valid city
    subreddit_name = 'austin'  # Replace with the keyword provided by the user

    # Search for threads in the subreddit
    for submission in reddit.subreddit(subreddit_name).search('best restaurants', sort='relevance', limit=1):
        # Process comments in each thread
        for comment in submission.comments.list():
            print('\nOriginal text:', comment.body)
            temp = extract_restaurant_name(comment.body)
            print('\nExtracted name:', temp)
            if temp:
                rest_name_arr.append(temp)

    # Filter restaurant names that occur more than once
    rest_name_arr = extract_multiple_mentions(rest_name_arr)
    print(rest_name_arr)

if __name__ == "__main__":
    main()
