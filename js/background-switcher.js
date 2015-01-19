$(document).ready(function(){
  
  var backgrounds = ['bg/coffee-beans-fast-fall-small.mp4',
                     'bg/coffee-beans-left-justified-small.mp4',
                     'bg/coffee-beans-small.mp4',
                     'bg/coffee-cup-small.mp4'];
  
  var $source = $('source');
  
  var generateBackground = function(){
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  };

  var setBackground = function(background){
    $source.attr('src', background);
  };

  setBackground(generateBackground());

});
