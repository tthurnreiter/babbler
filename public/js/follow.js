$(document).ready(function () {

  $('.label.follow')
      .on('click', function (e) {
        $(this).addClass('disabled loading');
        var userToFollow = this.closest('.card').id;
        var myID = $('.identity').attr('id')

        $.ajax({
          url: '/api/user/' + myID + '/following/' + userToFollow,
          type: 'POST',
          success: (succ) => {location.reload();},
        });
        location.reload();
      });
  $('.label.unfollow')
      .on('click', function (e) {
        $(this).addClass('disabled loading');
        var userToFollow = this.closest('.card').id;
        var myID = $('.identity').attr('id')
        $.ajax({
          url: '/api/user/' + myID + '/following/' + userToFollow,
          type: 'DELETE',
          success: (succ) => {location.reload();},
        });
      });
});
