var LUNCHREACTOR = (function() {


  Parse.initialize("c7Yv1NXWxdwF2GwXDrFCUKbF1V69EDhJQLiAAjMl", "8gUndkylCKEr8HfinuDN7Z4Lw3R0570gbsb0KLDh");

  // var TestObject = Parse.Object.extend("TestObject");
  // var testObject = new TestObject();
  // testObject.save({what: "is up"}, {
  //   success: function(obj) {
  //     // alert('success');
  //     testObject.set('foo', 'baz');
  //     testObject.set('what', 'nothing');
  //     testObject.save();
  //   }
  // });

  var GameScore = Parse.Object.extend("TestObject");
  var gameScore = new GameScore();
  var query = new Parse.Query(GameScore);
  query.get("RY0fOrBL02", {
    success: function(gameScore) {
      var score = gameScore.get("foo");
      alert(score);
    },
    error: function(object, error) {
      alert('err');
    }
  });

  // var firebase  = new Firebase("https://crackling-torch-5502.firebaseio.com/");
  var hackers = {};

  function addHacker(name) {
    if (_.contains(getHackers(), name) === false)
      hackers[name] = [];
    else
      console.log(name + " is already in the record.");
  }

  function getHackers() {
    return _.keys(hackers);
  }

  function allFriends() {
    var maxMeets = (getHackers().length % 2 === 0)?
          getHackers().length - 1 :
          getHackers().length - 2;
    return _.some(hackers, function(met) {
      return met.length >= maxMeets;
    });
  }

  function getMatches() {
    if (allFriends()) {
      return "Everyone knows everyone.";
    }
    return matches(getHackers());
  }

  function matches(names) {
    var pairs = {};
    var luckyOne;
    while (names.length > 0) {

      if (names.length % 2 !== 0) {
        luckyOne = names.shift();
      }

      var one = names.pop();
      var two = _.find(names, function(name) {
        return _.contains(hackers[one], name) === false;
      });
      names = _.without(names, two);

      hackers[one].push(two);
      hackers[two].push(one);

      pairs[one] = two;
      pairs[two] = one;
    }

    if (luckyOne !== undefined) {
      var rando = _.find(pairs, function(name) {
        return _.contains(hackers[luckyOne], name) === false;
      });
      pairs[pairs[rando]] += " & " + luckyOne;
      pairs[rando] += " & " + luckyOne;
      hackers[luckyOne].push(rando);
    }

    return pairs;
  }

  function hasMet(name, other) {
    return _.contains(hackers[name], other);
  }

  return {
    addHacker: addHacker,
    getHackers: getHackers,
    getMatches: getMatches
  };

})();
