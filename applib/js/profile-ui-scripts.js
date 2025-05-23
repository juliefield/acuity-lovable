$(function() {
  $("#filterstab").click(function() {
    $(".leftpanel").addClass('active');
    $(".filters-tab").addClass('closed');
    $(".leftpanelOverlay").addClass('active');
  });
  $("#leftpanelclose").click(function() {
    $(".leftpanel").removeClass('active');
    $(".filters-tab").removeClass('closed');
    $(".leftpanelOverlay").removeClass('active');
  });
  $("#leftpanelOverlay").click(function() {
    $(".leftpanel").removeClass('active');
    $(".filters-tab").removeClass('closed');
    $(".leftpanelOverlay").removeClass('active');
  });
  $(".nav3-icon").click(function() {
    $(".leftpanel").removeClass('active');
    $(".filters-tab").removeClass('closed');
    $(".leftpanelOverlay").removeClass('active');
  });
  $(".filter-instructions").click(function() {
    $(".filter-instructions").hide();
  });
  $(".action-profile-panel").click(function() {
    $(".agent-profile-panel").addClass('active');
  });
  $(".agent-profile-panel_note-history").click(function() {
    $(".agent-notes-panel").addClass('active');
    $(".agent-profile-panel_note-history").addClass('note-history-active');
  });
  $(".agent-profile-panel_close").click(function() {
    $(".agent-notes-panel").removeClass('active');
    $(".agent-profile-panel").removeClass('active');
  });
  $(".close-profile-btn").click(function() {
    $(".agent-notes-panel").removeClass('active');
    $(".agent-profile-panel").removeClass('active');
  });
  $(".agent-notes-panel_close").click(function() {
    $(".agent-notes-panel").removeClass('active');
  });
  $("#deletenote").click(function() {
    $(".notes-tab-delete-message").addClass('active');
  });
  $(".notes-tab-delete-message-btn").click(function() {
    $(".notes-tab-delete-message").removeClass('active');
  });
  $("#add-profile-note").click(function() {
    $(".agent-profile-panel-notebox").addClass('active');
    $(".add-agent-appear").css("display", "none");
  });

});
$(document).ready(function () {
  $(".filter-instructions").show();
});
function dontshow(){
    $.cookie('visited', 'yes', { expires: 30 }); // Set the cookie.
}
  $(document).ready(function() {
    var visited = $.cookie('visited');
    if (visited == 'yes') {
        $("#dontshow").hide();
    } else {
        $("#dontshow").show(); // cookie has no value, so show the text
    }
  });
