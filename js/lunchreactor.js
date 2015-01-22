$(function(){

  
  /* ******************
   * Global Variables *
   * ******************/

  var $video = $('#bgvid'); 
  var $source = $video.find('#source');
  var backgrounds = ['bg/coffee-beans-fast-fall-small.mp4',
                     'bg/coffee-beans-left-justified-small.mp4',
                     'bg/coffee-beans-small.mp4',
                     'bg/coffee-cup-small.mp4'];
  var $sign = $('#signup');
  var $reg = $sign.find('#register');
  var frost = false;
  var $rsvp_frost = $('#frost', '#middle');
  var $rsvp_circle = $('#rsvp', '#middle');

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

  // Frosts the RSVP circle on hover
  $rsvp_circle.hover(function(){
   if(!frost){
     $rsvp_frost.stop().velocity({opacity:0.4},{display:"block"}); 
     frost = true; 
   }else{
     $rsvp_frost.stop().velocity({opacity:0},{display:"none"}); 
     frost = false;
   }
  });

  // Displays sign up form
  $sign.hover(function() {
    $reg.stop().slideToggle('fast');
  });

  // Shows/Hides video background
  $(window).on('resize', function() {
    if($(this).width() < 640){ 
      $video.fadeToggle('slow');
      return false;
    } else{
      if ($video.css('opacity') === '0'){
      $video.fadeToggle('slow');}
    }});

  /* **************
   * Default Code *
   * **************/
    
  // Sets a random motion background
  setBackground(generateBackground());

  // Sets the day's date 
  $('#date').text(moment().format('dddd, MMMM Do YYYY')); 

});
