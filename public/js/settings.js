$(document).ready(function () {

  $('#uploadbutton')
      .on('click', function (e) {
        $('#imageinput').click();
      });
  $('#imageinput').on('change', function () {
    $('#uploadbutton').addClass('disabled loading');
    $('#imageform').submit();
  });
});
