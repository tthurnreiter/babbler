$(document).ready(function () {

  var idToDelete;
  var itemType;
  var itemTypeMulti;

  $('.label.delete')
      .on('click', function (e) {
        var parent = this.closest('.card');
        idToDelete = parent.id;

        if ($(parent).hasClass('babble')) {
          itemType = 'babble';
        } else if ($(parent).hasClass('user')) {
          itemType = 'user';
        }

        $('.basic.modal').modal('show');
      });

  $('.basic.modal .ok.button')
      .on('click', function (e) {
        $.ajax({
          url: '/api/' + itemType + '/' + idToDelete,
          type: 'DELETE',
          success: function (result) {
            location.reload();
          }
        });
      });
});
