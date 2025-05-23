angularApp.directive("ngBudgetManager", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/BudgetManager.htm?' + Date.now(),
      scope: {
         assoc: "@",
         text: "@",
         details: "@",
         cid: "@",
         filters: "@",
         panel: "@",
         hidetopper: "@",
         toppertext: "@"
      },
      require: '^ngLegacyContainer',
      link: function (scope, element, attrs, legacyContainer) {
         var budgetItemsList = [];
         var dataLoaded = false;
         var possibleRoles = [];
         var currentBudgetUsage = [];
         const USAGE_PREVIOUS_MONTH_DATAVALUE = "P";
         const USAGE_CURRENT_MONTH_DATAVALUE = "C";

         scope.Initialize = function () {
            HideAll();
            LoadAvailableRoles();
            LoadSelectionListItems();
            MarkTodayInFilter();
            HandleBudgetListLoad();
         };

         function LoadAvailableRoles() {
            possibleRoles.length = 0;
            //possibleRoles.push({ RoleCode: "Admin", RoleDesc: "System Admin", Status: "A" });
            possibleRoles.push({ RoleCode: "CorpAdmin", RoleDesc: "Senior Management", Status: "A" });
            possibleRoles.push({ RoleCode: "MGMT", RoleDesc: "Management", Status: "A" });
            possibleRoles.push({ RoleCode: "GL", RoleDesc: "Group Leader", Status: "A" });
            possibleRoles.push({ RoleCode: "TL", RoleDesc: "Team Leader", Status: "A" });
            //possibleRoles.push({ RoleCode: "QA", RoleDesc: "Quality Assurance", Status: "A" });
            //possibleRoles.push({ RoleCode: "CSR", RoleDesc: "Agent", Status: "A" });
         }
         function LoadSelectionListItems(listToLoad) {
            if (listToLoad == null) {
               listToLoad = "all";
            }
            listToLoad = listToLoad.toLowerCase();
            let loadAll = (listToLoad == "all")

            if (listToLoad == "roles" || loadAll == true) {
               $("#editRoleBudgetItemAllowance_Role", element).empty();
               $("#editRoleBudgetItemAllowance_Role", element).append($("<option />", { value: "", text: "Select Role" }));

               for (let roleIndex = 0; roleIndex < possibleRoles.length; roleIndex++) {
                  let item = possibleRoles[roleIndex];

                  $("#editRoleBudgetItemAllowance_Role", element).append($("<option />", { value: item.RoleCode, text: item.RoleDesc }));
               }
            }
            if (listToLoad == "months" || loadAll == true) {
               $("#monthSelector", element).empty();
               $("#monthSelector", element).append($("<option />", { value: "", text: "" }));

               let today = new Date();
               for (let mIndex = 1; mIndex >= -6; mIndex--) {
                  let dateForListItem = new Date(today.getFullYear(), today.getMonth() + mIndex, 1);
                  let monthText = dateForListItem.toLocaleString("default", { month: "long" });
                  let yearText = dateForListItem.toLocaleString("default", { year: "numeric" });
                  let listItemText = monthText + " " + yearText;

                  $("#monthSelector", element).append($("<option />", { value: dateForListItem.toLocaleDateString(), text: listItemText }));
               }

            }
         }
         function MarkTodayInFilter() {
            let today = new Date();
            let thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            $("#monthSelector", element).val(thisMonth.toLocaleDateString());
         }
         function LoadBudgetManagerItems(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (budgetItemsList != null && budgetItemsList.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(budgetItemsList);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getBudgetItems"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     if (data.errormessage != null && data.errormessage == "true") {
                        a$.jsonerror(data);
                        return;
                     }
                     else {

                        var returnList = JSON.parse(data.BudgetItemsList);
                        budgetItemsList.length = 0;
                        budgetItemsList = returnList;
                        if (callback != null) {
                           callback(returnList);
                        }
                     }
                  }
               });
            }
         }
         function RenderCurrentBudgetItems(listToRender, callback) {
            let listToFilter = listToRender;

            let budgetListHolder = $("<div class=\"budget-items-list\" />");
            if (listToFilter != null && listToFilter.length > 0) {
               for (let itemIndex = 0; itemIndex < listToFilter.length; itemIndex++) {
                  let dataItem = listToFilter[itemIndex];

                  let itemRowHolder = $("<div class=\"budget-list-item-holder\" />");
                  let roleNameHolder = $("<div class=\"budget-list-item role-name\" />");
                  let dollarsPerMonthHolder = $("<div class=\"budget-list-item dollars-per-month\" />");
                  let acuityPointsPerMonthHolder = $("<div class=\"budget-list-item acuity-points-per-month\" />");
                  let isActiveHolder = $("<div class=\"budget-list-item is-active\" />");
                  let listItemButtonsHolder = $("<div class=\"budget-list-item item-buttons\" />");

                  let role = possibleRoles.find(r => r.RoleCode == dataItem.Role);
                  let roleName = dataItem.Role;
                  if (role != null) {
                     roleName = role.RoleDesc;
                  }
                  roleNameHolder.append(roleName);

                  dollarsPerMonthHolder.append(dataItem.DollarPerMonthAllowed.toLocaleString("en-US", { style: "currency", currency: "USD" }));
                  acuityPointsPerMonthHolder.append(dataItem.AcuityPointsPerMonthAllowed);
                  let isActiveValue = "Yes";
                  if (dataItem.IsActive == false) {
                     isActiveValue = "No";
                  }
                  isActiveHolder.append(isActiveValue);

                  let editItemButton = $("<button title=\"Edit\" class=\"\" id=\"btnEditBudgetItem_" + dataItem.RoleBudgetItemId + "\"><i class=\"fa fa-edit\"></i></button>");
                  editItemButton.off("click").on("click", function () {
                     let btnId = this.id;
                     let id = btnId.split("_")[1];
                     ClearEditorForm(function () {
                        LoadEditorForm(id, function () {
                           ShowEditorForm();
                        });
                     });
                  });
                  listItemButtonsHolder.append(editItemButton);


                  itemRowHolder.append(roleNameHolder);
                  itemRowHolder.append(dollarsPerMonthHolder);
                  itemRowHolder.append(acuityPointsPerMonthHolder);
                  itemRowHolder.append(isActiveHolder);
                  itemRowHolder.append(listItemButtonsHolder);

                  budgetListHolder.append(itemRowHolder);
               }
            }
            else {
               budgetListHolder.append("No Budget items found.");
            }

            $("#budgetItemsList", element).empty();
            $("#budgetItemsList", element).append(budgetListHolder);

            if (callback != null) {
               callback();
            }
         }

         function HandleBudgetListLoad() {
            LoadBudgetManagerItems(null, function (listToRender) {
               RenderCurrentBudgetItems(listToRender);
            });
         }

         function ValidateEditorForm(callback) {
            var formValid = true;
            var errorMessages = [];

            console.log("ValidateEEditorForm()");

            if (formValid) {
               if (callback != null) {
                  callback();
               }
            } else {
               var messageString = "";
               if (errorMessages.length > 0) {
                  messageString += "<i class=\"fas fa-exclamation-triangle\"></i> <strong>Correct the following errors:</strong> <ul>";
               }
               for (var m = 0; m < errorMessages.length; m++) {
                  let item = errorMessages[m];

                  messageString += "<li>" + item.message + "</li>";
                  if (item.fieldclass != "") {
                     $(item.fieldclass, element).addClass("errorField");
                     $(item.fieldclass, element).off("blur").on("blur", function () {
                        $(this).removeClass("errorField");
                     });
                  }
                  else if (item.fieldid != "") {
                     $("#" + item.fieldid, element).addClass("errorField");
                     $("#" + item.fieldid, element).off("blur").on("blur", function () {
                        $(this).removeClass("errorField");
                     });
                  }
               }
               if (messageString != "") {
                  messageString += "</ul>";

                  $(".error-information-holder", element).html(messageString);
                  $(".error-information-holder", element).show();
               }
            }
         }
         function CollectFormDataForBudgetItem() {
            let returnObject = new Object();
            returnObject.RoleBudgetItemId = $("#editRoleBudgetItemAllowance_Id", element).val();
            returnObject.Role = $("#editRoleBudgetItemAllowance_Role", element).val();
            returnObject.DollarPerMonthAllowed = parseFloat($("#editRoleBudgetItemAllowance_DollarsPerMonth", element).val());
            returnObject.AcuityPointsPerMonthAllowed = parseFloat($("#editRoleBudgetItemAllowance_AcuityPointsPerMonth", element).val());
            returnObject.IsActive = $("#editRoleBudgetItemAllowance_IsActive", element).is(":checked");
            returnObject.EntDt = new Date().toLocaleDateString();
            returnObject.EntBy = legacyContainer.scope.TP1Username;
            returnObject.UpdDt = new Date().toLocaleDateString();
            returnObject.UpdBy = legacyContainer.scope.TP1Username;

            return returnObject;
         }

         /*Budget Usage*/
         function LoadBudgetUsage(callback) {
            GetBudgetUsage(null, function (listToRender) {
               RenderBudgetUsage(listToRender, callback);
            });
         }
         function GetBudgetUsage(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (currentBudgetUsage != null && currentBudgetUsage.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(currentBudgetUsage);
               }
            }
            else {
               let budgetDate = $("#monthSelector", element).val();
               let userId = "";

               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getBudgetUsage",
                     budgetdate: budgetDate,
                     userid: userId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     if (data.errormessage != null && data.errormessage == "true") {
                        a$.jsonerror(data);
                        return;
                     }
                     else {

                        var returnList = JSON.parse(data.usageList);
                        currentBudgetUsage.length = 0;
                        currentBudgetUsage = returnList;
                        if (callback != null) {
                           callback(returnList);
                        }
                     }
                  }
               });
            }

         }
         function RenderBudgetUsage(listToRender, callback) {
            if (listToRender == null) {
               listToRender = currentBudgetUsage;
            }
            $("#budgetUsageCurrentMonthLabel", element).empty();
            $("#budgetUsagePreviousMonthLabel", element).empty();
            $("#budgetUsageCurrentMonth", element).empty();
            $("#budgetUsagePreviousMonth", element).empty();

            let previousMonthHolder = $("<div />");
            let currentMonthHolder = $("<div />");

            let firstDate = new Date($("#monthSelector", element).val());
            let previousDate = new Date(firstDate.setMonth(firstDate.getMonth() - 1));
            let currentMonthText = firstDate.toLocaleString("default", { month: "long" });
            let currentYearText = firstDate.toLocaleString("default", { year: "numeric" });
            let currentListItemText = " (" + currentMonthText + " " + currentYearText + ")";
            let previousMonthText = previousDate.toLocaleString("default", { month: "long" });
            let previousYearText = previousDate.toLocaleString("default", { year: "numeric" });
            let previousListItemText = " (" + previousMonthText + " " + previousYearText + ")";

            if (listToRender != null && listToRender.length > 0) {
               let previousMonthDataList = listToRender.filter(i => i.DataValue.toUpperCase() == USAGE_PREVIOUS_MONTH_DATAVALUE.toUpperCase() && (i.UserId == "" || i.UserId == null));
               let userPreviousMonthDataList = listToRender.filter(i => i.DataValue.toUpperCase() == USAGE_PREVIOUS_MONTH_DATAVALUE.toUpperCase() && i.UserId != "" && i.UserId != null);
               let currentMonthDataList = listToRender.filter(i => i.DataValue.toUpperCase() == USAGE_CURRENT_MONTH_DATAVALUE.toUpperCase() && (i.UserId == "" || i.UserId == null));
               let userCurrentMonthDataList = listToRender.filter(i => i.DataValue.toUpperCase() == USAGE_CURRENT_MONTH_DATAVALUE.toUpperCase() && i.UserId != "" && i.UserId != null);

               if (previousMonthDataList != null && previousMonthDataList.length > 0) {
                  let listFirstDate = new Date(previousMonthDataList[0].LedgerDate);
                  let monthText = listFirstDate.toLocaleString("default", { month: "long" });
                  let yearText = listFirstDate.toLocaleString("default", { year: "numeric" });
                  let listItemText = " (" + monthText + " " + yearText + ")";
                  $("#budgetUsagePreviousMonthLabel", element).text(listItemText);

                  for (let iIndex = 0; iIndex < previousMonthDataList.length; iIndex++) {
                     let item = previousMonthDataList[iIndex];
                     RenderBudgetUsageItem(item, previousMonthHolder, null, userPreviousMonthDataList);

                  }
               }
               else {
                  $("#budgetUsagePreviousMonthLabel", element).text(previousListItemText);
                  previousMonthHolder.append("No Previous month data found.");
               }

               if (currentMonthDataList != null && currentMonthDataList.length > 0) {
                  let listFirstDate = new Date(currentMonthDataList[0].LedgerDate);
                  let monthText = listFirstDate.toLocaleString("default", { month: "long" });
                  let yearText = listFirstDate.toLocaleString("default", { year: "numeric" });
                  let listItemText = " (" + monthText + " " + yearText + ")";
                  $("#budgetUsageCurrentMonthLabel", element).text(listItemText);

                  for (let iIndex = 0; iIndex < currentMonthDataList.length; iIndex++) {
                     let item = currentMonthDataList[iIndex];
                     let compareValue = "unknown";
                     let previousMonthItem = previousMonthDataList.find(i => i.SpendType == item.SpendType && i.UserId == item.UserId && i.UserRole == item.UserRole && i.LedgerTypeId == item.LedgerTypeId);
                     if (previousMonthItem != null) {
                        if (item.BudgetAmount > previousMonthItem.BudgetAmount) {
                           compareValue = "increase";
                        }
                        else if (item.BudgetAmount < previousMonthItem.BudgetAmount) {
                           compareValue = "decrease";
                        }
                        else if (item.BudgetAmount == previousMonthItem.BudgetAmount) {
                           compareValue = "equal"
                        }
                     }
                     else {
                        compareValue = "increase";
                     }
                     //RenderBudgetUsageItem(item, currentMonthHolder, compareValue, userCurrentMonthDataList);
                     RenderBudgetUsageItemGraphed(item, currentMonthHolder, true, userCurrentMonthDataList, previousMonthDataList);
                  }
               }
               else {
                  $("#budgetUsageCurrentMonthLabel", element).text(currentListItemText);
                  currentMonthHolder.append("No Current month data found.");
               }

            }
            else {

               $("#budgetUsagePreviousMonthLabel", element).text(previousListItemText);
               $("#budgetUsageCurrentMonthLabel", element).text(currentListItemText);

               previousMonthHolder.append("No previous month data found.");
               currentMonthHolder.append("No current month data found.");
            }

            $("#budgetUsageCurrentMonth", element).append(currentMonthHolder);
            $("#budgetUsagePreviousMonth", element).append(previousMonthHolder);

            HideAllSubListsItems();

            if (callback != null) {
               callback();
            }
         }

         function RenderBudgetUsageItem(itemToRender, objectToRenderTo, compareValue, subItemList) {
            if (compareValue == null) {
               compareValue = "unknown";
            }

            let itemListExpanderId = itemToRender.DataValue.replace(" ", "");
            itemListExpanderId += "_" + itemToRender.SpendType.toString().replace(" ", "");
            itemListExpanderId += "_" + itemToRender.UserRole.toString().replace(" ", "");
            itemListExpanderId += "_" + itemToRender.LedgerTypeId.toString().replace(" ", "");

            let budgetItemRow = $("<div class=\"budget-item-row-holder\" />");
            let budgetItemSubItemListHolder = $("<div class=\"budget-item-row-sub-list-items-holder\" id=\"subListHolder_" + itemListExpanderId + "\" />");
            let budgetItemUserNameHolder = $("<div class=\"budget-item-row-item-holder budget-user-name\" />");
            let budgetItemRoleNameHolder = $("<div class=\"budget-item-row-item-holder user-role-name\" />");
            let ledgerTypeNameHolder = $("<div class=\"budget-item-row-item-holder ledger-type\" />");
            let budgetAmountHolder = $("<div class=\"budget-item-row-item-holder budget-amount\" />");
            let totalUsersHolder = $("<div class=\"budget-item-row-item-holder total-users\" />");
            let avgPerUserHolder = $("<div class=\"budget-item-row-item-holder avg-per-users\" />");
            let compareHolder = $("<div class=\"budget-item-row-item-holder compare-holder\" />");

            switch (compareValue) {
               case "increase":
                  compareHolder.append("<i class=\"fa fa-gauge-high increase\"></i>");
                  break;
               case "decrease":
                  compareHolder.append("<i class=\"fa fa-gauge-low decrease\"></i>");
                  break;
               case "equal":
                  compareHolder.append("<i class=\"fa fa-gauge equal\"></i>");
                  break;

            }


            let subListItemExpanderHolder = $("<div class=\"budget-item-row-item-holder expander-holder\" id=\"expanderBudgetItem_" + itemListExpanderId + "\" />");
            let subListItemExpanderText = $("<i class=\"fa \"></i>");
            subListItemExpanderText.addClass("fa-plus");
            subListItemExpanderHolder.append(subListItemExpanderText);

            $(subListItemExpanderHolder).on("click", function () {
               let buttonId = this.id;
               ToggleSubListItems(buttonId);
            });

            let budgetAmount = Math.abs(itemToRender.BudgetAmount);
            let avgPerUser = Math.abs(itemToRender.AveragePerUser);

            if (itemToRender.LedgerTypeCode.toUpperCase().includes("DOLLAR")) {
               budgetAmount = budgetAmount.toLocaleString("en-US", { style: "currency", currency: "USD" });
               avgPerUser = avgPerUser.toLocaleString("en-US", { style: "currency", currency: "USD" });
            }
            budgetItemRow.addClass(itemToRender.SpendType.toLowerCase());

            let userName = itemToRender.UserId;
            if (itemToRender.UserIdSource != null) {
               userName = itemToRender.UserIdSource.UserFullName;
            }
            if (subItemList != null && subItemList.length > 0) {
               let currentUsersMatchList = subItemList.filter(i => i.SpendType == itemToRender.SpendType && i.UserRole == itemToRender.UserRole && i.LedgerTypeId == itemToRender.LedgerTypeId);
               RenderBudgetUsageSubItems(currentUsersMatchList, budgetItemSubItemListHolder);
            }

            let ledgerTypeName = itemToRender.LedgerTypeName + " " + itemToRender.SpendType;


            budgetItemUserNameHolder.append(userName);
            budgetItemRoleNameHolder.append(itemToRender.UserRole);

            ledgerTypeNameHolder.append(ledgerTypeName);
            budgetAmountHolder.append(budgetAmount);
            totalUsersHolder.append(itemToRender.TotalUsers);
            avgPerUserHolder.append(avgPerUser);

            budgetItemRow.append(subListItemExpanderHolder);
            budgetItemRow.append(budgetItemRoleNameHolder);
            budgetItemRow.append(budgetItemUserNameHolder);
            budgetItemRow.append(ledgerTypeNameHolder);
            budgetItemRow.append(totalUsersHolder);
            budgetItemRow.append(avgPerUserHolder);
            budgetItemRow.append(budgetAmountHolder);
            budgetItemRow.append(compareHolder);

            budgetItemRow.append(budgetItemSubItemListHolder);

            budgetItemRow.addClass(compareValue);

            $(objectToRenderTo).append(budgetItemRow);

         }

         function RenderComparedValues(currentValue, previousValue, renderToObject, itemSpendType) {
            let isSpendingItem = false;
            if (itemSpendType != null) {
               isSpendingItem = (itemSpendType.toLowerCase() == "spent".toLowerCase());
            }
            if (isSpendingItem) {
               currentValue = Math.abs(currentValue);
               previousValue = Math.abs(previousValue);
            }
            let compareObject = $("<i class=\"fa\" />");
            if (currentValue < previousValue || (currentValue == null && previousValue != null)) {
               compareObject.addClass("decrease");
               compareObject.addClass("fa-gauge-low");
            }
            else if (currentValue > previousValue || (previousValue == null && currentValue != null)) {
               compareObject.addClass("increase");
               compareObject.addClass("fa-gauge-high");
            }
            else if (currentValue == previousValue) {
               compareObject.addClass("equal");
               compareObject.addClass("fa-gauge");
            }
            $(renderToObject).append("&nbsp;");
            $(renderToObject).append(compareObject);

         }

         function RenderBudgetUsageItemGraphed(itemToRender, objectToRenderTo, isCurrentList, subItemList, previousList) {
            if (isCurrentList == null) {
               isCurrentList = false;
            }
            let itemListExpanderId = itemToRender.DataValue.replace(" ", "");
            itemListExpanderId += "_" + itemToRender.SpendType.toString().replace(" ", "");
            itemListExpanderId += "_" + itemToRender.UserRole.toString().replace(" ", "");
            itemListExpanderId += "_" + itemToRender.LedgerTypeId.toString().replace(" ", "");

            let budgetItemRow = $("<div class=\"budget-item-row-holder\" />");
            let budgetItemSubItemListHolder = $("<div class=\"budget-item-row-sub-list-items-holder\" id=\"subListHolder_" + itemListExpanderId + "\" />");
            let budgetItemUserNameHolder = $("<div class=\"budget-item-row-item-holder budget-user-name\" />");
            let budgetItemRoleNameHolder = $("<div class=\"budget-item-row-item-holder user-role-name\" />");
            let ledgerTypeNameHolder = $("<div class=\"budget-item-row-item-holder ledger-type\" />");
            let totalUsersHolder = $("<div class=\"budget-item-row-item-holder total-users\" />");
            let totalUsersCompareHolder = $("<div class=\"budget-item-row-item-holder compare-holder\" />");
            let avgPerUserHolder = $("<div class=\"budget-item-row-item-holder avg-per-users\" />");
            let avgPerUserCompareHolder = $("<div class=\"budget-item-row-item-holder compare-holder\" />");
            let budgetAmountHolder = $("<div class=\"budget-item-row-item-holder budget-amount\" />");
            let budgetAmountCompareHolder = $("<div class=\"budget-item-row-item-holder compare-holder\" />");

            let subListItemExpanderHolder = $("<div class=\"budget-item-row-item-holder expander-holder\" id=\"expanderBudgetItem_" + itemListExpanderId + "\" />");
            let subListItemExpanderText = $("<i class=\"fa \"></i>");
            subListItemExpanderText.addClass("fa-plus");
            subListItemExpanderHolder.append(subListItemExpanderText);

            $(subListItemExpanderHolder).on("click", function () {
               let buttonId = this.id;
               ToggleSubListItems(buttonId);
            });

            let budgetAmount = Math.abs(itemToRender.BudgetAmount);
            let avgPerUser = Math.abs(itemToRender.AveragePerUser);

            if (itemToRender.LedgerTypeCode.toUpperCase().includes("DOLLAR")) {
               budgetAmount = budgetAmount.toLocaleString("en-US", { style: "currency", currency: "USD" });
               avgPerUser = avgPerUser.toLocaleString("en-US", { style: "currency", currency: "USD" });
            }
            budgetItemRow.addClass(itemToRender.SpendType.toLowerCase());

            let userName = itemToRender.UserId;
            if (itemToRender.UserIdSource != null) {
               userName = itemToRender.UserIdSource.UserFullName;
            }
            if (subItemList != null && subItemList.length > 0) {
               let currentUsersMatchList = subItemList.filter(i => i.SpendType == itemToRender.SpendType && i.UserRole == itemToRender.UserRole && i.LedgerTypeId == itemToRender.LedgerTypeId);
               RenderBudgetUsageSubItems(currentUsersMatchList, budgetItemSubItemListHolder);
            }

            let ledgerTypeName = itemToRender.LedgerTypeName + " " + itemToRender.SpendType;


            let previousItem = null;

            if (isCurrentList == true) {
               previousItem = previousList.find(i =>
                  i.DataValue.toUpperCase() == USAGE_PREVIOUS_MONTH_DATAVALUE.toUpperCase() &&
                  i.UserId == itemToRender.UserId &&
                  i.UserRole == itemToRender.UserRole &&
                  i.SpendType == itemToRender.SpendType &&
                  i.LedgerTypeId == itemToRender.LedgerTypeId &&
                  i.LedgerTypeCode == itemToRender.LedgerTypeCode
               );
            }

            budgetItemUserNameHolder.append(userName);
            budgetItemRoleNameHolder.append(itemToRender.UserRole);

            ledgerTypeNameHolder.append(ledgerTypeName);
            budgetAmountHolder.append(budgetAmount);
            totalUsersHolder.append(itemToRender.TotalUsers);
            avgPerUserHolder.append(avgPerUser);

            if (isCurrentList == true) {
               let previousBudgetAmount = null;
               let previousTotalUsers = null;
               let previousAvgPerUser = null;
               if (previousItem != null) {
                  previousBudgetAmount = previousItem.BudgetAmount;
                  previousTotalUsers = previousItem.TotalUsers;
                  previousAvgPerUser = previousItem.AveragePerUser;
               }

               RenderComparedValues(itemToRender.BudgetAmount, previousBudgetAmount, budgetAmountCompareHolder, itemToRender.SpendType);
               RenderComparedValues(itemToRender.TotalUsers, previousTotalUsers, totalUsersCompareHolder, itemToRender.SpendType);
               RenderComparedValues(itemToRender.AveragePerUser, previousAvgPerUser, avgPerUserCompareHolder, itemToRender.SpendType);
            }

            budgetItemRow.append(subListItemExpanderHolder);
            budgetItemRow.append(budgetItemRoleNameHolder);
            budgetItemRow.append(budgetItemUserNameHolder);
            budgetItemRow.append(ledgerTypeNameHolder);
            budgetItemRow.append(totalUsersHolder);
            budgetItemRow.append(totalUsersCompareHolder);
            budgetItemRow.append(avgPerUserHolder);
            budgetItemRow.append(avgPerUserCompareHolder);
            budgetItemRow.append(budgetAmountHolder);
            budgetItemRow.append(budgetAmountCompareHolder);

            budgetItemRow.append(budgetItemSubItemListHolder);

            //budgetItemRow.addClass(compareValue);

            $(objectToRenderTo).append(budgetItemRow);

         }
         function RenderBudgetUsageSubItems(listToRender, objectToRenderTo) {
            let subListItemHolder = $("<div />");
            if (listToRender != null && listToRender.length > 0) {
               for (let iIndex = 0; iIndex < listToRender.length; iIndex++) {
                  let item = listToRender[iIndex];

                  let subListRowHolder = $("<div class=\"sub-list-item-row-holder\" />");
                  //let groupNameHolder = $("<div class=\"budget-sub-list-item sub-user-role-name\" />");
                  let userNameHolder = $("<div class=\"budget-sub-list-item sub-budget-user-name\" />");
                  let budgetAmountHolder = $("<div class=\"budget-sub-list-item sub-budget-amount\" />");

                  //groupNameHolder.append("&nbsp;");

                  let userName = item.UserId;
                  let budgetAmount = Math.abs(item.BudgetAmount);
                  if (item.UserIdSource != null) {
                     userName = item.UserIdSource.UserFullName;
                  }
                  if (item.LedgerTypeCode.toUpperCase().includes("DOLLAR")) {
                     budgetAmount = budgetAmount.toLocaleString("en-US", { style: "currency", currency: "USD" });
                  }
                  userNameHolder.append(userName);

                  budgetAmountHolder.append(budgetAmount);

                  subListRowHolder.addClass(item.SpendType.toLowerCase());

                  //subListRowHolder.append(groupNameHolder);                  
                  subListRowHolder.append(userNameHolder);
                  subListRowHolder.append(budgetAmountHolder);

                  subListItemHolder.append(subListRowHolder);
               }
            }
            else {
               subListItemHolder.append("No Details found.");
            }

            $(objectToRenderTo).append(subListItemHolder);
         }
         /*Budget Usage END*/

         function SaveEditorForm(callback) {
            let budgetItem = CollectFormDataForBudgetItem();
            SaveBudgetItem(budgetItem, function () {
               HandleBudgetListLoad();
               HideEditorForm();
            });
            if (callback != null) {
               callback();
            }
         }
         function SaveBudgetItem(objectToSave, callback) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "saveBudgetItem",
                  roleBudgetItem: JSON.stringify(objectToSave)
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  if (data.errormessage != null && data.errormessage == "true") {
                     a$.jsonerror(data);
                     return;
                  }
                  else {

                     budgetItemsList.length = 0;
                     if (callback != null) {
                        callback(data);
                     }
                  }
               }
            });
         }
         function LoadEditorForm(itemId, callback) {
            let editorItem = budgetItemsList.find(i => i.RoleBudgetItemId == itemId);

            if (editorItem != null) {
               $("#editRoleBudgetItemAllowance_Id", element).val(editorItem.RoleBudgetItemId);
               $("#editRoleBudgetItemAllowance_Role", element).val(editorItem.Role);
               $("#editRoleBudgetItemAllowance_DollarsPerMonth", element).val(editorItem.DollarPerMonthAllowed);
               $("#editRoleBudgetItemAllowance_AcuityPointsPerMonth", element).val(editorItem.AcuityPointsPerMonthAllowed);
               $("#editRoleBudgetItemAllowance_IsActive", element).prop("checked", (editorItem.IsActive == true));
            }

            if (callback != null) {
               callback();
            }
         }
         function ClearEditorForm(callback) {
            $("#editRoleBudgetItemAllowance_Id", element).val(-1);
            $("#editRoleBudgetItemAllowance_Role", element).val("");
            $("#editRoleBudgetItemAllowance_DollarsPerMonth", element).val(0.00);
            $("#editRoleBudgetItemAllowance_AcuityPointsPerMonth", element).val(0);
            $("#editRoleBudgetItemAllowance_IsActive", element).prop("checked", true);

            if (callback != null) {
               callback();
            }
         }
         function HideAll() {
            HideEditorForm();
         }
         function ShowEditorForm() {
            $("#budgetManagerFormPanel", element).show();
         }
         function HideEditorForm() {
            $("#budgetManagerFormPanel", element).hide();
         }
         function HideAllSubListsItems() {
            $("[id^='expanderBudgetItem_'", element).each(function () {
               $(this).click();
            });
         }
         function ToggleSubListItems(id) {
            let subListHolderName = id.replace("expanderBudgetItem", "subListHolder");
            let isVisible = $("#" + subListHolderName, element).is(":visible");

            $("i", $("#" + id, element)).removeClass("fa-plus");
            $("i", $("#" + id, element)).removeClass("fa-minus");

            if (isVisible) {
               $("#" + subListHolderName, element).hide();
               $("i", $("#" + id, element)).addClass("fa-plus");
            }
            else {
               $("#" + subListHolderName, element).show();
               $("i", $("#" + id, element)).addClass("fa-minus");
            }

         }
         function CollapseAll(listToCollapse) {
            let parentItem = element;
            if (listToCollapse == "previous") {
               parentItem = $("#budgetUsagePreviousMonth", element);

            }
            else if (listToCollapse == "current") {
               parentItem = $("#budgetUsageCurrentMonth", element);
            }
            $("[id^='subListHolder_'", parentItem).each(function () {
               $(this).hide();
            });

            $("[id^='expanderBudgetItem_']", parentItem).each(function () {
               $("i", $(this)).removeClass("fa-plus");
               $("i", $(this)).removeClass("fa-minus");
               $("i", $(this)).addClass("fa-plus");
            });

         }

         scope.load = function () {
            scope.Initialize();

            $("#btnAddNewBudgetItem", element).off("click").on("click", function () {
               ClearEditorForm(function () {
                  LoadEditorForm(null, function () {
                     ShowEditorForm();
                  });
               });
            });
            $("#btnSaveBudgetItem", element).off("click").on("click", function () {
               ValidateEditorForm(function () {
                  SaveEditorForm(function () {
                     HideEditorForm();
                  });
               });
            });
            $("#monthSelector", element).off("change").on("change", function () {
               ko.postbox.publish("budgetUsageReload", true);
            });
            $("#collapseAllPreviousMonth", element).off("click").on("click", function () {
               CollapseAll("previous");
            });
            $("#collapseAllCurrentMonth", element).off("click").on("click", function () {
               CollapseAll("current");
            });
            $(".btn-close", element).off("click").on("click", function () {
               ClearEditorForm(function () {
                  HideEditorForm();
                  ko.postbox.publish("budgetManagerReload", false);
               });
            });

            HandleBudgetListLoad();
            LoadBudgetUsage();
         };

         ko.postbox.subscribe("budgetManagerReload", function (requireReload) {
            if (requireReload == true) {
               budgetItemsList.length = 0;
            }
            window.setTimeout(function () {
               HandleBudgetListLoad();
            }, 500);
         });
         ko.postbox.subscribe("budgetManagerLoad", function () {
            scope.load();
         });
         ko.postbox.subscribe("budgetUsageReload", function (requireReload) {
            if (requireReload == true) {
               currentBudgetUsage.length = 0;
            }
            window.setTimeout(function () {
               LoadBudgetUsage();
            }, 500);
         });
      }
   };
}]);