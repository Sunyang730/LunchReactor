$(document).ready(function(){

  /* ******************
   * Global Variables *
   * ******************/

  var backgrounds = ['bg/coffee-beans-fast-fall-small.mp4',
                     'bg/coffee-beans-left-justified-small.mp4',
                     'bg/coffee-beans-small.mp4',
                     'bg/coffee-cup-small.mp4'];

  var $video = $('#bgvid'); 
  var $source = $('source');
  
  /* ***********
   * Functions *
   * ***********/
  
  var generateBackground = function(){
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  };

  var setBackground = function(background){
    $source.attr('src', background);
  };


  /* ****************
   * Event Handlers *
   * ****************/

  $(window).on('resize', function() {

    // shows/hides video background
    if($(window).width() < 640){ $video.fadeOut();}
    else{ $video.fadeIn();}
  });

  /* **************
   * Default code *
   * **************/

  setBackground(generateBackground());
});
