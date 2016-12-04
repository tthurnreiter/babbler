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

  $('#babbleform #preview')
      .on('click', function (e) {
        var control = $("#babbleform #fileinput");
        control.replaceWith(control.val('').clone(true));
        $('#babbleform #preview').removeAttr('src');
      });

  $('#babbleform').on('submit', function () {
    $('#babbleform').addClass('loading disabled');
  });
});
