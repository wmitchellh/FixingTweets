const Twitter = require('twitter');
const config = require('./config.js');
const fs = require('fs');
const path = require('path');

//for Google Cloud Storage

//1. Install Gsutil
//2. Enable Google Cloud storage
//3. Create New bucket
//      -multiregional
//      -bucket level permissions
//4. Set bucket to public
//5. Set permissions of user to storageAdmin
//    go to console
//    Select Edit permissions from the drop-down menu.
//    In the overlay that appears, click the + Add item button.
//    Add a permission for allUsers.
//    Select User for the Entity.
//    Enter allUsers for the Name.
//    Select Reader for the Access.


//6 API permissions Create Service Account Key
//    -- download json
//    -- add to gitignore
//7. Create and save authentication json file
//8. Commit and push authentication json file
//9. Test authentication using
//gc.getBuckets().then(x => console.log(x));
//10. Run twitter logic
//11 save file to GCS
// helpful for config or Google Cloud storage  https://www.youtube.com/watch?v=pGSzMfKBV9Q
//12. set url for ajax request
//    https://www.googleapis.com/download/storage/v1/b/[bucket]/o/[filename.json]?alt=media

const {Storage} = require('@google-cloud/storage');
const gc = new Storage({
  keyFilename: path.join(__dirname, '487hedrickgmproject-d0800362af70.json'),
  projectId: 'hedrickgmproject'
});

// add bucekt config json and push
//for testing authentication
//gc.getBuckets().then(x => console.log(x));

// saving file to GCS
const stream     = require('stream'),
      dataStream = new stream.PassThrough(),
      gcFile     = gc.bucket('mh-api-project').file('tweets.json')


// name of GCS bucket
const storageBucket = gc.bucket('mh-api-project');
//console.log(storageBucket);



//Start of twitter logic
const T = new Twitter(config);
console.log("Launching twitter-bot script");




// Set up your search parameters
const params = {
  q: '#chileprotests',
  count: 10,
  result_type: 'recent',
  lang: 'en'
}

// Initiate your search using the above paramaters
T.get('search/tweets', params, (err, data, response) => {
  // If there is no error, proceed
  if(err){
    return console.log(err);
  }

var tweets = [];
  for(var i = 0; i < data.statuses.length; i++){
      // Get the tweet Id from the returned data
      tweets.push({id: data.statuses[i].id_str, text: data.statuses[i].text});
      var id = { id: data.statuses[i].id_str }
      //console.log(tweets);
    };

//JSON.stringify({array: tweets});
//console.log(JSON);
completeData = JSON.stringify(tweets);
var thePath = __dirname;
console.log(__dirname);
console.log(thePath);
var theFile = __dirname + '/tweetsVar.json'
//fs.writeFileSync(theFile, completeData);

//saving file to GCS
dataStream.push(completeData)
dataStream.push(null)

function saveFile(){
  console.log('saving file...');
return new Promise((resolve, reject) => {
  dataStream.pipe(gcFile.createWriteStream({
    resumable  : false,
    validation : false,
    metadata   : {'Cache-Control': 'public, max-age=31536000'}
  }))
  // .on('error', (error : Error) => {
  //   reject(error)
  // })
  // .on('finish', () => {
  //   resolve(true)
  // })
})
}


//console.log(completeData);

saveFile();
console.log("saved to GCS");
console.log("https://storage.cloud.google.com/mh-api-project/tweets.json");
// console.log("----- saved as " + theFile + "----- ");
// console.log("----- saved as " + thePath + "/tweetsFile.json ----- ");


  // Loop through the returned tweets
  // const tweetsId = data.statuses
  //   .map(tweet => ({ id: tweet.id_str }));
  //
  // tweetsId.map(tweetId => {
  //   T.post('favorites/create', tweetId, (err, response) => {
  //     if(err){
  //       return console.log(err[0].message);
  //     }
  //
  //     const username = response.user.screen_name;
  //     const favoritedTweetId = response.id_str;
  //     console.log(`Favorited: https://twitter.com/${username}/status/${favoritedTweetId}`);
  //
  //   });
  //
  // });
    //console.log(tweetsDesc);
});
