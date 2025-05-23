var currentConfigParameters = [];

var currentUserRole = "";
var currentUserProfileExtended = null;
$(document).ready(function () {
  LoadConfigParameters();
  HideTabPanels();
  ShowInitalPanels();
  AddTabClickers();
  HandleUserNamePageLoad();
  LoadAvailableTabs();
  LoadInitialTab();
  appLib.LoadResourceText(true, true, function(){
    appLib.HandleResourceTexts(null);
  });

  // // // // // // // console.log("UserDashboardScripts Load()");
});
async function LoadConfigParameters() {
  await appLib.getConfigParameters(true, function (paramList) {
    currentConfigParameters = paramList;
  });
}
function HideTabPanels(panelToHideId) {
  let panelItems = [];
  if (panelToHideId != null && panelToHideId != "") {
    panelItems = $(
      "<div[class^='user-dashboard-panel-tabholder']",
      $("#" + panelToHideId)
    );
  } else {
    panelItems = $("<div[class^='user-dashboard-panel-tabholder']");
  }
  $(panelItems).each(function () {
    $(this).hide();
  });
}
function ShowTab(tabToShow, panelId) {
  HideTabPanels(panelId);
  let headerPanelObject = $("#" + panelId);
  $(".user-dashboard-tab-item", headerPanelObject).removeClass("active");
  switch (tabToShow) {
    case "agame":
      $(".user-dashboard-panel-tabholder-agames").show();
      break;
    case "flex":
      ko.postbox.publish("AGameWidgetLoad");
      $(".user-dashboard-panel-tabholder-flexgames").show();
      break;
    case "goal":
      $(".user-dashboard-panel-tabholder-goals").show();
      break;
    case "performance":
      $(".user-dashboard-panel-tabholder-performance").show();
      break;
    case "trend":
      $(".user-dashboard-panel-tabholder-trend").show();
      break;
    case "task":
      $(".user-dashboard-panel-tabholder-tasks").show();
      break;
    case "awards":
      $(".user-dashboard-panel-tabholder-awards").show();
      break;
    case "required-user-actions":
      $(".tab-required-user-actions").show();
      break;
  }
  $(".user-dashboard-tab-item[id='" + tabToShow + "']").addClass("active");
}
function ShowInitalPanels() {
  //ShowTab("task", "goalTaskPanel");
  //ShowTab("flex", "gamesPanel");
  ShowTab("performance", "userStatsPanel");
}
function AddTabClickers() {
  $(".user-dashboard-tab-item").each(function () {
    let parentHolder =
      this.parentElement.parentElement || this.parentNode.parentElement;
    let parentHolderId = $(parentHolder).attr("id");
    $(this)
      .off("click")
      .on("click", function () {
        let buttonId = this.id;
        ShowTab(buttonId, parentHolderId);
      });
  });
}
function HandleUserNamePageLoad() {
  let userProfile = $.cookie("userprofile");
  if (userProfile == null) {
    a$.ajax({
      type: "GET",
      service: "JScript",
      async: false, //true,
      data: {
        lib: "spine",
        cmd: "getMe",
        who: "ME",
        members: ["person"],
      },
      dataType: "json",
      cache: false,
      error: a$.ajaxerror,
      success: function (data) {
        currentUserRole = data.me.person.role;
        LoadExtendedUserProfileInformation(data);
      },
    });
  } else {
    LoadExtendedUserProfileInformation(userProfile);
  }
}
function LoadExtendedUserProfileInformation(userProfileData) {
  let extendedProfile = currentUserProfileExtended;

  if(extendedProfile == null || extendedProfile == "")
  {
    let username = userProfileData.me?.person?.uid;
    if(username != null && username != "")
    {
      a$.ajax({
        type: "GET",
        service: "C#",
        async: false,
        data: {
          lib: "userprofile",
          cmd: "getProfileSettings",
          userid:username,
        },
        dataType: "json",
        cache: false,
        error: a$.ajaxerror,
        success: function (data) {
          extendedProfile = JSON.parse(data.userProfileSettings)[0];
          currentUserProfileExtended = JSON.parse(data.userProfileSettings)[0];
        }
      });
    }
  }

  if(extendedProfile != null)
  {
    $.cookie("userProfile_defaultTab", extendedProfile.UserDashboardSettings?.DefaultTabId);
    SetDefaultUserTab(extendedProfile);
  }
}
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  let tabId = "myTasks";
  let itemToLoad = "tasks";
  var publishEventName = "UserGoalTaskLoad";

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  $(tablinks).each(function () {
    $(this).removeClass("active");
  });
  for (i = 0; i < tablinks.length; i++) {
    if (tabName == "tab-goals") {
      tabId = "myGoals";
      itemToLoad = "goals";
      i = tablinks.length;
    } else if (tabName == "tab-messages") {
      tabId = "myMessages";
      itemToLoad = "";
      publishEventName = "UserMessagesLoad";
      i = tablinks.length;
    } else if (tabName == "tab-sidekick") {
      tabId = "mySidekick";
      itemToLoad = "";
      publishEventName = "UserSidekickLoad";
      i = tablinks.length;
    } else if (tabName == "tab-awards") {
      tabId = "myAwards";
      itemToLoad = "";
      publishEventName = "UserAwardsLoad";
      i = tablinks.length;
    } else if (tabName == "tab-agame-leagues") {
      tabId = "myAgame";
      itemToLoad = "";
      publishEventName = "userLeagueLoad";
      i = tablinks.length;
    } else if (tabName == "tab-games") {
      tabId = "myGames";
      itemToLoad = "";
      //publishEventName = "userLeagueLoad";
      i = tablinks.length;
    } else if (tabName == "tab-required-user-actions") {
      tabId = "myRequiredUserActions";
      itemToLoad = "";
      i = tablinks.length;
    }
  }
  window.setTimeout(function () {
    ko.postbox.publish(publishEventName, itemToLoad);
  }, 500);

  document.getElementById(tabName).style.display = "block";
  if (evt.currentTarget != null) {
    evt.currentTarget.className += " active";
  } else {
    $("button[id='" + tabId + "']").addClass("active");
  }
}
function LoadAvailableTabs() {
  let tabLinks = document.getElementsByClassName("tablinks");
  let tabAvailable = false;
  $(tabLinks).each(function () {
    tabAvailable = false;
    let item = this;
    let moduleName = $(item).attr("module");
    if (moduleName != null && moduleName != "") {
      let moduleParam = currentConfigParameters.find(
        (p) => p.ParamName == ("MODULE_" + moduleName).toUpperCase()
      );
      if (moduleParam == null) {
        appLib.getConfigParameterByName(
          "MODULE_" + moduleName,
          function (parameter) {
            moduleParam = parameter;
          }
        );
      }

      if (moduleParam != null) {
        tabAvailable =
          moduleParam?.ParamValue?.toUpperCase() == "ON".toUpperCase() ||
          moduleParam?.ParamValue?.toUpperCase() == "YES".toUpperCase() ||
          moduleParam?.ParamValue?.toUpperCase() == "true".toUpperCase();
      } else {
        tabAvailable = true;
      }
    } else {
      tabAvailable = true;
    }
    //if(tabAvailable == false && a$.urlprefix(true).indexOf("mnt") >= 0 && currentUserRole.toLowerCase() == "Admin".toLowerCase()){
    if(tabAvailable == false && a$.urlprefix(true).indexOf("mnt") >= 0){
      tabAvailable = true;
      $(item).addClass("admin-display-check-on")
    }
    if (tabAvailable == true) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}
function LoadInitialTab() {
  let isInitialTabVisible = false;
  let defaultTab = "";
  defaultTab = GetDefaultUserTab();
  if(defaultTab == null || defaultTab == "")
  {
    appLib.getConfigParameterByName(
      "UI_USERDASHBOARD_DEFAULT_TAB_ID",
      function (parameter) {
        if (parameter != null) {
          defaultTab = parameter.ParamValue;
        }
      }
    );
  }

  tablinks = document.getElementsByClassName("tablinks");
  if (defaultTab != null && defaultTab != "") {
    $(tablinks).each(function () {
      if (this.id == defaultTab && $(this).is(":visible") == true) {
        isInitialTabVisible = true;
        return;
      }
    });
  }

  if (isInitialTabVisible == false) {
    $(tablinks).each(function () {
      if ($(this).is(":visible") == true) {
        defaultTab = $(this)[0].id;
        return false;
      }
    });
  }

  if (defaultTab != null && defaultTab != "") {
    $("#" + defaultTab).click();
  }
}
function SetDefaultUserTab(userExtendedProfile){
  let defaultTab = GetDefaultUserTab(userExtendedProfile);
  if(defaultTab != null && defaultTab != "")
  {
    $(`#${defaultTab}`).click();
  }
}
function GetDefaultUserTab(userExtendedProfile)
{
  let returnValue = "";
  if(userExtendedProfile == null)
  {
    if($.cookie("userProfile_defaultTab") != null && $.cookie("userProfile_defaultTab") != "")
    {
      returnValue = $.cookie("userProfile_defaultTab");
    }
  }
  else
  {
    if(userExtendedProfile == null)
    {
      userExtendedProfile = currentUserProfileExtended;
    }
    returnValue = userExtendedProfile?.UserDashboardSettings?.DefaultTabId || "";
  }
  return returnValue;
}
$(function () {
  $("#maximize-panel").click(function () {
    $("#performance").addClass("maximize");
    $(".rpt-min-link").css({ display: "block" });
    $(".rpt-max-link").css({ display: "none" });
    ko.postbox.publish("RedrawCharts");
  });

  $("#minimize-panel").click(function () {
    $("#performance").removeClass("maximize");
    $(".rpt-min-link").css({ display: "none" });
    $(".rpt-max-link").css({ display: "block" });
    ko.postbox.publish("RedrawCharts");
  });

  $("#sidekick-button").click(function () {
    $(".side-panel").removeClass("active");
    $("#sidekick-panel").addClass("active");
  });
  $("#agame-button").click(function () {
    $(".side-panel").removeClass("active");
    $("#agame-panel").addClass("active");
  });
  $("#chat-button").click(function () {
    $(".side-panel").removeClass("active");
    $("#chat-panel").addClass("active");
  });
  $("#messages-button").click(function () {
    $(".side-panel").removeClass("active");
    $("#messages-panel").addClass("active");
  });

  $("#th-button").click(function () {
    $(".side-panel").removeClass("active");
    $("#th-panel").addClass("active");
  });
  $("#points-button").click(function () {
    $(".side-panel").removeClass("active");
    $("#points-panel").addClass("active");
  });

  $(".side-panel_close").click(function () {
    $(".side-panel").removeClass("active");
  });
});
