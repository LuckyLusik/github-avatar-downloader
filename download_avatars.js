var request = require('request');
var fs = require('fs');
var token = require ('./secrets.js');
var repoOwnerReal = process.argv[2];
var repoNameReal = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + token.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var jsonN = JSON.parse(body);
    cb(err, jsonN);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)               // Note 1
       .on('error', function (err) {                                   // Note 2
         throw err;
       })
       .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(repoOwnerReal, repoNameReal, function(err, result) {
  if (err){
    console.log("Errors:", err);
  }
  for (var arr of result){
    downloadImageByURL(arr.avatar_url, "./avatars/" + arr.login + ".jpg");
  }
  console.log("Download complete.");
});

