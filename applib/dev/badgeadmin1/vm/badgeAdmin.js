angularApp.directive("ngBadgeAdmin", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/BADGEADMIN1/view/badgeAdmin.htm?' + Date.now(),
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
         var baseClientBadgesUrl = window.location.protocol + "//" + window.location.hostname;
         var defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
         var defaultBadgeUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/badges/placeholder-badge.png";
         var defaultLoadingImage = a$.debugPrefix() + "/applib/css/images/acuity-loading.gif";
         var possibleBadges = [];
         var possibleKpiOptions = [];
         var maxBadgeLevel = 4; //TODO: Set this as a config parameter?
         var tempGroupingName = [];
         var possibleUploadedImages = [];
         var possibleBadgeRules = [];
         var clientUploadedImageKey = "/UPLOADS/";//TODO: Change to a config parameter

         scope.Initialize = function (callback) {
            $("#UI_loadingImage", element).attr("src", defaultLoadingImage);
            $("#badgeAdminForm_BadgeImagePreview", element).prop("src", defaultBadgeUrl);
            WriteUserStatus("Initializing Badge Manager...", 60000);
            $("#currentSorts", element).val("default");
            HideAll();
            LoadAvailableUploadedBadgeImages();
            LoadCurrentBadgeRules();
            LoadAvailableBadges(function () {
               LoadAvailableGroupingNames();
               LoadAvailableKpi();
            });
            LoadAvailableGroupingNames();
            LoadAvailableKpi();
            LoadFilterOptions(false);
            HideUserStatus();
            if (callback != null) {
               callback();
            }
            return;
         }

         function HideAll(callback) {
            HideAddBadgePanel();
            HideImageManager();
            HideGroupingNameAddManager();
            HideConsecutiveDaysHolder();
            HideScoreValueHolder();
            HideStandardValueHolder();
            HideTotalValueHolder();
            if (callback != null) {
               callback();
            }
            return;
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
               $("#badgeAdmin_GroupNameFilter", element).empty();
               $("#badgeAdmin_GroupNameFilter", element).append($("<option value=\"\">Select Category</option>"));

               for (let bc = 0; bc < badgesToLoad.length; bc++) {
                  let badge = badgesToLoad[bc];
                  let groupingName = badge.BadgeGroupingName;
                  let exists = false;
                  exists = ($("#badgeAdmin_GroupNameFilter option", element).filter(function (i, o) { return o.value === groupingName; }).length > 0);
                  if (exists != true) {
                     let listItem = $("<option />");
                     listItem.val(groupingName);
                     listItem.text(groupingName);
                     $("#badgeAdmin_GroupNameFilter", element).append(listItem);
                  }
               }
            }
            $("#badgeAdmin_BadgeLevelFilter", element).empty();
            $("#badgeAdmin_BadgeLevelFilter", element).append($("<option value=\"\">Select Badge Level</option>"));
            $("#badgeAdminForm_BadgeLevel", element).empty();
            $("#badgeAdminForm_BadgeLevel", element).append($("<option value=\"\">Select Badge Level</option>"));

            for (let blc = 1; blc <= maxBadgeLevel; blc++) {
               let listItem = $("<option />");
               let managerListItem = $("<option />");
               listItem.val(blc);
               listItem.text(blc);
               managerListItem.val(blc);
               managerListItem.text(blc);
               $("#badgeAdmin_BadgeLevelFilter", element).append(listItem);
               $("#badgeAdminForm_BadgeLevel", element).append(managerListItem);
            }

            if (possibleKpiOptions.length > 0) {
               $("#badgeAdmin_RelatedKpiFilter", element).empty();
               $("#badgeAdmin_RelatedKpiFilter", element).append($("<option value=\"\">Select KPI</option>"));
               $("#badgeAdminForm_RelatedMqfNumber", element).empty();
               $("#badgeAdminForm_RelatedMqfNumber", element).append($("<option value=\"\">Select KPI</option>"));
               $("#badgeAdminForm_BadgeAssignedKpi", element).empty();
               $("#badgeAdminForm_BadgeAssignedKpi", element).append($("<option value=\"\">Select KPI</option>"));

               for (let kc = 0; kc < possibleKpiOptions.length; kc++) {
                  let kpiObject = possibleKpiOptions[kc];
                  let listItem = $("<option />");
                  let formListItem = $("<option />");
                  let rulesListItem = $("<option />");
                  listItem.val(kpiObject.MqfNumber);
                  listItem.text(kpiObject.Text);
                  formListItem.val(kpiObject.MqfNumber);
                  formListItem.text(kpiObject.Text);
                  rulesListItem.val(kpiObject.MqfNumber);
                  rulesListItem.text(kpiObject.Text);

                  $("#badgeAdmin_RelatedKpiFilter", element).append(listItem);
                  $("#badgeAdminForm_RelatedMqfNumber", element).append(formListItem);
                  $("#badgeAdminForm_BadgeAssignedKpi", element).append(rulesListItem);
               }
            }
         }
         function LoadBadgeData(callback) {
            LoadAvailableBadges(function (badgesToRender) {
               let activeStatus = $("#badgeAdmin_ActiveFilter", element).val();
               let filteredBadges = badgesToRender;
               if (activeStatus.toLowerCase() == "active") {
                  filteredBadges = badgesToRender.filter(b => b.IsActive == true);
               }
               else if (activeStatus.toLowerCase() == "inactive") {
                  filteredBadges = badgesToRender.filter(b => b.IsActive == false);
               }
               RenderBadgeData(filteredBadges);
               $("#badgeFoundCounter", element).empty();
               $("#badgeFoundCounter", element).append(filteredBadges.length);
            });
            if (callback != null) {
               callback();
            }
            return;
         }
         function LoadAvailableBadges(callback) {
            let nameFilter = $("#badgeAdmin_BadgeNameFilter", element).val();
            let groupingNameFilter = $("#badgeAdmin_GroupNameFilter", element).val();
            let relatedKpiFilter = $("#badgeAdmin_RelatedKpiFilter", element).val();
            let relatedSubKpiFilter = $("#badgeAdmin_RelatedSubKpiFilter", element).val();
            let badgeLevelFilter = $("#badgeAdmin_BadgeLevelFilter", element).val();
            if (nameFilter == null) {
               nameFilter = "";
            }
            if (groupingNameFilter == null) {
               groupingNameFilter = "";
            }
            if (relatedKpiFilter == null || relatedKpiFilter == "") {
               relatedKpiFilter = -1;
            }
            if (relatedSubKpiFilter == null || relatedSubKpiFilter == "") {
               relatedSubKpiFilter = -1;
            }
            if (badgeLevelFilter == null || badgeLevelFilter == "") {
               badgeLevelFilter = -1;
            }
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "getAllAvailableBadgesFiltered",
                  deepLoad: true,
                  namefilter: nameFilter,
                  groupingnamefilter: groupingNameFilter,
                  relatedkpifilter: relatedKpiFilter,
                  relatedsubkpifilter: relatedSubKpiFilter,
                  badgelevelfilter: badgeLevelFilter
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
                     HideUserStatus();
                     if (callback != null) {
                        callback(returnData);
                     }
                     return;
                  }
               }
            });
         }

         function LoadCurrentBadgeRules(callback) {
            let groupingName = $("#badgeAdmin_GroupNameFilter", element).val();
            let mqfNumber = $("#badgeAdmin_RelatedKpiFilter", element).val();
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
         function LoadAvailableGroupingNames(callback) {
            let activeOnly = $("#badgeAdmin_ActiveOnly", element).is(":checked");
            $("#badgeAdmin_GroupNameFilter", element).empty();
            $("#badgeAdmin_GroupNameFilter", element).append($("<option value=\"\">Select Category</option>"));
            $("#badgeAdminForm_BadgeGroupingName", element).empty();
            $("#badgeAdminForm_BadgeGroupingName", element).append($("<option value=\"\">Select Category</option>"));

            if (possibleBadges.length > 0) {
               let badgesToLoad = possibleBadges;
               if (activeOnly) {
                  badgesToLoad = possibleBadges.filter(x => x.IsActive == true);
               }

               for (let bc = 0; bc < badgesToLoad.length; bc++) {
                  let badge = badgesToLoad[bc];
                  let groupingName = badge.BadgeGroupingName;
                  let exists = false;
                  exists = ($("#badgeAdmin_GroupNameFilter option", element).filter(function (i, o) { return o.value === groupingName; }).length > 0);
                  if (exists != true) {
                     let listItem = $("<option />");
                     listItem.val(groupingName);
                     listItem.text(groupingName);
                     let managerListItem = $("<option />");
                     managerListItem.val(groupingName);
                     managerListItem.text(groupingName);
                     $("#badgeAdmin_GroupNameFilter", element).append(listItem);
                     $("#badgeAdminForm_BadgeGroupingName", element).append(managerListItem);
                  }
               }
               if (tempGroupingName.length > 0) {
                  for (let tgnc = 0; tgnc < tempGroupingName.length; tgnc++) {
                     let groupingName = tempGroupingName[tgnc];
                     let exists = false;
                     exists = ($("#badgeAdminForm_BadgeGroupingName option", element).filter(function (i, o) { return o.value === groupingName; }).length > 0);
                     if (exists != true) {
                        let listItem = $("<option />");
                        listItem.val(tempGroupingName[tgnc]);
                        listItem.text(tempGroupingName[tgnc]);
                        $("#badgeAdminForm_BadgeGroupingName", element).append(listItem);
                     }
                  }
               }
            }
            if (callback != null) {
               callback();
            }
            return;
         }
         function LoadAvailableKpi(callback) {
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
         function LoadAvaiableSubKpi(callback) {
            if (callback != null) {
               callback();
            }
            return;
         }
         function LoadAvailableUploadedBadgeImages(callback) {
            let badgeTypeId = 2; //TODO: Handle this as enum?
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserv",
                  cmd: "getAllAvailableUploadImagesByImageType",
                  imagetypeid: badgeTypeId,
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
                     if (jsonData.uploadedImagesList != null) {
                        returnData = JSON.parse(jsonData.uploadedImagesList);
                        possibleUploadedImages.length = 0;
                        possibleUploadedImages = returnData;
                     }
                     if (callback != null) {
                        callback(returnData);
                     }
                     return;
                  }
               }
            });
         }
         function LoadImageManagerBadgeList(listToRender, callback) {
            if (listToRender == null) {
               listToRender = possibleUploadedImages;
            }
            let currentlySetImageName = $("#badgeAdminForm_ImageUrl", element).val();
            $("#badgeImageManagement_ImageOptionHolder", element).empty();
            listToRender = SortPossibleImageOptionsList(listToRender);
            for (let i = 0; i < listToRender.length; i++) {
               let previewImageHolder = $("<div class=\"badge-preview-image-holder preview-item\" />");
               let uploadImage = listToRender[i];
               let fileDisplayName = "";
               let fullFileName = "placeholder-badge.png";
               let fileName = -1;
               let itemId = 0;
               let imageSource = baseBadgesUrl + fullFileName;
               let clientOption = "";
               if (uploadImage != null) {
                  fileDisplayName = uploadImage.Name;
                  fullFileName = uploadImage.ImageUrl;
                  itemId = uploadImage.UploadedImageId;
                  if (uploadImage.Client !== 0) {
                     imageSource = baseClientBadgesUrl + fullFileName;
                     clientOption = "CO";
                  }
                  else {
                     imageSource = baseBadgesUrl + fullFileName;
                  }
               }
               let imageOptionItem = $("<img class=\"badge-preview-image\" previewItem=\"previewImageOption\" clientOption=\"" + clientOption + "\"  id=\"imageOption" + clientOption + itemId + "\" alt=\"" + fileDisplayName + "\" />");

               if (fileName == currentlySetImageName) {
                  previewImageHolder.addClass("badge-preview-image-selected");
               }
               imageOptionItem.prop("src", imageSource);
               imageOptionItem.off("click").on("click", function () {
                  let itemId = this.id;
                  PreviewImageSelected(itemId, imageSource, uploadImage.UploadedImageId, "previewImageOption");
               });

               let previewImageName = $("<div class=\"badge-preview-image-name\" />");
               previewImageName.append(fileDisplayName);

               previewImageHolder.append(imageOptionItem);
               previewImageHolder.append(previewImageName);

               $("#badgeImageManagement_ImageOptionHolder", element).append(previewImageHolder);
               //$("#badgeImageManagement_ImageOptionHolder", element).append(imageOptionItem);
            }
            if (callback != null) {
               callback();
            }
            return;
         }
         function MarkCurrentImage(currentUrl) {

            let currentUploadedImageId = 0;
            let item = possibleUploadedImages.find(i => i.ImageUrl == currentUrl);
            let imageSource = "placeholder-badge.png";
            if (item != null) {
               currentUploadedImageId = item.UploadedImageId;
               imageSource = item.ImageUrl;
            }
            let imageOptionName = "imageOption" + currentUploadedImageId;
            if (imageSource.toUpperCase().includes(clientUploadedImageKey.toUpperCase())) {
               imageOptionName = "imageOptionCO" + currentUploadedImageId;
            }
            PreviewImageSelected(imageOptionName, imageSource, currentUploadedImageId, "previewImageOption");
         }
         function PreviewImageSelected(itemId, fullSourcePath, imageId, propertyName) {
            let htmlObject = $("#" + itemId, element);
            let isClientOption = false;
            if (htmlObject != null) {
               let clientAttr = $(htmlObject, element).attr("clientOption");
               if (clientAttr != null && clientAttr.toString() != "") {
                  isClientOption = true;
               }
            }

            $(".badge-preview-image-holder").each(function () {
               $(this).removeClass("badge-preview-image-selected");
            });
            $("#selectedImageFileName", element).val(imageId);
            let filePath = "placeholder-badge.png"
            let image = null;
            if (isClientOption == true) {
               image = possibleUploadedImages.find(x => x.UploadedImageId == imageId && x.Client !== 0);
            }
            else {
               image = possibleUploadedImages.find(x => x.UploadedImageId == imageId);
            }
            if (image != null) {
               filePath = image.ImageUrl;
            }
            $("#selectedImagePath", element).val(filePath);
            $("#" + itemId, element).parent().addClass("badge-preview-image-selected");
            ScrollToSelectedImage(itemId);
         }
         function ScrollToSelectedImage(imageOptionId, callback) {
            let scrollTopValue = 0;
            let divHolderPosition = $("#badgeImageManagement_ImageOptionHolder").offset();
            let itemPosition = $("#" + imageOptionId, $("#badgeImageManagement_ImageOptionHolder", element)).offset();
            if (itemPosition != null && divHolderPosition != null) {
               scrollTopValue = itemPosition.top - (divHolderPosition.top + 50);
            }
            $("#badgeImageManagement_ImageOptionHolder").animate({ scrollTop: scrollTopValue }, "slow");

            if (callback != null) {
               callback();
            }
         }
         function ClearImageManagerForm(callback) {
            $("#selectedImageFileName", element).val(0);
            $("#selectedImagePath", element).val("");
            if (callback != null) {
               callback();
            }
            return;
         }
         function SetCurrentImageUrlForBadge(callback) {
            let currentSelectedImageUrl = "";
            currentSelectedImageUrl = $("#selectedImagePath", element).val();
            $("#badgeAdminForm_ImageUrl", element).val(currentSelectedImageUrl);
            let fullImageUrl = "";
            if (currentSelectedImageUrl.toUpperCase().includes(clientUploadedImageKey.toUpperCase()) == true) {
               fullImageUrl = baseClientBadgesUrl + currentSelectedImageUrl;
            }
            else {
               fullImageUrl = baseBadgesUrl + currentSelectedImageUrl;
            }
            $("#badgeAdminForm_BadgeImagePreview", element).prop("src", fullImageUrl);
            if (callback != null) {
               callback();
            }
            return;
         }
         function RenderBadgeData(badgeList) {
            WriteUserStatus("Drawing badge data...", 60000);
            let badgeInformationHolder = $("<div class=\"badge-list-information-holder\" />");
            badgeInformationHolder.append("No Badges Found.");
            if (badgeList != null && badgeList.length > 0) {
               badgeInformationHolder.empty();

               for (let bc = 0; bc < badgeList.length; bc++) {
                  let badgeItem = badgeList[bc];
                  RenderBadgeItem(badgeItem, badgeInformationHolder);
               }
            }
            else {
               badgeInformationHolder.addClass("no-badge-information");
            }
            $("#badgeAdmin_BadgeListHolder", element).empty();
            $("#badgeAdmin_BadgeListHolder", element).append(badgeInformationHolder);
            HideUserStatus();
         }
         function RenderBadgeItem(itemToRender, objectToAddTo) {
            let badgeDataHolder = $("<div class=\"badge-row-item-holder\" />");
            if (itemToRender.IsActive == false) {
               badgeDataHolder.addClass("inactive-badge-row");
            }
            let badgeItem = $(itemToRender)[0];
            let badgeImageHolder = $("<div class=\"badge-item-holder badge-image\"/>");
            let badgeImage = $("<img />");
            let badgeNameHolder = $("<div class=\"badge-item-holder badge-name\" />");
            let badgeDescHolder = $("<div class=\"badge-item-holder badge-desc\" />");
            let badgeGroupNameHolder = $("<div class=\"badge-item-holder badge-group-name\" />");
            let badgeRelatedKpiHolder = $("<div class=\"badge-item-holder related-kpi\" />");
            let badgeLevelHolder = $("<div class=\"badge-item-holder badge-level\" />");
            let badgeButtonHolder = $("<div class=\"badge-item-holder badge-button-holder\" />");
            let badgeActiveHolder = $("<div class=\"badge-item-holder badge-active\" />");
            BuildToggleSwitch(badgeItem, badgeActiveHolder);
            let badgeRuleRow = $("<div class=\"badge-rule-row\" />");
            let badgeRuleButton = $("<button title=\"Add or Edit Rules\" class=\"button btn btn-large btn-block badge-button\" id=\"EditRules_" + badgeItem.BadgeId + "\"><i class=\"fa fa-list\"></i> Rules</button>");
            let badgeRuleHolder = $("<div class=\"badge-item-holder badge-rule-holder\" />");
            BuildBadgeRuleInfo(badgeItem, badgeRuleHolder, badgeRuleButton);

            let canRemoveBadge = false;
            if (itemToRender.UsersEarnedBadgeCount != null && itemToRender.UsersEarnedBadgeCount <= 0) {
               canRemoveBadge = true;
            }
            let badgeName = "No Badge Name";
            let badgeImageUrl = "placeholder-badge.png";
            //let badgeEarnedDate = "";
            let badgeRelatedKpi = "Unassigned";
            let badgeRemoveButton = $("<button title=\"Delete Badge\" class=\"button button--red btn-block btn-large badge-button\" id=\"RemoveButton_" + badgeItem.BadgeId + "\"><i class=\"fa fa-trash\"></i></button>");

            badgeRemoveButton.off("click").on("click", function () {
               let buttonId = this.id;
               let id = buttonId.split("_")[1];
               RemoveBadge(id, function () {
                  WriteUserStatus("Reloading badge list...", 10000);
                  LoadBadgeData();
               });
            });
            let badgeEditButton = $("<button title=\"Edit Badge\" class=\"btn-large btn-block badge-button\" id=\"EditButton_" + badgeItem.BadgeId + "\"><i class=\"fa fa-edit\" /></button>");
            badgeEditButton.off("click").on("click", function () {
               let buttonId = this.id;
               let id = buttonId.split("_")[1];
               ShowTab("ALL");
               LoadEditorFormForBadge(id, function () {
                  LoadEditorTab(id, function () {
                     HideRulesContainerInEditor();
                     ShowBadgeEditorContainerInEditor();
                     ShowAddBadgePanel("badge");
                  });
               });
            });
            badgeRuleButton.off("click").on("click", function () {
               let buttonId = this.id;
               let id = buttonId.split("_")[1];
               ClearForm();
               ClearRulesForm();
               LoadEditorFormForBadge(id, function () {
                  LoadEditorTab(id, function () {
                     HideBadgeEditorContainerInEditor();
                     ShowRulesContainerInEditor();
                     ShowAddBadgePanel("rules");
                  });
               });
            });

            badgeName = badgeItem.BadgeName;
            if (badgeItem.ImageUrl != null && badgeItem.ImageUrl != "") {
               badgeImageUrl = badgeItem.ImageUrl;
            }
            if (badgeItem.BadgeDesc != null && badgeItem.BadgeDesc != "") {
               badgeDescHolder.append(badgeItem.BadgeDesc);
            }
            badgeNameHolder.append(badgeName);
            badgeNameHolder.append(badgeDescHolder);
            if (badgeItem.BadgeGroupingName != null && badgeItem.BadgeGroupingName != "") {
               badgeGroupNameHolder.append(badgeItem.BadgeGroupingName);
            }
            if (badgeItem.RelatedMqfNumber != null && badgeItem.RelatedMqfNumber > -1) {
               let kpiOption = possibleKpiOptions.find(k => k.MqfNumber == badgeItem.RelatedMqfNumber);
               if (kpiOption != null) {
                  badgeRelatedKpi = kpiOption.Text;
               }
            }
            badgeLevelHolder.append(badgeItem.BadgeLevel);
            let badgeImageSource = "";
            if (badgeImageUrl.toUpperCase().includes(clientUploadedImageKey.toUpperCase())) {
               badgeImageSource = baseClientBadgesUrl + badgeImageUrl;
            }
            else {
               badgeImageSource = baseBadgesUrl + badgeImageUrl;
            }
            badgeImage.prop("src", badgeImageSource);
            badgeImage.prop("title", badgeName);
            badgeImage.height(100);
            badgeImageHolder.append(badgeImage);

            badgeButtonHolder.append(badgeEditButton);
            if (canRemoveBadge == true) {
               badgeButtonHolder.append("&nbsp;");
               badgeButtonHolder.append(badgeRemoveButton);
            }


            badgeRuleRow.append(badgeRuleHolder);

            badgeRelatedKpiHolder.append(badgeRelatedKpi);

            badgeDataHolder.append(badgeImageHolder);
            badgeDataHolder.append(badgeNameHolder);
            badgeDataHolder.append(badgeGroupNameHolder);
            badgeDataHolder.append(badgeRelatedKpiHolder);
            badgeDataHolder.append(badgeLevelHolder);
            badgeDataHolder.append(badgeButtonHolder);
            badgeDataHolder.append(badgeActiveHolder);
            badgeDataHolder.append(badgeRuleRow);

            $(objectToAddTo).append(badgeDataHolder);
         }
         function BuildToggleSwitch(badgeItem, objectToAddInfoTo) {
            if (badgeItem != null) {
               let toggleHolder = $("<div class=\"toggle-button-cover\" />")
               let buttonCover = $("<div class=\"button-cover\" />")
               let buttonHolder = $("<div class=\"button r\" id=\"toggleBadgeToggler_" + badgeItem.BadgeId + "\" />")
               let isActiveInput = $("<input type=\"checkbox\" class=\"checkbox\" id=\"toggleActiveBadge_" + badgeItem.BadgeId + "\" />")
               isActiveInput.prop("checked", badgeItem.IsActive);

               isActiveInput.off("change").on("change", function () {
                  let id = this.id;
                  let badgeId = id.split("_")[1];
                  ToggleBadgeStatus(badgeId, function () {
                     LoadBadgeData();
                  });
               });
               buttonHolder.append(isActiveInput);

               buttonHolder.append($("<div class=\"knobs\" />"));
               buttonHolder.append($("<div class=\"layer\" />"));

               buttonCover.append(buttonHolder);

               toggleHolder.append(buttonCover);

               $(objectToAddInfoTo).append(toggleHolder);

            }
         }
         function ToggleBadgeStatus(badgeId, callback) {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserv",
                  cmd: "toggleActiveStatus",
                  badgeid: badgeId
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
         function BuildBadgeRuleInfo(badgeItem, objectToAddRulesTo, badgeRuleButton) {
            let ruleButtonText = "Edit";
            if (badgeItem != null) {
               let badgeRule = badgeItem.BadgeRule;

               if (badgeItem.BadgeRule != null) {
                  badgeRule = badgeItem.BadgeRule;
               }
               else {
                  badgeRule = possibleBadgeRules.find(br => br.BadgeId == badgeItem.BadgeId);
                  if (badgeRule == null) {
                     badgeRule = GetBadgeRulesForBadge(badgeItem.BadgeId);
                  }
               }

               if (badgeRule != null) {
                  let badgeRulesHolder = $("<div class=\"badgeRulesHolder-box\" />");

                  let badgeRuleEarnedHolder = $("<div />");
                  let badgeRuleConsecutiveEarnHolder = $("<div />");
                  let badgeRuleIsProgressiveBadgeHolder = $("<div />");
                  let badgeRuleMaximumUserCanEarnHolder = $("<div />");
                  let badgeRulePointsAwardedHolder = $("<div />");

                  let isTotalScoreRule = false;

                  let earnedRuleText = "{0} Value between <span class=\"rule-value\">{1}</span> and <span>{2}</span>";
                  let totalRuleText = "{0} Value of at least <span class=\"rule-value\">{1}</span>";

                  let consecutiveTimeText = "Earn after scoring for <span class=\"rule-value\">{0}</span> <span class=\"rule-value\">{1}</span>";
                  let progressiveText = "Is Badge Progressive? <span class=\"rule-value\">{0}</span>";
                  let maxBadgePerUserText = "Max Badges that a User can Earn: <span class=\"rule-value\">{0}</span>";
                  let pointsText = "Credits Awarded for earning badge: <span class=\"rule-value\">{0}</span>";

                  let scoringType = "Scored";
                  let minimumValue = "";
                  let maximumValue = "";
                  let totalValue = "";
                  let consecutiveTimeValue = "";
                  let consecutiveTimeTiming = "";
                  let isProgressiveBadge = "Yes";
                  let maxBadgeCountForUser = badgeRule.MaximumNumberOfBadgesPerUser;
                  let pointsEarnedValue = badgeRule.PointsForBadgeAward;

                  if (badgeRule.IsProgressiveBadge == false) {
                     isProgressiveBadge = "No";
                  }

                  if (badgeRule.MinimumScoreValueToEarn != null) {
                     minimumValue = badgeRule.MinimumScoreValueToEarn;
                     scoringType = "Scored";
                  }
                  else if (badgeRule.MinimumStandardValueToEarn != null) {
                     minimumValue = badgeRule.MinimumStandardValueToEarn;
                     scoringType = "Standard";
                  }
                  else if (badgeRule.MinimumRawSumToEarn != null) {
                     totalValue = badgeRule.MinimumRawSumToEarn;
                     scoringType = "Total";
                     isTotalScoreRule = true;
                  }

                  if (badgeRule.MaximumScoreValueToEarn != null) {
                     maximumValue = badgeRule.MaximumScoreValueToEarn;
                     scoringType = "Scored";
                  }
                  else if (badgeRule.MaximumStandardValueToEarn != null) {
                     maximumValue = badgeRule.MaximumStandardValueToEarn;
                     scoringType = "Standard";
                  }

                  earnedRuleText = earnedRuleText.replace("{0}", scoringType);
                  earnedRuleText = earnedRuleText.replace("{1}", minimumValue);
                  earnedRuleText = earnedRuleText.replace("{2}", maximumValue);

                  totalRuleText = totalRuleText.replace("{0}", scoringType);
                  totalRuleText = totalRuleText.replace("{1}", totalValue);

                  if (badgeRule.ConsecutiyveDaysToEarn != null && badgeRule.ConsecutiyveDaysToEarn > 0) {
                     consecutiveTimeTiming = "day(s)";
                     consecutiveTimeValue = badgeRule.ConsecutiyveDaysToEarn;
                  }
                  else if (badgeRule.ConsecutiveMonthsToEarn != null && badgeRule.ConsecutiveMonthsToEarn > 0) {
                     consecutiveTimeTiming = "months(s)";
                     consecutiveTimeValue = badgeRule.ConsecutiveMonthsToEarn;
                  }
                  else {
                     consecutiveTimeText = "Time requirements to earn not set.";
                  }
                  consecutiveTimeText = consecutiveTimeText.replace("{0}", consecutiveTimeValue);
                  consecutiveTimeText = consecutiveTimeText.replace("{1}", consecutiveTimeTiming);

                  progressiveText = progressiveText.replace("{0}", isProgressiveBadge);
                  maxBadgePerUserText = maxBadgePerUserText.replace("{0}", maxBadgeCountForUser);

                  if (badgeRule.HasPoints == false) {
                     pointsEarnedValue = 0;
                  }
                  pointsText = pointsText.replace("{0}", pointsEarnedValue);
                  let toEarnRule = earnedRuleText;
                  if (isTotalScoreRule == true) {
                     toEarnRule = totalRuleText;
                  }

                  badgeRuleEarnedHolder.append(toEarnRule);
                  badgeRuleConsecutiveEarnHolder.append(consecutiveTimeText);
                  badgeRuleIsProgressiveBadgeHolder.append(progressiveText);
                  badgeRuleMaximumUserCanEarnHolder.append(maxBadgePerUserText);
                  badgeRulePointsAwardedHolder.append(pointsText);

                  $(badgeRulesHolder).append(badgeRuleEarnedHolder);
                  $(badgeRulesHolder).append(badgeRuleConsecutiveEarnHolder);
                  $(badgeRulesHolder).append(badgeRuleIsProgressiveBadgeHolder);
                  $(badgeRulesHolder).append(badgeRuleMaximumUserCanEarnHolder);
                  $(badgeRulesHolder).append(badgeRulePointsAwardedHolder);

                  $(objectToAddRulesTo).append(badgeRulesHolder);
               }
               else {
                  ruleButtonText = "Add";
               }
            }
            $(badgeRuleButton).prop("title", ruleButtonText + " Rule");
         }
         function GetBadgeRulesForBadge(badgeId) {
            let returnData = null;
            if (possibleBadgeRules != null) {
               returnData = possibleBadgeRules.find(br => br.BadgeId == badgeId);
            }
            return returnData;

         }
         function HandleBadgeRuleScoreTypeChange(callback) {
            let scoreType = $("#badgeAdminForm_BadgeScoreType", element).val();
            HideTotalValueHolder();
            HideScoreValueHolder();
            HideStandardValueHolder();

            if (scoreType == "Standard") {
               ShowStandardValueHolder();
            }
            else if (scoreType == "Total") {
               ShowTotalValueHolder();
            }
            else {
               ShowScoreValueHolder();
            }

            if (callback != null) {
               callback();
            }
            return;
         }
         function LoadEditorFormForBadge(badgeId, callback) {
            if (possibleBadges.length == 0) {
               LoadAvailableBadges();
            }
            let badge = possibleBadges.find(b => b.BadgeId == badgeId);
            let badgeName = "";
            let badgeDesc = "";
            let groupingName = "";
            let badgeLevel = "";
            let badgeImageUrl = "";
            let isActive = false;
            let relatedMqfNumber = "";
            let relatedSubKpi = "";
            let previewUrl = baseBadgesUrl + "placeholder-badge.png";
            let usersEarnedCount = 0;

            if (badge != null) {
               badgeName = badge.BadgeName;
               badgeDesc = badge.BadgeDesc;
               groupingName = badge.BadgeGroupingName;
               badgeLevel = badge.BadgeLevel;
               if (badge.ImageUrl != null && badge.ImageUrl != "") {
                  badgeImageUrl = badge.ImageUrl;
                  if (badge.ImageUrl.toUpperCase().includes(clientUploadedImageKey.toUpperCase()) == true) {
                     previewUrl = baseClientBadgesUrl + badge.ImageUrl;
                  }
                  else {
                     previewUrl = baseBadgesUrl + badge.ImageUrl;
                  }

               }
               isActive = badge.IsActive;
               relatedMqfNumber = badge.RelatedMqfNumber;
               relatedSubKpi = badge.RelatedSubKpi;
               usersEarnedCount = badge.UsersEarnedBadgeCount;
            }
            $("#badgeAdminForm_BadgeId", element).val(badgeId);
            $("#badgeAdminForm_BadgeName", element).val(badgeName);
            $("#badgeAdminForm_BadgeDesc", element).val(badgeDesc);
            $("#badgeAdminForm_BadgeGroupingName", element).val(groupingName);
            $("#badgeAdminForm_BadgeLevel", element).val(badgeLevel);
            $("#badgeAdminForm_ImageUrl", element).val(badgeImageUrl);
            $("#badgeAdminForm_BadgeImagePreview", element).prop("src", previewUrl);
            $("#badgeAdminForm_IsActive", element).prop("checked", isActive);
            $("#badgeAdminForm_RelatedMqfNumber", element).val(relatedMqfNumber);
            $("#badgeAdminForm_RelatedSubKpi", element).val(relatedSubKpi);
            if (callback != null) {
               callback();
            }
            return;
         }
         function ValidateForm(callback) {
            $(".error-information-holder", element).empty();
            var formValid = true;
            let errorMessages = [];
            let badgeName = $("#badgeAdminForm_BadgeName", element).val();
            let groupingName = $("#badgeAdminForm_BadgeGroupingName", element).val();
            let badgeLevel = $("#badgeAdminForm_BadgeLevel", element).val();

            if (badgeName == null || badgeName == "") {
               errorMessages.push({ message: "Name is Required.", fieldclass: "", fieldid: "badgeAdminForm_BadgeName" });
               formValid = false;
            }
            if (groupingName == null || groupingName == "") {
               errorMessages.push({ message: "Grouping Name is Required.", fieldclass: "", fieldid: "badgeAdminForm_BadgeGroupingName" });
               formValid = false;
            }
            if (badgeLevel == null || badgeLevel == "") {
               errorMessages.push({ message: "Badge Level is Required.", fieldclass: "", fieldid: "badgeAdminForm_BadgeLevel" });
               formValid = false;
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

                  $(".error-information-holder", element).html(messageString);
                  ShowErrorInformation();
               }
            }
         }
         function WriteAddRuleErrorMessage(messageText) {
            let messageString = "";
            messageString += "<i class=\"fas fa-exclamation-triangle text-red\"></i> <strong>Correct the following errors:</strong> <ul>";
            messageString += "<li>" + messageText + "</li>";
            messageString += "</ul>";

            $(".error-information-holder", element).html(messageString);
         }
         function ValidateRulesForm(callback) {
            $(".error-information-holder", element).empty();
            var formValid = true;
            let errorMessages = [];
            let kpiToEarn = $("#badgeAdminForm_BadgeAssignedKpi", element).val();
            let scoreType = $("#badgeAdminForm_BadgeScoreType", element).val();
            let checkEarnValueMinimum = -1;
            let checkEarnValueMaximum = -1;
            let checkEarnValueTotal = -1;
            let hasPoints = $("#badgeAdminForm_HasPoints", element).is(":checked");
            let pointsForBadgeValue = $("#badgeAdminForm_PointsForBadgeAward", element).val();

            if (kpiToEarn == null || kpiToEarn == "") {
               errorMessages.push({ message: "Kpi is Required.", fieldclass: "", fieldid: "badgeAdminForm_BadgeAssignedKpi" });
               formValid = false;
            }
            if (scoreType == "Score") {
               checkEarnValueMinimum = $("#badgeAdminForm_MinimumScoreValueToEarn", element).val();
               checkEarnValueMaximum = $("#badgeAdminForm_MaximumScoreValueToEarn", element).val();
               if (checkEarnValueMinimum == null || checkEarnValueMinimum == "") {
                  errorMessages.push({ message: "Score Value (Minimum) is Required.", fieldclass: "", fieldid: "badgeAdminForm_MinimumScoreValueToEarn" });
                  formValid = false;
               }
               if (checkEarnValueMaximum == null || checkEarnValueMaximum == "") {
                  errorMessages.push({ message: "Score Value (Maximum) is Required.", fieldclass: "", fieldid: "badgeAdminForm_MaximumScoreValueToEarn" });
                  formValid = false;
               }
            }
            else if (scoreType == "Standard") {
               checkEarnValueMinimum = $("#badgeAdminForm_MinimumStandardValueToEarn", element).val();
               checkEarnValueMaximum = $("#badgeAdminForm_MaximumStandardValueToEarn", element).val();
               if (checkEarnValueMinimum == null || checkEarnValueMinimum == "") {
                  errorMessages.push({ message: "Standard Value (Minimum) is Required.", fieldclass: "", fieldid: "badgeAdminForm_MinimumStandardValueToEarn" });
                  formValid = false;
               }
               if (checkEarnValueMaximum == null || checkEarnValueMaximum == "") {
                  errorMessages.push({ message: "Standard Value (Maximum) is Required.", fieldclass: "", fieldid: "badgeAdminForm_MaximumStandardValueToEarn" });
                  formValid = false;
               }
            }
            else if (scoreType == "Total") {
               checkEarnValueTotal = $("#badgeAdminForm_MinimumRawSumToEarn", element).val();
               if (checkEarnValueTotal == null || checkEarnValueTotal == "") {
                  errorMessages.push({ message: "Total Value is Required.", fieldclass: "", fieldid: "badgeAdminForm_MinimumRawSumToEarn" });
                  formValid = false;
               }
            }

            if (hasPoints == true) {
               if (pointsForBadgeValue == null || pointsForBadgeValue == "") {
                  errorMessages.push({ message: "Credits Awarded required.", fieldclass: "", fieldid: "badgeAdminForm_PointsForBadgeAward" });
                  formValid = false;
               }
               else if (pointsForBadgeValue != null && (isNaN(pointsForBadgeValue) || pointsForBadgeValue == "")) {
                  errorMessages.push({ message: "Credits Awarded must be a numeric value.", fieldclass: "", fieldid: "badgeAdminForm_PointsForBadgeAward" });
                  formValid = false;
               }
            }

            if (formValid) {
               HideErrorInformation();
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

                  $(".error-information-holder", element).html(messageString);
                  ShowErrorInformation();
               }
            }
         }
         function SaveBadge(callback) {
            WriteUserStatus("Saving badge form...", 6000);
            ValidateForm(function () {
               SaveBadgeForm(function (badgeId) {
                  possibleBadges.length = 0;
                  ShowTab("badgeAdminFormTab_Rules");
                  let tabSelected = $("#badgeAdminForm_SelectedTab", element).val();
                  if (tabSelected.toLowerCase() == "rules") {
                     ValidateRulesForm(function () {
                        possibleBadgeRules.length = 0;
                        SaveBadgeRuleForm(function () {
                           LoadCurrentBadgeRules();
                           if (callback != null) {
                              HideUserStatus();
                              callback(badgeId);
                           }
                        });
                     });
                  }
                  else {
                     LoadEditorTab(badgeId);
                     HideUserStatus();
                  }
               });
            });
         }
         function SaveBadgeForm(callback) {
            let badgeDataToSave = new Object();
            let badgeId = -1;
            badgeId = $("#badgeAdminForm_BadgeId", element).val();
            if (badgeId == "" || Number.isNaN(badgeId)) {
               badgeId = -1;
            }
            badgeDataToSave.BadgeId = parseInt(badgeId);
            badgeDataToSave.BadgeName = $("#badgeAdminForm_BadgeName", element).val();
            badgeDataToSave.BadgeDesc = $("#badgeAdminForm_BadgeDesc", element).val();
            badgeDataToSave.BadgeGroupingName = $("#badgeAdminForm_BadgeGroupingName", element).val();
            badgeDataToSave.BadgeLevel = parseInt($("#badgeAdminForm_BadgeLevel", element).val());
            badgeDataToSave.ImageUrl = $("#badgeAdminForm_ImageUrl", element).val();
            let assignedMqfNumber = $("#badgeAdminForm_RelatedMqfNumber", element).val();
            if (assignedMqfNumber == null || assignedMqfNumber == "") {
               assignedMqfNumber = null;
            }
            else {
               assignedMqfNumber = parseInt(assignedMqfNumber);
            }
            badgeDataToSave.RelatedMqfNumber = assignedMqfNumber;
            badgeDataToSave.RelatedSubKpi = null;
            badgeDataToSave.isActive = $("#badgeAdminForm_IsActive", element).is(":checked");
            badgeDataToSave.EntDt = new Date();
            badgeDataToSave.EntBy = legacyContainer.scope.TP1Username;

            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "saveBadge",
                  badgeData: JSON.stringify(badgeDataToSave)
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  let badgeId = jsonData.badgeId;
                  $("#badgeAdminForm_BadgeId", element).val(badgeId);
                  if (callback != null) {
                     callback(badgeId);
                  }
                  return;
               }
            });
         }
         function SaveBadgeRuleForm(callback) {
            let badgeRuleDataToSave = new Object();
            let badgeId = $("#badgeAdminForm_BadgeId", element).val();
            let badgeRuleId = $("#badgeAdminForm_BadgeRuleId", element).val();
            if (badgeId != "" && !Number.isNaN(badgeId)) {
               badgeRuleDataToSave = CollectBadgeRuleObject(badgeRuleId, badgeId);
               SaveBadgeRule(badgeRuleDataToSave, function () {
                  if (callback != null) {
                     callback();
                  }
               });
            }
         }
         function SaveBadgeRule(ruleObjectToSave, callback) {
            let isAddNew = (ruleObjectToSave.BadgeRuleId <= 0);
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "saveBadgeRule",
                  badgeRuleData: JSON.stringify(ruleObjectToSave)
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == true) {
                     if (jsonData.messageText != null) {
                        let messageText = jsonData.messageText;
                        WriteAddRuleErrorMessage(messageText);
                     }
                     if (messageText != "") {
                        ShowErrorInformation();
                     }
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
         function CollectBadgeRuleObject(badgeRuleId, badgeId) {
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

            let scoringType = $("#badgeAdminForm_BadgeScoreType", element).val();
            let badgeRuleIdToCollect = badgeRuleId;
            if ((badgeRuleIdToCollect != null && Number.isNaN(badgeRuleIdToCollect) || badgeRuleIdToCollect == "")) {
               badgeRuleIdToCollect = -1;
            }

            assignedMqfNumber = parseInt($("#badgeAdminForm_BadgeAssignedKpi", element).val());
            if (scoringType == "Standard") {
               minimumStandardValueToEarn = $("#badgeAdminForm_MinimumStandardValueToEarn", element).val();
               maximumStandardValueToEarn = $("#badgeAdminForm_MaximumStandardValueToEarn", element).val();
            }
            else if (scoringType == "Total") {
               minimumRawSumToEarn = $("#badgeAdminForm_MinimumRawSumToEarn", element).val();
            }
            else {
               minimumScoreValueToEarn = $("#badgeAdminForm_MinimumScoreValueToEarn", element).val();
               maximumScoreValueToEarn = $("#badgeAdminForm_MaximumScoreValueToEarn", element).val();
            }
            consecutiveMonthsToEarn = parseInt($("#badgeAdminForm_ConsecutiveMonthsToEarn", element).val());
            consecutiveDaysToEarn = parseInt($("#badgeAdminForm_ConsecutiveDaysToEarn", element).val());
            isProgressiveBadge = $("#badgeAdminForm_IsProgressiveBadge", element).is(":checked");
            maximumNumberOfBadgesPerUser = parseInt($("#badgeAdminForm_MaximumBadgePerUser", element).val());
            if ((maximumNumberOfBadgesPerUser != null && maximumNumberOfBadgesPerUser != "") || Number.isNaN(maximumNumberOfBadgesPerUser)) {
               maximumNumberOfBadgesPerUser = 1;
            }
            hasPoints = $("#badgeAdminForm_HasPoints", element).is(":checked");
            if (hasPoints == true) {
               pointsForBadgeAward = parseInt($("#badgeAdminForm_PointsForBadgeAward").val());
            }

            if (badgeRuleIdToCollect > -1) {
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
         function RemoveBadge(badgeId, callback) {
            if (confirm("You are about to remove this badge.\nClick OK to continue with removal.")) {
               WriteUserStatus("Deleting badge...", 5000);
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "deleteBadge",
                     badgeid: badgeId
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

                        HideUserStatus();
                        if (callback != null) {
                           callback();
                        }
                        return;
                     }
                  }
               });
            }
         }
         function ClearForm(callback) {
            ResetErrorMessages();
            HideErrorInformation();

            $("#badgeAdminForm_BadgeId", element).val(-1);
            $("#badgeAdminForm_BadgeName", element).val("");
            $("#badgeAdminForm_BadgeDesc", element).val("");
            $("#badgeAdminForm_BadgeGroupingName", element).val("");
            $("#badgeAdminForm_BadgeLevel", element).val("");
            $("#badgeAdminForm_ImageUrl", element).val("");
            $("#badgeAdminForm_BadgeImagePreview", element).prop("src", baseBadgesUrl + "placeholder-badge.png");
            $("#badgeAdminForm_IsActive", element).prop("checked", false);
            $("#badgeAdminForm_RelatedMqfNumber", element).val("");
            $("#badgeAdminForm_RelatedSubKpi", element).val("");
            ClearRulesForm();

            if (callback != null) {
               callback();
            }
            return;
         }
         function ClearRulesForm(callback) {
            $("#badgeAdminForm_BadgeAssignedKpi", element).val("");
            $("#badgeAdminForm_BadgeAssignedKpi", element).prop("disabled", false);
            $("#badgeAdminForm_BadgeScoreType", element).val("Score");
            $("#badgeAdminForm_MinimumScoreValueToEarn", element).val("");
            $("#badgeAdminForm_MaximumScoreValueToEarn", element).val("");
            $("#badgeAdminForm_MinimumStandardValueToEarn", element).val("");
            $("#badgeAdminForm_MaximumStandardValueToEarn", element).val("");
            $("#badgeAdminForm_MinimumRawSumToEarn", element).val("");
            $("#badgeAdminForm_ConsecutiveMonthsToEarn", element).val("");
            $("#badgeAdminForm_ConsecutiveDaysToEarn", element).val("");
            $("#badgeAdminForm_IsProgressiveBadge", element).prop("checked", false);
            $("#badgeAdminForm_MaximumBadgePerUser", element).val("");
            $("#badgeAdminForm_HasPoints", element).prop("checked", false);
            $("#badgeAdminForm_PointsForBadgeAward", element).val("");
            $("#badgeAdminForm_BadgeRuleId", element).val(-1);

            if (callback != null) {
               callback();
            }
            return;
         }
         function SaveGroupingNameForm(callback) {
            let currentlyExists = false;
            let valueToAdd = $("#badgeAdminGroupingNameForm_GroupingName", element).val();
            if (valueToAdd != null && valueToAdd != "") {
               currentlyExists = (tempGroupingName.filter(gn => gn == valueToAdd).length > 0);
               if (currentlyExists == false) {
                  tempGroupingName.push(valueToAdd);
               }
            }
            ClearGroupingNameForm();
            if (callback != null) {
               callback(valueToAdd);
            }
            return;
         }
         function ClearGroupingNameForm(callback) {
            $("#badgeAdminGroupingNameForm_GroupingName", element).val("");
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
         function ResetErrorMessages() {
            $(".error-information-holder", element).empty();
            $(".errorField").each(function () {
               $(this).removeClass("errorField");
            });
         }
         function MarkActiveEditorTab(tabId) {
            let tabSelected = tabId.replace("badgeAdminFormTab_", "");
            $("#badgeAdminForm_SelectedTab", element).val(tabSelected.toLowerCase());
            $("div[id^='badgeAdminFormTab_']", element).each(function () {
               $(this).removeClass("active");
            });
            $("#" + tabId, element).addClass("active");
         }
         function ResetFilters(callback) {
            $("#badgeAdmin_BadgeNameFilter", element).val("");
            $("#badgeAdmin_GroupNameFilter", element).val("");
            $("#badgeAdmin_GroupNameFilter option[value='']", element).attr("selected", "selected");
            $("#badgeAdmin_BadgeLevelFilter", element).val("");
            $("#badgeAdmin_BadgeLevelFilter option[value='']", element).attr("selected", "selected");
            $("#badgeAdmin_RelatedKpiFilter", element).val("");
            $("#badgeAdmin_RelatedKpiFilter option[value='']", element).attr("selected", "selected");
            $("#badgeAdmin_ActiveFilter", element).val("All");
            $("#badgeAdmin_ActiveFilter option[value='All']", element).attr("selected", "selected");
            if (callback != null) {
               callback();
            }
            return;
         }
         function ShowAddBadgePanel(badgeName, callback) {
            let activeTabId = "badgeAdminFormTab_Badge";

            if (badgeName == null || badgeName == "") {
               badgeName = "badge";
            }
            if (badgeName == "rules") {
               activeTabId = "badgeAdminFormTab_Rules"
            }
            ShowTab(activeTabId);
            ShowEditorTab(badgeName, function () {
               MarkActiveEditorTab(activeTabId);
               HideGroupingNameAddManager();
               ShowAddGroupingButton();
               EnableSaveButton();
               $("#badgeFormHolder", element).show();
            });
            if (callback != null) {
               callback();
            }
            return;
         }
         function HideAddBadgePanel(callback) {
            $("#badgeFormHolder", element).hide();
            if (callback != null) {
               callback();
            }
            return;
         }
         function ShowImageManager(callback) {
            $("#badgeImageManagementHolder", element).show();
            if (callback != null) {
               callback();
            }
            return;
         }
         function HideImageManager(callback) {
            $("#badgeImageManagementHolder", element).hide();
            if (callback != null) {
               callback();
            }
            return;
         }
         function HideSelectImageButton() {
            $("#btnOpenImageManager", element).hide();
         }
         function ShowSelectImageButton() {
            $("#btnOpenImageManager", element).show();
         }
         function HideAddGroupingButton() {
            $("#btnOpenGroupingManager", element).hide();
         }
         function ShowAddGroupingButton() {
            $("#btnOpenGroupingManager", element).show();
         }
         function DisableSaveButton() {
            $("#btnSave", element).hide();
         }
         function EnableSaveButton() {
            $("#btnSave", element).show();
         }
         function ShowGroupingNameAddManager(callback) {
            $("#badgeAdmin_AddGroupingNameHolder", element).show();
            if (callback != null) {
               callback();
            }
            return;
         }
         function HideGroupingNameAddManager(callback) {
            $("#badgeAdmin_AddGroupingNameHolder", element).hide();
            if (callback != null) {
               callback();
            }
            return;
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
         function HideErrorInformation() {
            $(".error-information-holder", element).hide();
         }
         function ShowErrorInformation() {
            $(".error-information-holder", element).show();
         }
         function HideTab(tabId) {
            if (tabId.toUpperCase() == "ALL") {
               $("div[id^='badgeAdminFormTab_']", element).hide();
            }
            else {
               $("#" + tabId, element).hide();
            }
         }
         function ShowTab(tabId) {
            if (tabId.toUpperCase() == "ALL") {
               $("div[id^='badgeAdminFormTab_']", element).show();
            }
            else {
               $("#" + tabId, element).show();
            }
         }
         function LoadEditorTab(badgeId, callback) {
            if (possibleBadges.length == 0) {
               LoadBadgeData();
            }
            let badge = possibleBadges.find(b => b.BadgeId == badgeId);
            let badgeRule = possibleBadgeRules.find(br => br.BadgeId == badgeId);
            let isKpiAssigned = false;
            if (badgeRule != null) {
               let scoreType = "Score";
               let minValue = "";
               let maxValue = "";
               let totalValue = "";
               if (badgeRule.AssignedMqfNumber != null && badgeRule.AssignedMqfNumber.toString() != "") {
                  $("#badgeAdminForm_BadgeAssignedKpi", element).val(badgeRule.AssignedMqfNumber);
                  isKpiAssigned = true;
               }
               else {
                  if (badge != null && badge.RelatedMqfNumber != null && badge.RelatedMqfNumber.toString() != "") {
                     $("#badgeAdminForm_BadgeAssignedKpi", element).val(badge.RelatedMqfNumber);
                     isKpiAssigned = true;
                  }
               }
               if (badgeRule.MinimumScoreValueToEarn != null) {
                  minValue = badgeRule.MinimumScoreValueToEarn;
                  scoreType = "Score";
               }
               else if (badgeRule.MinimumStandardValueToEarn != null) {
                  minValue = badgeRule.MinimumStandardValueToEarn;
                  scoreType = "Standard";
               }
               else if (badgeRule.MinimumRawSumToEarn != null) {
                  totalValue = badgeRule.MinimumRawSumToEarn;
                  scoreType = "Total";
               }

               if (badgeRule.MaximumScoreValueToEarn != null) {
                  maxValue = badgeRule.MaximumScoreValueToEarn;
                  scoreType = "Score";
               }
               else if (badgeRule.MaximumStandardValueToEarn != null) {
                  maxValue = badgeRule.MaximumStandardValueToEarn;
                  scoreType = "Standard";
               }
               $("#badgeAdminForm_BadgeScoreType", element).val(scoreType);
               HideTotalValueHolder();
               HideScoreValueHolder();
               HideStandardValueHolder();

               if (scoreType == "Standard") {
                  $("#badgeAdminForm_MinimumScoreValueToEarn", element).val("");
                  $("#badgeAdminForm_MaximumScoreValueToEarn", element).val("");
                  $("#badgeAdminForm_MinimumStandardValueToEarn", element).val(minValue);
                  $("#badgeAdminForm_MaximumStandardValueToEarn", element).val(maxValue);
                  ShowStandardValueHolder();
               }
               else if (scoreType == "Total") {
                  $("#badgeAdminForm_MinimumScoreValueToEarn", element).val("");
                  $("#badgeAdminForm_MaximumScoreValueToEarn", element).val("");
                  $("#badgeAdminForm_MinimumStandardValueToEarn", element).val("");
                  $("#badgeAdminForm_MaximumStandardValueToEarn", element).val("");
                  $("#badgeAdminForm_MinimumRawSumToEarn", element).val(totalValue);
                  ShowTotalValueHolder();
               }
               else {
                  $("#badgeAdminForm_MinimumScoreValueToEarn", element).val(minValue);
                  $("#badgeAdminForm_MaximumScoreValueToEarn", element).val(maxValue);
                  $("#badgeAdminForm_MinimumStandardValueToEarn", element).val("");
                  $("#badgeAdminForm_MaximumStandardValueToEarn", element).val("");
                  ShowScoreValueHolder();
               }
               if (badgeRule.ConsecutiveMonthsToEarn != null && badgeRule.ConsecutiveMonthsToEarn != "") {
                  $("#badgeAdminForm_ConsecutiveMonthsToEarn", element).val(badgeRule.ConsecutiveMonthsToEarn);
                  HideConsecutiveDaysHolder();
                  ShowConsecutiveMonthsHolder();
               }
               if (badgeRule.ConsecutiveDaysToEarn != null && badgeRule.ConsecutiveDaysToEarn != "") {
                  $("#badgeAdminForm_ConsecutiveDaysToEarn", element).val(badgeRule.ConsecutiveDaysToEarn);
                  HideConsecutiveMonthsHolder();
                  ShowConsecutiveDaysHolder();
               }
               $("#badgeAdminForm_IsProgressiveBadge", element).prop("checked", badgeRule.IsProgressiveBadge);
               $("#badgeAdminForm_MaximumBadgePerUser", element).val(badgeRule.MaximumNumberOfBadgesPerUser);
               $("#badgeAdminForm_HasPoints", element).prop("checked", badgeRule.HasPoints);
               $("#badgeAdminForm_BadgeRuleId", element).val(badgeRule.BadgeRuleId);
               if (badgeRule.PointsForBadgeAward != null && badgeRule.PointsForBadgeAward != "") {
                  $("#badgeAdminForm_PointsForBadgeAward", element).val(badgeRule.PointsForBadgeAward);
               }
            }

            if (badge != null) {
               if (badge.RelatedMqfNumber != null && badge.RelatedMqfNumber != "") {
                  $("#badgeAdminForm_BadgeAssignedKpi", element).val(badge.RelatedMqfNumber);
                  isKpiAssigned = true;
               }
               let assignedRelatedMqfAssignment = $("#badgeAdminForm_RelatedMqfNumber", element).val();
               if (isKpiAssigned == false && assignedRelatedMqfAssignment !== "") {
                  $("#badgeAdminForm_BadgeAssignedKpi", element).val(assignedRelatedMqfAssignment);
                  isKpiAssigned = true;
               }
               $("#badgeAdminForm_BadgeScoreType", element).change();
            }

            if (badgeRule == null) {
               if (badge != null) {
                  $("#badgeAdminForm_ConsecutiveMonthsToEarn", element).val(badge.BadgeLevel);
                  $("#badgeAdminForm_IsProgressiveBadge", element).prop("checked", (badge.BadgeLevel > 1));
               }
               $("#badgeAdminForm_MaximumBadgePerUser", element).val(1);
            }

            $("#badgeAdminForm_BadgeAssignedKpi", element).prop("disabled", isKpiAssigned);

            if (callback != null) {
               callback();
            }
            return;
         }
         function ShowEditorTab(tabClickedName, callback) {
            if (tabClickedName.toLowerCase() == "rules") {
               HideBadgeEditorContainerInEditor();
               ShowRulesContainerInEditor();
            }
            else {
               HideRulesContainerInEditor();
               ShowBadgeEditorContainerInEditor();
            }
            $("#badgeAdminForm_SelectedTab", element).val(tabClickedName.toLowerCase());
            if (callback != null) {
               callback();
            }
         }
         function HideBadgeEditorContainerInEditor() {
            HideSelectImageButton();
            $("#badgeAdminForm_BadgeEditorContainer", element).hide();
         }
         function ShowBadgeEditorContainerInEditor() {
            ShowSelectImageButton();
            $("#badgeAdminForm_BadgeEditorContainer", element).show();
         }
         function HideRulesContainerInEditor() {
            $("#badgeAdminForm_BadgeRulesContainer", element).hide();
         }
         function ShowRulesContainerInEditor() {
            $("#badgeAdminForm_BadgeRulesContainer", element).show();
         }
         function SortPossibleImageOptionsList(listToSort) {
            let returnList = listToSort;
            returnList = $(returnList).sort((a, b) => (a.ImageName > b.ImageName) ? 1 : (a.ImageName === b.ImageName) ? ((a.Client < b.Client) ? 1 : -1) : -1);
            return returnList;
         }
         function HideConsecutiveMonthsHolder() {
            $("#badgeAdminForm_ConsecutiveMonthHolder", element).hide();
         }
         function ShowConsecutiveMonthsHolder() {
            $("#badgeAdminForm_ConsecutiveMonthHolder", element).show();
         }
         function HideConsecutiveDaysHolder() {
            $("#badgeAdminForm_ConsecutiveDaysHolder", element).hide();
         }
         function ShowConsecutiveDaysHolder() {
            $("#badgeAdminForm_ConsecutiveDaysHolder", element).show();
         }
         function HideScoreValueHolder() {
            $("#badgeAdminForm_ScoreValueHolder", element).hide();
         }
         function ShowScoreValueHolder() {
            $("#badgeAdminForm_ScoreValueHolder", element).show();
         }
         function HideStandardValueHolder() {
            $("#badgeAdminForm_StandardValueHolder", element).hide();
         }
         function ShowStandardValueHolder() {
            $("#badgeAdminForm_StandardValueHolder", element).show();
         }
         function HideTotalValueHolder() {
            $("#badgeAdminForm_RawTotalValueHolder", element).hide();
         }
         function ShowTotalValueHolder() {
            $("#badgeAdminForm_RawTotalValueHolder", element).show();
         }
         scope.load = function () {
            scope.Initialize(function () {
               LoadFilterOptions(false);
            });
            WriteUserStatus("Loading badge data...", 60000);
            LoadBadgeData();
            $("#badgeAdmin_BadgeNameFilter", element).off("blur").on("blur", function () {
               WriteUserStatus("Applying Badge Name Filter...", 60000);
               LoadBadgeData();
            });
            $("#badgeAdmin_GroupNameFilter", element).off("change").on("change", function () {
               WriteUserStatus("Applying Grouping Name Filter...", 60000);
               LoadBadgeData();
            });

            $("#badgeAdmin_BadgeLevelFilter", element).off("change").on("change", function () {
               WriteUserStatus("Applying Badge Level Filter...", 60000);
               LoadBadgeData();
            });
            $("#badgeAdmin_RelatedKpiFilter", element).off("change").on("change", function () {
               WriteUserStatus("Applying Kpi Filter...", 60000);
               LoadBadgeData();
            });
            $("#btnAddBadge", element).off("click").on("click", function () {
               ShowAddBadgePanel("", function () {
                  HideTab("badgeAdminFormTab_Rules");
               });
            });
            $(".btn-close", element).off("click").on("click", function () {
               ClearForm(function () {
                  HideImageManager();
                  HideAddBadgePanel();
                  HideGroupingNameAddManager();
                  ShowAddGroupingButton();
                  EnableSaveButton();
                  ResetErrorMessages();
               });
            });
            $("#btnSave", element).off("click").on("click", function () {
               let selectedTab = $("#badgeAdminForm_SelectedTab", element).val();
               if (selectedTab == null || selectedTab == "") {
                  selectedTab = "badge";
               }
               SaveBadge(function (badgeId) {
                  LoadBadgeData();
                  LoadEditorFormForBadge(badgeId, function () {
                     if (selectedTab == "rules") {
                        HideBadgeEditorContainerInEditor();
                        ShowRulesContainerInEditor();
                     }
                     else {
                        HideRulesContainerInEditor();
                        ShowBadgeEditorContainerInEditor();
                     }
                     ShowAddBadgePanel(selectedTab);
                  });
               });
            });
            $("#btnSaveAndClose", element).off("click").on("click", function () {
               SaveBadge(function () {
                  LoadBadgeData();
                  ClearForm();
                  HideAddBadgePanel();
                  HideUserStatus();
               });
            });
            $("#btnOpenImageManager", element).off("click").on("click", function () {
               LoadImageManagerBadgeList(null, function () {
                  let currentImage = $("#badgeAdminForm_ImageUrl", element).val();
                  MarkCurrentImage(currentImage);
                  ShowImageManager();
               });
            });
            $(".btn-close-image-manager", element).off("click").on("click", function () {
               ClearImageManagerForm(function () {
                  HideImageManager();
               });
            });
            $("#btnSetImageManager", element).off("click").on("click", function () {
               SetCurrentImageUrlForBadge(function () {
                  HideImageManager();
               });
            });
            $("#btnOpenGroupingManager", element).off("click").on("click", function () {
               ShowGroupingNameAddManager();
               DisableSaveButton();
               HideAddGroupingButton();
            });
            $("#btnGroupingManagerSave", element).off("click").on("click", function () {
               WriteUserStatus("Adding new grouping name to list...", 10000);
               SaveGroupingNameForm(function (addedValue) {
                  LoadAvailableGroupingNames(function () {
                     $("#badgeAdminForm_BadgeGroupingName", element).val(addedValue);
                     ShowAddGroupingButton();
                     EnableSaveButton();
                     HideGroupingNameAddManager();
                     HideUserStatus();
                  });
               });
            });
            $(".btn-close-grouping", element).off("click").on("click", function () {
               ClearGroupingNameForm(function () {
                  ShowAddGroupingButton();
                  EnableSaveButton();
                  HideGroupingNameAddManager();
               });
            });
            $("#badgeAdmin_ResetFilters", element).off("click").on("click", function () {
               WriteUserStatus("Clearing filters...", 6000);
               ResetFilters(function () {
                  WriteUserStatus("Loading badge information...", 5000);
                  LoadBadgeData();
               });
            });
            $("div[id^='badgeAdminFormTab_']", element).off("click").on("click", function () {
               let id = this.id;
               let tabClicked = id.replace("badgeAdminFormTab_", "");
               let badgeId = $("#badgeAdminForm_BadgeId", element).val();
               LoadEditorTab(badgeId, function () {
                  MarkActiveEditorTab(id);
                  ShowEditorTab(tabClicked);
               });
            });
            $("#badgeAdminForm_BadgeScoreType", element).off("change").on("change", function () {
               HandleBadgeRuleScoreTypeChange();
            });
            $("#badgeAdmin_ActiveFilter", element).off("change").on("change", function () {
               WriteUserStatus("Applying badge status Filter...", 6000);
               LoadBadgeData();
            });

            HideUserStatus();
         }

         scope.load2 = function () {
            HideAll();
         }
         scope.load2();
         //scope.load();
         ko.postbox.subscribe("badgeAdminLoad", function () {
            scope.load();
         });
      }
   };
}]);