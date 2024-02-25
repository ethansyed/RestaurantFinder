# Local Restaurant Finder

## Purpose
To easily find and recommend highly rated **locally** owned restaurant's / food stops\

#### Personal Context
One of my hobbies is finding local restuarants / mom & pop shops in my city to visit\
I tend to use a multitude of different apps and tools to find these restuarant's\
I have found that Google & Yelp reccomendations do not typically fufill my needs\
My goal is to streamline this process and have highly rated locally owned restaurant's presented to the user

## Structure & Plans

### Current State
Currently serves as an API endpoint that takes a city name and parses reddit to find posts containing positive sentiment about locally owned restaurants.\
The endpoint returns a list of restaurants identified

### Future Plans
- Build a frontend for Users to visually interact with
- Transition JavaScript codebase to Python
- Integrate more social media apis (Instagram, Facebook,  )
- Cross reference the spots with reviews on Google Maps (Google My Business API); ensure the resturants are above an arbitrary x / 5 rating

## Technologies Utilized
- JavaScript
- HTML
- Python (WIP)
- React.js (WIP)

## Challenges 

#### Recognizing Restaurant Names
Methodology used to recognize names in strings returned from social media posts are crude / rudimentary
Many restaurant names are not properly capitalized and are ill formated in social media posts
**Potential Solutions**
- Utilize an open source NLP model to recognize ill formatted names within a string
- Utilize beter regex patterns in order to get a better basic parse
