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
  var small = false;
  var $sign = $('#signup');
  var $reg = $sign.find('#register');
  var $middle = $('#middle');
  var $rsvp_frost = $('#frost', '#middle');
  var $rsvp_circle = $('#rsvp', '#middle');
  var $time_left = $('#time_left');
  var rsvped;
  var loggedIn;

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
  $rsvp_circle.hover(
    function(){
      if(!rsvped) {$rsvp_frost.css('display', 'block'); }
    },
    function(){
      if(!rsvped) {$rsvp_frost.css('display','none'); }
    });

  // Shows the success message in RSVP circle
  $rsvp_circle.on('click',function(){

    // voids click if already RSVPed
    if(rsvped){ return; }

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
          $('#email').val(),
          function(user) {

          });
  });

  // Check if the user is currently logged-in
  // checkUser(function(user) {
  //
  // });

  // Log in the user with information from the forms (TESTING)
  // $('.submitInfo').on('click', function() {
  //   logIn($('#fullname').val(), $('#password').val(), function(user) {
  //     alert(user);
  //   });
  // });

  // Displays sign up form
  $sign.hover(function() {
    $reg.stop().slideToggle('fast');
  });

  // Shows/Hides video background
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
  setBackground(generateBackground());

  // Sets the day's date
  $('#date').text(moment().format('dddd, MMMM Do YYYY'));

  // TODO: Sets the time left to RSVP
  $('#time_left').text(moment().hour(11).from(moment()));

  // TODO: set to user or false from Parse.com
  loggedIn = checkUser(function(user){
    if(user === undefined){ return false; }
    else{ return user;}
  });

  // TODO: set boolean from Parse.com
  rsvped = false; // default
  if(rsvped){
    $rsvp_frost.css('display','none');
    $('#rsvp_text').hide();
    $rsvp_circle.css({border: '1px solid #66BB6A',
                      cursor:'auto'});
    $('#rsvp_success').show();
  }

});
