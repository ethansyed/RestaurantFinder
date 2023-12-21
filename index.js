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
    let doc = nlp(text)
    let restaurantName = doc.match('#Possessive #Noun').text() || doc.possessives().out('text') || doc.match('#Noun').text()
    restaurantName = restaurantName.replace(/[^a-zA-Z0-9]/g, '')
    restaurantName = restaurantName.toLowerCase()

    return restaurantName;
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

// Search for a subreddit
//have user input valid city
const subredditName = 'austin'; // Replace with the keyword provided by the user
//reddit.searchSubredditNames({query: subredditName}).then(console.log)
let restNameArr = [];

reddit.search({
    query: 'best restaurants',
    subreddit: subredditName,
    sort: 'hot',
    time: 'year',
    limit : 10
}).then(threadList =>{
    for(let i = 0; i < threadList.length; i++){
        let threadHeadID = threadList.at(i).id //string 
        reddit.getSubmission(threadHeadID).comments.fetchAll({limit: 10}).then(comments => {
            comments.forEach(comment => {
                //console.log('\n Original comment: ' + comment.body.replace(/(\r\n|\n|\r)/gm, " ")); // Print the body of each comment without line break characters
                let temp = extractRestaurantName(comment.body)
                console.log('\nExtracted name: ' + temp);
                restNameArr.push(temp);
            });
            console.log(restNameArr)
        })
    }
    //restNameArr = extractMultipleMentions(restNameArr)
    //console.log(restNameArr)
})


// reddit.searchSubredditNames({ query: subredditName })
//   .then(subredditNames => {
//     // Get the first subreddit from the search results
//     const subreddit = reddit.getSubreddit(subredditNames[0]);

//     // Fetch the first 10 threads in the subreddit
//     return subreddit.getHot({ limit: 10 });
//   })
//   .then(threads => {
//     // Iterate through the threads
//     threads.forEach(thread => {
//       console.log('\nTitle:', thread.title);
//       console.log('URL:', thread.url);

//       // Fetch the first 10 comments of each thread
//       thread.getComments({ limit: 10 })
//         .then(comments => {
//           console.log('\nComments:');
//           comments.forEach(comment => {
//             console.log(comment.body);
//           });
//         })
//         .catch(error => {
//           console.error('Error fetching comments:', error.message);
//         });
//     });
//   })
//   .catch(error => {
//     console.error('Error searching subreddit:', error.message);
//   });
