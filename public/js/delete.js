
$(document).ready(function () {

  var idToDelete;
  var type;

  $('.label.delete')
      .on('click', function (e) {
        var parent = this.closest('.card');
        idToDelete = parent.id;

        if ($(parent).hasClass('babble')) {
          type = 'babble';
        } else if ($(parent).hasClass('user')) {
          type = 'user';
        }

        $('.basic.modal').modal('show');
      });

  $('.basic.modal .ok.button')
      .on('click', function (e) {
        $.ajax({
          url: '/api/' + type + '/' + idToDelete,
          type: 'DELETE',
          success: function (result) {
            location.reload();
          }
        });
      });
});
