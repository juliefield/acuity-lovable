let loadCheckCounter = 0;
let viewerConfigurations = {
   checkIterations: 1000,
   recheckTimeoutMS: 1000,
};
let dataLookupOptionsLoaded = {
   Projects: false,   
   Locations: false,
   UserProfiles: false,
   Groups: false,
   Teams: false,
   Data: {
      Projects: [],
      Locations: [],
      UserProfiles: [],
      Groups: [],
      Teams: [],
   }
}
$(document).ready(function(){
   
   window.setTimeout(function(){
      ko.postbox.publish("UsageAnalysisInit");
   }, 100);

   window.setTimeout(function(){
      LoadAllLookupData();
   }, 500);
 });

function LoadAllLookupData(forceReload){   
   if(forceReload == true)
   {
      dataLookupOptionsLoaded.Projects = false;
      dataLookupOptionsLoaded.Locations = false;
      dataLookupOptionsLoaded.Groups = false;
      dataLookupOptionsLoaded.Teams = false;
      dataLookupOptionsLoaded.UserProfiles = false;

      dataLookupOptionsLoaded.Data.Projects.length = 0;
      dataLookupOptionsLoaded.Data.Locations.length = 0;
      dataLookupOptionsLoaded.Data.UserProfiles.length = 0;
   }
   let isAllLoaded = false;
   LoadProjectLookupData(function(projectDataList){
      dataLookupOptionsLoaded.Projects = true;
      ko.postbox.publish("UsageAnalysis_LookupDataLoaded", {dataType: "project", dataObjectsList: projectDataList});
   });
   LoadLocationsLookupData(function(locationsDataList){
      dataLookupOptionsLoaded.Locations = true;
      ko.postbox.publish("UsageAnalysis_LookupDataLoaded", {dataType: "location", dataObjectsList: locationsDataList});
   });
   LoadUserProfilesLookupData(function(userProfilesList){
      dataLookupOptionsLoaded.UserProfiles = true;
      ko.postbox.publish("UsageAnalysis_LookupDataLoaded", {dataType: "userProfiles", dataObjectsList: userProfilesList});
   });
   LoadGroupsLookupData(function(groupsDataList){
      dataLookupOptionsLoaded.Groups = true;
      ko.postbox.publish("UsageAnalysis_LookupDataLoaded", {dataType: "group", dataObjectsList: groupsDataList});
   });
   LoadTeamsLookupData(function(teamsDataList){
      dataLookupOptionsLoaded.Teams = true;
      ko.postbox.publish("UsageAnalysis_LookupDataLoaded", {dataType: "team", dataObjectsList: teamsDataList});
   });

   CheckLoadsComplete();
}

function CheckLoadsComplete()
{
   let isComplete = (dataLookupOptionsLoaded.Projects == true &&
      dataLookupOptionsLoaded.Locations == true && 
      dataLookupOptionsLoaded.Groups == true && 
      dataLookupOptionsLoaded.Teams == true && 
      dataLookupOptionsLoaded.UserProfiles == true);
   if(isComplete == false && loadCheckCounter < viewerConfigurations.checkIterations)
   {
      window.setTimeout(function(){
         loadCheckCounter++;
         CheckLoadsComplete();
      }, viewerConfigurations.recheckTimeoutMS);   
   }
   else 
   {
      ko.postbox.publish("UsageAnalysisReload");
   }
   
}

