angularApp.directive("ngBadgeRules", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/BADGEADMIN1/view/badgeRules.htm?' + Date.now(),
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
         var baseBadgesUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/badges/";
         var baseClientBadgeUrl = window.location.protocol + "//" + window.location.hostname
         var defaultBadgeUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/badges/placeholder-badge.png";
         var defaultLoadingImage = a$.debugPrefix() + "/applib/css/images/acuity-loading.gif";
         var possibleBadges = [];
         var possibleBadgeRules = [];
         var possibleKpiOptions = [];
         var clientUploadedImageKey = "/UPLOADS/"; //TODO: Change to a config parameter

         scope.Initialize = function () {
            $("#UI_loadingImage", element).attr("src", defaultLoadingImage);
            HideAll();
            LoadPossibleKpiOptions();
            LoadPossibleBadges(function () {
               LoadFilterOptions(true);
               RenderBadgeRules(function () {
                  HideUserStatus();
               });
            });
         };
         function HideAll() {
            HideUserPopup();
            HideUserStatus();
            HideAddRuleForm();
         }
         function LoadFilterOptions(activeOnly) {
            if (activeOnly == null) {
               activeOnly = true;
            }
            if (possibleBadges.length > 0) {
               let badgesToLoad = possibleBadges;
               if (activeOnly) {
                  badgesToLoad = possibleBadges.filter(x => x.IsActive == true);
               }
               $("#badgeRulesManager_groupFilter", element).empty();
               $("#badgeRulesManager_groupFilter", element).append($("<option value=\"\">Select Category</option>"));

               for (let bc = 0; bc < badgesToLoad.length; bc++) {
                  let badge = badgesToLoad[bc];
                  let groupListItem = $("<option />");
                  let groupingName = badge.BadgeGroupingName;
                  let exists = false;
                  exists = ($("#badgeRulesManager_groupFilter option", element).filter(function (i, o) { return o.value === groupingName; }).length > 0);
                  if (exists != true) {
                     groupListItem.val(groupingName);
                     groupListItem.text(groupingName);
                     $("#badgeRulesManager_groupFilter", element).append(groupListItem);
                  }
               }
            }
            BuildKpiOptionList("badgeRulesManager_kpiFilter");
            BuildKpiOptionList("badgeRulesAdmin_BadgeAssignedKpi");
         }
         function BuildKpiOptionList(idToFill) {
            if (possibleKpiOptions.length > 0) {
               $("#" + idToFill, element).empty();
               $("#" + idToFill, element).append($("<option value=\"\">Select KPI</option>"));
               for (let kc = 0; kc < possibleKpiOptions.length; kc++) {
                  let kpiObject = possibleKpiOptions[kc];
                  let listItem = $("<option />");
                  listItem.val(kpiObject.MqfNumber);
                  listItem.text(kpiObject.Text);
                  $("#" + idToFill, element).append(listItem);
               }
            }
         }
         function AddKpiListToObject(objectToFill) {
            if (possibleKpiOptions.length > 0) {
               $(objectToFill, element).empty();
               $(objectToFill, element).append($("<option value=\"\">Select KPI</option>"));
               for (let kc = 0; kc < possibleKpiOptions.length; kc++) {
                  let kpiObject = possibleKpiOptions[kc];
                  let listItem = $("<option />");
                  listItem.val(kpiObject.MqfNumber);
                  listItem.text(kpiObject.Text);
                  $(objectToFill, element).append(listItem);
               }
            }
         }
         function BuildScoreTypeOptionList(objectToFill) {
            $(objectToFill, element).empty();
            $(objectToFill, element).append($("<option value=\"Score\">Score Value</option>"));
            $(objectToFill, element).append($("<option value=\"Standard\">Standard Value</option>"));
            $(objectToFill, element).append($("<option value=\"Total\">Total</option>"));

         }
         function LoadPossibleBadges(callback) {
            WriteUserStatus("Loading possible badges...", 5000);
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "getAllAvailableBadges",
                  deepLoad: true
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {

                     let returnData = null;
                     if (jsonData.badgesList != null) {
                        returnData = JSON.parse(jsonData.badgesList);
                        possibleBadges.length = 0;
                        possibleBadges = returnData;
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                     return;
                  }
               }
            });
         }
         function LoadPossibleKpiOptions(callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "getPossibleScoringAreas",
                  userId: legacyContainer.scope.TP1Username
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {

                     let returnData = null;
                     if (jsonData.scoringAreaList != null) {
                        returnData = JSON.parse(jsonData.scoringAreaList);
                        possibleKpiOptions.length = 0;
                        possibleKpiOptions = returnData;
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                     return;
                  }
               }
            });
         }
         function LoadBadgeRules(callback) {
            let groupingName = $("#badgeRulesManager_groupFilter", element).val();
            let mqfNumber = $("#badgeRulesManager_kpiFilter", element).val();
            if (groupingName == null) {
               groupingName = "";
            }
            if (mqfNumber == null || mqfNumber == "") {
               mqfNumber = -1;
            }
            else {
               mqfNumber = parseInt(mqfNumber);
            }
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "getBadgeRulesForGroup",
                  deepLoad: true,
                  groupingname: groupingName,
                  mqfnumber: mqfNumber
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {

                     let returnData = null;
                     if (jsonData.badgeRulesList != null) {
                        returnData = JSON.parse(jsonData.badgeRulesList);
                        possibleBadgeRules.length = 0;
                        possibleBadgeRules = returnData;
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                     return;
                  }
               }
            });

         }
         function RenderBadgeRules(callback) {
            WriteUserStatus("Rendering badge information to screen...", 5000);
            let groupingName = $("#badgeRulesManager_groupFilter", element).val();
            let badgesInGrouping = possibleBadges;
            if (groupingName != null && groupingName != "") {
               badgesInGrouping = possibleBadges.filter(b => (b.BadgeGroupingName == groupingName));
            }
            let badgeItemHolder = $("<div />");
            $("#badgeRulesAdmin_BadgeListHolder", element).empty();

            if (badgesInGrouping != null && badgesInGrouping.length > 0) {
               for (let bc = 0; bc < badgesInGrouping.length; bc++) {
                  let badge = badgesInGrouping[bc];
                  RenderRulesForBadge(badge, badgeItemHolder);
               }
            }
            else {
               badgeItemHolder.append("No Badges found for Grouping.");
            }
            $("#badgeRulesAdmin_BadgeListHolder", element).append(badgeItemHolder);

            if (callback != null) {
               callback();
            }
            return;
         }
         function RenderRulesForBadge(badgeObject, objectToRenderTo) {
            if (badgeObject != null) {
               let isInsertRule = false;
               let badgeRule = possibleBadgeRules.find(br => br.BadgeId == badgeObject.BadgeId);
               let saveRuleButtonText = "Save";
               let saveButtonImage = "<i class=\"fa-solid fa-save\"></i>";
               let badgeRuleId = -1;
               if (badgeRule == null || badgeRule == "") {
                  saveRuleButtonText = "Add";
                  saveButtonImage = "<i class=\"fa fa-plus\"></i> Add a Rule";
                  isInsertRule = true;
               }
               else {
                  badgeRuleId = badgeRule.BadgeRuleId;
               }
               let badgeRulesEditorItemHolder = $("<div class=\"badge-rule-editor-item-holder\"/>");
               let badgeRulesLeftSectionHolder = $("<div class=\"badge-rule-editor-row-holder left-holder\" />");
               let badgeRulesRightSectionHolder = $("<div class=\"badge-rule-editor-row-holder right-holder\" />");
               let badgeRulesSectionHolder = $("<div class=\"badge-rule-editor-section rules-section-holder\" />");
               let badgeRuleBadgeRuleId = $("<input type=\"hidden\" id=\"badgeRuleEditorForm_BadgeRuleId_" + badgeObject.BadgeId + "\"/>");
               let badgeNameHolder = $("<div class=\"badge-rule-edtior-badge-name-holder\" />");
               badgeNameHolder.append(badgeObject.BadgeName);
               let badgeImageHolder = $("<div class=\"badge-rule-editor-badge-image-holder\" />");
               let badgeImage = $("<img class=\"badge-image-item\" />");
               let badgeImageUrl = badgeObject.ImageUrl;
               let badgeRulesItemButtonHolder = $("<div class=\"badge-rule-inline-editor-row-holder right-align\" />");
               let badgeRuleItemErrorHolder = $("<div class=\"error-information-holder inline-error-holder\" />");
               if (badgeImageUrl == null || badgeImageUrl == "") {
                  badgeImageUrl = defaultBadgeUrl;
               }
               else {
                  let isClientBadge = false;
                  isClientBadge = badgeImageUrl.toUpperCase().includes(clientUploadedImageKey.toUpperCase());

                  if (isClientBadge == true) {
                     badgeImageUrl = baseClientBadgeUrl + badgeImageUrl;
                  }
                  else {
                     badgeImageUrl = baseBadgesUrl + badgeImageUrl;
                  }

               }

               badgeImage.prop("src", badgeImageUrl);
               badgeImage.height(75);

               badgeImageHolder.append(badgeImage);


               let saveRuleButton = $("<button title=\"" + saveRuleButtonText + " Rule\" id=\"saveRule_" + badgeObject.BadgeId + "\" class=\"button btn btn-large save-button\" />");
               saveRuleButton.html(saveButtonImage);
               if (isInsertRule == true) {
                  $(badgeRuleBadgeRuleId).val(-1);
                  saveRuleButton.off("click").on("click", function () {
                     //WriteUserPopup("Saving rule information...", 5000);
                     let buttonId = this.id;
                     let badgeId = buttonId.split("_")[1];
                     LoadAddRuleForm(badgeId, function () {
                        ShowAddRuleForm();
                        HideUserPopup();
                     });
                  });
               }
               else {
                  $(badgeRuleItemErrorHolder).prop("id", "badgeRuleEditorForm_ErrorHolder_" + badgeRuleId);
                  $(badgeRuleBadgeRuleId).val(badgeRuleId);
                  saveRuleButton.off("click").on("click", function () {
                     //WriteUserPopup("Saving rule information...", 5000);
                     let buttonId = this.id;
                     let badgeId = buttonId.split("_")[1];
                     UpdateBadgeRuleForm(badgeId, function () {
                        WriteUserPopup("Information saved.", 5000);
                        LoadBadgeRules(function () {
                           RenderBadgeRules(function () {
                              HideUserStatus();
                           });
                        });
                     });
                  });

                  let currentBadgeRuleHolder = $("<div class=\"badge-rule-current-list-holder\" />");
                  let kpiOptionHolder = $("<div class=\"badge-rule-inline-editor-row-holder\" />");
                  let kpiOptionLabel = $("<label class=\"badge-rule-label earned-by\">Earned by: </label>");
                  let kpiOptionInput = $("<select id=\"badgeRuleEditorForm_BadgeAssignedKpi_" + badgeRuleId + "\" class=\"badge-rule-selector kpi-option\" />");
                  let scoringTypeSelector = $("<select id=\"badgeRuleEditorForm_BadgeScoreType_" + badgeRuleId + "\" class=\"badge-rule-selector scoring-type\"></select>");
                  let minScoreValueHolder = $("<span id=\"badgeRuleEditorForm_ScoreValueHolder\" class=\"badge-rule-selection-holder min-score-holder\" />");
                  let minScoreValueInput = $("<input type=\"text\" id=\"badgeRuleEditorForm_MinimumScoreValueToEarn_" + badgeRuleId + "\" class=\"small-box badge-rule-input min-score-value\" />");
                  minScoreValueInput.val(badgeRule.MinimumScoreValueToEarn);
                  let maxScoreValueInput = $("<input type=\"text\" id=\"badgeRuleEditorForm_MaximumScoreValueToEarn_" + badgeRuleId + "\" class=\"small-box badge-rule-input max-score-value\" />");
                  maxScoreValueInput.val(badgeRule.MaximumScoreValueToEarn);
                  let minStandardValueHolder = $("<span id=\"badgeRuleEditorForm_StandardValueHolder\" class=\"badge-rule-selection-holder min-standard-holder\" />");
                  let minStandardValueInput = $("<input type=\"text\" id=\"badgeRuleEditorForm_MinimumStandardValueToEarn_" + badgeRuleId + "\" class=\"small-box badge-rule-input min-score-value\" />");
                  minStandardValueInput.val(badgeRule.MinimumStandardValueToEarn);
                  let maxStandardValueInput = $("<input type=\"text\" id=\"badgeRuleEditorForm_MaximumStandardValueToEarn_" + badgeRuleId + "\" class=\"small-box badge-rule-input max-score-value\" />");
                  maxStandardValueInput.val(badgeRule.MaximumStandardValueToEarn);
                  let minRawSumValueHolder = $("<span id=\"badgeRuleEditorForm_RawTotalValueHolder\" class=\"badge-rule-selection-holder total-value-holder\" />");
                  let minRawSumValueInput = $("<input type=\"text\" id=\"badgeRuleEditorForm_MinimumRawSumToEarn_" + badgeRuleId + "\" class=\"badge-rule-input max-score-value\" />");
                  minRawSumValueInput.val(badgeRule.minimumRawSumToEarn);
                  let consecutiveEarnRowHolder = $("<div class=\"badge-rule-inline-editor-row-holder\" />");
                  let consecutiveEarnHolder = $("<span class=\"badge-rule-selection-holder consecutive-earn-holder\" />");
                  let consecutiveEarnLabel = $("<label class=\"badge-rule-label consecutive-earn\">Consecutive Earn:</label>");
                  let consecutiveEarnMonthsInput = $("<input type=\"text\" id=\"badgeRuleEditorForm_ConsecutiveMonthsToEarn_" + badgeRuleId + "\" class=\"small-box badge-rule-input consecutive-months\" />");
                  consecutiveEarnMonthsInput.val(badgeRule.ConsecutiveMonthsToEarn);
                  // let consecutiveEarnDaysInput = $("<input type=\"text\" id=\"badgeRuleEditorForm_ConsecutiveDaysToEarn_" + badgeRuleId + "\" class=\"small-box\" />");                  
                  // consecutiveEarnDaysInput.val(badgeRule.ConsecutiveDaysToEarn);
                  let progressiveBadgeHolder = $("<span class=\"badge-rule-selection-holder progressive-badge-holder\"/>");
                  let progressiveBadgeLabel = $("<label class=\"badge-rule-label progressive-badge\">Is Progressive?</label>");
                  let progressiveBadgeOption = $("<input type=\"checkbox\" id=\"badgeRuleEditorForm_IsProgressiveBadge_" + badgeRuleId + "\" class=\"checkbox-input is-progressive\" />");
                  progressiveBadgeOption.prop("checked", badgeRule.IsProgressiveBadge);
                  let awardPointsOptionHolder = $("<div class=\"badge-rule-inline-editor-row-holder\" />");
                  let awardPointsOptionLabel = $("<label class=\"badge-rule-label award-points\">Award Credits?</label>");
                  let awardPointsOption = $("<input type=\"checkbox\" id=\"badgeRuleEditorForm_HasPoints_" + badgeRuleId + "\" class=\"checkbox-input has-points\" />");
                  awardPointsOption.prop("checked", badgeRule.HasPoints);
                  let awardPointsValueLabel = $("<label class=\"badge-rule-label points-to-award\">Credits for Earning:</label>");
                  let awardPointsValueInput = $("<input type=\"text\" id=\"badgeRuleEditorForm_PointsForBadgeAward_" + badgeRuleId + "\" class=\"badge-rule-input points-to-award\" />");
                  awardPointsValueInput.val(badgeRule.PointsForBadgeAward);
                  let maxEarnHolder = $("<div class=\"badge-rule-inline-editor-row-holder\" />");
                  let maxEarnLabel = $("<label class=\"badge-rule-label max-badge-earn\">Maxmimum Earn Badge:</label>");
                  let maxEarnInput = $("<input type=\"text\" id=\"badgeRuleEditorForm_MaximumNumberOfBadgesPerUser_" + badgeRuleId + "\" class=\"small-box badge-rule-input max-badge-earn\" />");
                  maxEarnInput.val(badgeRule.MaximumNumberOfBadgesPerUser);

                  minScoreValueHolder.append("<label class=\"spacing-label\"> between </label>");
                  minScoreValueHolder.append(minScoreValueInput);
                  minScoreValueHolder.append("<label class=\"spacing-label\"> and </label>");
                  minScoreValueHolder.append(maxScoreValueInput);

                  minStandardValueHolder.append("<label class=\"spacing-label\"> between </label>");
                  minStandardValueHolder.append(minStandardValueInput);
                  minStandardValueHolder.append("<label class=\"spacing-label\"> and </label>");
                  minStandardValueHolder.append(maxStandardValueInput);

                  minRawSumValueHolder.append("<label class=\"spacing-label\"> at least </label>");
                  minRawSumValueHolder.append(minRawSumValueInput);
                  AddKpiListToObject(kpiOptionInput);

                  kpiOptionHolder.append(kpiOptionLabel);
                  kpiOptionHolder.append(kpiOptionInput);
                  kpiOptionHolder.append("&nbsp;");
                  kpiOptionHolder.append(scoringTypeSelector);
                  BuildScoreTypeOptionList(scoringTypeSelector);
                  kpiOptionHolder.append(minScoreValueHolder);
                  kpiOptionHolder.append(minStandardValueHolder);
                  kpiOptionHolder.append(minRawSumValueHolder);

                  scoringTypeSelector.off("change").on("change", function () {
                     HandleScoreTypeForUpdateForm(scoringTypeSelector, minScoreValueHolder, minStandardValueHolder, minRawSumValueHolder);
                  });

                  consecutiveEarnHolder.append(consecutiveEarnLabel);
                  consecutiveEarnHolder.append(consecutiveEarnMonthsInput);
                  consecutiveEarnHolder.append("<label class=\"spacing-label\"> Month(s) </label>");
                  //consecutiveEarnHolder.append(consecutiveEarnDaysInput);

                  progressiveBadgeHolder.append(progressiveBadgeLabel);
                  progressiveBadgeHolder.append(progressiveBadgeOption);

                  consecutiveEarnRowHolder.append(consecutiveEarnHolder);
                  consecutiveEarnRowHolder.append(progressiveBadgeHolder);

                  maxEarnHolder.append(maxEarnLabel);
                  maxEarnHolder.append(maxEarnInput);

                  awardPointsOptionHolder.append(awardPointsOptionLabel);
                  awardPointsOptionHolder.append(awardPointsOption);
                  awardPointsOptionHolder.append(awardPointsValueLabel);
                  awardPointsOptionHolder.append(awardPointsValueInput);

                  currentBadgeRuleHolder.append(badgeRuleItemErrorHolder);
                  currentBadgeRuleHolder.append(kpiOptionHolder);
                  currentBadgeRuleHolder.append(consecutiveEarnRowHolder);
                  currentBadgeRuleHolder.append(maxEarnHolder);
                  currentBadgeRuleHolder.append(awardPointsOptionHolder);

                  kpiOptionInput.val(badgeRule.AssignedMqfNumber);

                  badgeRulesSectionHolder.append(currentBadgeRuleHolder);
                  //SetScoreTypeOption()
                  HandleScoreTypeForUpdateForm(scoringTypeSelector, minScoreValueHolder, minStandardValueHolder, minRawSumValueHolder);

               }

               badgeRulesItemButtonHolder.append(saveRuleButton);

               if (badgeRule != null) {
                  let removeRuleButton = $("<button title=\"Delete Rule\" class=\"button btn btn-large button--red\" id=\"btnDeleteBadgeRule_" + badgeRule.BadgeRuleId + "\"><i class=\"fa fa-trash\"></button>");
                  removeRuleButton.off("click").on("click", function () {
                     let buttonId = this.id;
                     let ruleId = buttonId.split("_")[1];
                     WriteUserStatus("Removing badge rule...", 10000);
                     DeleteBadgeRule(ruleId, function () {
                        HideUserStatus();
                        LoadBadgeRules(function () {
                           RenderBadgeRules();
                        });
                     });
                  });
                  badgeRulesItemButtonHolder.append("&nbsp;");
                  badgeRulesItemButtonHolder.append(removeRuleButton);
               }
               badgeRulesSectionHolder.append(badgeRuleBadgeRuleId);

               badgeRulesLeftSectionHolder.append(badgeImageHolder);
               badgeRulesLeftSectionHolder.append(badgeNameHolder);


               badgeRulesRightSectionHolder.append(badgeRulesSectionHolder);
               badgeRulesRightSectionHolder.append(badgeRulesItemButtonHolder);

               badgeRulesEditorItemHolder.append(badgeRulesLeftSectionHolder);
               badgeRulesEditorItemHolder.append(badgeRulesRightSectionHolder);

               $(objectToRenderTo, element).append(badgeRulesEditorItemHolder);

            }
         }
         function HandleScoreTypeForAddForm() {
            let value = $("input:radio[name=badgeRulesAdmin_ScoreType]:checked", element).val();
            if (value == "Score") {
               HideTotalValueOptions();
               HideStandardValuesOptions();
               ShowScoreValuesOptions();
            }
            else if (value == "Standard") {
               HideTotalValueOptions();
               HideScoreValuesOptions();
               ShowStandardValuesOptions();
            }
            else if (value == "Total") {
               HideStandardValuesOptions();
               HideScoreValuesOptions();
               ShowTotalValueOptions();
            }
         }
         function HandleScoreTypeForUpdateForm(objectToHandle, scoreHolder, standardHolder, totalHolder) {
            let value = $(objectToHandle, element).val();
            if (value == "Score") {
               $(scoreHolder, element).show();
               $(standardHolder, element).hide();
               $(totalHolder, element).hide();
            }
            else if (value == "Standard") {
               $(scoreHolder, element).hide();
               $(standardHolder, element).show();
               $(totalHolder, element).hide();
            }
            else if (value == "Total") {
               $(scoreHolder, element).hide();
               $(standardHolder, element).hide();
               $(totalHolder, element).show();
            }
         }
         function HandleScoreType(formType, objectToHandle) {
            if (formType == null) {
               formType = "add";
            }
            formType = formType.toLowerCase();

            if (formType == "add" || formType == "insert") {
               HandleScoreTypeFromAddForm();
            }
            else if (formType == "update") {
               HandleScoreTypeForUpdateForm(objectToHandle);
            }
         }
         function LoadAddRuleForm(badgeId, callback) {
            let badge = possibleBadges.find(b => b.BadgeId == badgeId);
            $("#badgeRulesAdmin_BadgeName", element).text(badge.BadgeName);
            if (badge.RelatedMqfNumber != null && badge.RelatedMqfNumber.toString() != "") {
               $("#badgeRulesAdmin_BadgeAssignedKpi", element).val(badge.RelatedMqfNumber);
               $("#badgeRulesAdmin_BadgeAssignedKpi", element).prop("disabled", true);
            }
            $("#addBadgeRuleBadgeId", element).val(badgeId);
            $("#badgeRulesAdmin_IsProgressiveBadge", element).prop("checked", badge.BadgeLevel != 1);
            $("#badgeRulesAdmin_MaximumNumberOfBadgesPerUser", element).val(1);
            $("#badgeRulesAdmin_ConsecutiveMonthsToEarn", element).val(badge.BadgeLevel);

            $("input:radio[name=badgeRulesAdmin_ScoreType]", element).val(["Score"]);
            HandleScoreTypeForAddForm();
            if (callback != null) {
               callback();
            }
            return;
         }
         function ClearAddRuleForm(callback) {
            $("#addBadgeRuleBadgeId", element).val(-1);
            $("#badgeRulesAdmin_BadgeName", element).text("");
            $("#badgeRulesAdmin_BadgeAssignedKpi", element).val("");
            $("#badgeRulesAdmin_BadgeAssignedKpi", element).prop("disabled", false);
            $("#badgeRulesAdmin_IsProgressiveBadge", element).prop("checked", false);
            $("#badgeRulesAdmin_MaximumNumberOfBadgesPerUser", element).val(1);
            $("#badgeRulesAdmin_ConsecutiveMonthsToEarn", element).val("");
            $("#badgeRulesAdmin_ConsecutiveDaysToEarn", element).val("");
            $("input:radio[name=badgeRulesAdmin_ScoreType]", element).val(["Score"]);
            $("#badgeRulesAdmin_MinimumScoreValueToEarn", element).val("");
            $("#badgeRulesAdmin_MaximumScoreValueToEarn", element).val("");
            $("#badgeRulesAdmin_MinimumStandardValueToEarn", element).val("");
            $("#badgeRulesAdmin_MaximumStandardValueToEarn", element).val("");
            $("#badgeRulesAdmin_MinimumRawSumToEarn", element).val("");
            $("#badgeRulesAdmin_HasPoints", element).prop("checked", false);
            $("#badgeRulesAdmin_PointsForBadgeAward", element).val("");
            HandleScoreTypeForAddForm();
            $(".errorField", $("#badgeRulesAdmin_AddBadgeRuleForm", element)).each(function () {
               $(this).removeClass("errorField");
            });

            if (callback != null) {
               callback();
            }
            return;
         }
         function ValidateAddRuleForm(callback) {
            $("#addBadgeRuleErrorHolder", element).empty();

            var formValid = true;
            let errorMessages = [];
            let kpiToEarn = $("#badgeRulesAdmin_BadgeAssignedKpi", element).val();
            let scoreType = $("input:radio[name=badgeRulesAdmin_ScoreType]:checked", element).val();
            let checkEarnValueMinimum = -1;
            let checkEarnValueMaximum = -1;
            let checkEarnValueTotal = -1;
            //TODO: Add all validation rules here.
            if (kpiToEarn == null || kpiToEarn == "") {
               errorMessages.push({ message: "Kpi is Required.", fieldclass: "", fieldid: "badgeRulesAdmin_BadgeAssignedKpi" });
               formValid = false;
            }
            if (scoreType == "Score") {
               checkEarnValueMinimum = $("#badgeRulesAdmin_MinimumScoreValueToEarn", element).val();
               checkEarnValueMaximum = $("#badgeRulesAdmin_MaximumScoreValueToEarn", element).val();
               if (checkEarnValueMinimum == null || checkEarnValueMinimum == "") {
                  errorMessages.push({ message: "Score Value (Minimum) is Required.", fieldclass: "", fieldid: "badgeRulesAdmin_MinimumScoreValueToEarn" });
                  formValid = false;
               }
               if (checkEarnValueMaximum == null || checkEarnValueMaximum == "") {
                  errorMessages.push({ message: "Score Value (Maximum) is Required.", fieldclass: "", fieldid: "badgeRulesAdmin_MaximumScoreValueToEarn" });
                  formValid = false;
               }
            }
            else if (scoreType == "Standard") {
               checkEarnValueMinimum = $("#badgeRulesAdmin_MinimumStandardValueToEarn", element).val();
               checkEarnValueMaximum = $("#badgeRulesAdmin_MaximumStandardValueToEarn", element).val();
               if (checkEarnValueMinimum == null || checkEarnValueMinimum == "") {
                  errorMessages.push({ message: "Standard Value (Minimum) is Required.", fieldclass: "", fieldid: "badgeRulesAdmin_MinimumStandardValueToEarn" });
                  formValid = false;
               }
               if (checkEarnValueMaximum == null || checkEarnValueMaximum == "") {
                  errorMessages.push({ message: "Standard Value (Maximum) is Required.", fieldclass: "", fieldid: "badgeRulesAdmin_MaximumStandardValueToEarn" });
                  formValid = false;
               }
            }
            else if (scoreType == "Total") {
               checkEarnValueTotal = $("#badgeRulesAdmin_MinimumRawSumToEarn", element).val();
               if (checkEarnValueTotal == null || checkEarnValueTotal == "") {
                  errorMessages.push({ message: "Total Value is Required.", fieldclass: "", fieldid: "badgeRulesAdmin_MinimumRawSumToEarn" });
                  formValid = false;
               }
            }

            if (formValid) {
               if (callback != null) {
                  callback();
               }
            } else {
               var messageString = "";
               if (errorMessages.length > 0) {
                  messageString += "<i class=\"fas fa-exclamation-triangle text-red\"></i> <strong>Correct the following errors:</strong> <ul>";
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
                  $("#addBadgeRuleErrorHolder", element).html(messageString);
                  ShowErrorInformation("#addBadgeRuleErrorHolder");
               }
            }
         }
         function SaveAddRuleForm(callback) {
            let badgeId = parseInt($("#addBadgeRuleBadgeId", element).val());
            let objectToSave = CollectBadgeRuleObject(-1, badgeId);
            SaveRule(objectToSave, function () {
               if (callback != null) {
                  callback();
               }
            });
         }
         function ValidateUpdateRuleForm(badgeRuleId, callback) {
            $("#badgeRuleEditorForm_ErrorHolder_" + badgeRuleId, element).empty();
            let formValid = true;
            let errorMessages = [];
            let kpiToEarn = $("#badgeRuleEditorForm_BadgeAssignedKpi_" + badgeRuleId, element).val();
            let scoreType = $("#badgeRuleEditorForm_BadgeScoreType_" + badgeRuleId, element).val();
            let checkEarnValueMinimum = -1;
            let checkEarnValueMaximum = -1;
            let checkEarnValueTotal = -1;

            if (kpiToEarn == null || kpiToEarn == "") {
               errorMessages.push({ message: "Kpi is Required.", fieldclass: "", fieldid: "badgeRuleEditorForm_BadgeAssignedKpi_" + badgeRuleId });
               formValid = false;
            }
            if (scoreType == "Score") {
               checkEarnValueMinimum = $("#badgeRuleEditorForm_MinimumScoreValueToEarn_" + badgeRuleId, element).val();
               checkEarnValueMaximum = $("#badgeRuleEditorForm_MaximumScoreValueToEarn_" + badgeRuleId, element).val();
               if (checkEarnValueMinimum == null || checkEarnValueMinimum == "") {
                  errorMessages.push({ message: "Score Value (Minimum) is Required.", fieldclass: "", fieldid: "badgeRuleEditorForm_MinimumScoreValueToEarn_" + badgeRuleId });
                  formValid = false;
               }
               if (checkEarnValueMaximum == null || checkEarnValueMaximum == "") {
                  errorMessages.push({ message: "Score Value (Maximum) is Required.", fieldclass: "", fieldid: "badgeRuleEditorForm_MaximumScoreValueToEarn_" + badgeRuleId });
                  formValid = false;
               }
            }
            else if (scoreType == "Standard") {
               checkEarnValueMinimum = $("#badgeRuleEditorForm_MinimumStandardValueToEarn_" + badgeRuleId, element).val();
               checkEarnValueMaximum = $("#badgeRuleEditorForm_MaximumStandardValueToEarn_" + badgeRuleId, element).val();
               if (checkEarnValueMinimum == null || checkEarnValueMinimum == "") {
                  errorMessages.push({ message: "Standard Value (Minimum) is Required.", fieldclass: "", fieldid: "badgeRuleEditorForm_MinimumStandardValueToEarn_" + badgeRuleId });
                  formValid = false;
               }
               if (checkEarnValueMaximum == null || checkEarnValueMaximum == "") {
                  errorMessages.push({ message: "Standard Value (Maximum) is Required.", fieldclass: "", fieldid: "badgeRuleEditorForm_MaximumStandardValueToEarn_" + badgeRuleId });
                  formValid = false;
               }
            }
            else if (scoreType == "Total") {
               checkEarnValueTotal = $("#badgeRuleEditorForm_MinimumRawSumToEarn_" + badgeRuleId, element).val();
               if (checkEarnValueTotal == null || checkEarnValueTotal == "") {
                  errorMessages.push({ message: "Total Value is Required.", fieldclass: "", fieldid: "badgeRuleEditorForm_MinimumRawSumToEarn_" + badgeRuleId });
                  formValid = false;
               }
            }
            HideErrorInformation("#badgeRuleEditorForm_ErrorHolder_" + badgeRuleId);
            if (formValid) {
               if (callback != null) {
                  callback(true);
               }
            }
            else {
               var messageString = "";
               if (errorMessages.length > 0) {
                  messageString += "<i class=\"fas fa-exclamation-triangle text-red\"></i> <strong>Correct the following errors:</strong> <ul>";
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
                  $("#badgeRuleEditorForm_ErrorHolder_" + badgeRuleId, element).html(messageString);
                  ShowErrorInformation("#badgeRuleEditorForm_ErrorHolder_" + badgeRuleId);
               }
               else {
                  HideErrorInformation("#badgeRuleEditorForm_ErrorHolder_" + badgeRuleId);
               }
               if (callback != null) {
                  callback(false);
               }
            }
         }
         function UpdateBadgeRuleForm(badgeId, callback) {
            badgeId = parseInt(badgeId);
            let badgeRuleId = parseInt($("#badgeRuleEditorForm_BadgeRuleId_" + badgeId, element).val());
            if (badgeRuleId > 0) {
               ValidateUpdateRuleForm(badgeRuleId, function (validationStatus) {
                  if (validationStatus == true) {
                     let objectToSave = CollectBadgeRuleObject(badgeRuleId, badgeId);
                     SaveRule(objectToSave, function () {
                        if (callback != null) {
                           callback(validationStatus);
                        }
                     });
                  }
               });
            }
         }
         function DeleteBadgeRule(badgeRuleId, callback) {
            if (confirm("You are about to remove this rule for the badge.\nClick OK to continue with removal.")) {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "deleteBadgeRule",
                     badgeruleid: badgeRuleId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else {

                        if (callback != null) {
                           callback();
                        }
                        return;
                     }
                  }
               });
            }
            else {
               HideUserStatus();
            }
         }
         function SaveAllRules(callback) {
            let badgeIdsToSave = [];
            var allFormsValid = true;
            $("input[id^=badgeRuleEditorForm_BadgeRuleId_]", element).each(function () {
               let inputId = this.id;
               let badgeId = inputId.split("_")[2];
               badgeIdsToSave.push(badgeId);
            });
            for (let rc = 0; rc < badgeIdsToSave.length; rc++) {
               let badgeId = parseInt(badgeIdsToSave[rc]);
               let badgeRuleId = parseInt($("#badgeRuleEditorForm_BadgeRuleId_" + badgeId, element).val());
               if (badgeRuleId > 0) {
                  HideErrorInformation("#badgeRuleEditorForm_ErrorHolder_" + badgeRuleId);
                  ValidateUpdateRuleForm(badgeRuleId, function (isValid) {
                     let objectToSave = CollectBadgeRuleObject(badgeRuleId, badgeId);
                     allFormsValid = allFormsValid && isValid;
                     if (isValid == true) {
                        SaveRule(objectToSave);
                     }
                  });
               }
               if (rc + 1 >= badgeIdsToSave.length) {
                  HideUserStatus();
                  if (allFormsValid) {
                     if (callback != null) {
                        callback();
                     }
                  }
                  else {
                     WriteUserPopup("Save All Completed, but some items had errors and were not saved.", 5000);
                  }
               }
            }
         }
         function SaveRule(objectToSave, callback) {
            let isAddNew = (objectToSave.BadgeRuleId <= 0);
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "saveBadgeRule",
                  badgeRuleData: JSON.stringify(objectToSave)
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {

                     if (a$.ajaxerror) {
                        let messageText = "There was an error saving the rule information.";
                        if (jsonData.messageText != null) {
                           messageText = jsonData.messageText;
                        }
                        if (messageText != null && messageText != "") {
                           WriteAddRuleErrorMessage(messageText);
                        }
                        if (isAddNew) {
                           ShowErrorInformation("#addBadgeRuleErrorHolder");
                        }
                     }
                     else {
                        ClearAddRuleForm();
                        if (callback != null) {
                           callback();
                        }
                        return;
                     }
                  }
               }
            });
         }
         function CollectBadgeRuleObject(badgeRuleIdToCollect, badgeId, callback) {
            let assignedMqfNumber = null;
            let assignedSubKpiMqfNumber = null;
            let minimumScoreValueToEarn = null;
            let maximumScoreValueToEarn = null;
            let minimumStandardValueToEarn = null;
            let maximumStandardValueToEarn = null;
            let consecutiveMonthsToEarn = null;
            let consecutiveDaysToEarn = null;
            let minimumRawSumToEarn = null;
            let isProgressiveBadge = false;
            let maximumNumberOfBadgesPerUser = 1;
            let hasPoints = false;
            let pointsForBadgeAward = null;
            let entBy = legacyContainer.scope.TP1Username;
            let entDt = new Date().toLocaleDateString();
            let updBy = null;
            let updDt = null;

            let scoringType = $("input:radio[name=badgeRulesAdmin_ScoreType]:checked", element).val();
            if (badgeRuleIdToCollect == -1) {
               assignedMqfNumber = parseInt($("#badgeRulesAdmin_BadgeAssignedKpi", element).val());
               if (scoringType == "Standard") {
                  minimumStandardValueToEarn = $("#badgeRulesAdmin_MinimumStandardValueToEarn", element).val();
                  maximumStandardValueToEarn = $("#badgeRulesAdmin_MaximumStandardValueToEarn", element).val();
               }
               else if (scoringType == "Total") {
                  minimumRawSumToEarn = $("#badgeRulesAdmin_MinimumRawSumToEarn", element).val();
               }
               else {
                  minimumScoreValueToEarn = $("#badgeRulesAdmin_MinimumScoreValueToEarn", element).val();
                  maximumScoreValueToEarn = $("#badgeRulesAdmin_MaximumScoreValueToEarn", element).val();
               }
               consecutiveMonthsToEarn = parseInt($("#badgeRulesAdmin_ConsecutiveMonthsToEarn", element).val());
               //consecutiveDaysToEarn = parseInt($("#badgeRulesAdmin_ConsecutiveDaysToEarn", element).val());
               isProgressiveBadge = $("#badgeRulesAdmin_IsProgressiveBadge", element).is(":checked");
               maximumNumberOfBadgesPerUser = parseInt($("#badgeRulesAdmin_MaximumNumberOfBadgesPerUser", element).val());
               hasPoints = $("#badgeRulesAdmin_HasPoints", element).is(":checked");
               if (hasPoints == true) {
                  pointsForBadgeAward = parseInt($("#badgeRulesAdmin_PointsForBadgeAward").val());
               }

            }
            else {
               scoringType = $("#badgeRuleEditorForm_BadgeScoreType_" + badgeRuleIdToCollect, element).val();
               assignedMqfNumber = parseInt($("#badgeRuleEditorForm_BadgeAssignedKpi_" + badgeRuleIdToCollect, element).val());
               //assignedSubKpiMqfNumber = null;
               if (scoringType == "Standard") {
                  minimumStandardValueToEarn = $("#badgeRuleEditorForm_MinimumStandardValueToEarn_" + badgeRuleIdToCollect, element).val();
                  maximumStandardValueToEarn = $("#badgeRuleEditorForm_MaximumStandardValueToEarn_" + badgeRuleIdToCollect, element).val();
               }
               else if (scoringType == "Total") {
                  minimumRawSumToEarn = $("#badgeRuleEditorForm_MinimumRawSumToEarn_" + badgeRuleIdToCollect, element).val();
               }
               else {
                  minimumScoreValueToEarn = $("#badgeRuleEditorForm_MinimumScoreValueToEarn_" + badgeRuleIdToCollect, element).val();
                  maximumScoreValueToEarn = $("#badgeRuleEditorForm_MaximumScoreValueToEarn_" + badgeRuleIdToCollect, element).val();
               }
               consecutiveMonthsToEarn = $("#badgeRuleEditorForm_ConsecutiveMonthsToEarn_" + badgeRuleIdToCollect, element).val();
               //consecutiveDaysToEarn = $("#badgeRuleEditorForm_ConsecutiveDaysToEarn_" + badgeRuleIdToCollect, element).val();
               isProgressiveBadge = $("#badgeRuleEditorForm_IsProgressiveBadge_" + badgeRuleIdToCollect, element).is(":checked");
               maximumNumberOfBadgesPerUser = parseInt($("#badgeRuleEditorForm_MaximumNumberOfBadgesPerUser_" + badgeRuleIdToCollect, element).val());

               hasPoints = $("#badgeRuleEditorForm_HasPoints_" + badgeRuleIdToCollect, element).is(":checked");
               if (hasPoints == true) {
                  pointsForBadgeAward = parseInt($("#badgeRuleEditorForm_PointsForBadgeAward_" + badgeRuleIdToCollect, element).val());
               }
               updDt = new Date().toLocaleDateString();
               updBy = legacyContainer.scope.TP1Username;
            }
            let returnObject = new Object();

            returnObject.BadgeRuleId = badgeRuleIdToCollect;
            returnObject.BadgeId = badgeId;
            returnObject.AssignedMqfNumber = assignedMqfNumber;
            returnObject.AssignedSubKpiMqfNumber = assignedSubKpiMqfNumber;
            returnObject.MinimumScoreValueToEarn = minimumScoreValueToEarn;
            returnObject.MaximumScoreValueToEarn = maximumScoreValueToEarn;
            returnObject.MinimumStandardValueToEarn = minimumStandardValueToEarn;
            returnObject.MaximumStandardValueToEarn = maximumStandardValueToEarn;
            returnObject.ConsecutiveMonthsToEarn = consecutiveMonthsToEarn;
            returnObject.ConsecutiveDaysToEarn = consecutiveDaysToEarn;
            returnObject.MinimumRawSumToEarn = minimumRawSumToEarn;
            returnObject.IsProgressiveBadge = isProgressiveBadge;
            returnObject.MaximumNumberOfBadgesPerUser = maximumNumberOfBadgesPerUser;
            returnObject.HasPoints = hasPoints;
            returnObject.PointsForBadgeAward = pointsForBadgeAward;
            returnObject.EntBy = entBy;
            returnObject.EntDt = entDt;
            returnObject.UpdBy = updBy;
            returnObject.UpdDt = updDt;

            return returnObject;
         }
         function ResetFilters(callback) {
            $("#badgeRulesManager_groupFilter", element).val("");
            $("#badgeRulesManager_kpiFilter", element).val("");

            if (callback != null) {
               callback();
            }
            return;
         }
         function WriteUserStatus(message, displayForTiming, callback) {
            HideUserStatus();
            $("#UI_loadingText", element).empty();
            $("#UI_loadingText", element).html(message);

            if (displayForTiming == null) {
               displayForTiming = 60000; //display for 1 minute as a default.
            }
            ShowUserStatus(displayForTiming);
            if (callback != null) {
               callback();
            }
         }
         function WriteAddRuleErrorMessage(messageInformation) {
            $("#addBadgeRuleErrorHolder", element).empty();
            $("#addBadgeRuleErrorHolder", element).html(messageInformation);
            ShowErrorInformation("#addBadgeRuleErrorHolder");
         }
         function HideAddRuleForm() {
            $("#badgeRulesAdmin_AddBadgeRuleForm", element).hide();
         }
         function ShowAddRuleForm() {
            $("#badgeRulesAdmin_AddBadgeRuleForm", element).show();
         }
         function HideScoreValuesOptions() {
            $("#badgeRulesAdminForm_ScoreHolder", element).hide();
         }
         function ShowScoreValuesOptions() {
            $("#badgeRulesAdminForm_ScoreHolder", element).show();
         }
         function HideStandardValuesOptions() {
            $("#badgeRulesAdminForm_StandardHolder", element).hide();
         }
         function ShowStandardValuesOptions() {
            $("#badgeRulesAdminForm_StandardHolder", element).show();
         }
         function HideTotalValueOptions() {
            $("#badgeRulesAdminForm_TotalHolder", element).hide();
         }
         function ShowTotalValueOptions() {
            $("#badgeRulesAdminForm_TotalHolder", element).show();
         }
         function ShowUserStatus(displayTiming) {
            var currentDisplayStatus = $("#userInformationDisplay", element).css("display");

            if (currentDisplayStatus == "none") {
               $("#userInformationDisplay", element).show();
               if (displayTiming != null) {
                  window.setTimeout(function () {
                     HideUserStatus();
                  }, displayTiming);
               }
            }
         }
         function HideUserStatus() {
            var currentDisplayStatus = $("#userInformationDisplay", element).css("display");
            if (currentDisplayStatus != "none") {
               $("#userInformationDisplay", element).hide();
            }
         }
         function WriteUserPopup(message, displayTiming, classesToApply) {
            $("#userPopup_Message", element).empty();
            $("#userPopup_Message", element).append(message);
            let baseClass = "";
            if ($("#badgeRulesAdmin_UserPopup", element).attr("baseclass") != null && $("#badgeRulesAdmin_UserPopup", element).attr("baseclass") != "") {
               baseClass = $("#badgeRulesAdmin_UserPopup", element).attr("baseclass");
            }

            if (classesToApply != null) {
               let classes = [];
               classes = classesToApply.split(",");
               if (baseClass != null && baseClass != "") {
                  classes.push(baseClass);
               }
               $("#badgeRulesAdmin_UserPopup", element).removeClass();
               for (let cc = 0; cc < classes.length; cc++) {
                  $("#badgeRulesAdmin_UserPopup", element).addClass(classes[cc]);
               }
            }
            if (displayTiming == null) {
               displayTiming = 10000; //10 seconds
            }
            ShowUserPopup();
            window.setTimeout(function () {
               HideUserPopup();
            }, displayTiming);

         }
         function ShowUserPopup() {
            $("#badgeRulesAdmin_UserPopup", element).show();
         }
         function HideUserPopup() {
            $("#badgeRulesAdmin_UserPopup", element).hide();
         }
         function HideErrorInformation(elementId) {
            if (elementId != null && elementId != "") {
               $(elementId, element).hide();
            }
            else {
               $(".error-information-holder", element).hide();
            }
         }
         function ShowErrorInformation(elementId) {
            if (elementId != null && elementId != "") {
               $(elementId, element).show();
            }
            else {
               $(".error-information-holder", element).show();
            }
         }
         scope.load = function () {
            scope.Initialize();
            $("#badgeRulesManager_groupFilter", element).off("change").on("change", function () {
               WriteUserStatus("Applying grouping filter...", 30000);
               LoadBadgeRules(function () {
                  RenderBadgeRules();
                  HideUserStatus();
               });
            });
            $("#badgeRulesManager_kpiFilter", element).off("change").on("change", function () {
               WriteUserStatus("Applying KPI filter...", 30000);
               LoadBadgeRules(function () {
                  RenderBadgeRules();
                  HideUserStatus();
               });
            });
            $("#btnAddBadgeRule", element).off("click").on("click", function () {
               ValidateAddRuleForm(function () {
                  SaveAddRuleForm(function () {
                     WriteUserPopup("Rule Added.", 10000, "user-popup-message,centerMe");
                     ClearAddRuleForm();
                     HideAddRuleForm();
                     LoadBadgeRules(function () {
                        RenderBadgeRules();
                     });
                     HideErrorInformation("#addBadgeRuleErrorHolder");
                  });
               });
            });
            $("#btnSaveAllRules", element).off("click").on("click", function () {
               WriteUserStatus("Saving all rules information...", 30000);
               SaveAllRules(function () {
                  WriteUserPopup("All rules saved.", 2500);
                  LoadBadgeRules(function () {
                     RenderBadgeRules();
                     HideUserStatus();
                  });
               });
            });
            $(".btn-close-rules", element).off("click").on("click", function () {
               ClearAddRuleForm(function () {
                  HideAddRuleForm();
                  HideErrorInformation("#addBadgeRuleErrorHolder");
               });
            });
            $("#badgeRulesAdmin_ScoreType", element).off("change").on("change", function () {
               HandleScoreTypeForAddForm();
            });
            $(".user-popup-close", element).off("click").on("click", function () {
               HideUserPopup();
            });
            $("#badgeRulesManager_clearFilters", element).off("click").on("click", function () {
               ResetFilters(function () {
                  LoadBadgeRules(function () {
                     RenderBadgeRules();
                     HideUserStatus();
                  });
               });
            });
         };
         scope.load2 = function () {
            HideAll();
         }
         scope.load2();
         //scope.load();
         ko.postbox.subscribe("badgeRulesLoad", function () {
            scope.load();
         });
      }
   };
}]);