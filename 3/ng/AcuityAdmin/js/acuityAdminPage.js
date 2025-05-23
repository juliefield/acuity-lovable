let clientAdminConfig = [
   {
      prefix:"walgreens",
      id:67,
      adminTabs:[
         {
            tabName: "entityAdminTab",
            allowRoles: ["CorpAdmin"],
         },
         {
            tabName: "rosterManagerTab",
            allowRoles: ["Team Leader", "Group Leader", "Management", "CorpAdmin"],
         },
      ]
   },
   {
      prefix:"da",
      id:70,
      adminTabs:[
         {
            tabName: "payPerformanceTab",
            allowRoles: ["CorpAdmin"],
         },
      ]
   },
];

$(document).ready(function () {
   HideNoAccess();
   HandlePageTabs();
   HandleButtons();
   HideAll();
   let areaToLoad = a$.gup("area");
   if (areaToLoad == null || areaToLoad == "") {
      let userRole = $.cookie("TP1Role");
      if (userRole == "Admin") {
         areaToLoad = "default";
      }
      else if (userRole == "CorpAdmin") {
         areaToLoad = "default";
      }
      else {
         areaToLoad = "default";
      }

   }
   if (areaToLoad == "points") {
      ShowUserPointsContainer();
      MarkSelectedTab("userPointsTab");
   }
   else if (areaToLoad == "badges") {
      ShowUserBadgesContainer();
      MarkSelectedTab("userBadgesTab");
   }
   else if (areaToLoad == "trophies") {
      ShowUserTrophiesContainer();
      MarkSelectedTab("userTrophiesTab");
   }
   else if (areaToLoad == "pointsprizemanager" || areaToLoad == "ppm") {
      ko.postbox.publish("pointsPrizeManagerLoad");
      $("#pointsPrizeManagerTab").click();
   }
   else if (areaToLoad == "fulfillmanager" || areaToLoad == "fmgr") {
      ShowFulfillmentManagerContainer();
      MarkSelectedTab("fulfillmentManagerTab");
   }
   else if (areaToLoad == "datamanagement" || areaToLoad == "dm") {
      $("#dataManagerOptionsTab").click();
   }
   else if (areaToLoad == "badgemanagement" || areaToLoad == "bm") {
      ShowBadgeManagerContainer();
      MarkSelectedTab("badgeManagerTab");
   }
   else if (areaToLoad == "reportadmin" || areaToLoad == "ra") {
      ShowReportsAdminContainer();
      MarkSelectedTab("reportsAdminTab");
      $("#reportsAdminTab").click();
   }
   else if (areaToLoad == "projects" || areaToLoad == "proj") {
      ShowEntityAdminContainer();
      MarkSelectedSubTab("projectsSubTab");
      $("#entityAdminTab").click();
      $("#projectSubTab").click();
   }
   else if (areaToLoad == "locations" || areaToLoad == "lm") {
      ShowEntityAdminContainer();
      MarkSelectedSubTab("locationSubTab");
      $("#entityAdminTab").click();
      $("#locationSubTab").click();
   }
   else if (areaToLoad == "groups" || areaToLoad == "gm") {
      ShowEntityAdminContainer();
      MarkSelectedSubTab("groupSubTab");
      $("#entityAdminTab").click();
      $("#groupSubTab").click();
   }
   else if (areaToLoad == "teams" || areaToLoad == "tm") {
      ShowEntityAdminContainer();
      MarkSelectedSubTab("teamSubTab");
      $("#entityAdminTab").click();
      $("#teamSubTab").click();
   }
   else if (areaToLoad == "users" || areaToLoad == "um") {
      ShowEntityAdminContainer();
      MarkSelectedSubTab("userSubTab");
      $("#entityAdminTab").click();
      $("#userSubTab").click();
   }
   else if (areaToLoad == "skm" || areaToLoad == "srm" || areaToLoad == "sidekcikreason" || areaToLoad == "sidekickreason") {
      ShowEntityAdminContainer();
      MarkSelectedSubTab("sidekickReasonSubTab");
      $("#entityAdminTab").click();
      $("#sidekickReasonSubTab").click();
   }
   else if (areaToLoad == "config" || areaToLoad == "cm") {
      ShowConfigManagerContainer();
      MarkSelectedTab("configManagerOptionsTab");
      $("#configManagerOptionsTab").click();
   }
   else if (areaToLoad == "budget" || areaToLoad == "budgem") {
      ShowBudgetManagerContainer();
      MarkSelectedTab("budgetManagerOptionsTab");
      $("#budgetManagerOptionsTab").click();
   }
   else if (areaToLoad == "txtmgr" || areaToLoad == "txtm") {
      ShowResourceTextManagerContainer();
      MarkSelectedSubTab("generalTextSubTab");
      $("#resourceTextManagerTab").click();
      $("#generalTextSubTab").click();
   }
   else if (areaToLoad == "vmtxt" || areaToLoad == "vmtm") {
      ShowResourceTextManagerContainer();
      MarkSelectedSubTab("virtualMentorTextSubTab");
      $("#resourceTextManagerTab").click();
      $("#virtualMentorTextSubTab").click();
   }
   else if (areaToLoad == "tipstricks" || areaToLoad == "ttmgr") {
      ShowTipsTricksManagerContainer();
      MarkSelectedTab("tipsTricksManagerTab");
      $("#tipsTricksManagerTab").click();
   }
   else if (areaToLoad == "p4p" || areaToLoad == "payperf") {
      ShowPayPerformanceManagerContainer();
      MarkSelectedTab("payPerformanceTab");
      $("#payPerformanceTab").click();
   }
   else if (areaToLoad == "rm" || areaToLoad == "myroster") {
      ShowRosterManagerContainer();
      MarkSelectedTab("rosterManagerTab");
      $("#rosterManagerTab").click();
   }
   else if (areaToLoad == "upm" || areaToLoad == "userpromotion") {
      ShowUserPromotionManagerContainer();
      MarkSelectedTab("userPromotionManagerTab");
      $("#userPromotionManagerTab").click();
   }
   else if (areaToLoad == "ftm" || areaToLoad == "flexthememanager") {
      ShowFlexThemeManagerTabContainer();
      MarkSelectedTab("flexThemeManagerTab");
      $("#flexThemeManagerTab").click();
   }
   else if (areaToLoad == "none") {
      ShowNoAccess();
      HideLoadingPanel();
   }
   else if (areaToLoad == "default"){
      console.log("Default area.  Select something to view.");
      HideLoadingPanel();
   }
});

