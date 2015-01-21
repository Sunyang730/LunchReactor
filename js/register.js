var firebase = new Firebase("https://amber-heat-4078.firebaseio.com/");

$(document).ready(function(){
  var $sign = $('.signup');
  var $reg = $('.register');
  var $submit = $('.submitInfo');

  $sign.hover(function() {
    if ( $reg.is(":hidden")) {
      $reg.slideDown("fast");
    } else {
      $reg.slideUp("fast");
    }
  });

  $submit.click(function() {
    var name = $('input[name="firstname"]').val() + ' ' +
                $('input[name="lastname"]').val();
    var email = $('input[name="email"]').val();

    firebase.set({
      name: name,
      email: email
      });
  });
 });
