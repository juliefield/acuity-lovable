angularApp.directive("ngPrizeCatalogAdmin", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/PrizeCatalog/view/prizeCatalogAdmin.htm?' + Date.now(),
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
         let defaultImageUrl = "/applib/css/images/prizes/prize-placeholder.png";
         let availableCatalogs = [];
         let currentCatalogItems = [];
         let availableTags = [];
         let displayUserMessagingTimingMs = (5*1000);
         let availableCatalogItemImages = [];

         /* Event Handling START */
         $("#btnRefreshCatalog", element).off("click").on("click", function () {
            RenderAvailableCatalogs();
            MarkCatalogItemActive(null, -1);
            ClearEditorForm();
            HideEditorForm();
         });
         $("#btnAddNewCatalog", element).off("click").on("click", function () {
            ClearEditorForm(function () {
               HideEditorForm();
            });
            ClearItemListing();
            ClearCatalogForm(function () {
               ShowCatalogForm();
            });
         });
         $("#btnAddNewItem", element).off("click").on("click", function () {
            ClearEditorForm(function () {
               LoadEditorForm(function(){
                  ShowEditorForm();
               }, -1);
            });
            ClearCatalogForm(function () {
               HideCatalogForm();
            });
         });
         $("#btnRefreshItems", element).off("click").on("click", function () {
            RefreshCurrentCatalogItems();
         });
         $("#btnSaveNewTagOption", element).off("click").on("click", function () {
            alert("Save new tag not implemented.");
         });
         $(".btn-close", element).off("click").on("click", function () {
            ClearEditorForm(function () {
               HideEditorForm();
            });
            ClearCatalogForm(function () {
               HideCatalogForm();
            });
         });
         $("#btnSaveCatalogForm", element).off("click").on("click", function () {            
            ValidateCatalogItemForm(function(){
               SaveCatalogItemForm(function(){
                  WriteUserMessaging("Catalog Item Save complete.");
                  RefreshCurrentCatalogItems();
                  HideEditorForm();
               });
            });
         });
         $("#btnSaveCatalogCreateEditor", element).off("click").on("click", function () {
            ValidateCreateCatalogForm(function(){
               SaveCreateCatalogForm(function(){
                  WriteUserMessaging("Catalog information saved.");
                  HideEditorForm();
                  LoadAvailableCatalogs();
               });
            });
         });
         $("#prizeCatalogEditorImageHolder", element).off("click").on("click", function(){
            RenderAllAvailableCatalogImages(function(){
               ShowCatalogImageManagerForm();
            });
         });
         $("#prizeCatalogEditorThumbnailImageHolder", element).off("click").on("click", function(){
            console.log("Load Thumbnail Image selection editor.");
         });
         $("#btnCloseImageSelectionForm", element).off("click").on("click", function(){
            HideCatalogImageManagerForm();
         });
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
            LoadAllAvailableTags();
            LoadAllAvailableImagesForCatalogItems();            
            SetDatePickers();
            // LoadDisplayOptions();
            // WriteSelectedUserCount();
         };
         function SetDatePickers() {
            $(".datepicker", element).datepicker();
         }
         /* Data Loading START */
         function LoadDirective() {
            HideAll();
            LoadAvailableCatalogs();
         }
         function LoadAllAvailableTags() {
            GetAllAvailableTags();
         }
         function LoadAvailableCatalogs() {
            GetAvailableCatalogs(function (catalogsList) {
               RenderAvailableCatalogs(null, catalogsList)
            });
         }
         function LoadCurrentCatalogPrizes(callback, catalogIdToLoad, forceReload) {
            GetCurrentCatalogPrizes(function (currentCatalogPrizeList) {
               RenderCurrentCatalogItems(callback, currentCatalogPrizeList, catalogIdToLoad);
            }, catalogIdToLoad, forceReload);
         }
         function RefreshCurrentCatalogItems(callback)
         {
            $("[id^='currentCatalogRowHolder_']", element).each(function(){
               if($(this).hasClass("active-catalog") == true)
               {
                  let id = this.id;
                  let catalogId = id.split("_")[1];
                  LoadCurrentCatalogPrizes(null, catalogId, true);
               }
            });
         }
         function LoadAllAvailableImagesForCatalogItems()
         {
            GetAvailableImagesForCatalogItems();
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetAvailableCatalogs(callback) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "getAllVirtualPrizeCatalogs",
                  deepLoad: true
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.virtualCatalogsList);
                  availableCatalogs = returnData;
                  if (callback != null) {
                     callback(returnData);
                  }
                  else {
                     return returnData;
                  }
               }
            });
         }
         function GetCurrentCatalogPrizes(callback, catalogIdToLoad, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (catalogIdToLoad == null || catalogIdToLoad == "") {
               catalogIdToLoad = -1;
            }
            let returnItems = [];

            if (forceReload == false && currentCatalogItems != null) {
               returnItems = currentCatalogItems.filter(p => p.VirtualPrizeCatalogId == catalogIdToLoad || catalogIdToLoad == -1);
            }

            if (returnItems == null || returnItems.length == 0 || forceReload == true) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getAllVirtualPrizeItemsForCatalog",
                     catalogid: catalogIdToLoad,
                     deepLoad: false,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.virtualPrizeItemList);
                     currentCatalogItems = returnData;
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
         function GetAllAvailableTags(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (availableTags == null || availableTags.length == 0 || forceReload == true) {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "flex",
                     cmd: "getAllPossiblePrizeTags"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.possibleTagsList);
                     availableTags = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                     else {
                        return returnData;
                     }
                  }
               });
            }
            return availableTags;
         }
         function GetTagsForItem(prizeItemId, forceReload) {
            if (forceReload == null) {
               forceReload = false
            }

            let returnList = [];

            let prizeObject = currentCatalogItems.find(i => i.VirtualPrizeItemId == prizeItemId);
            if (prizeObject != null && prizeObject.Tags != null && prizeObject.Tags.length > 0 && forceReload == false) {
               returnList = prizeObject.Tags;
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getAllTagsForVirtualPrizeItem",
                     prizeItemId: prizeItemId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.virtualItemTags);
                     let curCatalogIndex = currentCatalogItems.findIndex(i => i.VirtualPrizeItemId == prizeItemId);
                     if (curCatalogIndex > -1) {
                        currentCatalogItems[curCatalogIndex].Tags.length = 0;
                        currentCatalogItems[curCatalogIndex].Tags = [...returnData];
                     }
                     returnList = returnData;
                  }
               });
            }
            return returnList;
         }
         function GetCatalogsForItem(prizeItemId, forceReload) {
            if (forceReload == null) {
               forceReload = false
            }

            let returnList = [];

            let prizeObject = currentCatalogItems.find(i => i.VirtualPrizeItemId == prizeItemId);
            if (prizeObject != null && prizeObject.Catalogs != null && prizeObject.Catalogs.length > 0 && forceReload == false) {
               returnList = prizeObject.Catalogs;
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getAllCatalogsForVirtualPrizeItem",
                     prizeItemId: prizeItemId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.virtualItemCatalogs);
                     let curCatalogIndex = currentCatalogItems.findIndex(i => i.VirtualPrizeItemId == prizeItemId);
                     if (curCatalogIndex > -1) {
                        currentCatalogItems[curCatalogIndex].Catalogs.length = 0;
                        currentCatalogItems[curCatalogIndex].Catalogs = [...returnData];
                     }
                     returnList = returnData;
                  }
               });
            }
            return returnList;
         }
         function GetPrizeObject(virtualPrizeIdToLoad) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "getVirtualPrizeItemById",
                  prizeid: virtualPrizeIdToLoad
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.virtualPrizeItem);
                  return returnData;
               }
            });
         }
         function GetAvailableImagesForCatalogItems(callback, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            if(forceReload == true || availableCatalogItemImages == null || availableCatalogItemImages.length == 0)
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllImagesForCatalogItems"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.availableCatalogItemImagesList);                     
                     availableCatalogItemImages = returnData;
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
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderAvailableCatalogs(callback, listToRender) {
            if (listToRender == null) {
               listToRender = availableCatalogs;
            }
            $("#currentCatalogListing", element).empty();
            let currentCatalogListHolder = $(`<div id="currentCatalogListHolder" class="current-catalog-list-holder" />`);
            //Master Catalog Item.
            let masterCatalogRowHolder = $(`<div id="currentCatalogRowHolder_-1" class="current-catalog-row-holder" />`);
            let masterCatalogNameHolder = $(`<div id="currentCatalogNameHolder_-1" class="current-catalog-name-holder" />`);
            let masterCatalogName = "Master";
            masterCatalogNameHolder.append(masterCatalogName);
            masterCatalogRowHolder.on("click", function () {
               LoadCurrentCatalogPrizes(null, -1, true);
               MarkCatalogActive(null, -1);
               ClearEditorForm();
            });
            masterCatalogRowHolder.append(masterCatalogNameHolder);
            currentCatalogListHolder.append(masterCatalogRowHolder);

            listToRender.forEach(function (catalogItem) {
               let catalogRowHolder = $(`<div id="currentCatalogRowHolder_${catalogItem.VirtualPrizeCatalogId}" class="current-catalog-row-holder" />`);

               let currentCatalogNameHolder = $(`<div id="currentCatalogNameHolder_${catalogItem.VirtualPrizeCatalogId}" class="current-catalog-name-holder" />`);
               let currentCatalogName = catalogItem.CatalogName;

               currentCatalogNameHolder.append(currentCatalogName);

               catalogRowHolder.on("click", function () {
                  let id = this.id;
                  let catalogIdToLoad = id.split("_")[1];
                  LoadCurrentCatalogPrizes(null, catalogIdToLoad, true);
                  MarkCatalogActive(null, catalogIdToLoad);
                  ClearEditorForm();
                  HideEditorForm();
                  LoadCatalogForm(function () {
                     ShowCatalogForm();
                  }, catalogIdToLoad);
               });

               catalogRowHolder.append(currentCatalogNameHolder);

               currentCatalogListHolder.append(catalogRowHolder);
            });

            $("#currentCatalogListing", element).append(currentCatalogListHolder);

            $("#lblCatalogsFound", element).empty();
            $("#lblCatalogsFound", element).text(listToRender.length);

            if (callback != null) {
               callback();
            }
         }
         function RenderCurrentCatalogItems(callback, listToRender, catalogIdToLoad) {
            if (catalogIdToLoad == null) {
               catalogIdToLoad = -1;
            }

            if (listToRender == null) {
               listToRender = currentCatalogItems.filter(i => i.VirtualPrizeCatalogId == catalogIdToLoad || catalogIdToLoad == -1);
            }
            $("#currentCatalogItemListingHolder", element).empty();
            let currentCatalogPrizeListHolder = $(`<div class="" />`);

            listToRender.forEach(function (prizeItem) {
               let currentPrizeRowHolder = $(`<div class="" id="currentPrizeRowHolder_${prizeItem.VirtualPrizeItemId}" />`);

               let currentPrizeNameHolder = $(`<div class="" id=`);
               let currentPrizeCostHolder = $(``);
               currentPrizeRowHolder.append(prizeItem.PrizeName);

               currentPrizeRowHolder.on("click", function () {
                  let id = this.id;
                  let prizeId = id.split("_")[1];
                  LoadEditorForm(function () {
                     MarkCatalogItemActive(null, prizeId);
                     ClearCatalogForm();
                     HideCatalogForm();
                     ShowEditorForm();
                  }, prizeId);

               });

               currentCatalogPrizeListHolder.append(currentPrizeRowHolder);

            });
            $("#currentCatalogItemListingHolder", element).append(currentCatalogPrizeListHolder);

            $("#lblCatalogItemsFound", element).empty();
            $("#lblCatalogItemsFound", element).text(listToRender.length);


            if (callback != null) {
               callback();
            }
         }
         function RenderAllAvailableTags(callback, listToRender) {
            if (listToRender == null) {
               listToRender = availableTags;
            }
            let possibleTags = [];
            listToRender.forEach(function (tagItem) {
               if (tagItem != null && tagItem.PrizeTag != "") {
                  if (possibleTags.findIndex(i => i == tagItem.PrizeTag) < 0) {
                     possibleTags.push(tagItem.PrizeTag);
                  }
               }
            });
            $("#possibleTagsListHolder", element).empty();
            possibleTags = SortTagsList(possibleTags);

            possibleTags.forEach(function (tagText) {
               let unformattedText = tagText.replace(" ", '');
               let tagRow = $(`<div class="possible-tag-row" id="tagRowHolder_${unformattedText}" />`);
               let tagDisplay = $(`<div class="possible-tag-text" />`);
               tagDisplay.append(tagText);

               tagRow.on("click", function () {
                  HandleTagItemClick(null, this.id);
               });

               tagRow.append(tagDisplay);

               $("#possibleTagsListHolder", element).append(tagRow);
            });

            if (callback != null) {
               callback();
            }
         }
         function RenderCurrentItemCatalogAssignments(callback, virtualPrizeItemObject) {
            let currentCatalogAssignmentList = virtualPrizeItemObject.Catalogs;            
            if (currentCatalogAssignmentList == null || currentCatalogAssignmentList.length == 0) {
               currentCatalogAssignmentList = GetCatalogsForItem(virtualPrizeItemObject.VirtualPrizeItemId);
            }

            $("#itemAssignedCatalogList", element).empty();
            let itemCatalogListingHolder = $(`<div id="itemCatalogListingHolder_${virtualPrizeItemObject.VirtualPrizeItemId}" class="item-assigned-catalog-listing-holder" />`);
            let itemCatalogListingHeaderHolder = $(`<div  class="item-assigned-catalog-row header-row catalog-editor-list-form-header" />`);
            let itemCatalogSelectHeader = $(`<div class="item-assigned-catalog-item-holder header-item catalog-select" />`);
            let itemCatalogNameHeader = $(`<div class="item-assigned-catalog-item-holder header-item catalog-name" />`);
            let itemCatalogCostHeader = $(`<div class="item-assigned-catalog-item-holder header-item catalog-cost" />`);
            // let itemCatalogDatesHeader = $(`<div class="item-assigned-catalog-item-holder header-item catalog-dates" />`);
            let itemCatalogButtonsHeader = $(`<div class="item-assigned-catalog-item-holder header-item catalog-buttons" />`);
            
            itemCatalogSelectHeader.append("&nbsp;");
            itemCatalogNameHeader.append("Name");
            itemCatalogCostHeader.append("Credit Cost");
            // itemCatalogDatesHeader.append("Dates");
            itemCatalogButtonsHeader.append("&nbsp;");
         
            itemCatalogListingHeaderHolder.append(itemCatalogSelectHeader);
            itemCatalogListingHeaderHolder.append(itemCatalogNameHeader);
            itemCatalogListingHeaderHolder.append(itemCatalogCostHeader);
            itemCatalogListingHeaderHolder.append(itemCatalogButtonsHeader);
            // itemCatalogListingHeaderHolder.append(itemCatalogDatesHeader);

            itemCatalogListingHolder.append(itemCatalogListingHeaderHolder);

            availableCatalogs.forEach(function (catalogItem) {
               let itemCatalogListingRow = $(`<div id="catalogListingRow_${catalogItem.VirtualPrizeCatalogId}" class="item-assigned-catalog-row" />`);
               let itemCatalogSelectHolder = $(`<div class="item-assigned-catalog-item-holder catalog-select" />`);
               let itemCatalogNameHolder = $(`<div class="item-assigned-catalog-item-holder catalog-name" />`);
               let itemCatalogCostHolder = $(`<div class="item-assigned-catalog-item-holder catalog-cost" />`);
               // let itemCatalogDatesHolder = $(`<div class="item-assigned-catalog-item-holder catalog-dates" />`);
               let itemCatalogButtonsHolder = $(`<div class="item-assigned-catalog-item-holder button-holder catalog-buttons" />`);

               let catalogSelector = $(`<input type="checkbox" id="assignedToCatalog_${catalogItem.VirtualPrizeCatalogId}" class="checkbox-item" />`);
               let currentCatalogIndex = -1;
               let catalogCost = virtualPrizeItemObject.BaseCreditCost;
               if(currentCatalogAssignmentList != null)
               {
                  currentCatalogIndex = currentCatalogAssignmentList.findIndex(i => i.VirtualPrizeCatalogId == catalogItem.VirtualPrizeCatalogId);
               }
               if(currentCatalogIndex >= 0)
               {
                  //catalogCost = currentCatalogAssignmentList[currentCatalogIndex].CreditCost;
                  catalogSelector.prop("checked", true);
                  itemCatalogListingRow.addClass("item-assigned-to-catalog");
               }
               
               //let saveCatalogItemButton = $(`<button id="btnSaveItemCatalogAssignment_${catalogItem.VirtualPrizeCatalogId}" class="button btn save-button"><i class="fa fa-save"></i></button>`);
               //let removeCatalogItemButton = $(`<button id="btnRemoveItemCatalogAssignment_${catalogItem.VirtualPrizeCatalogId}" class="button btn delete-button"><i class="fa fa-x"></i></button>`);

               // saveCatalogItemButton.on("click", function () {
               //    console.log(`Save Item Catalog button clicked. id:${this.id}`);
               // });
               // removeCatalogItemButton.on("click", function () {
               //    console.log(`Remove Item Catalog button clicked. id:${this.id}`);
               // });

               // itemCatalogDatesHolder.append(`dates`);
               // itemCatalogButtonsHolder.append(saveCatalogItemButton);
               // itemCatalogButtonsHolder.append("&nbsp;");
               //itemCatalogButtonsHolder.append(removeCatalogItemButton);
               

               itemCatalogSelectHolder.append(catalogSelector);
               itemCatalogNameHolder.append(catalogItem.CatalogName);
               itemCatalogCostHolder.append(catalogCost);
               itemCatalogButtonsHolder.append(`&nbsp;`);
               


               itemCatalogListingRow.append(itemCatalogSelectHolder);
               itemCatalogListingRow.append(itemCatalogNameHolder);
               itemCatalogListingRow.append(itemCatalogCostHolder);
               // itemCatalogListingRow.append(itemCatalogDatesHolder);
               itemCatalogListingRow.append(itemCatalogButtonsHolder);

               itemCatalogListingHolder.append(itemCatalogListingRow);
            });
            $("#itemAssignedCatalogList", element).append(itemCatalogListingHolder);

            if (callback != null) {
               callback();
            }
         }
         function RenderAllAvailableCatalogImages(callback, listToRender)
         {
            if(listToRender == null)
            {
               listToRender = availableCatalogItemImages;
            }
            $("#catalogItemAvailableImagesList", element).empty();            
            let allImagesHolder = $(`<div class="catalog-image-options-full-list-holder" />`);

            if(listToRender != null && listToRender.length > 0)
            {
               listToRender.forEach(function(availableImageInfo){                  
                  let currentImageOptionHolder = $(`<div keyValue="${availableImageInfo.ImageTempKey}"  class="catalog-image-option-selector-holder" />`);
                  let currentImageOptionImage = $(`<img src="${availableImageInfo.FilePath}${availableImageInfo.FileName}" class="catalog-image-option-item" />`);

                  currentImageOptionHolder.append(currentImageOptionImage);
                  currentImageOptionHolder.on("click", function(){
                     let val = $(this).attr("keyValue");
                     SetNewCatalogItemImage(function(){
                        HideCatalogImageManagerForm();
                     }, val);
                  });
                  allImagesHolder.append(currentImageOptionHolder);
               });               
            }
            else
            {
               allImagesHolder.append("No images found to load.");
            }

            $("#catalogItemAvailableImagesList", element).append(allImagesHolder);
            if(callback != null)
            {
               callback();
            }
         }
         /* Data Rendering END */
         /* Editor Loading START */
         function LoadEditorForm(callback, prizeIdToLoad) {
            InitializeForm();

            let prizeObject = null;
            let itemImageUrl = defaultImageUrl;
            let itemThumbnailImageUrl = defaultImageUrl;
            let prizeName = null;
            let baseCreditCost = 0;
            let prizeStatus = "A";
            let tempKey = "";
            let prizeDesc = null;
            let availableQuantity = null;
            let maxQauntity = null;
            let dateAvailable = null;
            let dateExpires = null;
            let isLimited = false;

            if (prizeIdToLoad > 0) {
               prizeObject = currentCatalogItems.find(i => i.VirtualPrizeItemId == prizeIdToLoad);
               if (prizeObject == null) {
                  prizeObject = GetPrizeObject(prizeIdToLoad);
               }
            }
            else
            {
               tempKey = GetNewGuid();
            }
            if (prizeObject != null) {
               itemImageUrl = prizeObject.ImageUrl || defaultImageUrl;
               itemThumbnailImageUrl = prizeObject.ThumnailUrl || defaultImageUrl;
               prizeName = prizeObject.PrizeName;
               baseCreditCost = prizeObject.BaseCreditCost;
               prizeStatus = prizeObject.Status;
               tempKey = prizeObject.TempKey;
               prizeDesc = prizeObject.PrizeDesc;
               availableQuantity = prizeObject.AvailableQuantity;
               maxQauntity = prizeObject.MaximumQuantity;
               dateAvailable = prizeObject.DateAvailable;
               if(dateAvailable != null && dateAvailable != "")
               {
                  dateAvailable = new Date(dateAvailable).toLocaleDateString();
               }

               dateExpires = prizeObject.DateExpires;
               if(dateExpires != null && dateExpires != "")
               {
                  dateExpires = new Date(dateExpires).toLocaleDateString();
               }
               isLimited = prizeObject.IsLimited;

               MarkCurrentItemTags(null, prizeObject.Tags, prizeObject.VirtualPrizeItemId);
               RenderCurrentItemCatalogAssignments(null, prizeObject);
            }

            $("#prizeCatalogEditor_VirtualPrizeItemId", element).val(prizeIdToLoad);
            $("#prizeCatalogEditor_PrizeName", element).val(prizeName);
            $("#prizeCatalogEditorImageHolder", element).attr("src", itemImageUrl);
            $("#prizeCatalogEditorThumbnailImageHolder", element).attr("src", itemThumbnailImageUrl);
            $("#prizeCatalogEditor_ImageUrl", element).val(itemImageUrl);
            $("#prizeCatalogEditor_ThumbnailUrl", element).val(itemThumbnailImageUrl);
            $("#prizeCatalogEditor_BaseCreditCost", element).val(baseCreditCost);
            $("#prizeCatalogEditor_Status", element).val(prizeStatus);
            $("#prizeCatalogEditor_TempKey", element).val(tempKey);
            $("#prizeCatalogEditor_PrizeDesc", element).val(prizeDesc);
            $("#prizeCatalogEditor_AvailableQuantity", element).val(availableQuantity);
            $("#prizeCatalogEditor_MaximumQuantity", element).val(maxQauntity);
            $("#prizeCatalogEditor_DateAvailable", element).val(dateAvailable);
            $("#prizeCatalogEditor_DateExpires", element).val(dateExpires);
            $("#prizeCatalogEditor_IsLimited", element).prop("checked", isLimited);

            if (callback != null) {
               callback();
            }
         }
         function InitializeForm() {
            RenderAllAvailableTags();
            //RenderAllAvailableCatalogs();
         }
         function ClearEditorForm(callback) {
            $("#prizeCatalogEditor_VirtualPrizeItemId", element).val(-1);
            $("#prizeCatalogEditor_PrizeName", element).val("");
            $("#prizeCatalogEditorImageHolder", element).attr("src", defaultImageUrl);
            $("#prizeCatalogEditorThumbnailImageHolder", element).attr("src", defaultImageUrl);
            $("#prizeCatalogEditor_ImageUrl", element).val(defaultImageUrl);
            $("#prizeCatalogEditor_ThumbnailUrl", element).val(defaultImageUrl);
            $("#prizeCatalogEditor_BaseCreditCost", element).val(0);
            $("#prizeCatalogEditor_Status", element).val("A");
            $("#prizeCatalogEditor_TempKey", element).val("");
            $("#prizeCatalogEditor_PrizeDesc", element).val("");
            $("#prizeCatalogEditor_AvailableQuantity", element).val("");
            $("#prizeCatalogEditor_MaximumQuantity", element).val("");
            $("#prizeCatalogEditor_DateAvailable", element).val("");
            $("#prizeCatalogEditor_DateExpires", element).val("");
            $("#prizeCatalogEditor_IsLimited", element).prop("checked", false);
            ClearErrorInformation();
            ClearAssignedCatalogs();
            ClearAssignedTags();
            if (callback != null) {
               callback();
            }
         }
         function ClearCatalogForm(callback) {
            $("#prizeCatalogCreateEditor_CatalogId", element).val(-9999);
            $("#prizeCatalogCreateEditor_CatalogName", element).val("");
            $("#prizeCatalogCreateEditor_CatalogDesc", element).val("");
            $("#prizeCatalogCreateEditor_CatalogStartDate", element).val("");
            $("#prizeCatalogCreateEditor_CatalogEndDate", element).val("");
            $("#prizeCatalogCreateEditor_Status", element).val("A");
            ClearErrorInformation();

            if (callback != null) {
               callback();
            }
         }
         function ClearAssignedCatalogs()
         {
            $(`[id^='assignedToCatalog_']`, element).each(function(){
               $(this).prop("checked", false);
            });
            $(`[id^='catalogListingRow_']`, element).removeClass("item-assigned-to-catalog");
         }
         function ClearAssignedTags()
         {
            $(`[id^='tagRowHolder_']`, element).removeClass("active-tag");
         }
         function HandleTagItemClick(callback, tagname) {
            console.log(`Handle Tag Item Click: {${tagname}}`);
            if (callback != null) {
               callback();
            }
         }
         function MarkCurrentItemTags(callback, itemTagList, prizeId) {
            if (itemTagList == null || itemTagList.length == 0) {
               itemTagList = GetTagsForItem(prizeId);
            }
            if (itemTagList != null && itemTagList.length > 0) {
               itemTagList.forEach(function (prizeTag) {
                  let unformattedText = prizeTag.PrizeTag.replace(" ", '');
                  let tagRow = $(`#tagRowHolder_${unformattedText}`, element);
                  if (tagRow != null) {
                     tagRow.addClass("active-tag");
                  }
               });
            }
            if (callback != null) {
               callback();
            }
         }
         function MarkCatalogActive(callback, catalogId) {
            $("[id^='currentCatalogRowHolder_']", element).removeClass("active-catalog");
            $(`#currentCatalogRowHolder_${catalogId}`, element).addClass("active-catalog");
            MarkCatalogItemActive(null, -99999);
            if (callback != null) {
               callback();

            }
         }
         function MarkCatalogItemActive(callback, prizeItemId) {
            $("[id^='currentPrizeRowHolder_']", element).removeClass("active-catalog-item");
            $(`#currentPrizeRowHolder_${prizeItemId}`, element).addClass("active-catalog-item");
            if (callback != null) {
               callback();

            }
         }
         function LoadCatalogForm(callback, catalogIdToLoad) {
            let catalogObject = null;
            let catalogName = "";
            let catalogDesc = "";
            let catalogStartDate = null
            let catalogEndDate = null;
            let catalogStatus = "A";

            if (catalogIdToLoad > 0) {
               catalogObject = availableCatalogs.find(i => i.VirtualPrizeCatalogId == catalogIdToLoad);
               // if(catalogObject == null)
               // {
               //    catalogObject = GetCatalogObject(catalogIdToLoad);
               // }
            }
            else if(catalogIdToLoad == -1) //"Master" Catalog
            {
               catalogName = "Master";
               catalogDesc = "The Master catalog.  All items are in this.";
            }

            if (catalogObject != null) {
               catalogName = catalogObject.CatalogName;
               catalogDesc = catalogObject.CatalogDesc;
               if (catalogObject.CatalogStartDate != null) {
                  catalogStartDate = new Date(catalogObject.CatalogStartDate).toLocaleDateString();
               }
               if (catalogObject.CatalogEndDate != null) {
                  catalogEndDate = new Date(catalogObject.CatalogEndDate).toLocaleDateString();
               }
               catalogStatus = catalogObject.Status;
            }
            $("#prizeCatalogCreateEditor_CatalogId", element).val(catalogIdToLoad);
            $("#prizeCatalogCreateEditor_CatalogName", element).val(catalogName);
            $("#prizeCatalogCreateEditor_CatalogDesc", element).val(catalogDesc);
            $("#prizeCatalogCreateEditor_CatalogStartDate", element).val(catalogStartDate);
            $("#prizeCatalogCreateEditor_CatalogEndDate", element).val(catalogEndDate);
            $("#prizeCatalogCreateEditor_Status", element).val(catalogStatus);

            if (callback != null) {
               callback();
            }
         }
         function ClearItemListing(callback)
         {
            $("#currentCatalogItemListingHolder", element).empty();
            $("#lblCatalogItemsFound", element).empty();
            $("#lblCatalogItemsFound", element).text("0");
            $(`[id^='currentCatalogRowHolder_']`, element).removeClass("active-catalog");
         }
         function ClearErrorInformation()
         {
            $(".error-information-holder", element).empty();
            $(".error-information-holder", element).hide();
            $(".errorField", element).each(function () {
                $(this).removeClass("errorField");
            });
         }
         function SetNewCatalogItemImage(callback, imageKey)
         {
            let imageObject = availableCatalogItemImages.find(i => i.ImageTempKey == imageKey);

            let imageFileFullPath = defaultImageUrl;
            if(imageObject != null)
            {
               imageFileFullPath = `${imageObject.FilePath}${imageObject.FileName}`;
            }

            $("#prizeCatalogEditorImageHolder", element).prop("src", imageFileFullPath);
            $("#prizeCatalogEditor_ImageUrl", element).val(imageFileFullPath);

            if(callback != null)
            {
               callback();
            }
         }
         /* Editor Loading END */
         /* Editor Validation & Saving START */
         function ValidateCreateCatalogForm(callback)
         {
            let formValid = true;
            let catalogName = $("#prizeCatalogCreateEditor_CatalogName", element).val();;
            let catalogStatus = $("#prizeCatalogCreateEditor_Status", element).val();
            let errorMessages = [];
            if(catalogName == null || catalogName == "")
            {
               errorMessages.push({ message: "Name is required", fieldclass: "", fieldid: "prizeCatalogCreateEditor_CatalogName" });
               formValid = false;
            }
            if(catalogStatus == null || catalogStatus == "")
            {
               errorMessages.push({ message: "Status is required", fieldclass: "", fieldid: "prizeCatalogCreateEditor_Status" });
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
                     $("#" + item.fieldid, element).addClass("errorField");
                     $("#" + item.fieldid, element).off("blur").on("blur", function () {
                        $(this).removeClass("errorField");
                     });
                  }

               }
               if (messageString != "") {
                  messageString += "</ul>";

                  $(".error-information-holder-create-form", element).html(messageString);
                  $(".error-information-holder-create-form", element).show();
               }
            }
         }
         function CollectCreateCatalogFormInformation()
         {
            let returnObject = new Object();
            let catalogStartDate = $("#prizeCatalogCreateEditor_CatalogStartDate", element).val();
            let catalogEndDate = ("#prizeCatalogCreateEditor_CatalogEndDate", element).val();
            if(catalogStartDate == "")
            {
               catalogStartDate = null;
            }
            else
            {
               catalogStartDate = new Date(catalogStartDate).toLocaleDateString();
            }
            if(catalogEndDate == "")
            {
               catalogEndDate = new Date(catalogEndDate).toLocaleDateString();
            }

            returnObject.VirtualPrizeCatalogId = parseInt($("#prizeCatalogCreateEditor_CatalogId", element).val());
            returnObject.CatalogName = $("#prizeCatalogCreateEditor_CatalogName", element).val();
            returnObject.CatalogDesc = $("#prizeCatalogCreateEditor_CatalogDesc", element).val();
            returnObject.CatalogStartDate = catalogStartDate;
            returnObject.CatalogEndDate = catalogEndDate; 
            returnObject.Status = $("#prizeCatalogCreateEditor_Status", element).val();
            returnObject.EntBy = legacyContainer.scope.TP1Username;
            returnObject.EntDt = new Date();
            returnObject.UpdBy = legacyContainer.scope.TP1Username;
            returnObject.UpdDt = new Date();

            return returnObject;
         }
         function SaveCreateCatalogForm(callback)
         {
            let catalogObject = CollectCreateCatalogFormInformation();
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "saveVirtualPrizeCatalog",
                  catalog: JSON.stringify(catalogObject)
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  if (callback != null) {
                     callback();
                  }
               }
            });
         }
         function ValidateCatalogItemForm(callback)
         {
            console.log(`ValidateCatalogItemForm()`);
            let formValid = true;
            //name, base cost, status
            let errorMessages = [];
            // if(catalogName == null || catalogName == "")
            // {
            //    errorMessages.push({ message: "Catalog Name is required.", fieldclass: "", fieldid: "prizeCatalogCreateEditor_CatalogName" });
            //    formValid = false;
            // }
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
                     $("#" + item.fieldid, element).addClass("errorField");
                     $("#" + item.fieldid, element).off("blur").on("blur", function () {
                        $(this).removeClass("errorField");
                     });
                  }

               }
               if (messageString != "") {
                  messageString += "</ul>";

                  $(".error-information-holder-item-form", element).html(messageString);
                  $(".error-information-holder-item-form", element).show();
               }
            }
         }
         function SaveCatalogItemForm(callback)
         {
            let catalogItem = CollectCatalogItemInformation();
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "saveVirtualPrizeItem",
                  catalogitem: JSON.stringify(catalogItem)
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  if (callback != null) {
                     callback();
                  }
               }
            });
         }
         function CollectCatalogItemInformation() {
         //TODO: Clean the URL's for proper JSON handling.
            //TODO: Handle dates to make sure we actually have dates going in.
            //TODO: Handle costs and other int/double values properly.
            let returnObject = new Object();
            returnObject.VirtualPrizeItemId = $("#prizeCatalogEditor_VirtualPrizeItemId", element).val();
            returnObject.TempKey = $("#prizeCatalogEditor_TempKey", element).val();
            returnObject.PrizeName = $("#prizeCatalogEditor_PrizeName", element).val();
            returnObject.PrizeDesc = $("#prizeCatalogEditor_PrizeDesc", element).val();
            returnObject.ThumbnailUrl = $("#prizeCatalogEditor_ThumbnailUrl", element).val();
            returnObject.ImageUrl = $("#prizeCatalogEditor_ImageUrl", element).val();
            returnObject.AvailableQuantity = $("#prizeCatalogEditor_AvailableQuantity", element).val();
            returnObject.MaximumQuantity = $("#prizeCatalogEditor_MaximumQuantity", element).val();
            returnObject.BaseCreditCost = $("#prizeCatalogEditor_BaseCreditCost", element).val();
            returnObject.IsLimited = $("#prizeCatalogEditor_IsLimited", element).is(":checked");
            returnObject.DateAvailable = $("#prizeCatalogEditor_DateAvailable", element).val();
            returnObject.DateExpires = $("#prizeCatalogEditor_DateExpires", element).val();
            returnObject.Status = $("#prizeCatalogEditor_Status", element).val();
            returnObject.EntBy = legacyContainer.scope.TP1Username;
            returnObject.EntDt = new Date().toLocaleDateString();
            returnObject.UpdBy = legacyContainer.scope.TP1Username;
            returnObject.UpdDt = new Date().toLocaleDateString();
            returnObject.CatalogIdsList = CollectCatalogAssignmnetsForItem();
            returnObject.TagsStringList = CollectAssignedTagsForItem();
            return returnObject;
         }
         function CollectCatalogAssignmnetsForItem()
         {
            let returnArray = [];
            $(`[id^='assignedToCatalog_']`, element).each(function(){
               let id = this.id;
               let catalogId = id.split("_")[1];
               if($(this).prop("checked") == true)
               {
                  returnArray.push(catalogId);
               }
            });            
            return returnArray;
         }
         function CollectAssignedTagsForItem()
         {
            let returnArray = [];            
            $(`[id^='tagRowHolder_']`, element).each(function(){
               let id = this.id;
               let tagname = id.split("_")[1];
               if($(this).hasClass("active-tag"))
               {
                  returnArray.push(tagname);
               }
            });
            return returnArray;
         }
         /* Editor Validation & Saving END */
         /* Sorting Options START */
         function SortTagsList(listToSort) {
            let sortedList = listToSort;
            sortedList = sortedList.sort();            
            return sortedList;
         }
         /* Sorting Options END */
         /* Utility Functions START */
         function GetNewGuid()
         {
            let returnGuid = "";
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "generateGuid",
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = data.newGuid;
                  returnGuid = returnData;
               }
            });
            return returnGuid;
         }
         function WriteUserMessaging(messageToWrite)
         {
            $("#catalogManagerUserMessage", element).empty();
            $("#catalogManagerUserMessage", element).append(messageToWrite);
            ShowUserMessaging();
            setTimeout(function(){
               $("#virtualPrizeCatalogManagerUserMessagingHolder", element).addClass("fade-out");
               setTimeout(function(){
                  $("#virtualPrizeCatalogManagerUserMessagingHolder", element).removeClass("fade-out");
                  HideUserMessaging();
               }, 10000);
            }, displayUserMessagingTimingMs);
         }
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
            HideCatalogForm();
            HideEditorForm();
            HideUserMessaging();
            HideCatalogImageManagerForm();
         }
         function HideEditorForm() {
            $("#virtualPrizeCatalogEditorFormHolder", element).hide();
         }
         function ShowEditorForm() {
            $("#virtualPrizeCatalogEditorFormHolder", element).show();
         }
         function HideCatalogForm() {
            $("#virtualPrizeCatalogCreateFormHolder", element).hide();
         }
         function ShowCatalogForm() {
            $("#virtualPrizeCatalogCreateFormHolder", element).show();
         }
         function ShowUserMessaging()
         {
            $("#virtualPrizeCatalogManagerUserMessagingHolder", element).show();
         }
         function HideUserMessaging()
         {
            $("#virtualPrizeCatalogManagerUserMessagingHolder", element).hide();
         }
         function ShowCatalogImageManagerForm()
         {
            $("#virtualPrizeCatalogImageSelectorHolder", element).show();
         }
         function HideCatalogImageManagerForm()
         {
            $("#virtualPrizeCatalogImageSelectorHolder", element).hide();
         }
         /* Show/Hide END */

         scope.load = function (forceInitalize) {
            if (forceInitalize == null) {
               forceInitalize = false;
            }
            if (forceInitalize == true) {
               scope.Initialize();
            }
            LoadDirective();
         };

         ko.postbox.subscribe("userPrizeCatalogAdminLoad", function (forceLoad) {
            scope.load(forceLoad);
            ko.postbox.publish("userPrizeWidgetLoadComplete");
         });
      }
   };
}]);