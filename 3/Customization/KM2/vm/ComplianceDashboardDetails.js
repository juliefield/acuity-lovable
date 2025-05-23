angularApp.directive("ngComplianceDashboardDetails", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/3/Customization/KM2/view/ComplianceDashboardDetails.htm?' + Date.now(),
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
         let passedParams = null;
         let displayType = null;
         let dataFilterRecords = [];
         let initialData = [];
         let referenceObjects = {
            UserProfiles: [],
            Projects: [],
            Groups: [],
            Locations: [],
            Teams: [],
         }
         /* Event Handling START */
         $(".btn-close", element).off("click").on("click", function () {
            HideAll();
         });
         /* Event Handling END */
         function Initialize() {
            HideAll();
            SetDatePickers();
            //RenderDirectiveFooter();
         };
         function SetDatePickers() {
         }
         /* Data Loading START */
         function LoadDirective() {
            HideAll();
            SetDetailsHeaderText();
            LoadDetailsData();
         }
         function LoadDetailsData(callback) {
            let renderToObject = $("#detailsItemsListHolder", element);
            renderToObject.empty();            
            RenderDetailsHeader(function () {
               RenderDetailsData(function () {
                  RenderDetailsFooter(function () {
                     if (callback != null) {
                        callback();
                     }
                  }, renderToObject);
               }, renderToObject);
            }, renderToObject);
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetProject(projectId) {
            let returnObject = null;
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserv",
                  cmd: "getProjectById",
                  projectid: projectId,
                  deepload: false,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  returnObject = JSON.parse(data.projectObject);
                  if (referenceObjects.Projects.findIndex(i => i.Id == returnObject.Id) < 0) {
                     referenceObjects.Projects.push(returnObject);
                  }
               }
            });
            return returnObject;
         }
         function GetGroup(groupId) {
            let returnObject = null;
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserv",
                  cmd: "getGroupById",
                  groupid: groupId,
                  deepload: false,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  returnObject = JSON.parse(data.groupObject);
                  if (referenceObjects.Groups.findIndex(i => i.Id == returnObject.Id) < 0) {
                     referenceObjects.Groups.push(returnObject);
                  }
               }
            });
            return returnObject;
         }
         function GetLocation(locationId) {
            let returnObject = null;
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserv",
                  cmd: "getLocationById",
                  locationid: locationId,
                  deepload: false,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  returnObject = JSON.parse(data.locationObject);
                  if (referenceObjects.Locations.findIndex(i => i.Id == returnObject.Id) < 0) {
                     referenceObjects.Projects.push(returnObject);
                  }
               }
            });
            return returnObject;
         }
         function GetTeam(teamId) {
            let returnObject = null;
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserv",
                  cmd: "getTeamById",
                  teamid: teamId,
                  deepLoad: false,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  returnObject = JSON.parse(data.team);
                  if (referenceObjects.Teams.findIndex(i => i.Id == returnObject.Id) < 0) {
                     referenceObjects.Teams.push(returnObject);
                  }
               }
            });
            return returnObject;
         }
         function GetUserProfile(userProfileId) {
            let returnObject = null;
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserv",
                  cmd: "getUserProfile",
                  userid: userProfileId,
                  deepLoad: false,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  returnObject = JSON.parse(data.userFullProfile);
                  referenceObjects.UserProfiles.push(returnObject);
               }
            });
            return returnObject;
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderDetailsHeader(callback, renderToObject) {
            if (renderToObject == null) {
               renderToObject = $("#detailsItemsListHolder", element);
            }
            let dynamicColumns = [];
            GetColumnInfoToRender(displayType, dynamicColumns);

            let headerRowHolder = $(`<div class="details-items-header-holder-row" />`);

            let counterColumn = $(`<div class="details-item-column record-count details-header-item" />`);
            counterColumn.append(" # ")
            // let buttonColumn = $(`<div class="details-item-column action-buttons details-header-item" />`);
            // buttonColumn.append("Actions")

            headerRowHolder.append(counterColumn);
            dynamicColumns.forEach(function (columnDef) {
               let dynamicColumn = $(`<div class="details-item-column details-header-item" />`);
               dynamicColumn.addClass(columnDef.colName);
               let columnText = columnDef.headerText;
               if (columnText == null) {
                  columnText = "[no column name]";
               }
               dynamicColumn.append(columnText);
               headerRowHolder.append(dynamicColumn);
            });
            //headerRowHolder.append(buttonColumn);

            renderToObject.append(headerRowHolder);

            if (callback != null) {
               callback();
            }
         }
         function RenderDetailsData(callback, renderToObject) {
            if (renderToObject == null) {
               renderToObject = $("#detailsItemsListHolder", element);
            }
            let dynamicColumns = [];

            let counter = 1;
            let detailsHolder = $(`<div class="details-items-list-body-holder" />`);
            //detailDataRecords.forEach(function(dataRecord){
            GetColumnInfoToRender(displayType, dynamicColumns);
            //Sort data here.
            dataFilterRecords = SortDetailsData(dataFilterRecords);

            if (displayType.toLowerCase() != "auditsummary-client-complete".toLowerCase() && 
            displayType.toLowerCase() != "auditsummary-auditor-complete".toLowerCase() &&
            displayType.toLowerCase() != "auditsummary-location-fail-complete".toLowerCase()) {
               dataFilterRecords.forEach(function (dataItem) {
                  let dataRowHolder = $(`<div class="details-items-data-holder-row" />`);
                  let counterColumn = $(`<div class="details-item-column record-count" />`);
                  counterColumn.append(counter);
                  dataRowHolder.append(counterColumn);

                  dynamicColumns.forEach(function (columnDef) {
                     RenderColumnData(columnDef, dataRowHolder, dataItem);
                  });

                  // let buttonColumn = $(`<div class="details-item-column action-buttons" />`);
                  // buttonColumn.append(" --buttons here-- "); 
                  //dataRowHolder.append(buttonColumn);
                  detailsHolder.append(dataRowHolder);
                  counter++;
               });
            }
            else {
               let detailIdList = [];
               let keyVal = "";
               let firstObject = dataFilterRecords[0];
               if (displayType.toLowerCase() == "auditsummary-client-complete".toLowerCase()) {
                  keyVal = firstObject.ProjectId;
                  let dataRowHolder = $(`<div class="details-items-data-holder-row totals-row-withsubitems" />`);
                  let counterColumn = $(`<div class="details-item-column record-count" />`);
                  counterColumn.append("&nbsp;");
                  dataRowHolder.append(counterColumn);
                  //Totals Row:
                  dynamicColumns.forEach(function (columnDef) {
                     RenderColumnData(columnDef, dataRowHolder, keyVal);
                  });
                  detailsHolder.append(dataRowHolder);

                  dataFilterRecords.forEach(function (item) {
                     if (detailIdList.findIndex(g => g == item.GroupId) < 0) {
                        detailIdList.push(item.GroupId);
                     }
                  });
                  //Detail Rows:
                  let subCounter = 1;
                  detailIdList.forEach(function (groupId) {

                     let dataSubRowHolder = $(`<div class="details-items-data-holder-row-subtotals" />`);
                     let subCounterColumn = $(`<div class="details-item-column record-count" />`);
                     subCounterColumn.append(subCounter);
                     dataSubRowHolder.append(subCounterColumn);

                     dynamicColumns.forEach(function (columnDef) {
                        RenderColumnData(columnDef, dataSubRowHolder, groupId, true);
                     });
                     detailsHolder.append(dataSubRowHolder);
                     subCounter++;
                  });

               }
               else if (displayType.toLowerCase() == "auditsummary-auditor-complete".toLowerCase()) {
                  keyVal = firstObject.EvaluatorUserId
                  detailIdList.length = 0;
                  let userProjectCounter = 1;

                  dataFilterRecords.forEach(function (item) {
                     if (detailIdList.findIndex(g => g == item.ProjectId) < 0) {
                        detailIdList.push(item.ProjectId);
                     }
                  });
                  detailIdList.forEach(function (projectId) {
                     let dataRowHolder = $(`<div class="details-items-data-holder-row" />`);
                     let counterColumn = $(`<div class="details-item-column record-count" />`);
                     counterColumn.append(userProjectCounter);
                     dataRowHolder.append(counterColumn);

                     dynamicColumns.forEach(function (columnDef) {
                        RenderColumnData(columnDef, dataRowHolder, projectId);
                     });
                     detailsHolder.append(dataRowHolder);
                     userProjectCounter++;
                  });
               }
               else if (displayType.toLowerCase() == "auditsummary-location-fail-complete".toLowerCase()) {
                  keyVal = firstObject.LocationId;
                  dataFilterRecords.forEach(function (item) {
                     if (detailIdList.findIndex(g => g == item.ProjectId) < 0) {
                        detailIdList.push(item.ProjectId);
                     }
                  });
                  let projectCounter = 1;
                  detailIdList.forEach(function (projectId) {
                     let dataRowHolder = $(`<div class="details-items-data-holder-row-solid totals-row-withsubitems" />`);
                     let counterColumn = $(`<div class="details-item-column record-count" />`);
                     counterColumn.append(projectCounter);
                     dataRowHolder.append(counterColumn);                     
                     dynamicColumns.forEach(function (columnDef) {
                        RenderColumnData(columnDef, dataRowHolder, projectId);
                     });
                     detailsHolder.append(dataRowHolder);
                     let groupsList = initialData.filter(i => i.ProjectId == projectId);
                     let projectGroupsIdDetailList = [];
                     groupsList.forEach(function(groupItem){
                        if(projectGroupsIdDetailList.findIndex(g => g == groupItem.GroupId) < 0)
                        {
                           projectGroupsIdDetailList.push(groupItem.GroupId);
                        }
                     });
                     //let subCounter = 1;
                     projectGroupsIdDetailList.forEach(function (groupId) {
                        let dataSubRowHolder = $(`<div class="details-items-data-holder-row-subtotals" />`);
                        let subCounterColumn = $(`<div class="details-item-column record-count" />`);
                        //subCounterColumn.append(subCounter);
                        subCounterColumn.append("&nbsp;");
                        dataSubRowHolder.append(subCounterColumn);
                        dynamicColumns.forEach(function (columnDef) {
                           RenderColumnData(columnDef, dataSubRowHolder, groupId, true);
                        });
                        detailsHolder.append(dataSubRowHolder);
                        //subCounter++;
                     });
                     projectCounter++;
                  });

//                  });
               }
            }

            renderToObject.append(detailsHolder);
            if (callback != null) {
               callback();
            }
         }
         function RenderDetailsFooter(callback, renderToObject) {
            if (renderToObject == null) {
               renderToObject = $("#detailsItemsListHolder", element);
            }
            let footerRowHolder = $(`<div class="details-items-footer-holder-row" />`);
            footerRowHolder.append("")
            renderToObject.append(footerRowHolder);

            if (callback != null) {
               callback();
            }
         }
         function RenderColumnData(columnDefObject, renderToObject, filterValue, useSubDataField) {
            let itemToDisplayType = displayType;
            let isFilterValueObject = false;
            if (useSubDataField == null) {
               useSubDataField = false;
            }
            if (itemToDisplayType == "auditsFound" || itemToDisplayType.includes("disputeDetails") == true) {
               isFilterValueObject = true;
            }
            let dynamicColumn = $(`<div class="details-item-column" />`);
            dynamicColumn.addClass(columnDefObject.colName);
            let dataText = "&nbsp;";
            let dataObject = null;
            let dataFieldDef = columnDefObject.dataField;
            if (useSubDataField == true && (columnDefObject.subDataField != null && columnDefObject.subDataField != "")) {
               dataFieldDef = columnDefObject.subDataField;
            }
            switch (dataFieldDef) {
               case "objects.userProfile.UserFullName":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.UserId;
                  }
                  dataText = filterValue;
                  dataObject = referenceObjects.UserProfiles.find(u => u.UserId == filterValue);
                  if (dataObject == null) {
                     dataObject = GetUserProfile(filterValue);
                  }
                  if (dataObject != null) {
                     dataText = dataObject.UserFullName;
                  }
                  break;
               case "objects.userProfile.AuditorName":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.EvaluatorUserId;
                  }
                  dataText = filterValue;
                  dataObject = referenceObjects.UserProfiles.find(u => u.UserId == filterValue);
                  if (dataObject == null) {
                     dataObject = GetUserProfile(filterValue);
                  }
                  if (dataObject != null) {
                     dataText = dataObject.UserFullName;
                  }
                  break;
               case "objects.userProfile.SupervisorName":                  
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.SupervisorUserId;
                  }
                  dataText = filterValue;
                  dataObject = referenceObjects.UserProfiles.find(u => u.UserId == filterValue);
                  if (dataObject == null) {
                     dataObject = GetUserProfile(filterValue);
                  }
                  if (dataObject != null) {
                     dataText = dataObject.UserFullName;
                  }
                  break;
               case "objects.userProfile.LastLogin":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.UserId;
                  }
                  dataText = "";
                  dataObject = referenceObjects.UserProfiles.find(u => u.UserId == filterValue);
                  if (dataObject == null) {
                     dataObject = GetUserProfile(filterValue);
                  }
                  if (dataObject != null) {
                     if (dataObject.CurrentLoginDate != null && dataObject.CurrentLoginDate != "") {
                        dataText = new Date(dataObject.CurrentLoginDate).toLocaleString();
                     }
                  }
                  break;
               case "objects.projects.Name":
               case "objects.projects.name":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.ProjectId;
                  }
                  dataText = "";
                  dataObject = referenceObjects.Projects.find(u => u.ProjectId == filterValue);
                  if (dataObject == null) {
                     dataObject = GetProject(filterValue);
                  }
                  if (dataObject != null) {
                     dataText = dataObject.Name;
                  }
                  break;
               case "objects.locations.Name":
               case "objects.locations.name":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.LocationId;
                  }
                  dataText = "";
                  dataObject = referenceObjects.Locations.find(u => u.LocationId == filterValue);
                  if (dataObject == null) {
                     dataObject = GetLocation(filterValue);
                  }
                  if (dataObject != null) {
                     dataText = dataObject.Name;
                  }
                  break;
               case "objects.groups.Name":
               case "objects.groups.name":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.GroupId;
                  }
                  dataText = "";
                  dataObject = referenceObjects.Groups.find(u => u.GroupId == filterValue);
                  if (dataObject == null) {
                     dataObject = GetGroup(filterValue);
                  }
                  if (dataObject != null) {
                     dataText = dataObject.Name;
                  }
                  break;
               case "objects.groups.name.IncludeLocation":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.GroupId;
                  }
                  dataText = "";
                  dataObject = referenceObjects.Groups.find(u => u.GroupId == filterValue);
                  if (dataObject == null) {
                     dataObject = GetGroup(filterValue);
                  }
                  if (dataObject != null) {
                     dataText = dataObject.Name;
                     let locationObject = GetLocation(dataObject.LocationId);
                     if (locationObject != null) {
                        dataText = `${dataObject.Name} (${locationObject.Name})`;
                     }
                  }
                  break;
               case "objects.teams.Name":
               case "objects.teams.name":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.TeamId;
                  }
                  dataText = "";
                  dataObject = referenceObjects.Teams.find(u => u.TeamsId == filterValue);
                  if (dataObject == null) {
                     dataObject = GetTeam(filterValue);
                  }
                  if (dataObject != null) {
                     dataText = dataObject.Name;
                  }
                  break;
               case "dataitem.find.Rating":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.Rating;
                  }
                  dataText = filterValue;
                  break;
               case "dataitem.find.FormStatus":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.FormStatus;
                  }
                  dataText = filterValue;
                  break;
               case "dataitem.find.MonitorId":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.MonitorId;
                  }
                  dataText = filterValue;
                  if (columnDefObject.clickable == true) {
                     dataText = "";
                     
                     let linkUrl = `https://${a$.urlprefix(true)}acuityapm.com/monitor/monitor_review.aspx?prefix=${a$.urlprefix().replace(".", "")}&id=${filterValue}`;
                     let link = $(`<a target="_blank" href="${linkUrl}" class="auto-qa-link monitor-link">${filterValue}</a>`)
                     dynamicColumn.append(link);
                  }
                  break;
               case "dateitem.find.MonitorDate":                  
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.EnterDate;
                  }
                  dataText = new Date(filterValue).toLocaleDateString();
                  break;
               case "dataitem.find.MonitorCount.ByAuditor":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.EvaluatorUserId;
                  }
                  dataText = initialData.filter(m => m.EvaluatorUserId == filterValue)?.length || 0;
                  break;
               case "dataitem.find.MonitorCount.ByProject":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.ProjectId;
                  }
                  dataText = initialData.filter(m => m.ProjectId == filterValue)?.length || 0;
                  break;
               case "dataitem.find.MonitorCount.ByLocation":
                  if (isFilterValueObject == true) {
                     filterValue = filterValue.LocationId;
                  }
                  dataText = initialData.filter(m => m.LocationId == filterValue)?.length || 0;
                  break;
               case "auditcounts.Passed":
                  dataText = initialData.filter(m => m.ProjectId == filterValue && m.Rating?.toLowerCase() != "Fail".toLowerCase())?.length || 0;
                  if (useSubDataField == true) {
                     dataText = initialData.filter(m => m.GroupId == filterValue && m.Rating?.toLowerCase() != "Fail".toLowerCase())?.length || 0;
                  }
                  dataText = dataText.toLocaleString();
                  break;
               case "auditcounts.Failed":
                  let failCount = initialData.filter(m => m.ProjectId == filterValue && m.Rating?.toLowerCase() == "Fail".toLowerCase())?.length || 0;
                  let totalAudits = initialData.filter(m => m.ProjectId == filterValue)?.length || 0;

                  if (useSubDataField == true) {
                     failCount = initialData.filter(m => m.GroupId == filterValue && m.Rating?.toLowerCase() == "Fail".toLowerCase())?.length || 0;
                     totalAudits = initialData.filter(m => m.GroupId == filterValue)?.length || 0;
                  }
                  dataText = failCount.toLocaleString();
                  if (totalAudits > 0) {
                     let failRateRaw = (failCount / totalAudits);
                     let highFailRateClass = "";
                     if (failRateRaw > 0.45) {
                        highFailRateClass = "high-fail-rate-found";
                     }
                     failRateFormatted = new Intl.NumberFormat('en-US', {
                        style: 'percent',
                        maximumFractionDigits: 1,
                        minimumFractionDigits: 1,
                     }).format(failRateRaw);

                     dataText = `${failCount.toLocaleString()} <span class="fail-rate-percentage-per-line ${highFailRateClass}">(${failRateFormatted})</span>`;
                  }

                  break;
               case "auditcounts.Total":
                  dataText = initialData.filter(m => m.ProjectId == filterValue)?.length || 0;
                  if (useSubDataField == true) {
                     dataText = initialData.filter(m => m.GroupId == filterValue)?.length || 0;
                  }
                  dataText = dataText.toLocaleString();
                  break;
               case "auditcounts.TotalWithPct":
                  let lineItemCount = initialData.filter(m => m.ProjectId == filterValue)?.length || 0;
                  let totalCount = initialData.length || 0;

                  if (useSubDataField == true) {
                     lineItemCount = initialData.filter(m => m.GroupId == filterValue)?.length || 0;
                  }
                  if(totalCount > 0)
                  {
                     lineItemRate = (lineItemCount / totalCount);
                  }
                  let lineItemRateFormatted = new Intl.NumberFormat('en-US', {
                     style: 'percent',
                     maximumFractionDigits: 1,
                     minimumFractionDigits: 1,
                  }).format(lineItemRate);

                  //dataText = dataText.toLocaleString();
                  dataText = `${lineItemCount.toLocaleString()} <span class="total-column-with-percentage-of-total">(${lineItemRateFormatted})</span>`;
                  break;
            }

            dynamicColumn.append(dataText);

            $(renderToObject).append(dynamicColumn);
         }

         /* Data Rendering END */
         /* Editor Loading START */
         /* Editor Loading END */
         /* Editor Validation & Saving START */
         /* Editor Validation & Saving END */
         /* Sorting Options START */
         /* Sorting Options END */
         /* Utility Functions START */
         function SetDetailsHeaderText() {
            $("#detailsTypeHeaderText", element).empty();
            let headerText = "Details";
            if (passedParams?.headerText != null) {
               headerText = passedParams.headerText;
            }
            $("#detailsTypeHeaderText", element).append(headerText);
         }
         function GetColumnInfoToRender(renderType, columnsArray) {
            if (displayType == null) {
               renderType = displayType
            }
            if (columnsArray == null) {
               columnsArray = [];
            }
            switch (renderType.toLowerCase()) {
               case "auditorCount".toLowerCase():
                  columnsArray.push({ colName: "auditor-name", headerText: "Name", dataField: "objects.userProfile.UserFullName", });
                  columnsArray.push({ colName: "last-login", headerText: "Last Login", dataField: "objects.userProfile.LastLogin", });
                  columnsArray.push({ colName: "monitors-performed", headerText: "Monitors", dataField: "dataitem.find.MonitorCount.ByAuditor", });
                  break;
               case "auditsFound".toLowerCase():
                  columnsArray.push({ colName: "auditor-name", headerText: "Auditor", dataField: "objects.userProfile.UserFullName", });
                  columnsArray.push({ colName: "project-name", headerText: "Project", dataField: "objects.projects.Name", });
                  columnsArray.push({ colName: "enter-date", headerText: "Date Enter", dataField: "dataitem.find.EnterDate", });
                  columnsArray.push({ colName: "pass-fail", headerText: "Pass/Fail", dataField: "dataitem.find.Rating", });
                  break;
               case "clients".toLowerCase():
                  columnsArray.push({ colName: "project-name", headerText: "Name", dataField: "objects.projects.Name", });
                  columnsArray.push({ colName: "monitors-performed", headerText: "Monitors", dataField: "dataitem.find.MonitorCount.ByProject", });
                  break;
               case "disputeDetails-valid".toLowerCase():
               case "disputeDetails-pending".toLowerCase():
                  // columnsArray.push({ colName: "form-name", headerText: "Form Name", dataField: "dataitem.find.FormName", });
                  columnsArray.push({ colName: "monitor-id", headerText: "Monitor Id", dataField: "dataitem.find.MonitorId", clickable: true });
                  columnsArray.push({ colName: "monitor-date", headerText: "Monitor Date", dataField: "dateitem.find.MonitorDate", });
                  columnsArray.push({ colName: "project-name", headerText: "Project", dataField: "objects.projects.Name", });
                  columnsArray.push({ colName: "location-name", headerText: "Site Location", dataField: "objects.locations.Name", });
                  columnsArray.push({ colName: "group-name", headerText: "LOB", dataField: "objects.groups.Name", });
                  columnsArray.push({ colName: "auditor-name", headerText: "Auditor", dataField: "objects.userProfile.AuditorName", });
                  columnsArray.push({ colName: "supervisor-name", headerText: "Supervisor", dataField: "objects.userProfile.SupervisorName", });
                  
                  // columnsArray.push({ colName: "form-status", headerText: "Form Status", dataField: "dataitem.find.FormStatus", });
                  // columnsArray.push({ colName: "enter-date", headerText: "Monitor Date", dataField: "dataitem.find.EnterDate", });
                  // columnsArray.push({ colName: "call-date", headerText: "Call Date", dataField: "dataitem.find.CallDate", });
                  // columnsArray.push({ colName: "call-time", headerText: "Call Time", dataField: "dataitem.find.CallTime", });
                  // columnsArray.push({ colName: "call-id", headerText: "Call ID", dataField: "dataitem.find.CallId", });
                  // columnsArray.push({ colName: "agent-name", headerText: "Agent", dataField: "objects.userProfile.UserFullName", });
                  // columnsArray.push({ colName: "pass-fail", headerText: "Score/Rating", dataField: "dataitem.find.Rating", });
                  break;
               case "auditsummary-auditor-complete".toLowerCase():
                  columnsArray.push({ colName: "project-name", headerText: "Project", dataField: "objects.projects.Name", });
                  columnsArray.push({ colName: "audits-pass", headerText: "Passed Audits", dataField: "auditcounts.Passed", });
                  columnsArray.push({ colName: "audits-fail", headerText: "Failed Audits", dataField: "auditcounts.Failed", });
                  columnsArray.push({ colName: "audits-total", headerText: "Audits Completed", dataField: "auditcounts.TotalWithPct", });
                  //columnsArray.push({ colName: "audits-total", headerText: "Audits Completed", dataField: "auditcounts.Total", });
                  break;
               case "auditsummary-client-complete".toLowerCase():
                  columnsArray.push({ colName: "project-name", headerText: "Project or LOB", dataField: "objects.projects.Name", subDataField: "objects.groups.name.IncludeLocation" });
                  columnsArray.push({ colName: "audits-pass", headerText: "Passed Audits", dataField: "auditcounts.Passed", });
                  columnsArray.push({ colName: "audits-fail", headerText: "Failed Audits", dataField: "auditcounts.Failed", });
                  columnsArray.push({ colName: "audits-total", headerText: "Audits Completed", dataField: "auditcounts.Total", subDataField: "auditcounts.TotalWithPct"});
                  // columnsArray.push({ colName: "audits-total", headerText: "Audits Completed", dataField: "auditcounts.Total", });
                  break;
               case "auditsummary-location-fail-complete".toLowerCase():
                  columnsArray.push({ colName: "project-name", headerText: "Project or LOB", dataField: "objects.projects.Name", subDataField: "objects.groups.Name" });
                  columnsArray.push({ colName: "audits-pass", headerText: "Passed Audits", dataField: "auditcounts.Passed", });
                  columnsArray.push({ colName: "audits-fail", headerText: "Failed Audits", dataField: "auditcounts.Failed", });
                  columnsArray.push({ colName: "audits-total", headerText: "Audits Completed", dataField: "auditcounts.Total", subDataField: "auditcounts.Total"});
                  // columnsArray.push({ colName: "audits-total", headerText: "Audits Completed", dataField: "auditcounts.Total", });
                  break;
            }
            return columnsArray;
         }
         function SortDetailsData(dataToSort) {
            let sortedData = dataToSort;
            let tempSort = [];

            switch (displayType.toLowerCase()) {
               case "auditorCount".toLowerCase():
                  tempSort.length = 0;
                  dataToSort.forEach(function (id) {
                     let userObject = referenceObjects.UserProfiles.find(i => i.UserId == id);
                     if (userObject == null) {
                        userObject = GetUserProfile(id);
                     }
                     if (userObject != null) {
                        tempSort.push(userObject);
                     }
                  });
                  break;
               case "clients".toLowerCase():
                  //name sorting
                  tempSort.length = 0;
                  dataToSort.forEach(function (id) {
                     let projectObject = referenceObjects.Projects.find(i => i.ProjectId == parseInt(id));
                     if (projectObject == null) {
                        projectObject = GetProject(id);
                     }
                     if (projectObject != null) {
                        tempSort.push(projectObject);
                     }
                  });
                  break;
               case "disputeDetails-valid".toLowerCase():
               case "disputeDetails-pending".toLowerCase():
                  tempSort.length = 0;
                  sortedData = sortedData.sort((a, b) => {
                     if (a.MonitorId < b.MonitorId) {
                        return -1;
                     }
                     else if (a.MonitorId > b.MonitorId) {
                        return 1;
                     }
                     else {
                        return 0;
                     }
                  });
                  break;
            }
            if (tempSort != null && tempSort.length > 0) {
               tempSort = tempSort.sort((a, b) => {
                  if (a.Name.toLowerCase() < b.Name.toLowerCase()) {
                     return -1;
                  }
                  else if (a.Name.toLowerCase() > b.Name.toLowerCase()) {
                     return 1;
                  }
                  else {
                     return 0;
                  }
               });
               sortedData.length = 0;
               tempSort.forEach(function (item) {
                  sortedData.push(item.Id);
               });
            }
            return sortedData;
         }
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
            HideDetails();
         }
         function HideDetails() {
            $("#complaianceDashboardDetailsDirectiveHolder", element).hide();
         }
         function ShowDetails() {
            $("#complaianceDashboardDetailsDirectiveHolder", element).show();
         }
         // function HideEditorForm() {
         //    $("#virtualPrizeCatalogEditorFormHolder", element).hide();
         // }
         // function ShowEditorForm() {
         //    $("#virtualPrizeCatalogEditorFormHolder", element).show();
         // }

         /* Show/Hide END */

         scope.load = function () {
            Initialize();
            LoadDirective();
         };
         ko.postbox.subscribe("km2ComplianceDashboardDetailsLoad", function (params) {
            passedParams = params;
            if (params == null) {
               console.log("No detail information found that we can load.  DO SOMETHING!");
               alert("Error trying to load details");
               return;
            }
            if (params.type != null) {
               displayType = params.type;
            }
            if (params.filteredData != null) {
               dataFilterRecords = params.filteredData;
            }
            if (params.filteredData != null) {
               initialData = params.detailRecords;
            }
            scope.load();
            ShowDetails();
         });

         ko.postbox.subscribe("km2ComplianceDashboardReload", function (params) {
            HideDetails();
         });
         ko.postbox.subscribe("km2ComplianceDashboardLoad", function (params) {
            HideDetails();
         });
         ko.postbox.subscribe("km2ComplianceDashboardApplyFilter", function (dataObjects) {
            HideDetails();
         });

      }
   };
}]);