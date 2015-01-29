
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

  var getUser = function(user) {
    for (var i in userArray) {
      if ( user === userArray[i].get('fullname') )
        break;
    }
    return userArray[i];
  };
  var randomMatch = function () {
    var matchNum = Math.floor(Math.random() * lowestCountList.length);
    var match = lowestCountList[matchNum];
    rsvps.splice(matchNum,1);
    lowestCountList.splice(matchNum,1);
    if ( lowestCountList.length <= 0 ) {
      for (k; !matchesByCount.hasOwnProperty(k);  k++){}
      lowestCountList = matchesByCount[k];
    }
    return match;
  };

  var incrementMatches = function(match1, match2) {

    var matchObj = getUser(match1).get('matches');
    matchObj[match2] = matchObj[match2] + 1;
    getUser(match1).set('matches', matchObj);
    getUser(match1).save();
    incrementMatches(match2, match1);
  };

  // repeat code until we have matched everyone who RSVPed
  while (rsvps.length > 0) {

    var currentRSVP = rsvps.shift();
    var currentMatches = {};

    //match first person in rsvp list with their User name
    for(var i = 0; i<users.length; i++) {
        if (currentRSVP  === users[i]) {
          currentMatches = matches[i];
          break;
        }
    }

    //make an rsvp list for this person
    var matchesByName = {};
    for(var ii = 0; ii<rsvps.length; ii++) {
        for (var jj in currentMatches){
          if ( rsvps[ii] === jj ) {
            matchesByName[jj] = currentMatches[jj];
            break;
          }
        }
    }

    //swap key-value-pairs (keys become values and vice versa)
    var matchesByCount = {};
    for(var j in matchesByName) {
      if( matchesByCount.hasOwnProperty(matchesByName[j]) ){
        matchesByCount[matchesByName[j]].push(j);
      }else{
        matchesByCount[matchesByName[j]] = [j];
      }
    }

    //get the list of names with lowest number of matches
    var k = 0;
    for (k; !matchesByCount.hasOwnProperty(k);  k++){}
    var lowestCountList = matchesByCount[k];


    //create a matches randomly
    var match1 = randomMatch();

    if (rsvps.length%3 === 0) {
      var match2 = randomMatch();

      //update each users matchlist
      incrementMatches(match2, match1);
      incrementMatches(match2, currentRSVP);
      //add to daily group array
      dailyGroups.push([getUser(currentRSVP),getUser(match1),getUser(match2)]);
      console.log(currentRSVP + ' was matched with ' + match1 + ' and ' + match2);
    } else {
      //add to daily group array
      dailyGroups.push([getUser(currentRSVP),getUser(match1)]);
      console.log(currentRSVP + ' was matched with ' + match1);
      incrementMatches(currentRSVP, match1);
    }
  }

  uploadMatches(dailyGroups);
  notifyMatches(dailyGroups);
});

  // Upload matches to the Matches class on Parse
  var uploadMatches = function(matchGroup) {
    var Matches = Parse.Object.extend('Matches');
    var matchArray = new Matches();

    // console.log('Uploading matches..');

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

    //  console.log('Sending emails to ' + userEmails.join(', '));
     // Call the SendGrid api to send the emails
     sendgrid.sendEmail({
       to: userEmails,
       from: 'lunchreactor@gmail.com',
       subject: 'View Today\'s Lunch Match!',
       html: userDetails + '<br>'
     }, {
       success: function(httpResponse) {
         console.log(httpResponse);
         response.success("Email sent!");
       },
       error: function(httpResponse) {
         console.error(httpResponse);
         response.error("Uh oh, something went wrong");
       }
     });
   };

   // Loop through the matches to notify every set of users
   for (var i = 0; i < matchGroup.length; i++) {
    //  console.log('Notifying Group ' + i);
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
