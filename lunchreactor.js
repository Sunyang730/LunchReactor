var LUNCHREACTOR = (function() {

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
    return _.some(hackers, function(met) {
      return met.length === (getHackers().length - 1);
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
    while (names.length > 0) {

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
