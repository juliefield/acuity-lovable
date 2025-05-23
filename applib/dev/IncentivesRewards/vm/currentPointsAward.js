angularApp.directive("ngCurrentPointsAward", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/IncentivesRewards/view/currentPointsAward.htm?' + Date.now(),
      scope: {
         assoc: "@",
         text: "@",
         details: "@",
         cid: "@",
         filters: "@",
         panel: "@",
         hidetopper: "@",
         toppertext: "@",
         displayLimitedData: "@",
         addonlyDisplay: "@",
         tempReferenceKey: "@",
         userId: "@"
      },
      require: '^ngLegacyContainer',
      link: function (scope, element, attrs, legacyContainer) {
         HideAll();
         let recursiveLoadingTiming = 2000;
         let informationLoaded = {
            areasLoaded: false,
            subAreasLoaded: false,
            intervalOptionsLoaded: false,
            currentRewardsLoaded: false,
            allLoaded: false,
         };
         let initialRewardData = [];
         let availableIrpasAreas = [];
         let avaialbleIrpasSubareas = [];
         let availableIntervalTypes = [];
         /* Event Handling START */
         $("#btnRefreshCurrentPointsAward", element).off("click").on("click", function(){
            LoadCurrentRewardAssignments(null, true);
         });
         $(".btn-close", element).off("click").on("click", function () {
            console.log("Close button clicked.  Determine what to do.");
            ClearEditorForm();
            HideEditorForm();
         });
         $("#btnAddNewRewardOption", element).off("click").on("click", function () {            
            LoadEditor(function () {
               ShowEditorForm();
            });
         });
         $("#btnSaveAwardEditor", element).off("click").on("click", function () {
            let saveObject = CollectAwardItemData();
            ValidateAwardItem(function(validatedObject){
               SaveAwardItem(function () { 
                  ClearEditorForm();
                  HideEditorForm();
                  ko.postbox.publish("IRPASManagementReload", true);
               }, validatedObject);
            }, saveObject);
         });
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
            LoadOptionsLists();
         };
         function SetDatePickers() {
         }
         /* Data Loading START */
         function LoadOptionsLists() {
            GetAvailableIrpasAreas();
            GetAvailableIrpasSubAreas();
            GetAvailableIrpasIntervals();
         }
         function LoadDirective() {
            HideAll();
            RenderOptionsLists();
            LoadCurrentRewardAssignments();
         }
         function LoadCurrentRewardAssignments(callback, forceReload) {
            ShowLoadingMessage();
            GetCurrentRewardAssignments(function (currentRewards) {
               window.setTimeout(function () {
                  ko.postbox.publish("CurrentIRPADataLoaded", currentRewards);
               }, 1000);
               RenderCurrentRewardAssignments(function () {
                  HideLoadingMessage();
                  if (callback != null) {
                     callback();
                  }
               }, currentRewards);
            });
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetAvailableIrpasAreas(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (availableIrpasAreas != null && availableIrpasAreas.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(availableIrpasAreas);
               }
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllAvailableIRPASAreas",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     returnData = JSON.parse(jsonData.availableIrpasAreasList);
                     availableIrpasAreas.length = 0;
                     availableIrpasAreas = returnData;
                     informationLoaded.areasLoaded = true;
                     CheckAllLoaded();
                     ko.postbox.publish("CurrentIRPADataLoaded_Areas", availableIrpasAreas);
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function GetAvailableIrpasSubAreas(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (avaialbleIrpasSubareas != null && avaialbleIrpasSubareas.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(avaialbleIrpasSubareas);
               }
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllAvailableIRPASSubAreas",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     returnData = JSON.parse(jsonData.availableIrpasSubAreasList);
                     avaialbleIrpasSubareas.length = 0;
                     avaialbleIrpasSubareas = returnData;
                     informationLoaded.subAreasLoaded = true;
                     CheckAllLoaded();
                     ko.postbox.publish("CurrentIRPADataLoaded_SubAreas", avaialbleIrpasSubareas);
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function GetAvailableIrpasIntervals(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }

            if (availableIntervalTypes != null && availableIntervalTypes.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(availableIntervalTypes);
               }
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllAvailableIRPASIntervals",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     returnData = JSON.parse(jsonData.availableIntervalList);
                     availableIntervalTypes.length = 0;
                     availableIntervalTypes = returnData;
                     informationLoaded.intervalOptionsLoaded = true;
                     CheckAllLoaded();
                     //ko.postbox.publish("CurrentIRPADataLoaded_Intervals", availableIntervalTypes);
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         function GetCurrentRewardAssignments(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }

            if (initialRewardData != null && initialRewardData.length > 0 && forceReload == false) {
               window.setTimeout(function () {
                  ko.postbox.publish("CurrentIRPADataLoaded", initialRewardData);
               }, 500);

               if (callback != null) {
                  callback(initialRewardData);
               }
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getCurrentIRPASRewardOptions",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     returnData = JSON.parse(jsonData.currentRewardOptionList);
                     initialRewardData.length = 0;
                     initialRewardData = returnData;
                     informationLoaded.currentRewardsLoaded = true;
                     ko.postbox.publish("IRPASManagementRewardOptionsLoaded", initialRewardData);
                     CheckAllLoaded();
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });
            }
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderOptionsLists(callback) {
            CheckAllLoaded();
            RenderAvailableIrpasAreas();
            RenderAvailableIrpasSubAreas();
            RenderAvailableIrpasIntervals();
         }
         function RenderAvailableIrpasAreas(callback, listToRender){
            if (listToRender == null) {
               listToRender = availableIrpasAreas;
            }
            if (informationLoaded.areasLoaded == false) {
               window.setTimeout(function () {
                  RenderAvailableIrpasAreas(callback);
               }, recursiveLoadingTiming);
            }

            if (informationLoaded.areasLoaded == true || listToRender?.length > 0) {
               $("#rewardOptionsEditor_IrpasAreaId", element).empty();
               $("#rewardOptionsEditor_IrpasAreaId", element).append($(`<option value="" />`));
               listToRender.forEach(function (area) {

                  let areaName = area.Id;
                  if (area.Name != null && area.Name != "") {
                     areaName = area.Name;
                  }
                  let areaOption = $(`<option value="${area.Id}">${areaName}</option>`);
                  $("#rewardOptionsEditor_IrpasAreaId", element).append(areaOption);
               });
               if (callback != null) {
                  callback();
               }
            }
         }
         function RenderAvailableIrpasSubAreas(callback, listToRender){
            if (listToRender == null) {
               listToRender = avaialbleIrpasSubareas;
            }
            if (informationLoaded.subAreasLoaded == false) {
               window.setTimeout(function () {
                  RenderAvailableIrpasSubAreas(callback);
               }, recursiveLoadingTiming);
            }

            if (informationLoaded.subAreasLoaded == true || listToRender?.length > 0) {
               $("#rewardOptionsEditor_IrpasSubAreaId", element).empty();
               $("#rewardOptionsEditor_IrpasSubAreaId", element).append($(`<option value="" />`));
               listToRender.forEach(function (subarea) {

                  let subareaName = subarea.Id;
                  if (subarea.Name != null && subarea.Name != "") {
                     subareaName = subarea.Name;
                  }
                  let subareaOption = $(`<option value="${subarea.Id}">${subareaName}</option>`);
                  $("#rewardOptionsEditor_IrpasSubAreaId", element).append(subareaOption);
               });
               if (callback != null) {
                  callback();
               }
            }
         }
         function RenderAvailableIrpasIntervals(callback, listToRender) {
            if (listToRender == null) {
               listToRender = availableIntervalTypes;
            }
            if (informationLoaded.intervalOptionsLoaded == false) {
               window.setTimeout(function () {
                  RenderAvailableIrpasIntervals(callback);
               }, recursiveLoadingTiming);
            }

            if (informationLoaded.intervalOptionsLoaded == true || listToRender?.length > 0) {
               $("#rewardOptionsEditor_IrpasIntervalId", element).empty();
               $("#rewardOptionsEditor_IrpasIntervalId", element).append($(`<option value="" />`));
               listToRender.forEach(function (interval) {

                  let intervalName = interval.Id;
                  if (interval.Name != null && interval.Name != "") {
                     intervalName = interval.Name;
                  }
                  let intervalOption = $(`<option value="${interval.Id}">${intervalName}</option>`);
                  $("#rewardOptionsEditor_IrpasIntervalId", element).append(intervalOption);
               });
               if (callback != null) {
                  callback();
               }
            }
         }
         function RenderCurrentRewardAssignments(callback, listToRender) {
            CheckAllLoaded();
            if (listToRender == null) {
               listToRender = initialRewardData;
            }
            if(informationLoaded.currentRewardsLoaded == false || informationLoaded.allLoaded == false)
            {
               window.setTimeout(function(){
                  RenderCurrentRewardAssignments(callback);
               }, recursiveLoadingTiming);
               return;
            }

            listToRender = SortRewardsList(listToRender);

            $("#currentPointsRewardList", element).empty();
            $("#lblRecordsFound", element).empty();
            let recordCount = listToRender.length || 0;
            $("#lblRecordsFound", element).append(recordCount);
            let assignmentHolder = $(`<div class="current-points-list-holder" />`);

            if (recordCount != 0) {
               listToRender.forEach(function (dataItem) {
                  let currentRewardRow = $(`<div class="current-points-list-item-row" />`);
                  let tenureHolder = $(`<div class="current-points-list-item area-name" />`);
                  let intervalTypeHolder = $(`<div class="current-points-list-item interval-type" />`);
                  let intervalNumberHolder = $(`<div class="current-points-list-item interval-number" />`);
                  let awardAmountHolder = $(`<div class="current-points-list-item award-amount" />`);
                  let buttonHolder = $(`<div class="current-points-list-item button-holder" />`);
                  let editButton = $(`<button id="btnEditAward_${dataItem.Id}" class="button btn edit-award"><i class="fa fa-edit"></i></button>`);
                  let removeButton = $(`<button id="btnRemoveAward_${dataItem.Id}" class="button btn btn-delete"><i class="fa fa-trash"></i></button>`);

                  editButton.on("click", function () {
                     let buttonId = this.id;
                     let itemId = buttonId.split("_")[1];
                     LoadEditor(function () {
                        ShowEditorForm();
                     }, itemId);
                  });
                  removeButton.on("click", function () {
                     let buttonId = this.id;
                     let itemId = buttonId.split("_")[1];
                     RemoveItem(function () {
                        ko.postbox.publish("IRPASManagementReload", true);
                     }, itemId);
                  });
                  let areaName = dataItem.IrpasAreaId;
                  let areaObject = availableIrpasAreas.find(i => i.IrpasAreaId == dataItem.IrpasAreaId);
                  if (areaObject != null) {
                     areaName = areaObject.Name;
                  }
                  tenureHolder.append(areaName);

                  let intervalTypeName = dataItem.IrpasIntervalId;
                  let intervalTypeObject = availableIntervalTypes.find(i => i.IrpasIntervalId == dataItem.IrpasIntervalId);
                  if (intervalTypeObject != null) {
                     intervalTypeName = intervalTypeObject.Name;
                  }
                  if(dataItem.IsReoccurring == true)
                  {
                     currentRewardRow.addClass("reoccurring-amount");
                     intervalTypeHolder.append(`<i class="fa fa-refresh"></i>&nbsp;`);
                  }
                  intervalTypeHolder.append(intervalTypeName);
                  
                  intervalNumberHolder.append(dataItem.IntervalNumber);
                  awardAmountHolder.append(dataItem.IntervalAmount);

                  buttonHolder.append(editButton);
                  buttonHolder.append("&nbsp;");
                  buttonHolder.append(removeButton);

                  currentRewardRow.append(tenureHolder);
                  currentRewardRow.append(intervalTypeHolder);
                  currentRewardRow.append(intervalNumberHolder);
                  currentRewardRow.append(awardAmountHolder);
                  currentRewardRow.append(buttonHolder);

                  assignmentHolder.append(currentRewardRow);
               });
            }
            else {
               assignmentHolder.append("No Reward Data found.");
            }

            $("#currentPointsRewardList", element).append(assignmentHolder);
            if (callback != null) {
               callback();
            }
         }
         /* Data Rendering END */
         /* Editor Loading START */
         function LoadEditor(callback, idToLoad) {
            if (idToLoad == null) {
               idToLoad = -1;
            }
            RenderOptionsLists();
            let objectToLoad = initialRewardData.find(i => i.Id == idToLoad);
            if(objectToLoad != null)
            {
               $("#currentRewardsOptionId", element).val(objectToLoad.IrpasRewardOptionId);
               $("#rewardOptionsEditor_IrpasAreaId", element).val(objectToLoad.IrpasAreaId);
               $("#rewardOptionsEditor_IrpasSubAreaId", element).val(objectToLoad.IrpasSubAreaId);
               $("#rewardOptionsEditor_IrpasIntervalId", element).val(objectToLoad.IrpasIntervalId);
               $("#rewardOptionsEditor_IntervalNumber", element).val(objectToLoad.IntervalNumber);
               $("#rewardOptionsEditor_AwardAmount", element).val(objectToLoad.IntervalAmount);
               $("#rewardOptionsEditor_IsReoccurring", element).prop("checked", objectToLoad.IsReoccurring);
            }
            
            if (callback != null) {
               callback();
            }
         }
         function ClearEditorForm(callback) {
            $("#currentRewardsOptionId", element).val(-1);
            $("#rewardOptionsEditor_IrpasAreaId", element).val("");
            $("#rewardOptionsEditor_IrpasSubAreaId", element).val("");
            $("#rewardOptionsEditor_IrpasIntervalId", element).val("");
            $("#rewardOptionsEditor_IntervalNumber", element).val("");
            $("#rewardOptionsEditor_AwardAmount", element).val("");
            $("#rewardOptionsEditor_IsReoccurring", element).prop("checked", false);

            if (callback != null) {
               callback();
            }
         }
         function RemoveItem(callback, idToRemove) {
            if (confirm(`Are you sure?????`)) {
               informationLoaded.currentRewardsLoaded = false;
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "updateIRPASRewardOptionStatus",
                     id: idToRemove,
                     newstatus: "I",
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     returnData = JSON.parse(jsonData.currentRewardOptionList);
                     initialRewardData.length = 0;
                     initialRewardData = returnData;
                     informationLoaded.currentRewardsLoaded = true;
                     CheckAllLoaded();
                     if (callback != null) {
                        callback(returnData);
                     }
                  }
               });


               if (callback != null) {
                  callback();
               }
            }
         }
         function CollectAwardItemData() {
            let subAreaValue = $("#rewardOptionsEditor_IrpasSubAreaId", element).val();
            if(subAreaValue == "")
            {
               subAreaValue = null;
            }

            let returnObject = {
               IrpasRewardOptionId: parseInt($("#currentRewardsOptionId", element).val()),
               IrpasAreaId: parseInt($("#rewardOptionsEditor_IrpasAreaId", element).val()),
               IrpasSubAreaId: subAreaValue,
               IrpasIntervalId: parseInt($("#rewardOptionsEditor_IrpasIntervalId", element).val()),
               IntervalNumber: parseInt($("#rewardOptionsEditor_IntervalNumber", element).val()),
               IntervalAmount: parseFloat($("#rewardOptionsEditor_AwardAmount", element).val()),
               DisplayOrder: 0,
               IsReoccurring: $("#rewardOptionsEditor_IsReoccurring", element).is("checked"),
               Status: `A`,               
               EntBy: legacyContainer.scope.TP1Username,
               EntDt: new Date().toLocaleDateString(),
               UpdBy: legacyContainer.scope.TP1Username,
               UpdDt: new Date().toLocaleDateString(),
            };

            return returnObject;
         }
         /* Editor Loading END */
         /* Editor Validation & Saving START */
         function ValidateAwardItem(callback, objectToValidate) {
            if (objectToValidate == null) {
               objectToValidate = CollectAwardItemData();
            }
            console.log(`ValidateAwardItem(): \n[NYI] Determine processing items.\n${JSON.stringify(objectToValidate)}`);
            if (callback != null) {
               callback(objectToValidate);
            }
         }
         function SaveAwardItem(callback, objectToSave) {
            if(objectToSave == null)
            {
               objectToSave = CollectAwardItemData();
            }
            informationLoaded.currentRewardsLoaded = false;
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "saveIRPASRewardOption",
                  rewardOption: JSON.stringify(objectToSave),
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  returnData = JSON.parse(jsonData.currentRewardOptionList);
                  initialRewardData.length = 0;
                  initialRewardData = returnData;
                  informationLoaded.currentRewardsLoaded = true;
                  CheckAllLoaded();
                  if (callback != null) {
                     callback(returnData);
                  }
               }
            });
         }

         /* Editor Validation & Saving END */
         /* Sorting Options START */
         function SortRewardsList(listToSort) {
            let sortedList = listToSort;
            sortedList = sortedList.sort((a, b) => {
               if (a.IrpasAreaId < b.IrpasAreaId) {
                  return -1;
               }
               else if (a.IrpasAreaId > b.IrpasAreaId) {
                  return 1;
               }
               else {
                  if(a.IsReoccurring && b.IsReoccurring)
                  {
                     if (a.IntervalNumber < b.IntervalNumber) {
                        return -1;
                     }
                     else if (a.IntervalNumber > b.IntervalNumber) {
                        return 1;
                     }
                     else {
                        return 0;
                     }
                  }
                  else if(a.IsReoccurring && !b.IsReoccurring)
                  {
                     return 1;
                  }
                  else if(!a.IsReoccurring && b.IsReoccurring)
                  {
                     return -1;
                  } 
                  else {
                     if (a.IntervalNumber < b.IntervalNumber) {
                        return -1;
                     }
                     else if (a.IntervalNumber > b.IntervalNumber) {
                        return 1;
                     }
                     else {
                        return 0;
                     }
                  }
               }
            });

            return sortedList;
         }
         /* Sorting Options END */
         /* Utility Functions START */
         function CheckAllLoaded()
         {
            informationLoaded.allLoaded = (
               informationLoaded.areasLoaded &&
               informationLoaded.subAreasLoaded &&
               informationLoaded.intervalOptionsLoaded &&
               informationLoaded.currentRewardsLoaded
            );
         }
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
            HideEditorForm();
         }
         function HideEditorForm() {
            $("#currentPointsRewardEditorFormHolder", element).hide();
         }
         function ShowEditorForm() {
            $("#currentPointsRewardEditorFormHolder", element).show();
         }
         function ShowLoadingMessage() {
            $("#currentPointsLoadingMessage", element).show();
         }
         function HideLoadingMessage() {
            $("#currentPointsLoadingMessage", element).hide();
         }
         /* Show/Hide END */

         scope.load = function () {
            scope.Initialize();
            LoadDirective();
         };
         // //TODO: Remove
         // scope.load();

         ko.postbox.subscribe("IRPASManagementInit", function () {
            scope.Initialize();
         });
         ko.postbox.subscribe("IRPASManagementLoad", function () {
            //scope.load();
            LoadDirective();
         });
         ko.postbox.subscribe("IRPASManagementReload", function (forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload == true) {               
               initialRewardData.length = 0;
               informationLoaded.allLoaded = false;
               informationLoaded.currentRewardsLoaded = false;
            }
            else {
               informationLoaded.allLoaded = false;
            }
            LoadDirective();

         });
      }
   };
}]);