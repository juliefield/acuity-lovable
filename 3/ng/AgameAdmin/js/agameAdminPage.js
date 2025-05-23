$(document).ready(function () {
   HandleButtons();
   HideAll();
   $("#currentGamesTab").click();
});

function HandleButtons() {
   $("#currentGamesTab").off("click").on("click", function () {
      window.setTimeout(function(){
         HideAll();
         ShowCurrentGameContainer();
         MarkSelectedTab("currentGamesTab");   
         ko.postbox.publish("AgameAdminLoad");
      }, 250);
   });   
   $("#pastGamesTab").off("click").on("click", function () {
      HideAll();
      ShowPastGamesContainer();
      MarkSelectedTab("pastGamesTab");   
   });   
   $("#currentXtremeTab").off("click").on("click", function(){
      window.setTimeout(function(){
         HideAll();
         ShowCurrentXtremeContainer();
         MarkSelectedTab("currentXtremeTab");
         ko.postbox.publish("AgameXtremeAdminLoad");
      }, 250);
   });
}

function MarkSelectedTab(tabToSelect) {
   $(".tablinks").each(function () {
      $(this).removeClass("active");
   });
   $("#" + tabToSelect).addClass("active");
   //HideLoadingPanel();
}
function HideAll() {
   HideCurrentGameContainer();
   HidePastGamesContainer();
   HideCurrentXtremeContainer();
}

function ShowCurrentGameContainer() {
   $("#currentGameContainer").show();
}
function HideCurrentGameContainer() {
   $("#currentGameContainer").hide();
}
function ShowPastGamesContainer() {
   $("#pastGamesContainer").show();
}
function HidePastGamesContainer() {
   $("#pastGamesContainer").hide();
}
function ShowCurrentXtremeContainer()
{
   $("#currentXtremeContainer").show();
}
function HideCurrentXtremeContainer()
{
   $("#currentXtremeContainer").hide();
}
