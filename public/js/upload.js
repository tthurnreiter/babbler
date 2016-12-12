$(document).ready(function () {

  $('#babbleform #camerabutton')
      .on('click', function (e) {
        $('#babbleform #fileinput', $(e.target).parents()).click();
      });

  $('#babbleform #fileinput').on('change', function (input) {
    var preview = $('#babbleform #preview');
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#babbleform #preview').attr('src', e.target.result);
      }
      reader.readAsDataURL(this.files[0]);
    } else {
      $('#babbleform #preview').removeAttr('src');
    }
  });

  $('#babbleform #textinput').on('input', function () {
    $('#babbleform #submitbutton').addClass('teal');
    $('#babbleform #submitbutton').removeClass('red');
    $('#babbleform #submitbutton').removeAttr('data-tooltip');
  });

  $('#babbleform #preview')
      .on('click', function (e) {
        var control = $("#babbleform #fileinput");
        control.replaceWith(control.val('').clone(true));
        $('#babbleform #preview').removeAttr('src');
      });

  $('#babbleform').on('submit', function () {
    if($('#babbleform #textinput').val().length < 1 )
    {
      $('#babbleform #submitbutton').removeClass('teal');
      $('#babbleform #submitbutton').addClass('red');
      $('#babbleform #submitbutton').attr('data-tooltip', 'Please enter some text first');
    }
    else if($('#babbleform #textinput').val().length > 140 )
    {
      $('#babbleform #submitbutton').removeClass('teal');
      $('#babbleform #submitbutton').addClass('red');
      $('#babbleform #submitbutton').attr('data-tooltip', 'Your babble can not be longer than 140 characters');
    }
    else {
      $('#babbleform').addClass('disabled loading');
      return true;
    }
    return false;
  });

});
