
// Job to notify users of their match
Parse.Cloud.job("notifyUsers", function(request, response) {

  Parse.Cloud.useMasterKey();

  // what we are returning overall, an array where each argument is an array of 3-4 user objects
  var dailyGroups = [];
  var names = [];
  var matches = [];
  var rsvps = [];

  var Users = Parse.Object.extend('User');
  var query = new Parse.Query(Users);
  query.ascending('createdAt');
  query.equalTo('channel', 'beta');
  query.find({ 
    success : function(users) {
      pullData(users);
      updateUserMatches(users);
      generateMatches(users);
      uploadMatches(users);},
      //emailUsers(users);},
    error : function(users, err) {
      console.log(JSON.stringify(err)); 
    }
  });

  //}).then(function(users) { 
  //  updateUserMatches(users);
  //}).then(function(users) {
  //  generateMatches(users);
  //}).then(function(users) {
  //  uploadMatches(users);
  //).then(emailUsers(users));
  //});

  function pullData(users) {
    //create name, match, rsvp arrays
    users.forEach(function(user, index, array) {
      names.push(user.get('fullname'));
      matches.push(user.get('matches'));
      if (user.get('rsvp')){
        rsvps.push(user.get('fullname'));
      }
    });
  }
    
  function updateUserMatches(users) {
    console.log('in updateUserMatches');
    // updates each users' matches object 
    users.forEach(function(user,index,array){
      var numMatches = Object.keys(matches[index]).length;
      // if new users need to be added
      if ( names.length > numMatches+1 ) {
        numMatches = numMatches===0 ? 0 : numMatches+1;

        for (numMatches; numMatches < names.length; numMatches++) {
          if (names[numMatches] !== names[index]) {
            matches[index][names[numMatches]]=0;
          }
        }
        // save to Parse
        users[index].set('matches', matches[index]);
        users[index].save();
      }       
    });
  }

  function generateMatches(users) { 
      
    // increments the matches of the users.
    var incrementMatches = function(user1, user2, stop) {
      var matchObj = getUser(user1).get('matches');
      matchObj[user2] = matchObj[user2] + 1;
      getUser(user1).set('matches', matchObj);
      getUser(user1).save();
    
      if (!stop) { 
        incrementMatches(user2, user1, true);
      }
    };

    while (rsvps.length > 0) {
  
      var currentUser = rsvps.splice(Math.floor(Math.random() * rsvps.length),1).shift();
      var currentMatchesByCount = new matchesByCount();

      // make random pairs until divisible by 3, then make groups of 3
      var match1 = currentMatchesByCount.randomMatch();
      if ( (rsvps.length + 2)%3 === 0 ) {
        var match2 = currentMatchesByCount.randomMatch();
        //update each users matchlist
        incrementMatches(match2, match1);
        incrementMatches(match2, currentUser);
        //add to daily group array
        dailyGroups.push([getUser(currentUser),getUser(match1),getUser(match2)]);
        console.log(currentUser+ ' was matched with ' + match1 + ' and ' + match2);
      } else {
        //add to daily group array
        dailyGroups.push([getUser(currentUser),getUser(match1)]);
        console.log(currentUser + ' was matched with ' + match1);
      }
        incrementMatches(currentUser, match1);
    }

    function matchesByCount() {
      var counts = getMatchesByCount();
      var keys = Object.keys(counts).sort( function(a,b) {return a-b;}); 
      var keyIndex = 0;

      function randomMatch () {
        // get the key for the array of names with lowest number of matches
        getLowestKeyVal();

        // match randomly from array 
        console.log('currentUser: ' + currentUser);
        console.log('keys: ' + keys + ', keyIndex: ' + keyIndex);
        console.log('counts[keys[keyIndex]]: ' + counts[keys[keyIndex]]);
        var matchNum = Math.floor(Math.random() * counts[keys[keyIndex]].length);
        console.log('matchNum: ' + matchNum);
        var match = counts[keys[keyIndex]][matchNum];

        // remove from RSVP array
        var index = rsvps.indexOf(match);
        rsvps.splice(index,1);
          
        // remove from counts array
        counts[keys[keyIndex]].splice(matchNum,1);

        return match;
      }// randomMatch

      function getMatchesByCount() {
        var matchesByName = getMatchesByName();
        var matchesByCount = {};
        for(var name in matchesByName) {
          if( matchesByCount.hasOwnProperty(matchesByName[name]) ){
            matchesByCount[matchesByName[name]].push(name);
          }else{
            matchesByCount[matchesByName[name]] = [name];
          }
        }
        return matchesByCount;
      }// getMatchesByCount

      function getMatchesByName() {
        var currentUserMatches = {};
        for (var i = 0; i<users.length; i++) {
          if ( currentUser === users[i].get('fullname') ) {
            currentUserMatches = users[i].get('matches');
            break;
          }
        }
        var matchesByName = {};
        rsvps.forEach( function(rsvp) {
          for (var match in currentUserMatches) {
            if (rsvp === match){
              matchesByName[rsvp] = currentUserMatches[match];
              break;
            }
          }
        });
        return matchesByName;
      }// getMatchesByName

      function getLowestKeyVal() {
        if ( counts[keys[keyIndex]].length === 0 ) {
            keyIndex += 1;
        }
      }// getLowestKeyVal
      return {randomMatch:randomMatch};

    }// matchesByCount
 
    // getUser returns the User object if matched with a fullname
    function getUser(fullname) {
      var result = {};
      users.forEach( function(user, index, array) {
        if ( fullname === user.get('fullname') ) {
          result = user;
        }
      });
      return result;
    }// getUser

 }// generateMatches 
  
  // Upload matches to the Matches class on Parse
  function uploadMatches() {
    var Matches = Parse.Object.extend('Matches');
    var matchArray = new Matches();
    matchArray.save({matches: dailyGroups});
  }
  
  function emailUsers() {
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
    for (var i = 0; i < dailyGroups.length; i++) {
      notifyUsers(dailyGroups[i]);
    }
  }

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
