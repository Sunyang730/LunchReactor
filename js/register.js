$(document).ready(function(){                                                                                                       
  var $sign = $('.signup');
  var $reg = $('.register');                                                                                                

  $sign.hover(function() {
    if ( $reg.is(":hidden")) {
      $reg.slideDown("fast");
    } else {
      $reg.slideUp("fast");
    }
  });
 });                                                                                                                                 
