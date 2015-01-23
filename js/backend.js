/* *******************
 * Backend Functions *
 * *******************/

var checkUser = function(callback) {
  var currentUser = Parse.User.current();

  if (currentUser) {
    callback(currentUser.get('username'));
  } else {
    callback(undefined);
  }
};

var signUp = function(fullname, password, email) {
  var user = new Parse.User();
  user.set('username', fullname);
  user.set('password', password);
  user.set('email', email);

  user.signUp(null, {
    success: function(user) {
      return user.get('username');
    }
  });
};

var logIn = function(fullname, password, callback) {
  Parse.User.logIn(fullname, password, {
    success: function(user) {
      callback(user.get('username'));
    },
    error: function(user, err) {
      alert(JSON.stringify(err));
    }
  });
};

var logOut = function() {
  Parse.User.LogOut();
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

/* **************
 * Default code *
 * **************/

Parse.initialize("c7Yv1NXWxdwF2GwXDrFCUKbF1V69EDhJQLiAAjMl", "8gUndkylCKEr8HfinuDN7Z4Lw3R0570gbsb0KLDh");

/* **********
 * Old Code *
 * **********/
 
//   var TestObject = Parse.Object.extend("TestObject");
//   var testObject = new TestObject();
// testObject.save({what: "is up"}, {
//     success: function(obj) {
//       // alert('success');
//       testObject.set('foo', 'baz');
//       testObject.set('what', 'nothing');
//       testObject.save();
//     }
// });
  
// var GameScore = Parse.Object.extend("TestObject");
// var gameScore = new GameScore();
// var query = new Parse.Query(GameScore);
// query.get("RY0fOrBL02", {
//     success: function(gameScore) {
//       var score = gameScore.get("foo");
//       alert(score);
//     },
//     error: function(object, error) {
//       alert('err');
//     }
  
// var firebase  = new Firebase("https://crackling-torch-5502.firebaseio.com/");
// var hackers = {};
//
// var LUNCHREACTOR = (function() {
//   function addHacker(name) {
//     if (_.contains(getHackers(), name) === false)
//       hackers[name] = [];
//     else
//       console.log(name + " is already in the record.");
//   }
//
//   function getHackers() {
//     return _.keys(hackers);
//   }
//
//   function allFriends() {
//     var maxMeets = (getHackers().length % 2 === 0)?
//           getHackers().length - 1 :
//           getHackers().length - 2;
//     return _.some(hackers, function(met) {
//       return met.length >= maxMeets;
//     });
//   }
//
//   function getMatches() {
//     if (allFriends()) {
//        return "Everyone knows everyone.";
//      }
//      return matches(getHackers());
//    }
//
//    function matches(names) {
//      var pairs = {};
//      var luckyOne;
//      while (names.length > 0) {
//
//        if (names.length % 2 !== 0) {
//          luckyOne = names.shift();
//        }
//
//        var one = names.pop();
//        var two = _.find(names, function(name) {
//          return _.contains(hackers[one], name) === false;
//        });
//        names = _.without(names, two);
//
//        hackers[one].push(two);
//        hackers[two].push(one);
//
//        pairs[one] = two;
//        pairs[two] = one;
//      }
//
//      if (luckyOne !== undefined) {
//        var rando = _.find(pairs, function(name) {
//          return _.contains(hackers[luckyOne], name) === false;
//        });
//        pairs[pairs[rando]] += " & " + luckyOne;
//        pairs[rando] += " & " + luckyOne;
//        hackers[luckyOne].push(rando);
//      }
//
//      return pairs;
//    }
//
//    function hasMet(name, other) {
//      return _.contains(hackers[name], other);
//    }
//
//    return {
//      addHacker: addHacker,
//      getHackers: getHackers,
//      getMatches: getMatches
//    };
// })();