function HandleButtons() {
   $("#userPointsTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("LoadUserPointsForm");
         ShowUserPointsContainer();
         MarkSelectedTab("userPointsTab");
      });
   });
   $("#userBadgesTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("UserBadgesLoad");
         ShowUserBadgesContainer();
         MarkSelectedTab("userBadgesTab");
      });
   });
   $("#userTrophiesTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("LoadUserTrophiesForm");
         ShowUserTrophiesContainer();
         MarkSelectedTab("userTrophiesTab");
      });
   });
   $("#pointsPrizeManagerTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("pointsPrizeManagerLoad");
         ShowPointsPrizeManagerContainer();
         MarkSelectedTab("pointsPrizeManagerTab");
      });
   });
   $("#fulfillmentManagerTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("FulfillmentManagerLoad");
         ShowFulfillmentManagerContainer();
         MarkSelectedTab("fulfillmentManagerTab");
      });
   });
   $("#dataManagerOptionsTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("DataManagerOptionsLoad");
         ShowDataManagerOptionsContainer();
         MarkSelectedTab("dataManagerOptionsTab");
      });
   });
   $("#badgeManagerTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("badgeAdminLoad");
         ko.postbox.publish("badgeRulesLoad");
         ShowBadgeManagerContainer();
         MarkSelectedTab("badgeManagerTab");
      });
   });
   $("#reportsAdminTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("reportAdminLoad");
         ShowReportsAdminContainer();
         MarkSelectedTab("reportsAdminTab");
      });
   });
   $("#entityAdminTab").off("click").on("click", function () {
      HideAll();
      ShowSubTabsHolder();
      ShowLoadingPanel(function () {
         ko.postbox.publish("entityAdminLoad");
         ShowEntityAdminContainer();
         MarkSelectedTab("entityAdminTab");
         HandleSubTabSectionForSelectedTab("entityAdminTab");
      });
   });
   $("#projectSubTab").off("click").on("click", function () {
      HideAllSubTabInfo();
      ShowLoadingPanel(function () {
         ko.postbox.publish("projectAdminLoad");
         ShowProjectManagerContainer();
         MarkSelectedSubTab("projectSubTab");
      });
   });
   $("#locationSubTab").off("click").on("click", function () {
      HideAllSubTabInfo();
      ShowLoadingPanel(function () {
         ko.postbox.publish("locationAdminLoad");
         ShowLocationManagerContainer();
         MarkSelectedSubTab("locationSubTab");
      });
   });
   $("#groupSubTab").off("click").on("click", function () {
      HideAllSubTabInfo();
      ShowLoadingPanel(function () {
         ko.postbox.publish("groupAdminLoad");
         ShowGroupManagerContainer();
         MarkSelectedSubTab("groupSubTab");
      });
   });
   $("#teamSubTab").off("click").on("click", function () {
      HideAllSubTabInfo();
      ShowLoadingPanel(function () {
         ko.postbox.publish("teamAdminLoad");
         ShowTeamManagerContainer();
         MarkSelectedSubTab("teamSubTab");
      });
   });
   $("#userSubTab").off("click").on("click", function () {
      HideAllSubTabInfo();
      ShowLoadingPanel(function () {
         ko.postbox.publish("userAdminLoad");
         ShowUserManagerContainer();
         MarkSelectedSubTab("userSubTab");
      });
   });
   $("#sidekickReasonSubTab").off("click").on("click", function () {
      HideAllSubTabInfo();
      ShowLoadingPanel(function () {
         ko.postbox.publish("sidekickReasonLoad");
         ShowSidekickReasonsContainer();
         MarkSelectedSubTab("sidekickReasonSubTab");
      });
   });
   $("#configManagerOptionsTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("configManagerLoad");
         ShowConfigManagerContainer();
         MarkSelectedTab("configManagerOptionsTab");
      });
   });
   $("#budgetManagerOptionsTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("budgetManagerLoad");
         ShowBudgetManagerContainer();
         MarkSelectedTab("budgetManagerOptionsTab");
      });
   });
   $("#resourceTextManagerTab").off("click").on("click", function () {
      HideAll();
      ShowSubTabsHolder();
      ShowLoadingPanel(function () {
         ko.postbox.publish("resourceTextAdminLoad");
         ShowResourceTextManagerContainer();
         MarkSelectedTab("resourceTextManagerTab");
         HandleSubTabSectionForSelectedTab("resourceTextManagerTab");
      });
   });
   $("#tipsTricksManagerTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("tipsTricksManagerLoad");
         ShowTipsTricksManagerContainer();
         MarkSelectedTab("tipsTricksManagerTab");
      });
   });
   $("#generalTextSubTab").off("click").on("click", function () {
      HideAllSubTabTextInfo();
      ShowLoadingPanel(function () {
         ko.postbox.publish("resourceTextManagerLoad");
         ShowGeneralTextContainer();
         MarkSelectedSubTab("generalTextSubTab");
      });
   });
   $("#virtualMentorTextSubTab").off("click").on("click", function () {
      HideAllSubTabTextInfo();
      ShowLoadingPanel(function () {
         ko.postbox.publish("virtualMentorTextManagerLoad");
         ShowVirtualMentorTextContainer();
         MarkSelectedSubTab("virtualMentorTextSubTab");
      });
   });
   $("#payPerformanceTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("payPerformanceLoad");
         ShowPayPerformanceManagerContainer();
         MarkSelectedTab("payPerformanceTab");
      });
   });
   $("#rosterManagerTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("myTeamManagerLoad");
         ShowRosterManagerContainer();
         MarkSelectedTab("rosterManagerTab");
      });
   });
   $("#userPromotionManagerTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("UserPromotionManagerLoad");
         ShowUserPromotionManagerContainer();
         MarkSelectedTab("userPromotionManagerTab");
      });
   });
   $("#flexThemeManagerTab").off("click").on("click", function () {
      HideAll();
      ShowLoadingPanel(function () {
         ko.postbox.publish("FlexThemeManagerLoad");
         ShowFlexThemeManagerTabContainer();
         MarkSelectedTab("flexThemeManagerTab");
      });
   });

}
function MarkSelectedTab(tabToSelect) {
   $(".tablinks").each(function () {
      $(this).removeClass("active");
   });
   $("#" + tabToSelect).addClass("active");
   HideLoadingPanel();
}
function MarkSelectedSubTab(subTabToSelect) {
   let parentTabName = "entityAdminTab";
   let isEntityTabSubItem = true;
   switch (subTabToSelect) {
      case "generalTextSubTab":
      case "virtualMentorTextSubTab":
         parentTabName = "resourceTextManagerTab";
         isEntityTabSubItem = false;
         break;
   }
   ShowSubTabsHolder();
   HandleSubTabSectionForSelectedTab(parentTabName);
   if (isEntityTabSubItem == false) {
      ShowResourceTextManagerContainer();
   }
   else {
      ShowEntityAdminContainer();
   }
   MarkSelectedTab(parentTabName);
   $(".subtablinks").each(function () {
      $(this).removeClass("active");
   });
   $("#" + subTabToSelect).addClass("active");
   HideLoadingPanel();
}
function HandleSubTabSectionForSelectedTab(parentTabName) {
   HideAllSubTabSections();
   switch (parentTabName) {
      case "resourceTextManagerTab":
         $("#textSubTabOptionsContainer").show();
         break;
      default:
         $("#entitySubTabOptionsContainer").show();
         break;
   }
}
function HideAll() {
   HideNoAccess();
   HideSubTabsHolder();
   HideUserPointsContainer();
   HideUserBadgesContainer();
   HideUserTrophiesContainer();
   HidePointsPrizeManagerContainer();
   HideFulfillmentManagerContainer();
   HideDataManagerOptionsContainer();
   HideBadgeManagerContainer();
   HideReportsAdminContainer();
   HideEntityAdminContainer();
   HideConfigManagerContainer();
   HideBudgetManagerContainer();
   HideResourceTextManagerContainer();
   HideTipsTricksManagerContainer();
   HidePayPerformanceManagerContainer();
   HideRosterManagerContainer();
   HideUserPromotionManagerContainer();
   HideFlexThemeManagerTabContainer();
   HideAllSubTabInfo();
   HideAllSubTabTextInfo();

}
function HideAllSubTabInfo() {
   HideProjectManagerContainer();
   HideLocationManagerContainer();
   HideGroupManagerContainer();
   HideTeamManagerContainer();
   HideUserManagerContainer();
   HideSidekickReasonsContainer();
   HideGeneralTextContainer();
   HideVirtualMentorTextContainer();
}
function HideAllSubTabTextInfo() {
   HideGeneralTextContainer();
   HideVirtualMentorTextContainer();
}
function HideAllSubTabSections() {
   $(".subTab").each(function () {
      $(this).hide();
   });
}
function HandlePageTabs() {
   let userRole = $.cookie("TP1Role");
   let prefix = appLib.urlprefix();
   let configObject = clientAdminConfig.find(i => i.prefix == prefix.replace(".", ""));
   if(configObject == null)
   {
      $(".tablinks").each(function () {
         let id = this.id;
         if (userRole != "Admin" && userRole != "CorpAdmin") {
            $(this).hide();
         }
         else {
            switch (id) {
               case "userPointsTab":
               case "userBadgesTab":
               case "userTrophiesTab":
               case "reportsAdminTab":
               case "entityAdminTab":
               case "dataManagerOptionsTab":
               case "configManagerOptionsTab":
               case "budgetManagerOptionsTab":
               case "resourceTextManagerTab":
               case "tipsTricksManagerTab":
               //case "payPerformanceTab":
               case "rosterManagerTab":
               case "userPromotionManagerTab":
               case "flexThemeManagerTab":
                  // case "dataManagerOptionsTab":
                  if (userRole != "Admin") {
                     $(this).hide();
                  }
                  break;
            }
         }
      });
   }
   else
   {
      $(".tablinks").each(function () {
         let id = this.id;
         $(this).hide();
         if(IsTabVisibile(this.id, configObject, userRole, true))
         {
            $(this).show();
         }
      });
   }
}
function IsTabVisibile(tabId, configObject, currentUserRole, adminAlwaysVisible)
{
   let returnValue = false;
   if(adminAlwaysVisible == null)
   {
      adminAlwaysVisible == true;
   }
   if(adminAlwaysVisible && currentUserRole == "Admin")
   {
      return true;
   }

   let tabConfig = configObject.adminTabs?.find(tc => tc.tabName == tabId);

   if(tabConfig != null)
   {
      let roleIndex = tabConfig.allowRoles.findIndex(r => r == currentUserRole);

      returnValue = (roleIndex > -1);
   }
   return returnValue;

}
function ShowSubTabsHolder() {
   HandlePageSubTabs();
   $(".subTabsHolder").show();
}
function HandlePageSubTabs() {
   let userRole = $.cookie("TP1Role");
   $(".subtablinks").each(function () {
      let id = this.id;
      if (userRole != "Admin" && userRole != "CorpAdmin") {
         $(this).hide();
      }
      else {
         switch (id) {
            case "sidekickReasonSubTab":
            case "virtualMentorTextSubTab":
               if (userRole != "Admin") {
                  $(this).hide();
               }
               break;
         }
      }
   });

}
function HideSubTabsHolder() {
   $(".subTabsHolder").hide();
}
function ShowUserPointsContainer() {
   $("#userPointsContainer").show();
}
function HideUserPointsContainer() {
   $("#userPointsContainer").hide();
}
function ShowUserBadgesContainer() {
   $("#userBadgesContainer").show();
}
function HideUserBadgesContainer() {
   $("#userBadgesContainer").hide();
}
function ShowUserTrophiesContainer() {
   $("#userTrophiesContainer").show();
}
function HideUserTrophiesContainer() {
   $("#userTrophiesContainer").hide();
}
function ShowPointsPrizeManagerContainer() {
   $("#pointsPrizeManagerContainer").show();
}
function HidePointsPrizeManagerContainer() {
   $("#pointsPrizeManagerContainer").hide();
}
function ShowFulfillmentManagerContainer() {
   $("#fulfillmentManagerContainer").show();
}
function HideFulfillmentManagerContainer() {
   $("#fulfillmentManagerContainer").hide();
}
function ShowDataManagerOptionsContainer() {
   $("#dataManagerOptionsContainer").show();
}
function HideDataManagerOptionsContainer() {
   $("#dataManagerOptionsContainer").hide();
}
function ShowBadgeManagerContainer() {
   $("#badgeManagerContainer").show();
}
function HideBadgeManagerContainer() {
   $("#badgeManagerContainer").hide();
}
function ShowReportsAdminContainer() {
   $("#reportsAdminContainer").show();
}
function HideReportsAdminContainer() {
   $("#reportsAdminContainer").hide();
}
function ShowEntityAdminContainer() {
   $("#entityAdminContainer").show();
}
function HideEntityAdminContainer() {
   $("#entityAdminContainer").hide();
}
function ShowProjectManagerContainer() {
   $("#projectsManagerContainer").show();
}
function HideProjectManagerContainer() {
   $("#projectsManagerContainer").hide();
}
function ShowLocationManagerContainer() {
   $("#locationsManagerContainer").show();
}
function HideLocationManagerContainer() {
   $("#locationsManagerContainer").hide();
}
function ShowGroupManagerContainer() {
   $("#groupsManagerContainer").show();
}
function HideGroupManagerContainer() {
   $("#groupsManagerContainer").hide();
}
function ShowTeamManagerContainer() {
   $("#teamsManagerContainer").show();
}
function HideTeamManagerContainer() {
   $("#teamsManagerContainer").hide();
}
function ShowUserManagerContainer() {
   $("#usersManagerContainer").show();
}
function HideUserManagerContainer() {
   $("#usersManagerContainer").hide();
}
function ShowSidekickReasonsContainer() {
   $("#sidekickReasonContainer").show();
}
function HideSidekickReasonsContainer() {
   $("#sidekickReasonContainer").hide();
}
function ShowConfigManagerContainer() {
   $("#configParameterContainer").show();
}
function HideConfigManagerContainer() {
   $("#configParameterContainer").hide();
}
function ShowBudgetManagerContainer() {
   $("#budgetManagerContainer").show();
}
function HideBudgetManagerContainer() {
   $("#budgetManagerContainer").hide();
}
function ShowResourceTextManagerContainer() {
   $("#resourceTextManagerContainer").show();
}
function HideResourceTextManagerContainer() {
   $("#resourceTextManagerContainer").hide();
}
function HideTipsTricksManagerContainer() {
   $("#tipsTricksManagerContainer").hide();
}
function ShowTipsTricksManagerContainer() {
   $("#tipsTricksManagerContainer").show();
}
function HideGeneralTextContainer() {
   $("#generalTextContainer").hide();
}
function ShowGeneralTextContainer() {
   $("#generalTextContainer").show();
}
function HideVirtualMentorTextContainer() {
   $("#virtualMentorTextContainer").hide();
}
function ShowVirtualMentorTextContainer() {
   $("#virtualMentorTextContainer").show();
}
function HidePayPerformanceManagerContainer() {
   $("#payPerformanceContainer").hide();
}
function ShowPayPerformanceManagerContainer() {
   $("#payPerformanceContainer").show();
}
function HideRosterManagerContainer() {
   $("#rosterManagerContainer").hide();
}
function ShowRosterManagerContainer() {
   $("#rosterManagerContainer").show();
}
function HideUserPromotionManagerContainer() {
   $("#userPromotionManagerContainer").hide();
}
function ShowUserPromotionManagerContainer() {
   $("#userPromotionManagerContainer").show();
}
function HideFlexThemeManagerTabContainer(){
   $("#flexThemeManagerContainer").hide();
}
function ShowFlexThemeManagerTabContainer(){
   $("#flexThemeManagerContainer").show();
}

function ShowNoAccess() {
   $("#noAccess").show();
}
function HideNoAccess() {
   $("#noAccess").hide();
}

function ShowLoadingPanel(callback) {
   $("#LoadingPanel").show();
   if (callback != null) {
      window.setTimeout(function () {
         callback();
      }, 500);
   }
}
function HideLoadingPanel() {
   $("#LoadingPanel").hide();
}
