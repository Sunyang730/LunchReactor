$(function(){

  /* ******************
   * Global Variables *
   * ******************/

  var $video = $('#bgvid');
  var $source = $video.find('#source');
  var $sign = $('#signup');
  var $reg = $sign.find('#register');
  var $middle = $('#middle');
  var $rsvp_frost = $('#frost', '#middle');
  var $rsvp_circle = $('#rsvp', '#middle');
  var $time_left = $('#time_left');
  
  /* ****************
   * Event Handlers *
   * ****************/

  // Frosts the RSVP circle on hover
  $rsvp_circle.hover(
    function(){
      if(!rsvped && !closed) {$rsvp_frost.css('display', 'block'); }
    },
    function(){
      if(!rsvped && !closed) {$rsvp_frost.css('display','none'); }
    });

  // Shows the success message in RSVP circle
  $rsvp_circle.on('click',function(){

    // voids click if already RSVPed
    if(rsvped || closed){ return; }

    // shows green check mark and
    // kills 'frost' hover action
    rsvped = true;
    $rsvp_frost.css('display','none');
    $('#rsvp_text').fadeOut('fast', function(){
      $rsvp_circle.css({border: '1px solid #66BB6A',
                        cursor:'auto'});
      $('#rsvp_success').fadeIn('slow');
    });

   /* ******************************************
    *  TODO:                                   *
    *  perform RSVP action on Parse.com here   *
    * ******************************************/

  });

  // Sign up the user with information from the forms
  $('.submitInfo').submit(function(event) {
    signUp($('#fullname').val(),
          $('#password').val(),
          $('#email').val());
  });

  // Check if the user is currently logged-in
  // checkUser(function(user) {
  //
  // });

  // Displays sign up form
  $sign.hover(function() {
    $reg.stop().slideToggle('fast');
  });

  // Shows/Hides video background
  var small = false;
  $(window).on('resize', function() {
    if(small && $(this).width() > 640){
      $video.fadeToggle('slow');
      small = false;
      return;
    }

    if (!small && $(this).width() < 640){
      $video.fadeToggle('slow');
      small = true;
      return;
    }
    });

  /* **************
   * Default Code *
   * **************/

  // Sets a random motion background
  $source.attr('src', generateBackground());

  // Sets the day's date
  $('#date').text(moment().format('dddd, MMMM Do YYYY'));

  // Sets the time left to RSVP
  var closed = false;
  var time_left = timeLeft();
  if(time_left === 'Closed'){
   closed = true; 
   $rsvp_frost.css('display','none');
   $rsvp_circle.css('cursor', 'auto');
  }
  $time_left.text(timeLeft);

  // TODO: Check if user is logged in, display signup or greeting 
  var loggedIn = checkUser(function(user){
    if(user === undefined){ return false; }
    else{ return user;}
  });

  // TODO: Check if user has RSVPed that day, display RSVP or green check mark
  var rsvped = false; // default
  if(rsvped){
    $rsvp_frost.css('display','none');
    $('#rsvp_text').hide();
    $rsvp_circle.css({border: '1px solid #66BB6A',
                      cursor:'auto'});
    $('#rsvp_success').show();
  }

});
