
// Job to notify users of their match
Parse.Cloud.job("notifyUsers", function(request, response) {

  /*********************************
   *   Matching Section
   ********************************/

var allUsers = [];
var users = [];
var matches = [];
var rsvps = [];

Parse.Cloud.useMasterKey();

var updateMatches = function(callback) {

  //pull all users
  var Users = Parse.Object.extend('User');
  var query= new Parse.Query(Users);
  query.ascending('createdAt');
  query.equalTo('channel', 'beta');
  query.find({
    success: function(userArray) {

      //create name, match, rsvp arrays
      for (var i = 0; i<userArray.length; i++) {
        var object = userArray[i];
        users.push(object.get('fullname'));
        matches.push(object.get('matches'));
        if (object.get('rsvp')){
          rsvps.push(object.get('fullname'));
        }
      }
      //For each user, Add new users to their match list
      for(var j = 0; j<users.length; j++) {

        //mactchListLength equals num key-value-pairs or 0 if undefined
        var matchListLength = matches[j]?Object.keys(matches[j]).length:0;

        //if total number of users > than this users matchlist + 1
        //(add 1 to matchlist side because you don't include yourself in your own
        //match list.
        if ( users.length > matchListLength+1 ) {

            //if matchListLength != 0, add 1 to it.
            var k = matchListLength===0?0:matchListLength+1;

            // add users, check to make sure we are not added ourself
            for (k; k<users.length; k++) {
              
              // dont add yourself
              if (users[k] !== users[j]) {
                matches[j][users[k]]=0;
              }
            }
            // save to Parse
            userArray[j].set('matches', matches[j]);
            userArray[j].save();
        }
      }
  }
}).then(function(userArray){

  // what we are returning overall, an array where each argument is an array of 3-4 user objects
  var dailyGroups = [];

  // repeat code until we have matched everyone who RSVPed
  while (rsvps.length > 0) {

    var currentRSVP = rsvps.shift();
    var currentMatches = {};

    //match first person in rsvp list with their User name
    for(var i = 0; i<users.length; i++) {
        //console.log('for ' + i + ' ' + users[i]);
        if (currentRSVP  === users[i]) {
          currentMatches = matches[i];
          break;
        }
    }

    //make an rsvp list for this person
    var matchesByName = {};
    //console.log('matchesByName: ' + JSON.stringify(matchesByName));
    for(var ii = 0; ii<rsvps.length; ii++) {
        //console.log('for ' + ii);
        for (var jj in currentMatches){
          //console.log('rsvps[ii]: ' + rsvps[ii] + ' jj: '+ jj);
          if ( rsvps[ii] === jj ) {
            matchesByName[jj] = currentMatches[jj];
            break;
          }
        }
    }


    //console.log('matchesByName: ' + JSON.stringify(matchesByName));

    var matchesByCount = {};

    //swap key-value-pairs (keys become values and vice versa)
    //console.log('Current Matches: ' + JSON.stringify(matchesByName));
    for(var j in matchesByName) {
      if( matchesByCount.hasOwnProperty(matchesByName[j]) ){
        matchesByCount[matchesByName[j]].push(j);
      }else{
        matchesByCount[matchesByName[j]] = [j];
      }
    }

    //console.log('RSVPS: ' + rsvps);
    //console.log('matchesByCount: ' + JSON.stringify(matchesByCount));

    //get the list of names with lowest number of matches
    var k = 0;
    for (k; !matchesByCount.hasOwnProperty(k);  k++){}
    var lowestCountList = matchesByCount[k];

    //console.log('lowestCountList: ' + lowestCountList);
    //console.log('Random number gerenated: ' + Math.floor(Math.random() * lowestCountList.length));

    //create a matches randomly
    var matchNum = Math.floor(Math.random() * lowestCountList.length);
    var match1 = lowestCountList[matchNum];
    rsvps.splice(matchNum,1);
    lowestCountList.splice(matchNum,1);
    if ( lowestCountList.length <= 0 ) {
      for (k; !matchesByCount.hasOwnProperty(k);  k++){}
      lowestCountList = matchesByCount[k];
    }
    matchNum = Math.floor(Math.random() * lowestCountList.length);
    var match2 = lowestCountList[matchNum];
    rsvps.splice(matchNum,1);
    lowestCountList.splice(matchNum,1);
    if ( lowestCountList.length <= 0 ) {
      for (k; !matchesByCount.hasOwnProperty(k);  k++){}
      lowestCountList = matchesByCount[k];
    }
    //if there are not enough to make groups of three evenly, create 1-2 gropus of 4
    if (rsvps.length%3 > 0) {
      matchNum = Math.floor(Math.random() * lowestCountList.length);
      var match3 = lowestCountList[matchNum];
      rsvps.splice(matchNum,1);
      lowestCountList.splice(matchNum,1);
      if ( lowestCountList.length <= 0 ) {
        for (k; !matchesByCount.hasOwnProperty(k);  k++){}
        lowestCountList = matchesByCount[k];
      }

      //update match3's matchlist
      //userArray[match3].matches.set(currentRSVP, userArray[match3].matches[currentRSVP] + 1);
      //userArray[match3].matches.set(match2, userArray[match3].matches[match2] + 1);
      //userArray[match3].matches.set(match1, userArray[match3].matches[match1] + 1);
      //userArray[match3].save();

      console.log(currentRSVP + ' was matched with ' + match1 + ' and ' + match2 + ' and ' + match3 + '!');
      //add to daily group array
      dailyGroups.push([currentRSVP,match1,match2,match3]);
    } else {
      console.log(currentRSVP + ' was matched with ' + match1 + ' and ' + match2 + '!');
      //add to daily group array
      dailyGroups.push([currentRSVP,match1,match2]);
    }

    console.log('RSVPS: ' + rsvps);

    //update each users matchlist
    //userArray[currentRSVP].matches.set(match1, userArray[currentRSVP].matches[match1] + 1);
    //userArray[currentRSVP].matches.set(match2, userArray[currentRSVP].matches[match2] + 1);

    //userArray[match1].matches.set(currentRSVP, userArray[match1].matches[currentRSVP] + 1);
    //userArray[match1].matches.set(match2, userArray[match1].matches[match2] + 1);

    //userArray[match2].matches.set(currentRSVP, userArray[match2].matches[currentRSVP] + 1);
    //userArray[match2].matches.set(match1, userArray[match2].matches[match1] + 1);
    //userArray[currentRSVP].save();
    //userArray[match1].save();
    //userArray[match2].save();
  }

  console.log(dailyGroups);
  uploadMatches(dailyGroups);
  notifyMatches(dailyGroups);

  });

  // Upload matches to the Matches class on Parse
  var uploadMatches = function(matchGroup) {
    var Matches = Parse.Object.extend('Matches');
    var matchArray = new Matches();

    console.log('Uploading matches..');

    matchArray.save({matches: matchGroup});
  };

  /*********************************
   *   Email Section
   ********************************/

 // Notify a 2d array of matches
 var notifyMatches = function(matchGroup) {

   // Set up the SendGrid parameters
   var sendgrid = require("sendgrid");
   sendgrid.initialize("LunchReactor", "hackreactor0");

   // Send a notification email to an array of users
   var notifyUsers = function(userGroup) {
     var userEmails = [];
     var userDetails = 'Check out your group for today\'s lunch!<br><br><br>';

     // Set email recipients and their message content
     for (var j = 0; j < userGroup.length; j++) {
       userEmails.push(userGroup[j].get('email'));
       userDetails += '<b>' + userGroup[j].get('fullname') + '</b><br>' +
                      userGroup[j].get('email') + '<br>' +
                      userGroup[j].get('signature') + '<br><br>';
     }

     // Call the SendGrid api to send the emails
    //  sendgrid.sendEmail({
    //    to: userEmails,
    //    from: 'lunchreactor@gmail.com',
    //    subject: 'View Today\'s Lunch Match!',
    //    html: userDetails + '<br>'
    //  }, {
    //    success: function(httpResponse) {
    //      console.log(httpResponse);
    //      response.success("Email sent!");
    //    },
    //    error: function(httpResponse) {
    //      console.error(httpResponse);
    //      response.error("Uh oh, something went wrong");
    //    }
    //  });
   };

   // Loop through the matches to notify every set of users
   for (var i = 0; i < matchGroup.length; i++) {
     console.log('Notifying Group ' + i);
     console.log(matchGroup[i]);
     notifyUsers(matchGroup[i]);
   }
 };

};


  console.log("Starting");
  //getMatches();
  updateMatches();

});

// Job to reset users RSVPs (to be run at midnight)
Parse.Cloud.job("resetRSVPs", function(request, response) {
  Parse.Cloud.useMasterKey();

  var query = new Parse.Query(Parse.User);

  query.find({
    success: function(users) {
      for (var i = 0; i < users.length; i++) {
        users[i].set('rsvp', false);
        users[i].save();
      }
    }
  });
});
