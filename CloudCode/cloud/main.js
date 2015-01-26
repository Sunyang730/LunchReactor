
// Use Parse.Cloud.define to define as many cloud functions as you want.

Parse.Cloud.job("sendEmail", function() {
    // Set up to modify user data
    Parse.Cloud.useMasterKey();
    var counter = 0;
    
//    // Query for all users
//    var query = new Parse.Query(Parse.User);
//    query.each(function(user) {
//        // Update to plan value passed in
//    }).then(function() {
//        // Set the job's success status
//        status.success("Emails Successfully sent.");
//    }, function(error) {
//       // Set the job's error status
//       status.error("Emails not sent.");
//    });
});

// Job to notify users of their match
Parse.Cloud.job("notifyUsers", function(request, response) {
  var sendgrid = require("sendgrid");
  sendgrid.initialize("LunchReactor", "hackreactor0");

  var notifyUser = function(email, match) {
    sendgrid.sendEmail({
      to: email,
      from: 'lunchreactor@gmail.com',
      subject: 'View Today\'s Lunch Match!',
      text: 'Good morning, you\'re all set to get lunch with ' + match + ' today!'
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

  notifyUser('trjulian@gmail.com', 'Matt');

});
