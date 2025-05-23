angularApp.directive("ngPrizeCatalogView", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/PrizeCatalog/view/prizeCatalogView.htm?' + Date.now(),
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
         /* Test Data START */
         let masterCatalogItems = [];
         let availableCatalogs = [];
         let hasFilterChanged = false;
         /* Test Data END  */
         const numberOfDaysConsideredNewItem = 30;
         HideAll();
         /* Event Handling START */
         $("#btnPreviousCatalogPage", element).off("click").on("click", function () {
            console.log("btnPreviousCatalogPage clicked - go to previous");
         });
         $("#btnNextCatalogPage", element).off("click").on("click", function () {
            console.log("btnNextCatalogPage clicked - go to next");
         });
         $("#catalogDisplaySelector", element).off("change").on("change", function () {
            HideCatalogHolder();
            hasFilterChanged = true;
            let catalogIdToLoad = this.value;
            LoadCatalog(null, catalogIdToLoad);
         });
         $("#btnRedeemItem", element).on("click", function () {
            console.log("btnRedeemItem clicked");
            HandleRedeemItem();
         });
         $(".btn-close", element).off("click").on("click", function () {
            ClearCatalogItemDisplay(function () {
               HideCatalogHolder();
            });
         });
         $("#changeUserCatalogTheme", element).off("click").on("click", function () {
            HandleChangeUserThemeOptionClick();
         });
         $("#currentUserThemeChangeIcon", element).off("click").on("click", function () {
            HandleChangeUserThemeOptionClick();
         });
         $("input[type=radio][name=userEarnedDisplay_DisplayType]", element).off("change").on("change", function () {
            RenderUserRedeemedItems();
         });
         $("#catalogDisplay_SortType", element).off("change").on("change", function () {
            ClearCatalogItemDisplay();
            RenderCatalog();
         });
         $("#btnRefresh", element).off("click").on("click", function () {
            console.log("btnRefresh clicked");
            ClearCatalogItemDisplay();
            RenderCatalog();
         });
         $("#catalogItemTagFilter", element).off("change").on("change", function () {            
            hasFilterChanged = true;
         });
         $("#catalogItemTagFilter", element).off("blur").on("blur", function () {
            if(hasFilterChanged)
            {
               ClearCatalogItemDisplay();
               HideCatalogHolder();
               RenderCatalog();
               hasFilterChanged = false;
            }
         });
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
            GetAllCatalogs(function(){
               LoadCatalogOptions();
            });
            
         };

         /* Data Loading START */
         function LoadDirective(callback) {
            HideAll();
            LoadCatalog();
            if(callback != null)
            {
               callback();
            }
         }
         function LoadCatalogOptions(callback) {
            $("#catalogDisplaySelector", element).empty();
            let masterItem = $(`<option />`, { text: "Master", value: -1 });
            $("#catalogDisplaySelector", element).append(masterItem);
            let activeCatalogs = availableCatalogs.filter(c => c.Status == "A");
            activeCatalogs = SortCatalogs(activeCatalogs);
            activeCatalogs.forEach(function (catalog) {
               let catalogItem = $(`<option />`, { text: catalog.CatalogName, value: catalog.VirtualPrizeCatalogId });
               $("#catalogDisplaySelector", element).append(catalogItem);
            });
         }
         function LoadCatalog(callback, catalogToLoad) {
            ShowLoadingPanel();
            GetCatalog(function (catalogOptions) {
               RenderCatalog(function(){
                  HideLoadingPanel();
                  if(callback != null)
                  {
                     callback();
                  }
               }, catalogOptions);
            }, catalogToLoad);
         }
         function LoadCatalogItem(callback, itemId) {
            ClearCatalogItemDisplay();
            let itemObject = masterCatalogItems.find(ci => ci.VirtualPrizeItemId == itemId);
            let itemObjectIndex = masterCatalogItems.findIndex(ci => ci.VirtualPrizeItemId == itemId);

            if (itemObject != null) {
               
               let catalogImage = itemObject.ImageUrl ||"/applib/css/images/prizes/prize-placeholder.png";
               $("#catalogItemImage", element).prop("src", catalogImage);
               $("#lblItemNameLabel", element).append(itemObject.PrizeName);
               $("#lblItemTagList", element).append("Tags:");
               if (itemObject.Tags == null || itemObject.Tags.length == 0) {
                  let tagsList = GetTagsForItem(itemObject.VirtualPrizeItemId);
                  itemObject.Tags = tagsList;
                  if (itemObjectIndex > -1) {
                     masterCatalogItems[itemObjectIndex].Tags = tagsList;
                  }
               }
               if (itemObject.Tags != null && itemObject.Tags.length > 0) {
                  for (let tIndex = 0; tIndex < itemObject.Tags.length; tIndex++) {
                     let tagItem = $(`<div class="tag-item" />`);
                     tagItem.append(itemObject.Tags[tIndex].PrizeTag)
                     $("#lblItemTagList", element).append(tagItem);
                  }
               }
               else {
                  $("#lblItemTagList", element).append("&nbsp;");
               }
               if (itemObject.Catalogs == null || itemObject.Catalogs.length == 0) {
                  let catalogsList = GetCatalogsForItem(itemObject.VirtualPrizeItemId);
                  itemObject.Catalogs = catalogsList;
                  if (itemObjectIndex > -1) {
                     masterCatalogItems[itemObjectIndex].Catalogs = catalogsList;
                  }
               }

               if (itemObject.Catalogs != null && itemObject.Catalogs.length > 0) {
                  for (let cIndex = 0; cIndex < itemObject.Catalogs.length; cIndex++) {
                     let catalogTagItem = $(`<div class="catalog-tag-item" />`);
                     catalogTagItem.append(itemObject.Catalogs[cIndex].CatalogName)
                     $("#lblItemCatalogList", element).append(catalogTagItem);
                  }
               }
               else {
                  $("#lblItemCatalogList", element).append("&nbsp;");
               }
               $("#btnRedeemItem", element).empty();
               $("#btnRedeemItem", element).text(`${itemObject.CatalogCreditCost} Credits`);
               $("#redeemItemSelectedPrizeId", element).val(itemId);
               let catalogId = $("#catalogDisplaySelector", element).val() || -1;
               if(catalogId == "")
               {
                  catalogId = -1;
               }
               $("#redeemItemSelectedCatalogId", element).val(catalogId);
            }
            if (callback != null) {
               callback();
            }
         }

         /* Data Loading END */
         /* Data Pulls START */
         function GetAllCatalogs(callback)
         {
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
         function GetCatalog(callback, catalogToLoad) {
            if (catalogToLoad == null || catalogToLoad == "") {
               catalogToLoad = -1;
            }
            let activeOnly = true;
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "getAllVirtualPrizeItemsForCatalog",
                  catalogid: catalogToLoad,
                  deepLoad: true,
                  activeonly: activeOnly,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.virtualPrizeItemList);
                  masterCatalogItems = returnData;
                  if (callback != null) {
                     callback(returnData);
                  }
                  else {
                     return returnData;
                  }
               }
            });
         }
         function GetTagsForItem(prizeItemId) {
            let returnList = [];
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
                  returnList = returnData;
               }
            });
            return returnList;
         }
         function GetCatalogsForItem(prizeItemId) {
            let returnList = [];
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
                  returnList = returnData;
               }
            });
            return returnList;
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderCatalog(callback, itemsToRender, sortType) {
            if (itemsToRender == null) {
               itemsToRender = masterCatalogItems;
            }
            itemsToRender = FilterCatalogItems(itemsToRender);            
            itemsToRender = SortCatalogItems(itemsToRender, sortType);
            $("#catalogDisplayHolder", element).empty();
            itemsToRender.forEach(function (catalogItem) {
               let catalogItemHolder = $(`<div class="prize-catalog-view-catalog-item-holder" id="catalogItemHolder_${catalogItem.VirtualPrizeItemId}" />`);
               let catalogItemImageHolder = $(`<div class="prize-catalog-view-catalog-image-holder" id="catalogImageHolder_${catalogItem.VirtualPrizeItemId}" />`);
               let catalogImageUrl = catalogItem.ThumbnailUrl || catalogItem.ImageUrl || "/applib/css/images/prizes/prize-placeholder.png";
               let catalogItemImage = $(`<img src="${catalogImageUrl}" class="prize-catalog-view-catalog-item-image" id="catalogImage_${catalogItem.VirtualPrizeItemId}" />`);
               catalogItemImageHolder.append(catalogItemImage);
               let catalogItemNameHolder = $(`<div class="prize-catalog-view-catalog-item-name-holder" id="catalogItemNameHolder_${catalogItem.VirtualPrizeItemId}" />`);
               catalogItemNameHolder.append(`${catalogItem.Name}<br>`);
               let catalogItemPriceHolder = $(`<div class="prize-catalog-view-catalog-item-price-holder" id="catalogItemPriceHolder_${catalogItem.VirtualPrizeItemId}" />`);
               catalogItemNameHolder.append(`${catalogItem.CatalogCreditCost} credits`);
               catalogItemHolder.on("click", function () {
                  let holderId = this.id;
                  let itemId = holderId.split("_")[1];
                  ClearSelectedCatalogItem();
                  $(`#${this.id}`).addClass("active");
                  LoadCatalogItem(function () {
                     ShowCatalogHolder();
                  }, itemId);
               });

               let catalogItemLimitedHolder = $(`<div class="prize-catalog-view-catalog--item-limited-edition" />`);
               catalogItemLimitedHolder.append("&nbsp;");
               if (catalogItem.IsLimited) {
                  catalogItemLimitedHolder.empty().append("Limited Edition!");
               }
               let itemQuantity = catalogItem.AvailableQuantity || -1;
               if (itemQuantity > 0 && catalogItem.IsLimited == false) {
                  catalogItemLimitedHolder.empty().append("Limited Quantity!");
               }
               let dateAvailable = catalogItem.DateAvailable;
               if (dateAvailable != null) {
                  let today = new Date();
                  let itemAvailableDate = new Date(dateAvailable);
                  let timeBetween = today.getTime() - itemAvailableDate.getTime();
                  let daysBetweenDates = Math.ceil(timeBetween / (3600000 * 24));
                  if (daysBetweenDates <= numberOfDaysConsideredNewItem) {
                     let newItemBanner = $(`<div class="prize-catalog-view-catalog-new-item-banner-holder" id="newItemBanner_${catalogItem.VirtualPrizeItemId}" />`);
                     let newItemText = $(`<div class="prize-catalog-view-catalog-new-item-text-holder" id="newItemBannerText_${catalogItem.VirtualPrizeItemId}" />`);
                     newItemText.append('<i class="fa-sharp fa-solid fa-stars"></i> NEW!');

                     newItemBanner.append(newItemText);
                     catalogItemHolder.append(newItemBanner);
                  }
               }
               catalogItemHolder.append(catalogItemImageHolder);
               catalogItemHolder.append(catalogItemNameHolder);
               catalogItemHolder.append(catalogItemPriceHolder);
               catalogItemHolder.append(catalogItemLimitedHolder);

               $("#catalogDisplayHolder", element).append(catalogItemHolder);
            });
            //once catalog rendered set that the filters have not changed
            hasFilterChanged = false;

            if (callback != null) {
               callback();
            }
         }
         function ClearSelectedCatalogItem() {
            $("[id^='catalogItemHolder_']", element).removeClass("active");
         }
         function ClearCatalogItemDisplay(callback) {
            $("#catalogItemImage", element).empty();
            $("#lblItemNameLabel", element).empty();
            $("#lblItemQuantityLabel", element).empty();
            $("#lblItemTagList", element).empty();
            $("#lblItemCatalogList", element).empty();
            $("#redeemItemSelectedPrizeId", element).val(-1);
            $("#redeemItemSelectedCatalogId", element).val(-1);

            if (callback != null) {
               callback();
            }
         }

         /* Data Rendering END */
         /* Data Form Handling START */
         function HandleRedeemItem(callback) {
            console.log("HandleRedeemItem()");
            ConfirmRedeemItem(function () {
               SaveRedeemItem(callback);
            });
         }
         function ConfirmRedeemItem(callback) {
            console.log("ConfirmRedeemItem()");
            //TODO: Determine the confirmation message text...
            if (confirm(`Are you sure?`) == true) {
               if (callback != null) {
                  callback();
               }
               else {
                  return;
               }
            }
         }
         function SaveRedeemItem(callback) {            
            let virtualPrizeItemId = $("#redeemItemSelectedPrizeId", element).val();
            let virtualCatalogId = $("#redeemItemSelectedCatalogId", element).val();

            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "performUserPrizeRedemption",
                  userid: legacyContainer.scope.TP1Username,
                  virtualPrizeItemId: virtualPrizeItemId,
                  virtualCatalogId: virtualCatalogId,
                  deepLoad: true
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  ko.postbox.publish("userRedeemedPrizesReload");
                  ko.postbox.publish("userPrizesRedeemedLedgerReload");
                  ko.postbox.publish("prizeCatalogUserHeaderReload");                  
                  if(callback != null)
                  {
                     callback();
                  }
               }
            });
            
         }
         /* Data Form Handling END */
         /* Client Side FIltering START */
         function FilterCatalogItems(listToFilter) {
            let hasFilters = false;
            let tempList = [];
            if ($("#catalogItemTagFilter", element).val() != null && $("#catalogItemTagFilter", element).val() != "") {
               let tagsList = $("#catalogItemTagFilter", element).val().split(",");
               tagsList.forEach(function (tagInput) {
                  if (tagInput != null && tagInput != "") {
                     listToFilter.forEach(function (virtualPrizeItem) {
                        if (virtualPrizeItem.Tags != null && virtualPrizeItem.Tags.length > 0) {
                           virtualPrizeItem.Tags.forEach(function (virtualPrizeItemTag) {
                              if (virtualPrizeItemTag.PrizeTag.trim().toLowerCase().includes(tagInput.trim().toLowerCase()) == true) {
                                 tempList.push(virtualPrizeItem);
                              }
                           });
                        }
                     });
                  }
               });
               hasFilters = true;
            }
            if (hasFilters == true) {
               return [... new Set(tempList)];

            }
            else {
               return listToFilter;
            }
         }
         /* Client Side Filtering END */

         /* Client Side Sorting START */
         function SortCatalogs(listToSort, sortType) {
            if (sortType == null) {
               sortType = "catalogName";
            }
            let sortedList = listToSort;

            sortedList.sort((a, b) => {
               if (a.CatalogName < b.CatalogName) {
                  return -1;
               }
               else if (a.CatalogName > b.CatalogName) {
                  return 1;
               }
               else {
                  return 0;
               }
            });
            return sortedList;
         }
         function SortCatalogItems(listToSort, sortType) {
            if (sortType == null) {
               sortType = $("#catalogDisplay_SortType", element).val();
            }
            let sortedList = listToSort;

            switch (sortType.toLowerCase()) {
               case "highLow".toLowerCase():
                  sortedList = sortedList.sort((a, b) => {
                     if (a.CatalogCreditCost < b.CatalogCreditCost) {
                        return 1;
                     }
                     else if (a.CatalogCreditCost > b.CatalogCreditCost) {
                        return -1;
                     }
                     else {
                        if (a.BaseCreditCost < b.BaseCreditCost) {
                           return 1;
                        }
                        else if (a.BaseCreditCost > b.BaseCreditCost) {
                           return -1;
                        }
                        else {
                           if (a.PrizeName < b.PrizeName) {
                              return -1;
                           }
                           else if (a.PrizeName > b.PrizeName) {
                              return 1;
                           }
                           else {
                              return 0;
                           }
                        }
                     }
                  });
                  break;
               case "lowHigh".toLowerCase():
                  sortedList = sortedList.sort((a, b) => {
                     if (a.CatalogCreditCost < b.CatalogCreditCost) {
                        return -1;
                     }
                     else if (a.CatalogCreditCost > b.CatalogCreditCost) {
                        return 1;
                     }
                     else {
                        if (a.BaseCreditCost < b.BaseCreditCost) {
                           return -1;
                        }
                        else if (a.BaseCreditCost > b.BaseCreditCost) {
                           return 1;
                        }
                        else {
                           if (a.PrizeName < b.PrizeName) {
                              return -1;
                           }
                           else if (a.PrizeName > b.PrizeName) {
                              return 1;
                           }
                           else {
                              return 0;
                           }
                        }
                     }
                  });
                  break;
               default:
                  sortedList = sortedList.sort((a, b) => {
                     if (a.PrizeName < b.PrizeName) {
                        return -1;
                     }
                     else if (a.PrizeName > b.PrizeName) {
                        return 1;
                     }
                     else {
                        return 0;
                     }
                  });
                  break;
            }
            return sortedList;
         }
         /* Client Side Sorting END */
         /* Misc Function Handling START */
         function WriteLoadingMessage(callback,messageToWrite)
         {
            if(messageToWrite != null)
            {
               $("#userLoadingMessageHolder", element).empty();
               $("#userLoadingMessageHolder", element).append(messageToWrite);
            }
            if(callback != null)
            {
               callback();
            }
            else
            {
               return;
            }
         }
         /* Misc Function Handling END */
         /* Show/Hide START */
         function HideAll() {
            //HideLoadingPanel();
            HideCatalogHolder();
            HidePrizeCatalogDisplay();
         }
         function HideCatalogHolder() {
            $("#selectedCatalogItemHolder", element).hide();
         }
         function ShowCatalogHolder() {
            $("#selectedCatalogItemHolder", element).show();
         }
         function HidePrizeCatalogDisplay() {
            $("#prizeCatalogDisplayHolder_Content", element).hide();
         }
         function ShowPrizeCatalogDisplay() {
            $("#prizeCatalogDisplayHolder_Content", element).show();
         }
         function HideLoadingPanel()
         {
            $("#userLoadingPanel", element).hide();
         }
         function ShowLoadingPanel()
         {
            $("#userLoadingPanel", element).show();
         }
         /* Show/Hide END */

         scope.load = function (doInitialize) {
            ShowLoadingPanel();
            if (doInitialize == null) {
               doInitialize = false;
            }

            if (doInitialize == true) {
               scope.Initialize();
            }
            LoadDirective();
            ko.postbox.publish("userPrizeWidgetLoadComplete");
         };
         ko.postbox.subscribe("userPrizeCatalogLoad", function (forceLoad) {
            scope.load(forceLoad);
            ko.postbox.publish("userPrizeWidgetLoadComplete");
         });
      }
   };
}]);