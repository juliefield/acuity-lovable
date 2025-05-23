let IrpasReferenceObjects = {
  AvailableUserProfiles: {
    dataLoaded: false,
    data: [],
  },
  AvailableEvaluationAreas: {
    dataLoaded: false,
    data: [],
  },
  AvailableEvaluationSubAreas: {
    dataLoaded: false,
    data: [],
  },
  AvailableIntervals: {
    dataLoaded: false,
    data: [],
  },
  IrpasSettings: {
    dataLoaded: false,
    data: null,
  },
}
$(document).ready(function () {
  //TODO (cdj): Load the reference data that we will use (user profiles, current intervals, current areas, etc.)
  //Pass the reference data to the various subscribers
  //Load each of the widgets on the screen
  window.setTimeout(function () {
    ko.postbox.publish("IRPASManagementInit");
  }, 500);
  window.setTimeout(function () {
    ko.postbox.publish("IRPASManagementLoad");
  }, 1000);
  LoadAllData();
});

function LoadAllData(callback) {
  LoadCurrentSettings();
  LoadAvailableUserProfiles(function () {
    window.setTimeout(function () {
      ko.postbox.publish("IRPAS_AvailableUserProfileLoaded", IrpasReferenceObjects);
    }, 500);
  });
  LoadAvailableEvaluationAreas(function () {
    window.setTimeout(function () {
      ko.postbox.publish("IRPAS_AvailableEvaluationAreasLoaded", IrpasReferenceObjects);
    }, 500);
  });
  LoadAvailableEvaluationSubAreas(function () {
    window.setTimeout(function () {
      ko.postbox.publish("IRPAS_AvailableEvaluationSubAreasLoaded", IrpasReferenceObjects);
    }, 500);
  });
  LoadAvailableIntervals(function () {
    window.setTimeout(function () {
      ko.postbox.publish("IRPAS_AvailableIntervalsLoaded", IrpasReferenceObjects);
    }, 500);
  });
  if(callback != null)
  {
    callback();
  }
}

function LoadAvailableUserProfiles(callback) {
  if (IrpasReferenceObjects.AvailableUserProfiles.dataLoaded == false) {
    a$.ajax({
      type: "GET",
      service: "C#",
      async: true,
      data: {
        lib: "selfserv",
        cmd: "getAllProfiles"
      },
      dataType: "json",
      cache: false,
      error: a$.ajaxerror,
      success: function (jsonData) {
        returnData = JSON.parse(jsonData.allProfilesList);
        IrpasReferenceObjects.AvailableUserProfiles.data.length = 0;
        IrpasReferenceObjects.AvailableUserProfiles.data = returnData;
        IrpasReferenceObjects.AvailableUserProfiles.dataLoaded = true;
        if (callback != null) {
          callback(returnData);
        }
      }
    });
  }
}
function LoadAvailableEvaluationAreas(callback) {
  if (IrpasReferenceObjects.AvailableUserProfiles.dataLoaded == false) {
    a$.ajax({
      type: "POST",
      service: "C#",
      async: true,
      data: {
        lib: "selfserve",
        cmd: "getAllAvailableIRPASAreas",
      },
      dataType: "json",
      cache: false,
      error: a$.ajaxerror,
      success: function (data) {
        let returnData = JSON.parse(data.availableIrpasAreasList);
        IrpasReferenceObjects.AvailableEvaluationAreas.data.length = 0;
        IrpasReferenceObjects.AvailableEvaluationAreas.data = returnData;
        IrpasReferenceObjects.AvailableEvaluationAreas.dataLoaded = true;
        if (callback != null) {
          callback(returnData);
        }
        else {
          return returnData;
        }
      }
    });
  }
}
function LoadAvailableEvaluationSubAreas(callback) {
  if (IrpasReferenceObjects.AvailableEvaluationSubAreas.dataLoaded == false) {
    a$.ajax({
      type: "POST",
      service: "C#",
      async: true,
      data: {
        lib: "selfserve",
        cmd: "getAllAvailableIRPASSubAreas",
      },
      dataType: "json",
      cache: false,
      error: a$.ajaxerror,
      success: function (data) {
        let returnData = JSON.parse(data.availableIrpasSubAreasList);
        IrpasReferenceObjects.AvailableEvaluationSubAreas.data.length = 0;
        IrpasReferenceObjects.AvailableEvaluationSubAreas.data = returnData;
        IrpasReferenceObjects.AvailableEvaluationSubAreas.dataLoaded = true;
        if (callback != null) {
          callback(returnData);
        }
        else {
          return returnData;
        }
      }
    });
  }
}
function LoadAvailableIntervals(callback) {
  if (IrpasReferenceObjects.AvailableIntervals.dataLoaded == false) {
    a$.ajax({
      type: "POST",
      service: "C#",
      async: true,
      data: {
        lib: "selfserve",
        cmd: "getAllAvailableIRPASIntervals",
      },
      dataType: "json",
      cache: false,
      error: a$.ajaxerror,
      success: function (data) {
        let returnData = JSON.parse(data.availableIntervalList);
        IrpasReferenceObjects.AvailableIntervals.data.length = 0;
        IrpasReferenceObjects.AvailableIntervals.data = returnData;
        IrpasReferenceObjects.AvailableIntervals.dataLoaded = true;
        if (callback != null) {
          callback(returnData);
        }
        else {
          return returnData;
        }
      }
    });
  }
}
function LoadCurrentSettings(callback) {  
  IrpasReferenceObjects.IrpasSettings.dataLoaded = true;
  IrpasReferenceObjects.IrpasSettings.data = [];
  if (callback != null) {
    callback();
  }
}


