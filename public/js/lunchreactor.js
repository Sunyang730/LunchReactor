$(function(){

  /* ******************
   * Global Variables *
   * ******************/

  var $bg = $('#bg');
  var $middle = $('#middle');
  var $rsvp_frost = $('#frost');
  var $rsvp_circle = $('#rsvp');
  var $rsvp_text = $('#rsvp-text');
  var $rsvp_success = $('#rsvp-success');
  var $time_left = $('#time-left');
  var $rsvp_count = $('#rsvp-count');
  var $new_user = $('#new-user');
  var $greet = $('#greet');

  var $link_auth = $('#link-auth[rel*=leanModal]');
  var $link_auth2 = $('#link-auth2[rel*=leanModal]');
  var $link_prefs =  $('#link-prefs[rel*=leanModal]');

  var $modal_auth = $('#modal-auth');
  var $form_reg = $('#form-reg');
  var $email_reg = $('#email-reg');
  var $pw_reg = $('#pwd-reg');
  var $pw2_reg = $('#pwd2-reg');
  var $fullname_reg = $('#flname-reg');
  var $channel_reg = $('#channel-reg');
  var $notice_reg = $('#notice-reg');
  var $register = $('#submit-reg');

  var $form_signin = $('#form-signin');
  var $email_signin = $('#email-signin');
  var $pw_signin = $('#pwd-signin');
  var $notice_signin = $('#notice-signin');
  var $signin = $('#submit-signin');

  var $modal_prefs = $('#modal-prefs');
  var $email_prefs = $('#email-prefs');
  var $fullname_prefs = $('#flname-prefs');
  var $signature = $('#signature-prefs');
  var $channel_prefs = $('#channel-prefs');
  var $notice_prefs = $('#notice-prefs');
  var $unrsvp = $('#submit-unrsvp');
  var $update = $('#submit-update');
  var $signout = $('#submit-signout');
  
  var $lean_overlay = $('#lean_overlay');

  /* ***********
   * Functions *
   * ***********/

  // updates the RSVP counter
  var updateCounter = function(){
    backend.numRSVPs(function(len) {
      $rsvp_count.fadeOut('fast', function(){
        $rsvp_count.html(len).fadeIn('fast');
      });
    });
  };
  
  // updates the user object
  var user;
  var reloadUser = function(){
    user = undefined;
    backend.checkUser(function(currentUser){
      user = currentUser; 
    });
  }; 

  // shows the appropriate greeting
  var updateGreeting = function(){
    $greet.hide();
    $new_user.hide();
    if(user !== undefined){
      $link_prefs.text(user.get('fullname'));
      $greet.fadeIn();
    }else{
      $new_user.fadeIn();
    }
  };

  // shows the appropriate RSVP button/checkmark
  var rsvped;
  var updateRSVP = function(){
    rsvped = false; // default
    $rsvp_circle.css({border: '1px solid #fff',
      cursor:'pointer'});
    $rsvp_text.css('display','none');
    $rsvp_success.css('display','none');

    backend.checkRSVP(function(response) {
      if (response){ rsvped = true; displayYesRSVP(); }
      else{ displayNoRSVP(); }
      reloadPrefs();
    }, function() { displayNoRSVP(); reloadPrefs(); });

    updateCounter();
  };

  var displayYesRSVP = function() {
    $rsvp_frost.css('display','none');
    $rsvp_circle.css({border: '1px solid #66BB6A',
    cursor:'auto'});
    $rsvp_success.fadeIn();
  };
  var displayNoRSVP = function() {
    closed = false; // default
    var time_left = backend.timeLeft();
    if (time_left === 'Closed') {
      closed = true;
      $rsvp_frost.css('display','none');
      $rsvp_circle.css('cursor','auto');
    }
    $time_left.text(time_left);
    $rsvp_text.fadeIn();
  };

  // clears/auto-populates user prefs
  var reloadPrefs = function(){
    $email_prefs.val('');
    $fullname_prefs.val('');
    $signature.text('');
    $channel_prefs.val('');
    $unrsvp.css({opacity: 0.2, cursor:'auto'}).prop('disabled', true);

    if(user !== undefined){
     $email_prefs.val(user.get('email'));
     $fullname_prefs.val(user.get('fullname'));
     $signature.text(user.get('signature'));
     $channel_prefs.val(user.get('channel'));
    }

    if(rsvped && !closed){
      $unrsvp.css({opacity: 1, cursor:'pointer'}).prop('disabled', false);
    }
  };

  // clears reg/signin form elements
  var clearFormSignIn = function(){
    $email_signin.val('');
    $pw_signin.val('');
  };

  // updates the background
  var $video, width;
  var background = backend.generateBackground();
  var updateBackground = function(){
    width = $(window).width(); // defaults
    
    // fade out and dettach when small
    if($bg.children().length > 0 && width < 640){
      $video.hide('slow', function(){ $bg.empty();});
    }

    // attach and fade in when big
    if(width > 640 && $bg.children().length === 0){
      $video = $('<video>').css('display', 'none')
        .attr({id: 'bgvid'}).prop({autoplay:true, loop: true});
      var $source = $('<source>')
        .attr({id: 'source', src: background, type: 'video/mp4'});

      $video.append($source);
      $bg.append($video);
      $video.fadeIn('slow');
    }
  };

  /* ****************
   * Event Handlers *
   * ****************/

  // Frosts the RSVP circle on hover
  $rsvp_circle.hover(function(){
    if(!rsvped && !closed) {
      $rsvp_frost.css('display', 'block'); 
    }
  },
  function(){
    if(!rsvped && !closed) {$rsvp_frost.css('display','none'); }
  });

  // Submits RSVP on click.
  $rsvp_circle.on('click', function(e) {

    if(rsvped || closed){ return; }
    if(user === undefined){ $link_auth.trigger('click'); return; }

    backend.sendRSVP(true, function() {
      rsvped = true;
      $rsvp_frost.css('display','none');
      $rsvp_text.fadeOut('fast', function(){
        $rsvp_circle.css({border: '1px solid #66BB6A',
        cursor:'auto'});
        $rsvp_success.fadeIn('slow');
      });
      updateRSVP();
      reloadPrefs();
    }); 
    e.preventDefault();
  });

  // Submit sign in form
  $signin.on('click', function(e) {

    if(!validateSignIn()){
      e.preventDefault();
      return;
    }

    backend.logIn($email_signin.val(), $pw_signin.val(), function(user) {
      reloadUser(); 
      updateGreeting();
      updateRSVP();
      reloadPrefs();

      $notice_signin.css('display', 'none');
      closeModal($modal_auth);
    },
    function(error) {
      $notice_signin.text(error.message).slideDown();
    });
    e.preventDefault();
  });
  var validateSignIn = function(){
    $notice_signin.css('display', 'none');
    if($email_signin.val() === '' ||
      $pw_signin.val() === ''){
      
      $notice_signin.text('missing login parameters').slideDown();
      return false;
    }
    return true;
  };

  // Submit user registration form
  $register.on('click', function(e){

    if(!validateReg()){
      e.preventDefault();
      return;
    }

    backend.signUp($email_reg.val(),
      $pw_reg.val(), $fullname_reg.val(),
      $channel_reg.val(),
      function(user) {
        reloadUser();
        updateGreeting();
        closeModal($modal_auth);
      },
      function(error) {
        $notice_reg.text(error.message).slideDown();
        e.preventDefault();
      });

    e.preventDefault();
  });
  var validateReg = function(){
    $notice_reg.css('display', 'none');
    if($email_reg.val() === '' ||
      $pw_reg.val() === '' ||
      $pw2_reg.val() === '' ||
      $fullname_reg.val() === '' ||
      $channel_reg.val() === ''){
      $notice_reg.text('missing form fields').slideDown();
      return false;
    }else if($pw_reg.val() !== $pw2_reg.val()){
      $notice_reg.text('passwords did not match')
       .slideDown();
      return false;
    }
    return true;
  };

  // Update user preferences
  $update.on('click', function(e){

    if(!validateUpdate()){
      e.preventDefault();
      return;
    }

    if (user !== undefined) {
      user.set('email', $email_prefs.val());
      user.set('fullname', $fullname_prefs.val());
      user.set('signature', $signature.val());
      user.set('channel', $channel_prefs.val());
      backend.updateUser(user, function() {
        reloadUser();
        updateGreeting();
        updateRSVP();
        closeModal($modal_prefs);
      });
    }

    e.preventDefault();
  });
  var validateUpdate = function(){
    $notice_prefs.css('display', 'none');
    if($email_prefs.val() === '' ||
      $fullname_prefs.val() === '' ||
      $channel_prefs.val() === ''){

      $notice_prefs.text('missing form fields').slideDown();
      return false; 
    } 
    return true;
  };

  // Un-RSVP button
  $unrsvp.on('click', function(e){
    backend.sendRSVP(false, function(){
      updateRSVP();
      reloadPrefs();
      closeModal($modal_prefs);
    });
    e.preventDefault();
  });

  // Sign out button
  $signout.on('click', function(e){
    backend.logOut();
    reloadUser();
    updateGreeting();
    updateRSVP();
    reloadPrefs();
    clearFormSignIn();
    closeModal($modal_prefs);
    e.preventDefault();
  }); 

  // Show auth/prefs modal
  $link_auth.leanModal({ top: 200, overlay: 0.45 });
  $link_auth2.leanModal({ top: 200, overlay: 0.45 });
  $link_prefs.leanModal({ top: 200, overlay: 0.45 });

  // Hide modals on ESC key
  $(document).on('keydown', function(e){
    if(e.keyCode === 27){
      closeModal($modal_auth);
      closeModal($modal_prefs);
    }
  });

  // Hides modal dialog
  var closeModal = function(modal_id){
    $lean_overlay.fadeOut(200);
    $(modal_id).css({'display': 'none'});
  };

  // Shows/Hides video background
  $(window).on('resize', updateBackground);

  /* **************
   * Default Code *
   * **************/

  // Sets a random motion background
  updateBackground();

  // Sets the day's date
  $('#date').text(moment().format('dddd, MMMM Do YYYY'));

  // Sets the time left to RSVP
  var closed = false; // default
  var time_left = backend.timeLeft();
  if(time_left === 'Closed'){
   closed = true;
   $rsvp_frost.css('display','none');
   $rsvp_circle.css('cursor', 'auto');
  }
  $time_left.text(time_left);

  // Greets user, or displays signup message
  reloadUser();
  updateGreeting();

  // Check if user has RSVPed that day, display RSVP or green check mark
  updateRSVP();
});
