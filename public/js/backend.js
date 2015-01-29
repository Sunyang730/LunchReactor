var backend = (function() {

   // --------------------------- //
   // Initialization code.
   // --------------------------- //
   Parse.initialize("MpPiIKUQR5feeQMw36y6Bw5DKHObYLJ78DenmItK", "zTVd77R41YJjuySxIiGgxs4BewGD26qaLRmtm8Q2");

  /* *******************
   * Backend Functions *
   * *******************/

  // If user is logged in, pass their user object to the callback
  // Otherwise do nothing
  var checkUser = function(callback) {
   var currentUser = Parse.User.current();

   if (currentUser) {
     callback(currentUser);
   }
  };

  // Update the user's username, fullname, and signature
  var updateUser = function(user, callback) {
    var currentUser = Parse.User.current();

    if (currentUser) {
      currentUser.set('username', user.get('email'));
      currentUser.set('email', user.get('email'));
      currentUser.set('fullname', user.get('fullname'));
      currentUser.set('signature', user.get('signature'));
      currentUser.set('channel', user.get('channel'));

      currentUser.save(null, {
        success: function(user) {
          callback();
        }
      });
    }
  };

  // signUp takes the user's fullname, password, and email
  // If sign-up was successful, it passes the fullname back to 'callback()'
  // Otherwise, it passes the username and error to 'err()'
  var signUp = function(email, password, fullname, channel, callback, err) {
    var user = new Parse.User();
    user.set('username', email);
    user.set('emailVerified', false);
    user.set('email', email);
    user.set('password', password);
    user.set('fullname', fullname);
    user.set('rsvp', false);
    user.set('matches', {});
    user.set('channel', channel);

    user.signUp(null, {
      success: function(user) {
        callback(user.get('fullname'));
      },
      error: function(user, error) {
        err(error);
      }
    });
  };

  // Log in the user with their fullname and password
  // Run the 'callback' on success, 'err' if there's an error
  var logIn = function(email, password, callback, err) {
    Parse.User.logIn(email, password, {
      success: function(user) {
        callback(user.get('fullname'));
      },
      error: function(user, error) {
        err(error);
      }
    });
  };

  // Log the current user out of their account
  var logOut = function() {
    Parse.User.logOut();
  };

  // Send RSVP 'request' to the server, invoke 'callback' if successful.
  // 'request' should be true/false
  var sendRSVP = function(request, callback) {
    var currentUser = Parse.User.current();

    if (currentUser) {
      currentUser.set('rsvp', request);
      currentUser.save(null, {
        success: function(currentUser) {
          callback();
        }
      });
    }
  };


  // Check user's RSVP status
  // Provides 'response' to the callback function
  var checkRSVP = function(callback, error) {
    var currentUser = Parse.User.current();

    if (currentUser) {
      var query = new Parse.Query(Parse.User);
      query.get(currentUser.id, {
        success: function(user) {
          callback(user.get('rsvp'));
        },
        error: function(user, err) {
          callback(err);
        }
      });
    } else {
      callback();
    }
  };

  // Get the user's who have RSVP'd
  var getRSVPs = function(callback, error) {
    var query = new Parse.Query(Parse.User);
    query.equalTo('rsvp', true);
    query.find({
      success: function(results) {
        var users = [];
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          users.push(object.get('user'));
        }
        callback(users);
      },
      error: function(error) {
        error("Error: " + error.code + " " + error.message);
      }
    });
  };

  // Use getRSVPs to pass the number of respondents to the callback
  var numRSVPs = function(callback) {
    getRSVPs(function(vals) {
      callback(vals.length);
    });
  };

  /* ********************
   * Frontend Functions *
   * ********************/

  var backgrounds = ['bg/coffee-beans-fast-fall-small.mp4',
                     'bg/coffee-beans-left-justified-small.mp4',
                     'bg/coffee-beans-small.mp4',
                     'bg/coffee-cup-small.mp4'];

  var generateBackground = function(){
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  };

  var timeLeft = function(){
    var now = moment();
    var deadline = moment().hour(11).minute(0).second(0);
    if(now.isAfter(deadline) ||
       deadline.from(now) === 'in a few seconds'){
      return 'Closed';
    }
    else { return deadline.from(now);  }
  };

   // --------------------------- //
   // public functions of backend.
   // --------------------------- //
  return {
    checkUser: checkUser,
    updateUser: updateUser,
    signUp: signUp,
    logIn: logIn,
    logOut: logOut,
    sendRSVP: sendRSVP,
    checkRSVP: checkRSVP,
    backgrounds: backgrounds,
    generateBackground: generateBackground,
    timeLeft: timeLeft,
    numRSVPs: numRSVPs
  };

})();
