
// Job to notify users of their match
Parse.Cloud.job("notifyUsers", function(request, response) {

  /*********************************
   *   Matching Section
   ********************************/

var users = [];
var matches = [];
var rsvps = [];

Parse.Cloud.useMasterKey();

var updateMatches = function(callback) {
    
  //pull all users
  var Users = Parse.Object.extend('User');
  var query= new Parse.Query(Users);
  query.ascending('createdAt');
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
      console.log('Users: ' + users);
      console.log('Matches: ' + JSON.stringify(matches));
      console.log('RSVPS: ' + rsvps);

      //For each user, Add new users to their match list
      for(var j = 0; j<users.length; j++) {
        
          
        //mactchListLength equals num key-value-pairs or 0 if undefined  
        var matchListLength = matches[j]?Object.keys(matches[j]).length:0;
        
        //if total number of users > than this users matchlist + 1
        if ( users.length > matchListLength+1 ) {

            //if matchListLength != 0, add 1 to it.
            var k = matchListLength===0?0:matchListLength+1;

            // add users, check to make sure we are not added ourself
            for (k; k<users.length; k++) {
              if (users[k] !== users[j]) {
                matches[j][users[k]]=0; 
              } 
            }
            userArray[j].set('matches', matches[j]); 
            userArray[j].save();
        }
      }
  }
}).then(function(userArray){
  
  var current_rsvp = rsvps.shift();
  console.log('current_rsvp: ' + current_rsvp);
  console.log('RSVPS: ' + rsvps);
  console.log('typeof rsvps: ' + typeof rsvps);
  console.log('typeof current_rsvp: ' + typeof current_rsvp);
  var current_matches = {};
    
  //match first person in rsvp list with their User name 
  for(var i = 0; i<users.length; i++) {
      console.log('for ' + i + ' ' + users[i]);
      if (current_rsvp  === users[i]) {
        current_matches = matches[i];
        break;
      }
  }  
  //var oldmatches = matches;
  var matchesByCount = {};

  //swap key-value-pairs (keys become values and vice versa)
  console.log('Current Matches: ' + JSON.stringify(current_matches));
  for(var j in current_matches) {
    if( matchesByCount.hasOwnProperty(current_matches[j]) ){
      matchesByCount[current_matches[j]].push(j);
    }else{
      matchesByCount[current_matches[j]] = [j];
    }
  }

  console.log('RSVPS: ' + rsvps);
  console.log('matchesByCount: ' + JSON.stringify(matchesByCount));

  //get the list of names with lowest number of matches
  var k = 0; 
  for (k; !matchesByCount.hasOwnProperty(k);  k++){}
  var lowestCountList = matchesByCount[k];
  console.log('lowestCountList: ' + lowestCountList);
  console.log('Random number gerenated: ' + Math.floor(Math.random() * lowestCountList.length));
  var match = lowestCountList[Math.floor(Math.random() * lowestCountList.length)];
  console.log(current_rsvp + ' was matched with ' + match + '!');

  });
};
     

  console.log("Starting");
  //getMatches(); 
  updateMatches();

//  var getMatches = function(){
//    getRSVPs(function(rsvps){
//      updateMatches(function(users){
//      //while(rsvps.length > 0) {
//
//        //match first person in rsvp list with their User object  
//        for(var i = 0; i<users.length; i++) {
//            if (rsvps[0] === users[i].fullname)
//                break;
//        }  
//        var matches = users[i].matches;
//        var newmatches = {};
//
//        //make a new object where the keys are digits  that are the number
//        //times you've matched a person and  
//        //their value pairs as an array of names with whom you've been
//        //matched n times.
//        for(var j in matches) {
//          if(newmatches.hasOwnProperty(matches[j]) && rsvps.find(function(el){if( el === matches[j] ) return true;})) {
//              newmatches[matches[j]].push(j);
//          }else{
//              mewmatches[matches[j]] = [j];
//          }
//        }
//
//        console.log(rsvps);
//        console.log(newmatches);
//
//        //get the list of names with lowest number of matches
//      //  for (var k = 0; !newmatches.hasOwnProperty(k);  k++){
//      //  }
//      //  var match = newmatches[k](Math.random() * newmatches[k].length);
//     // }
//
//      }); 
//    });
//  };

//  var getRSVPs= function(callback) {
//    var Rsvps = Parse.Object.extend('User');
//    var query = new Parse.Query(Rsvps);
//    query.equalTo('rsvp',true);
//    query.find({
//      success: function(results) {
//        var rsvps = [];
//        for (var i = 0; i < results.length; i++) {
//          var object = results[i];
//          rsvps.push(object.get('fullname'));
//        }
//        callback(rsvps);
//      }
//      //error: function(error) {
//      //  error("Error: " + error.code + " " + error.message);
//      //}
//    });
//  };

  /*********************************
   *   Email Section
   ********************************/
//  var sendgrid = require("sendgrid");
//  sendgrid.initialize("LunchReactor", "hackreactor0");
//
//  var notifyUser = function(email, match) {
//    sendgrid.sendEmail({
//      to: email,
//      from: 'lunchreactor@gmail.com',
//      subject: 'View Today\'s Lunch Match!',
//      text: 'Good morning, you\'re all set to get lunch with ' + match + ' today!'
//    }, {
//      success: function(httpResponse) {
//        console.log(httpResponse);
//        response.success("Email sent!");
//      },
//      error: function(httpResponse) {
//        console.error(httpResponse);
//        response.error("Uh oh, something went wrong");
//      }
//    });
//  };
//
//  notifyUser('mattfdbrown@gmail.com', 'Matt');

});
