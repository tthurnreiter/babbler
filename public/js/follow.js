$(document).ready(function () {

  $('.label.follow')
      .on('click', function (e) {
        var userToFollow = this.closest('.card').id;
        var myID = $('.identity').attr('id')

        $.post('/api/user/' + myID + '/following/' + userToFollow);
        location.reload();
      });
  $('.label.unfollow')
      .on('click', function (e) {
        var userToFollow = this.closest('.card').id;
        var myID = $('.identity').attr('id')
        $.ajax({
          url: '/api/user/' + myID + '/following/' + userToFollow,
          type: 'DELETE',
        });
        location.reload();
      });
});
