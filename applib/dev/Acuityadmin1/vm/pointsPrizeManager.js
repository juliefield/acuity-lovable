angularApp.directive("ngPointsPrizeManager", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/pointsPrizeManager.htm?' + Date.now(),
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
         var basePrizeUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/prizes/";
         var baseClientPrizeUrl = window.location.protocol + "//" + window.location.hostname;
         var defaultAvatarUrl = window.location.protocol + "//" + window.location.hostname + "/jq/avatars/empty_headshot.png";
         var defaultPrizeUrl = window.location.protocol + "//" + window.location.hostname + "/applib/css/images/prizes/prize-placeholder.png";
         var possiblePrizeOptions = [];
         var clientUploadedImageKey = "/UPLOADS/";//TODO: Change to a config parameter
         var possiblePrizeFilterOption = [];
         var possibleUploadedPrizeImages = [];
         var prizeOptionCounts = [];

         scope.Initialize = function () {
            HideAll();
            SetDatePickers();
            LoadAvailableUploadedPrizeImages();
            LoadAllPrizeOptionCounts();
            LoadPossiblePrizeOptions(function (returnList) {
               RenderPossiblePrizeOptions(returnList);
            });
         };
         function SetDatePickers() {
            // $("#userPointsManager_AwardDate", element).datepicker();
         }
         function HideAll() {
            HidePointsPrizeManagerEditor();
            HideImageManager();
         }
         function LoadPossiblePrizeOptions(callback) {

            let includeGlobalOptions = false;
            let includeInactive = true;

            a$.ajax({
               type: "GET",
               service: "C#",

               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "getPrizeOptionsList",
                  includeinactive: includeInactive,
                  includeglobaloptions: includeGlobalOptions
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  let returnData = null;
                  if (jsonData.prizeOptionsList != null) {
                     returnData = JSON.parse(jsonData.prizeOptionsList);
                     possiblePrizeOptions.length = 0;
                     possiblePrizeOptions = returnData;
                     LoadFilterOptions("ALL");
                  }
                  if (callback != null) {
                     callback(returnData);
                  }
                  return;
               }
            });
         }
         function RenderPossiblePrizeOptions(dataToRender, callback) {
            let allPrizeHolder = $("<div class=\"prize-option-all-items-list\" />");
            if (dataToRender == null) {
               dataToRender = possiblePrizeOptions;
            }
            if (dataToRender != null && dataToRender.length > 0) {
               for (let po = 0; po < dataToRender.length; po++) {
                  let prizeOption = dataToRender[po];
                  RenderPossiblePrizeItem(prizeOption, allPrizeHolder);
               }
            }
            else {
               allPrizeHolder.append("No prize options found.");
            }
            $("#prizeOptionListHolder", element).empty();
            $("#prizeOptionListHolder", element).append(allPrizeHolder);
            // $("#prizeFoundCounter", element).empty();
            // $("#prizeFoundCounter", element).append(dataToRender.length);


            if (callback != null) {
               callback();
            }
         }
         function LoadAvailableUploadedPrizeImages(callback) {
            let imageTypeId = 4;
            a$.ajax({
               type: "GET",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserv",
                  cmd: "getAllAvailableUploadImagesByImageType",
                  imagetypeid: imageTypeId,
                  deepLoad: true
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  let returnData = null;
                  if (jsonData.uploadedImagesList != null) {
                     returnData = JSON.parse(jsonData.uploadedImagesList);
                     possibleUploadedPrizeImages.length = 0;
                     possibleUploadedPrizeImages = returnData;
                  }
                  if (callback != null) {
                     callback(returnData);
                  }
                  return;
               }
            });
         }
         function LoadImageManagerPrizeList(listToRender, callback) {
            if (listToRender == null) {
               listToRender = possibleUploadedPrizeImages;
            }
            let currentlySetImageName = $("#PrizeOptionForm_PrizeImageUrl", element).val();
            $("#pointsPrizeManager_ImageOptionHolder", element).empty();
            listToRender = SortPossibleImageOptionsList(listToRender);
            for (let i = 0; i < listToRender.length; i++) {
               let previewImageHolder = $("<div class=\"points-prizeprize-preview-image-holder points-prize-preview-image-holder preview-item\" />");
               let uploadImage = listToRender[i];
               let fileDisplayName = "";
               let fullFileName = "prize-placeholder.png";
               let fileName = -1;
               let itemId = 0;
               let imageSource = basePrizeUrl + fullFileName;
               let clientOption = "";
               if (uploadImage != null) {
                  fileDisplayName = uploadImage.Name;
                  fullFileName = uploadImage.ImageUrl;
                  itemId = uploadImage.UploadedImageId;
                  if (uploadImage.Client !== 0) {
                     imageSource = baseClientPrizeUrl + fullFileName;
                     clientOption = "CO";
                  }
                  else {
                     imageSource = basePrizeUrl + fullFileName;
                  }
               }
               let imageOptionItem = $("<img class=\"points-prize-preview-image\" previewItem=\"previewImageOption\" clientOption=\"" + clientOption + "\"  id=\"imageOption" + clientOption + itemId + "\" alt=\"" + fileDisplayName + "\" />");

               if (fileName == currentlySetImageName) {
                  previewImageHolder.addClass("points-prize-preview-image-selected");
               }
               imageOptionItem.prop("src", imageSource);
               imageOptionItem.off("click").on("click", function () {
                  let itemId = this.id;
                  PreviewImageSelected(itemId, imageSource, uploadImage.UploadedImageId, "previewImageOption");
               });

               let previewImageName = $("<div class=\"points-prize-preview-image-name\" />");
               previewImageName.append(fileDisplayName);

               previewImageHolder.append(imageOptionItem);
               previewImageHolder.append(previewImageName);

               $("#pointsPrizeManager_ImageOptionHolder", element).append(previewImageHolder);
            }
            if (callback != null) {
               callback();
            }
            return;
         }
         function LoadAllPrizeOptionCounts(callback)
         {
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getPrizeOptionCountsAll"
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  let returnData = null;
                  if (jsonData.prizeOptionCountsList != null) {
                     returnData = JSON.parse(jsonData.prizeOptionCountsList);
                     prizeOptionCounts.length = 0;
                     prizeOptionCounts = returnData;
                  }
                  if (callback != null) {
                     callback(returnData);
                  }
                  return;
               }
            });
         }

         function MarkCurrentImage(currentUrl) {
            let currentUploadedImageId = 0;
            let item = possibleUploadedPrizeImages.find(i => i.ImageUrl == currentUrl);
            let imageSource = "prize-placeholder.png";
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

            $(".points-prize-preview-image-holder").each(function () {
               $(this).removeClass("points-prize-preview-image-selected");
            });
            $("#selectedImageFileName", element).val(imageId);
            let filePath = "prize-placeholder.png"
            let image = null;
            if (isClientOption == true) {
               image = possibleUploadedPrizeImages.find(x => x.UploadedImageId == imageId && x.Client !== 0);
            }
            else {
               image = possibleUploadedPrizeImages.find(x => x.UploadedImageId == imageId);
            }
            if (image != null) {
               filePath = image.ImageUrl;
            }
            $("#selectedImagePath", element).val(filePath);
            $("#" + itemId, element).parent().addClass("points-prize-preview-image-selected");
            ScrollToSelectedImage(itemId);
         }
         function ScrollToSelectedImage(imageOptionId, callback) {
            let scrollTopValue = 0;
            let divHolderPosition = $("#pointsPrizeManager_ImageOptionHolder").offset();
            let itemPosition = $("#" + imageOptionId, $("#pointsPrizeManager_ImageOptionHolder", element)).offset();
            if (itemPosition != null && divHolderPosition != null) {
               scrollTopValue = itemPosition.top - (divHolderPosition.top + 50);
            }
            $("#pointsPrizeManager_ImageOptionHolder").animate({ scrollTop: scrollTopValue }, "slow");

            if (callback != null) {
               callback();
            }
         }
         function SortPossibleImageOptionsList(listToSort) {
            let returnList = listToSort;
            returnList = $(returnList).sort((a, b) => (a.ImageName > b.ImageName) ? 1 : (a.ImageName === b.ImageName) ? ((a.Client < b.Client) ? 1 : -1) : -1);
            return returnList;
         }
         function SetCurrentImageUrlForPrize(callback) {
            let currentSelectedImageUrl = "";
            currentSelectedImageUrl = $("#selectedImagePath", element).val();
            $("#PrizeOptionForm_PrizeImageUrl", element).val(currentSelectedImageUrl);
            let fullImageUrl = "";
            if (currentSelectedImageUrl.toUpperCase().includes(clientUploadedImageKey.toUpperCase()) == true) {
               fullImageUrl = baseClientPrizeUrl + currentSelectedImageUrl;
            }
            else {
               fullImageUrl = basePrizeUrl + currentSelectedImageUrl;
            }
            $("#PrizeOptionForm_PrizeImagePreview", element).prop("src", fullImageUrl);
            if (callback != null) {
               callback();
            }
            return;
         }
         function GetPrizeOptionCountByPrizeOptionId(prizeOptionId, counter, callback)
         {
            if(counter == null)
            {
               counter = 0;
            }
            let prizeOptionCount = prizeOptionCounts.find(poc => poc.PrizeOptionId == prizeOptionId);

            if(prizeOptionCount == null && counter < 3)
            {
               counter += 1;
               LoadAllPrizeOptionCounts();
               prizeOptionCount = GetPrizeOptionCountByPrizeOptionId(prizeOptionId, counter, callback);
            }
            else
            {
               return prizeOptionCount;
            }

         }
         function RenderPossiblePrizeItem(itemToRender, objectToRenderTo) {
            let prizeImageUrl = "prize-placeholder.png";
            let prizeImageSource = basePrizeUrl + prizeImageUrl;
            let itemHolder = $("<div class=\"prize-option-item-holder\" />");
            let isClientPrize = (itemToRender.Client != null && itemToRender.Client !== 0);

            if (itemToRender.IsActive == false) {
               itemHolder.addClass("inactive-prize-item-holder");
            }

            let prizeOptionImageHolder = $("<div class=\"prize-option-image-holder\" />");
            let prizeOptionImage = $("<img class=\"prize-option-image\" height=\"75\" />");
            let prizeOptionName = $("<div class=\"prize-option-name\" />");
            let prizeOptionPointsValueHolder = $("<div class=\"prize-option-points-value-holder\" />");
            let pointsValueHolder = $("<label class=\"points-value-label\"/>");
            let pointsCostLabel = $("<label> Credits Cost</label>");
            let pointsAwardHolder = $("<label  class=\"points-value-label\">");
            let pointsAwardLabel = $("<label> Credits Awarded</label>");
            let monetaryValueHolder = $("<div class=\"prize-option-monetary-value-holder\" />");
            let optionButtonHolder = $("<div class=\"prize-option-button-holder\" />");
            let editButton = $("<button class=\"button btn prize-option-edit-button\" id=\"editPrize_" + itemToRender.PrizeOptionId + "\"><i class=\"fa fa-edit\"></i></button>");
            let prizeOptionRedemptionCountHolder = $("<div class=\"prize-option-redemption-count-holder\" />");
            let prizeOptionRedemptionCountLabel = $("<label class=\"prize-option-redemption-count\" />");
            let prizeOptionNotFulfilledCountHolder = $("<div class=\"prize-option-not-fulfilled-count-holder\" />");
            let prizeOptionNotFulfilledCountLabel = $("<label class=\"prize-option-not-fulfilled-count\" />");

            if (itemToRender != null) {
               if (itemToRender.PrizeImageUrl != null && itemToRender.PrizeImageUrl != "") {
                  prizeImageUrl = itemToRender.PrizeImageUrl;

               }
               if (prizeImageUrl.toUpperCase().includes(clientUploadedImageKey.toUpperCase())) {
                  prizeImageSource = baseClientPrizeUrl + prizeImageUrl;
               }
               else {
                  prizeImageSource = basePrizeUrl + prizeImageUrl;
               }

               prizeOptionImage.prop("src", prizeImageSource);
               prizeOptionImage.prop("title", itemToRender.PrizeName);

               prizeOptionName.append(itemToRender.PrizeOptionName);
               pointsValueHolder.append(itemToRender.PointsValue);
               pointsAwardHolder.append(itemToRender.PointsAwarded);


               prizeOptionPointsValueHolder.append(pointsValueHolder);
               prizeOptionPointsValueHolder.append(pointsCostLabel);
               prizeOptionPointsValueHolder.append("<br>");
               prizeOptionPointsValueHolder.append(pointsAwardHolder);
               prizeOptionPointsValueHolder.append(pointsAwardLabel);
               
               //monetaryValueHolder.append(monetaryLabel);
               monetaryValueHolder.append(itemToRender.MonetaryValue.toLocaleString("en-US", { style: "currency", currency: "USD" }));
               let prizeOptionCounts = GetPrizeOptionCountByPrizeOptionId(itemToRender.PrizeOptionId);
               let redeemCount = 0;
               let notFulfilledCount = 0;
               if(prizeOptionCounts != null)
               {
                  redeemCount = prizeOptionCounts.TotalRedemptionsCount;
                  notFulfilledCount = prizeOptionCounts.NotFulfilledCount;
               }
               prizeOptionRedemptionCountLabel.text(redeemCount);
               prizeOptionRedemptionCountHolder.append(prizeOptionRedemptionCountLabel);
               prizeOptionRedemptionCountHolder.append(" Redeemed");

               prizeOptionNotFulfilledCountLabel.text(notFulfilledCount);
               prizeOptionNotFulfilledCountHolder.append(prizeOptionNotFulfilledCountLabel);
               prizeOptionNotFulfilledCountHolder.append(" Not Fulfilled");
            }
            editButton.off("click").on("click", function () {
               let buttonId = this.id;
               let id = buttonId.split("_")[1];
               LoadPointsPrizeForm(id, function () {
                  ShowPointsPrizeManagerEditor();
               });
            });

            prizeOptionImageHolder.append(prizeOptionImage);
            if (isClientPrize == true) {
               optionButtonHolder.append(editButton);
            }
            else {
               optionButtonHolder.append("&nbsp;");
            }

            //optionButtonHolder.append(toggleButton);

            itemHolder.append(prizeOptionImageHolder);
            itemHolder.append(prizeOptionName);
            itemHolder.append(prizeOptionPointsValueHolder);
            itemHolder.append(monetaryValueHolder);
            itemHolder.append(prizeOptionRedemptionCountHolder);
            itemHolder.append(prizeOptionNotFulfilledCountHolder);
            itemHolder.append(optionButtonHolder);

            $(objectToRenderTo).append(itemHolder);
         }
         function LoadPointsPrizeForm(prizeOptionId, callback) {
            let prizeName = "";
            let prizeDesc = "";
            let previewUrl = basePrizeUrl + "prize-placeholder.png";
            let imageUrl = "prize-placeholder.png";
            let pointsValue = 0.00;
            let pointsAwarded = 0.00;
            let monetaryValue = 0.00;
            let isActive = true;

            if (prizeOptionId != null && prizeOptionId > 0) {
               let prizeOption = possiblePrizeOptions.find(p => p.PrizeOptionId == prizeOptionId);

               if (prizeOption != null) {
                  prizeName = prizeOption.PrizeOptionName;
                  prizeDesc = prizeOption.PrizeOptionDesc;

                  if (prizeOption.PrizeImageUrl != null && prizeOption.PrizeImageUrl != "") {
                     imageUrl = prizeOption.PrizeImageUrl;
                     if (prizeOption.PrizeImageUrl.toUpperCase().includes(clientUploadedImageKey.toUpperCase()) == true) {
                        previewUrl = baseClientPrizeUrl + prizeOption.PrizeImageUrl;
                     }
                     else {
                        previewUrl = basePrizeUrl + prizeOption.PrizeImageUrl;
                     }
                  }
                  pointsValue = prizeOption.PointsValue;
                  pointsAwarded = prizeOption.PointsAwarded;
                  monetaryValue = prizeOption.MonetaryValue;                  
                  isActive = prizeOption.IsActive;
               }
            }
            else {
               prizeOptionId = -1;
               previewUrl = defaultPrizeUrl;
               pointsValue = null;
               monetaryValue = null;
               pointsAwarded = null;
            }
            $("#PrizeOptionForm_PrizeOptionName", element).val(prizeName);
            $("#PrizeOptionForm_PrizeOptionDesc", element).val(prizeDesc);
            $("#PrizeOptionForm_PrizeImageUrl", element).val(imageUrl);
            $("#PrizeOptionForm_PrizeImagePreview", element).prop("src", previewUrl);

            $("#PrizeOptionForm_PointsValue", element).val(pointsValue);
            $("#PrizeOptionForm_PointsAward", element).val(pointsAwarded);
            $("#PrizeOptionForm_MonetaryValue", element).val(monetaryValue);
            $("#PrizeOptionForm_IsActive", element).prop("checked", isActive);
            $("#PrizeOptionForm_PrizeOptionId", element).val(prizeOptionId);
            let prizeOptionCounts = GetPrizeOptionCountByPrizeOptionId(prizeOptionId);
            let totalRedemptions = 0;
            let notFulfilledCount = 0;
            if(prizeOptionCounts != null)            
            {
               totalRedemptions = prizeOptionCounts.TotalRedemptionsCount;
               notFulfilledCount = prizeOptionCounts.NotFulfilledCount;
            }
            $("#PrizeOptionForm_ItemRedeemedCount", element).text(totalRedemptions);
            $("#PrizeOptionForm_ItemNotFulfilledCount", element).text(notFulfilledCount);
            
            if (callback != null) {
               callback();
            }
         }
         function LoadFilterOptions(areaToLoad, callback) {
            if (areaToLoad == null) {
               areaToLoad = "ALL";
            }
            if (callback != null) {
               callback();
            }
         }
         function ApplyFilter(callback) {
            let nameFilter = null;
            let statusFilter = null;
            let filteredItems = [];

            if ($("#prizeManager_NameFilter", element).val() != "") {
               nameFilter = $("#prizeManager_NameFilter", element).val();
            }
            if ($("#prizeManager_StatusFilter", element).val() != "") {
               statusFilter = $("#prizeManager_StatusFilter", element).val();
            }

            filteredItems = possiblePrizeOptions;
            filteredItems = filteredItems.filter(x => x.PrizeOptionName.toLowerCase().includes(nameFilter?.toLowerCase()) || nameFilter == null);
            if (statusFilter != null && statusFilter != "") {
               if (statusFilter.toLowerCase() == "active".toLowerCase()) {
                  filteredItems = filteredItems.filter(x => x.IsActive == true);
               }
               else if (statusFilter.toLowerCase() == "inactive".toLowerCase()) {
                  filteredItems = filteredItems.filter(x => x.IsActive == false);
               }
            }
            RenderPossiblePrizeOptions(filteredItems, callback);
         }
         function ClearFilters(callback) {
            $("#prizeManager_NameFilter", element).val("");
            $("#prizeManager_StatusFilter", element).val("");

            if (callback != null) {
               callback();
            }
            else {
               ApplyFilter();
            }
         }
         function ValidatePointsPrizeForm(callback) {
            var formValid = true;
            let errorMessages = [];
            let prizeName = $("#PrizeOptionForm_PrizeOptionName", element).val();
            let pointsValue = $("#PrizeOptionForm_PointsValue", element).val();
            let pointsAwarded = $("#PrizeOptionForm_PointsAward", element).val();
            let monetaryValue = $("#PrizeOptionForm_MonetaryValue", element).val();

            if (prizeName == null || prizeName == "") {
               errorMessages.push({ message: "Prize Name is Required.", fieldclass: "", fieldid: "PrizeOptionForm_PrizeOptionName" });
               formValid = false;
            }
            if (pointsValue == null || pointsValue == "") {
               errorMessages.push({ message: "Credits Value are Required.", fieldclass: "", fieldid: "PrizeOptionForm_PointsValue" });
               formValid = false;
            }
            if (pointsAwarded == null || pointsAwarded == "") {
               errorMessages.push({ message: "Credits Awarded are Required.", fieldclass: "", fieldid: "PrizeOptionForm_PointsAward" });
               formValid = false;
            }
            if (monetaryValue == null || monetaryValue == "") {
               errorMessages.push({ message: "Monetary Value is Required.", fieldclass: "", fieldid: "PrizeOptionForm_MonetaryValue" });
               formValid = false;
            }
            else if (Number.isNaN(monetaryValue)|| isNaN(monetaryValue)){
               errorMessages.push({ message: "Monetary Value can only be numbers.  Please remove any symbols or letters.", fieldclass: "", fieldid: "PrizeOptionForm_MonetaryValue" });
               formValid = false;
            }

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
                  if (item.fieldid != "") {
                     $("#" + item.fieldd, element).addClass("errorField");
                     $("#" + item.fieldd, element).off("blur").on("blur", function () {
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
         function SavePointsPrizeManagerEditorForm(callback) {
            let prizeOptionToSave = new Object();
            let prizeOptionId = -1;
            prizeOptionId = $("#PrizeOptionForm_PrizeOptionId", element).val();
            if (prizeOptionId == "" || Number.isNaN(prizeOptionId)) {
               prizeOptionId = -1;
            }
            prizeOptionToSave.PrizeOptionId = prizeOptionId;
            prizeOptionToSave.PrizeOptionName = $("#PrizeOptionForm_PrizeOptionName", element).val();
            prizeOptionToSave.PrizeOptionDesc = $("#PrizeOptionForm_PrizeOptionDesc", element).val();
            prizeOptionToSave.PrizeImageUrl = $("#PrizeOptionForm_PrizeImageUrl", element).val();
            prizeOptionToSave.PointsValue = parseFloat($("#PrizeOptionForm_PointsValue", element).val());
            prizeOptionToSave.PointsAwarded = parseFloat($("#PrizeOptionForm_PointsAward", element).val());
            prizeOptionToSave.MonetaryValue = parseFloat($("#PrizeOptionForm_MonetaryValue", element).val());
            prizeOptionToSave.IsActive = $("#PrizeOptionForm_IsActive", element).is(":checked");
            prizeOptionToSave.EntDt = new Date();
            prizeOptionToSave.EntBy = legacyContainer.scope.TP1Username;

            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "savePrizeOption",
                  prizeOption: JSON.stringify(prizeOptionToSave)
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  let prizeOptionId = jsonData.prizeOptionId;
                  $("#PrizeOptionForm_PrizeOptionId", element).val(prizeOptionId);
                  if (callback != null) {
                     callback(prizeOptionId);
                  }
                  return;
               }
            });
         }
         function ClearPointsPrizeManagerEditorForm(callback) {
            $("#PrizeOptionForm_PrizeOptionName", element).val("");
            $("#PrizeOptionForm_PrizeOptionDesc", element).val("");
            $("#PrizeOptionForm_PrizeImageUrl", element).val("prize-placeholder.png");
            $("#PrizeOptionForm_PointsValue", element).val("0");
            $("#PrizeOptionForm_PointsAward", element).val("0");
            $("#PrizeOptionForm_MonetaryValue", element).val("0.00");
            $("#PrizeOptionForm_IsActive", element).prop("checked", true);
            $("#PrizeOptionForm_PrizeOptionId", element).val(-1);
            $("#PrizeOptionForm_ItemRedeemedCount", element).text("");
            $("#PrizeOptionForm_ItemNotFulfilledCount", element).text("");
            $(".error-information-holder", element).empty();
            $(".error-information-holder", element).hide();


            if (callback != null) {
               callback();
            }
            return;
         }

         function ShowPointsPrizeManagerEditor() {
            $("#pointsPrizeManagerEditorForm", element).show();
         }
         function HidePointsPrizeManagerEditor() {
            $("#pointsPrizeManagerEditorForm", element).hide();
         }
         function ShowImageManager(callback) {
            $("#pointsPrizeManagerImageManagerHolder", element).show();
            if (callback != null) {
               callback();
            }
            return;
         }
         function HideImageManager(callback) {
            $("#pointsPrizeManagerImageManagerHolder", element).hide();
            if (callback != null) {
               callback();
            }
            return;
         }
         scope.load = function () {
            scope.Initialize();
            $("#prizeManager_NameFilter", element).off("blur").on("blur", function () {
               ApplyFilter();
            });
            $("#prizeManager_StatusFilter", element).off("change").on("change", function () {
               ApplyFilter();
            });
            $("#prizeManager_RefreshList", element).off("click").on("click", function () {
               ko.postbox.publish("pointsPrizeManagerRefresh");
            });
            $("#prizeManager_ClearFilters", element).off("click").on("click", function () {
               ClearFilters(function () {
                  ApplyFilter();
               });
            });
            $(".btn-add-new", element).off("click").on("click", function () {
               LoadPointsPrizeForm(-1, function () {
                  ShowPointsPrizeManagerEditor();
               });
            });
            $("#btnSaveEditorForm", element).off("click").on("click", function () {
               ValidatePointsPrizeForm(function () {
                  SavePointsPrizeManagerEditorForm(function () {
                     ClearPointsPrizeManagerEditorForm();
                     LoadPossiblePrizeOptions(function () {
                        RenderPossiblePrizeOptions();
                        HidePointsPrizeManagerEditor();
                     });
                  });
               });
            });
            $(".btn-close", element).off("click").on("click", function () {
               ClearPointsPrizeManagerEditorForm(function () {
                  HidePointsPrizeManagerEditor();
               });
            });
            $("#btnOpenPrizeImageManager", element).off("click").on("click", function () {
               LoadImageManagerPrizeList(null, function () {
                  let currentImage = $("#PrizeOptionForm_PrizeImageUrl", element).val();
                  MarkCurrentImage(currentImage);
                  ShowImageManager();
               });

            });
            $("#btnSetPrizeImageManager", element).off("click").on("click", function () {
               SetCurrentImageUrlForPrize(function () {
                  HideImageManager();
               });
            });
            $(".btn-close-image-manager", element).off("click").on("click", function () {
               HideImageManager();
            });
         };

         //scope.load();

         ko.postbox.subscribe("pointsPrizeManagerLoad", function(){
            scope.load();
         });
         ko.postbox.subscribe("pointsPrizeManagerRefresh", function(){            
            LoadAllPrizeOptionCounts()
            LoadPossiblePrizeOptions(function(){
               RenderPossiblePrizeOptions();
            });
         });
         ko.postbox.subscribe("refreshPointsPrizeData", function(){
            LoadAllPrizeOptionCounts();
            LoadPossiblePrizeOptions();
         });
      }
   };
}]);