function LoadProjectLookupData(callback) {
   if(dataLookupOptionsLoaded.Projects == false)
   {
      a$.ajax({
         type: "POST",
         service: "C#",
         async: true,
         data: {
           lib: "selfserve",
           cmd: "getProjectListForUser",
         },
         dataType: "json",
         cache: false,
         error: a$.ajaxerror,
         success: function (data) {
           let returnData = JSON.parse(data.projectList);
           dataLookupOptionsLoaded.Data.Projects.length = 0;
           dataLookupOptionsLoaded.Data.Projects = [... returnData];
           dataLookupOptionsLoaded.Projects = true;

           if (callback != null) {
             callback(returnData);
           } else {
             return returnData;
           }
         },
       });
   }
   else
   {
      if (callback != null) {
         callback(dataLookupOptionsLoaded.Data.Projects);
       } else {
         return dataLookupOptionsLoaded.Data.Projects;
       }
   }  
}
function LoadLocationsLookupData(callback) {
   if(dataLookupOptionsLoaded.Locations == false)
   {
      a$.ajax({
         type: "POST",
         service: "C#",
         async: true,
         data: {
           lib: "selfserve",
           cmd: "getLocationList",
         },
         dataType: "json",
         cache: false,
         error: a$.ajaxerror,
         success: function (data) {
           let returnData = JSON.parse(data.locationList);
           dataLookupOptionsLoaded.Data.Locations.length = 0;
           dataLookupOptionsLoaded.Data.Locations = [... returnData];
           dataLookupOptionsLoaded.Locations = true;

           if (callback != null) {
             callback(returnData);
           } else {
             return returnData;
           }
         },
       });
   }
   else
   {
      if (callback != null) {
         callback(dataLookupOptionsLoaded.Data.Locations);
       } else {
         return dataLookupOptionsLoaded.Data.Locations;
       }
   }  
}
function LoadGroupsLookupData(callback) {
   if(dataLookupOptionsLoaded.Locations == false)
   {
      a$.ajax({
         type: "POST",
         service: "C#",
         async: true,
         data: {
           lib: "selfserve",
           cmd: "getGroupList",
         },
         dataType: "json",
         cache: false,
         error: a$.ajaxerror,
         success: function (data) {
           let returnData = JSON.parse(data.groupList);
           dataLookupOptionsLoaded.Data.Groups.length = 0;
           dataLookupOptionsLoaded.Data.Groups = [... returnData];
           dataLookupOptionsLoaded.Groups = true;

           if (callback != null) {
             callback(returnData);
           } else {
             return returnData;
           }
         },
       });
   }
   else
   {
      if (callback != null) {
         callback(dataLookupOptionsLoaded.Data.Groups);
       } else {
         return dataLookupOptionsLoaded.Data.Groups;
       }
   }  
}
function LoadTeamsLookupData(callback) {
   if(dataLookupOptionsLoaded.Teams == false)
   {
      a$.ajax({
         type: "POST",
         service: "C#",
         async: true,
         data: {
           lib: "selfserve",
           cmd: "getTeamList",
         },
         dataType: "json",
         cache: false,
         error: a$.ajaxerror,
         success: function (data) {
           let returnData = JSON.parse(data.teamList);
           dataLookupOptionsLoaded.Data.Teams.length = 0;
           dataLookupOptionsLoaded.Data.Teams = [... returnData];
           dataLookupOptionsLoaded.Teams = true;

           if (callback != null) {
             callback(returnData);
           } else {
             return returnData;
           }
         },
       });
   }
   else
   {
      if (callback != null) {
         callback(dataLookupOptionsLoaded.Data.Teams);
       } else {
         return dataLookupOptionsLoaded.Data.Teams;
       }
   }  
}
function LoadUserProfilesLookupData(callback) {
   if(dataLookupOptionsLoaded.UserProfiles == false)
   {
      a$.ajax({
         type: "POST",
         service: "C#",
         async: true,
         data: {
            lib: "selfserve",
            cmd: "getAllProfiles",
         },
         dataType: "json",
         cache: false,
         error: a$.ajaxerror,
         success: function (data) {
            let returnData = JSON.parse(data.allProfilesList);
            dataLookupOptionsLoaded.Data.UserProfiles.length = 0;
            dataLookupOptionsLoaded.Data.UserProfiles = [... returnData];
            dataLookupOptionsLoaded.UserProfiles = true;
            if (callback != null) {
            callback(returnData);
            } else {
            return returnData;
            }
         },
      });
   }
   else
   {
      if (callback != null) {
         callback(dataLookupOptionsLoaded.Data.UserProfiles);
       } else {
         return dataLookupOptionsLoaded.Data.UserProfiles;
       }
   }  
}
function RefreshPage()
{
   ko.postbox.publish("UsageAnalysisReload");
}
function toggleDiv() {
   var div = document.getElementById("openNotes");
   if (div.style.display === "none" || div.style.display === "") {
     div.style.display = "block";
     slideDown(div);
   } else {
     slideUp(div);
   }
 }

 function slideDown(element) {
   var height = 0;
   var interval = setInterval(function() {
     if (height >= 80) {
       clearInterval(interval);
     } else {
       height += 5;
       element.style.height = height + "px";
     }
   }, 20);
 }

 function slideUp(element) {
   var height = 100;
   var interval = setInterval(function() {
     if (height <= 0) {
       clearInterval(interval);
       element.style.display = "none";
     } else {
       height -= 5;
       element.style.height = height + "px";
     }
   }, 20);
 }
