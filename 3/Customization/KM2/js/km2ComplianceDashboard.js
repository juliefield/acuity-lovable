var autoRefreshTime = new Date((new Date().getTime() + (1000 * 60 * 60 * 24)));
var directiveLoadStatus = {
   auditorCount: false,
   auditCount: false,
   clientCount: false,
   failRatesCount: false,
   pendingDisputesCount: false,
   validDisputesCount: false,
   auditorSummaryChart: false,
   clientSummaryChart: false,
   auditorLoginStats: false,
   failRatesLocationChart: false,
};
var hasAccess = false;
$(document).ready(function () {
   HideAll();

   DetermineAccess();
   if (!hasAccess) {
      HandleNoAccess();
   }
   else {
      $("#btnRefreshAll").on("click", function () {
         ResetDirectiveLoadStatus();
         ShowLoadingPanel(function () {
            ko.postbox.publish("km2ComplianceFiltersChanged");
            SetRefreshInformation();
            StartRefreshTimer();
         });
      });
      window.setTimeout(function () {
         ShowLoadingPanel(function () {
            ko.postbox.publish("km2ComplianceFiltersChanged");
         });
      }, 500);
      SetRefreshInformation()
      StartRefreshTimer();
   }
});
function DetermineAccess() {
   let prefix = a$.urlprefix(false);
   let canAccess = false;
   let configParams = [];
   let moduleParameter = null;
   let dashboardAllowParameter = null;
   if (prefix != "km2.") {
      canAccess = false;
      hasAccess = false;
      return;
   }
   a$.getConfigParameterByName("MODULE_CUSTOMDEV_DASHBOARD", function(param){
      moduleParameter = param;
   });

   a$.getConfigParameterByName("CUSTOMDEV_DASHBOARD_SECURITY_ALLOWED", function(param){
      dashboardAllowParameter = param;
   });   
   if(moduleParameter != null && dashboardAllowParameter != null)
   {
      canAccess = false;
      hasAccess = false;
      if(moduleParameter.ParamValue != null && moduleParameter.ParamValue.toLowerCase() == "On".toLowerCase())
      {
         if(dashboardAllowParameter.ParamValue == null || dashboardAllowParameter.ParamValue == "")
         {
            let paramObjectList = dashboardAllowParameter.ParamValueObjects;
             //Find from a list???? paramObjectList.Dashboard.toLowerCase() == "compliance".toLowerCase();
            let dashboardParamObject = paramObjectList.Allows;
            if(dashboardParamObject != null && dashboardParamObject != "")
            {
               let userName = $.cookie("TP1Username");
               let userRole = $.cookie("TP1Role");
               //let userSubrole = $.cookie("TP1Subrole");
               if(userRole != null && userRole != "" && userRole.toLowerCase() == "Admin".toLowerCase()) //System Admin
               {
                  canAccess = true;
                  hasAccess = true;
               }
               else
               {
                  if(dashboardParamObject.Users != null && dashboardParamObject.Users != "" && dashboardParamObject.Users.findIndex(u => u.toLowerCase() == userName.toLowerCase()) > -1)
                  {
                     canAccess = true;
                     hasAccess = true;
                  }
                  else if(dashboardParamObject.Roles != null && dashboardParamObject.Roles != ""&& dashboardParamObject.Roles.findIndex(r => r.toLowerCase() == userRole.toLowerCase()) > -1)
                  {
                     canAccess = true;
                     hasAccess = true;
                  }
               }
            }
         }
      }
   }
   if (canAccess == true) {
      hasAccess = true;
   }
}

function HandleNoAccess() {
   $("#dashboardMainSection").hide();
   ShowNoAccess();
}
function HideAll() {
   HideNoAccess();
   HideLoadingPanel();
}
function HideLoadingPanel() {
   $("#km2ComplianceLoadingPanel").hide();
}
function ShowLoadingPanel(callback) {
   $("#km2ComplianceLoadingPanel").show();
   if (callback != null) {
      window.setTimeout(function () {
         callback();
      }, 500);
   }
}
function HideNoAccess() {
   $("#noAccessDisplay").hide();
}
function ShowNoAccess() {
   $("#noAccessDisplay").show();
}
function ShowMainDisplay() {
   $("#dashboardMainSection").show();
}
function HideMainDisplay() {
   $("#dashboardMainSection").hide();
}


