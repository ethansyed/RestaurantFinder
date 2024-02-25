const snoowrap = require('snoowrap');
const nlp = require('compromise');
require('dotenv').config();


//const RedditContent = require('snoowarp');
// const Listing = require('snoowrap');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const USER_AGENT = process.env.USER_AGENT;

// Initialize Snoowrap instance
const reddit = new snoowrap({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  username: USERNAME,
  password: PASSWORD,
  userAgent: USER_AGENT,
});

//Currently thinking of 2 ways to extract :

//1. Look based off of possesives - ie "Lisa's Chicken"
//  We can take the possesive + 1 extra word

//2. Look for a title based off of all caps

//Can be fined tuned 
function extractRestaurantName(text) {
    // const doc = nlp(text);
    // const restaurantName = doc.possessives().out('text');
    // let doc = nlp(text)
    // let restaurantName =  doc.match('#Person #Noun').text()
    // // || doc.match('#Possessive #Noun').text() || doc.possessives().out('text')
    // restaurantName = restaurantName.replace(/[^a-zA-Z0-9]/g, '')
    // restaurantName = restaurantName.toLowerCase()

    // Use a regular expression to match capitalized words
    const regex = /\b[A-Z][a-z']+\b/g;
    const matches = text.match(regex);

    // Filter out common non-restaurant words
    const filteredMatches = matches.filter(name => !['the', 'and', 'is', 'in', 'on', 'at'].includes(name.toLowerCase()));

    // Join the filtered matches into a single string
    return filteredMatches.join(', ');
}

//If a restaurant name does not occur more than once, remove it from the list
//Eventually can be changed to listen to other metrics
function extractMultipleMentions(restNameArr){
    const stringCount = {};
    const resultArray = [];

    restNameArr.forEach((item) => {
        stringCount[item] = (stringCount[item] || 0) + 1;
        if (stringCount[item] === 2) {
        resultArray.push(item);
        }
    });

    return resultArray;
}

restNameArr = []

//input valid city
const subredditName = 'austin'; // Replace with the keyword provided by the user
  
reddit.search({
query: 'best restaurants',
subreddit: subredditName,
sort: 'relevance',
time: 'all',
limit: 0,
})
.then(threadList => {
    return processThreadList(threadList);
})
.then(() => {
    restNameArr = extractMultipleMentions(restNameArr) // not a good filtering method
    console.log(restNameArr);
})
.catch(error => {
    console.error('Error searching subreddit:', error.message);
});


async function processThreadList(threadList) {
    for (let i = 0; i < threadList.length; i++) {
      let threadHeadID = threadList[i].id;
      await processComments(threadHeadID);
    }
}
  
async function processComments(threadHeadID) {
    let comments = await reddit.getSubmission(threadHeadID).comments.fetchAll({ limit: 1 });

    for (let comment of comments) {
        console.log('\nOriginal text: ' + comment.body);
        let temp = extractRestaurantName(comment.body);
        console.log('\nExtracted name: ' + temp);
        restNameArr.push(temp);
    }
}
