var backend = (function() {

   // --------------------------- //
   // Initialization code.
   // --------------------------- //
  Parse.initialize("c7Yv1NXWxdwF2GwXDrFCUKbF1V69EDhJQLiAAjMl", "8gUndkylCKEr8HfinuDN7Z4Lw3R0570gbsb0KLDh");

  /* *******************
   * Backend Functions *
   * *******************/

  // If user is logged in, pass their username to the callback
  // Otherwise do nothing
  // ex:
  // checkUser(function(user) {
  //   alert('welcome back ' + user);
  // });
  var checkUser = function(callback) {
   var currentUser = Parse.User.current();

   if (currentUser) {
     callback(currentUser.get('username'));
   }
  };

  // signUp takes the user's fullname, password, and email
  // If sign-up was successful, it passes the fullname back to 'callback()'
  // Otherwise, it passes the username and error to 'err()'
  // ex:
  // signUp('tyler', 'hack', 'tyler@me.com', function(user) {
  //   alert('signed up ' + user);
  // });
  var signUp = function(fullname, password, email, callback, err) {
    var user = new Parse.User();
    user.set('username', fullname);
    user.set('password', password);
    user.set('email', email);

    user.signUp(null, {
      success: function(user) {
        callback(user.get('username'));
      },
      error: function(user, error) {
        err(error);
      }
    });
  };

  // Log in the user with their fullname and password
  // Run the 'callback' on success, 'err' if there's an error
  // logIn('tyler', 'hack', function(user) {
  //   alert('logged in ' + user);
  // });
  var logIn = function(fullname, password, callback, err) {
    Parse.User.logIn(fullname, password, {
      success: function(user) {
        callback(user.get('username'));
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
  // example:
  // sendRSVP(true, function() {
  //   alert('You successfuly RSVP'd!');
  // });
  //
  var sendRSVP = function(request, callback) {
    var currentUser = Parse.User.current();

    if (currentUser !== undefined) {
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
  // example:
  // checkRSVP(function(response) {
  //  if (response) {
  //    alert('You are currently RSVP'd!');
  //  }
  // });
  //
  var checkRSVP = function(callback) {
    var currentUser = Parse.User.current();

    if (currentUser !== undefined) {
      var query = new Parse.Query(Parse.User);
      query.get(currentUser.id, {
        success: function(user) {
          callback(user.get('rsvp'));
        }
      });
    }
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
    var deadline = moment().hour(11);
    if(now.isAfter(deadline)) { return 'Closed'; }
    else { return deadline.from(now);  }
  };

   // --------------------------- //
   // public functions of backend.
   // --------------------------- //
  return {
    checkUser: checkUser,
    signUp: signUp,
    logIn: logIn,
    logOut: logOut,
    sendRSVP: sendRSVP,
    checkRSVP: checkRSVP,
    backgrounds: backgrounds,
    generateBackground: generateBackground,
    timeLeft: timeLeft
  };

})();
