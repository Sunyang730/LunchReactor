$(document).ready(function(){
  
  /* ******************
   * Global Variables *
   * ******************/

  var $rsvp_frost = $('.circle.frost');
  var $rsvp_circle = $('.circle.rsvp.fleft');

  /* ****************
   * Event Handlers *
   * ****************/

  // Frost the RSVP circle on hover

  $rsvp_circle.hover(function(){
   $rsvp_frost.fadeToggle(150);
  });


});
