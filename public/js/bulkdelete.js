$(document).ready(function () {

  //array to store ids of items to delete
  var itemsToDelete = [];
  var itemType;

  //add changed event handler to all deleteCheckboxes
  $('.deleteCheckbox').change(function () {

    var idToDelete = this.closest('.card').id;

    if ( $(this).parent().hasClass('babble') ) {
      itemType = 'babbles';
    } else if ( $(this).parent().hasClass('user') ) {
      itemType = 'users';
    }

    if (this.checked) {
      //add item
      itemsToDelete.push(idToDelete);
    } else {//remove item
      const indexOfItem = itemsToDelete.indexOf(idToDelete);
      if (indexOfItem > -1) {
        itemsToDelete.splice(indexOfItem, 1);
      }
    }
  });

  $('#confirmBulkDeleteButton').on('click', function (e) {

    //hide deletion menu and stay on screen if nothing was checked
    if (itemsToDelete.length === 0) {
      return;
    }

    $.ajax({
      url: '/api/' + itemType + '/bulkdelete',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(itemsToDelete),
      success: () => {
        location.reload();
      }
    });
  });

  $('#bulkDeleteButton').on('click', function (e) {
    //switch displayed buttons
    $('#bulkDeleteButton').hide();
    $('#bulkDeleteControls').show();

    //hide delete labels
    $('.label.delete').hide();
    //display toggle button on tweets
    $('.label.bulkdelete').show();

    $('.deleteCheckbox').prop('checked', false);
  });

  $('#cancelBulkDeleteButton').on('click', function (e) {
    //switch displayed buttons
    $('#bulkDeleteButton').show();
    $('#bulkDeleteControls').hide();

    //show delete labels
    $('.label.delete').show();
    //hide toggle button on tweets
    $('.label.bulkdelete').hide();
  });
});