function SetRefreshInformation() {
   autoRefreshTime = new Date((new Date().getTime() + (1000 * 60 * 15))); //15 minutes
}
function StartRefreshTimer() {
   let intervalId = setInterval(function () {
      let timeLeft = parseInt((new Date(autoRefreshTime) - new Date()) / (1000 * 60));
      let timeMessage = `${timeLeft} minutes`

      if (new Date() > new Date(autoRefreshTime)) {
         clearInterval(intervalId);
         $("#btnRefreshAll").click();
      }
      else {
         $("#lblTimeToRefreshLeft").empty();
         if (timeLeft < 1) {
            timeLeft = parseInt((new Date(autoRefreshTime) - new Date()) / (1000));
            timeMessage = `${timeLeft} seconds`
         }
         $("#lblTimeToRefreshLeft").text(timeMessage);
      }
   }, 1000);
}
function ResetDirectiveLoadStatus() {
   directiveLoadStatus.auditorCount = false;
   directiveLoadStatus.auditCount = false;
   directiveLoadStatus.clientCount = false;
   directiveLoadStatus.failRatesCount = false;
   directiveLoadStatus.pendingDisputesCount = false;
   directiveLoadStatus.validDisputesCount = false;
   directiveLoadStatus.auditorSummaryChart = false;
   directiveLoadStatus.clientSummaryChart = false;
   directiveLoadStatus.auditorLoginStats = false;
   directiveLoadStatus.failRatesLocationChart = false;
}
ko.postbox.subscribe("ComplianceDashboardStartLoad", function () {
   ResetDirectiveLoadStatus();
   window.setTimeout(function () {
      ShowLoadingPanel(function () {
         ko.postbox.publish("km2ComplianceFiltersChanged");
      });
   }, 500);
});
ko.postbox.subscribe("ComplianceLoadComplete", function (area) {
   let isAllLoaded = false;
   if (area != null) {
      switch (area.toLowerCase()) {
         case "TotalAuditors".toLowerCase():
            directiveLoadStatus.auditorCount = true;
            break;
         case "TotalAudits".toLowerCase():
            directiveLoadStatus.auditCount = true;
            break;
         case "ClientCounts".toLowerCase():
            directiveLoadStatus.clientCount = true;
            break;
         case "FailRatesCount".toLowerCase():
            directiveLoadStatus.failRatesCount = true;
            break;
         case "DisputesCountPending".toLowerCase():
            directiveLoadStatus.pendingDisputesCount = true;
            break;
         case "DisputesCountValid".toLowerCase():
            directiveLoadStatus.validDisputesCount = true;
            break;
         case "ChartLoad_auditor-complete".toLowerCase():
            directiveLoadStatus.auditorSummaryChart = true;
            break;
         case "ChartLoad_client-complete".toLowerCase():
            directiveLoadStatus.clientSummaryChart = true;
            break;
         case "ChartLoad_failRatesLocation".toLowerCase():
            directiveLoadStatus.failRatesLocationChart = true;
            break;
         case "AuditorLoginStats".toLowerCase():
            directiveLoadStatus.auditorLoginStats = true;
            break;
      }
   }
   isAllLoaded = (
      directiveLoadStatus.auditorCount &&
      directiveLoadStatus.auditCount &&
      directiveLoadStatus.clientCount &&
      directiveLoadStatus.failRatesCount &&
      directiveLoadStatus.pendingDisputesCount &&
      directiveLoadStatus.validDisputesCount &&
      directiveLoadStatus.auditorSummaryChart &&
      directiveLoadStatus.clientSummaryChart &&
      directiveLoadStatus.failRatesLocationChart &&
      directiveLoadStatus.auditorLoginStats
   );
   if (isAllLoaded) {
      HideLoadingPanel();
   }
});