$(document).ready(function () {
  $("#btnRefreshAll").on("click", function () {
    LoadAutoQaDashboard();
  });
  $("#btnLoadStatsData")
    .off("click")
    .on("click", function () {
      ShowLoadingPanel();
      DoStatsTableLoad(() => {
        LoadAutoQaDashboard();
      });
    });
  $("#lnkGoToAutoQa")
    .off("click")
    .on("click", function () {
      //alert("Not implemented - Should go to the Auto Qa Importing piece.");
      console.log("Go to AUTO QA clicked.  Determine what we need to do here.");
    });
});

function LoadAutoQaDashboard(filtersObject) {
  ShowLoadingPanel(function () {
    GetStatsLastRunDate();
    LoadQMDashboardStatsData((dataToLoad) => {
      PushDashboardStatsData(() => {
        HideLoadingPanel();
      }, dataToLoad);
    }, filtersObject);
    // LoadDashboardData(function (dataLoaded) {
    //    PushDashboardData(function () {
    //       HideLoadingPanel();
    //    }, dataLoaded);
    // }, filtersObject);
  });
}
function LoadDashboardData(callback, filtersObject) {
  let startDate = null;
  let endDate = null;
  let projectId = null;
  let locationId = null;
  let groupId = null;
  let teamId = null;
  let userId = null;
  if (filtersObject != null) {
    startDate = filtersObject.StartDate;
    endDate = filtersObject.EndDate;
    projectId = filtersObject.Project;
    locationId = filtersObject.Location;
    groupId = filtersObject.Group;
    teamId = filtersObject.Team;
    userId = filtersObject.CSR;
  } else {
    startDate = $.cookie("StartDate");
    endDate = $.cookie("EndDate");
    projectId = $.cookie("Project");
    locationId = $.cookie("Location");
    groupId = $.cookie("Group");
    teamId = $.cookie("Team");
    userId = $.cookie("CSR");
  }
  //TODO: Clean this up to make it better??
  //TODO: Handle the each/all values in the filters.
  //need to determine how the "each" value differs on the display
  if (projectId == "all" || projectId == "each") projectId = null;
  if (locationId == "all" || locationId == "each") locationId = null;
  if (groupId == "all" || groupId == "each") groupId = null;
  if (teamId == "all" || teamId == "each") teamId = null;
  if (userId == "all" || userId == "each") userId = null;

  a$.ajax({
    type: "POST",
    service: "C#",
    async: true,
    data: {
      lib: "selfserve",
      cmd: "getAutoQaDashboardData",
      startDate: startDate,
      endDate: endDate,
      deepLoad: false,
      projectId: projectId,
      locationId: locationId,
      groupId: groupId,
      teamId: teamId,
      userId: userId,
    },
    dataType: "json",
    cache: false,
    error: a$.ajaxerror,
    success: function (data) {
      let returnData = JSON.parse(data.autoQaDashboardData);
      if (callback != null) {
        callback(returnData);
      } else {
        return returnData;
      }
    },
  });
}
function PushDashboardData(callback, dataToPush) {
  ko.postbox.publish("autoQaLoad", dataToPush);
  if (callback != null) {
    callback(dataToPush);
  }
}
function LoadQMDashboardStatsData(callback, filtersObject) {
  let startDate = null;
  let endDate = null;
  let projectId = null;
  let locationId = null;
  let groupId = null;
  let teamId = null;
  let userId = null;
  if (filtersObject != null) {
    startDate = filtersObject.StartDate;
    endDate = filtersObject.EndDate;
    projectId = filtersObject.Project;
    locationId = filtersObject.Location;
    groupId = filtersObject.Group;
    teamId = filtersObject.Team;
    userId = filtersObject.CSR;
  } else {
    startDate = $.cookie("StartDate");
    endDate = $.cookie("EndDate");
    projectId = $.cookie("Project");
    locationId = $.cookie("Location");
    groupId = $.cookie("Group");
    teamId = $.cookie("Team");
    userId = $.cookie("CSR");
  }
  //TODO: Clean this up to make it better??
  //TODO: Handle the each/all values in the filters.
  //need to determine how the "each" value differs on the display
  if (projectId == "all" || projectId == "each") projectId = null;
  if (locationId == "all" || locationId == "each") locationId = null;
  if (groupId == "all" || groupId == "each") groupId = null;
  if (teamId == "all" || teamId == "each") teamId = null;
  if (userId == "all" || userId == "each") userId = null;

  a$.ajax({
    type: "POST",
    service: "C#",
    async: true,
    data: {
      lib: "selfserve",
      cmd: "getQMDashboardStatsData",
      startDate: startDate,
      endDate: endDate,
      deepLoad: false,
      projectId: projectId,
      locationId: locationId,
      groupId: groupId,
      teamId: teamId,
      userId: userId,
    },
    dataType: "json",
    cache: false,
    error: a$.ajaxerror,
    success: function (data) {
      let returnData = JSON.parse(data.qmDashboardStatsData);
      if (callback != null) {
        callback(returnData);
      } else {
        return returnData;
      }
    },
  });
}
function PushDashboardStatsData(callback, dataToPush) {
  ko.postbox.publish("qmDashboardLoadData", dataToPush);
  ko.postbox.publish("AutoQA_HumanVsAI_Load", null);
  if (callback != null) {
    callback(dataToPush);
  }
}
function DoStatsTableLoad(callback) {
  let endDate = new Date();
  let previousDaysToLoad = 3;
  a$.ajax({
    type: "POST",
    service: "C#",
    async: true,
    data: {
      lib: "selfserve",
      cmd: "forceLoadQMDashboardStatsData",
      endDate: endDate.toLocaleDateString(),
      previousDayCountToLoad: previousDaysToLoad,
    },
    dataType: "json",
    cache: false,
    error: a$.ajaxerror,
    success: function (data) {
      if (callback != null) {
        callback();
      } else {
        return;
      }
    },
  });
}
function GetStatsLastRunDate(callback) {
  a$.ajax({
    type: "POST",
    service: "C#",
    async: true,
    data: {
      lib: "selfserve",
      cmd: "getQMDashboardStatsLastRunDate",
    },
    dataType: "json",
    cache: false,
    error: a$.ajaxerror,
    success: function (data) {
      let returnData = data.lastQMStatsRunDate;
      RenderLastRunDate(returnData);
      if (callback != null) {
        callback(returnData);
      } else {
        return returnData;
      }
    },
  }); //
}

