
$(document).ready(function () {

  var babbleToDelete;

  $('.deleteBabble')
      .on('click', function (e) {
        babbleToDelete = this.closest('.card').id;
        $('.basic.modal').modal('show');
      });

  $('.basic.modal .ok.button')
      .on('click', function (e) {
        $.ajax({
          url: '/api/babble/' + babbleToDelete,
          type: 'DELETE',
          success: function(result) {
            location.reload();
          }
        });
      });
});