function RenderLastRunDate(dateToRender) {
  $("#lastRunDateText").empty();
  let dateStringFormat = "{date} @ {time}";
  dateStringFormat = dateStringFormat.replace(
    "{date}",
    new Date(dateToRender).toLocaleDateString()
  );
  dateStringFormat = dateStringFormat.replace(
    "{time}",
    new Date(dateToRender).toLocaleTimeString()
  );

  $("#lastRunDateText").append(dateStringFormat);
  //lastRunDateText
}

function GetFilterArrays() {
  let returnArraysObject = {
    ProjectId: [],
    LocationId: [],
    GroupId: [],
    TeamId: [],
    UserId: [],
  };
  // let projectId = legacyContainer.scope.filters.Project;
  // let locationId = legacyContainer.scope.filters.Location;
  // let groupId = legacyContainer.scope.filters.Group;
  // let teamId = legacyContainer.scope.filters.Team;

  let projectId = $.cookie("Project");
  let locationId = $.cookie("Location");
  let groupId = $.cookie("Group");
  let teamId = $.cookie("Team");

  if (projectId == "all" || projectId == "each" || projectId == "") {
    returnArraysObject.ProjectId.push(0);
  } else if (projectId.indexOf(",") > 0) {
    projectId.split(",").forEach((i) => {
      returnArraysObject.ProjectId.push(parseInt(i));
    });
  } else {
    returnArraysObject.ProjectId.push(parseInt(projectId));
  }
  if (locationId == "all" || locationId == "each" || locationId == "") {
    returnArraysObject.LocationId.push(0);
  } else if (locationId.indexOf(",") > 0) {
    //returnArraysObject.LocationId = locationId.split(",");
    locationId.split(",").forEach((i) => {
      returnArraysObject.LocationId.push(parseInt(i));
    });
  } else {
    returnArraysObject.LocationId.push(parseInt(locationId));
  }
  if (groupId == "all" || groupId == "each" || groupId == "") {
    returnArraysObject.GroupId.push(0);
  } else if (groupId.indexOf(",") > 0) {
    //returnArraysObject.GroupId = groupId.split(",");
    groupId.split(",").forEach((i) => {
      returnArraysObject.GroupId.push(parseInt(i));
    });
  } else {
    returnArraysObject.GroupId.push(parseInt(groupId));
  }
  if (teamId == "all" || teamId == "each" || teamId == "") {
    returnArraysObject.TeamId.push(0);
  } else if (teamId.indexOf(",") > 0) {
    //returnArraysObject.TeamId = teamId.split(",");
    teamId.split(",").forEach((i) => {
      returnArraysObject.TeamId.push(parseInt(i));
    });
  } else {
    returnArraysObject.TeamId.push(parseInt(teamId));
  }
  return returnArraysObject;
}
function HideAll() {
  HideLoadingPanel();
}
function HideLoadingPanel() {
  $("#autoQaLoadingPanel").hide();
}
function ShowLoadingPanel(callback) {
  $("#autoQaLoadingPanel").show();
  if (callback != null) {
    window.setTimeout(function () {
      callback();
    }, 500);
  }
}

ko.postbox.subscribe("Filters", function (value) {
  LoadAutoQaDashboard(value);
});
