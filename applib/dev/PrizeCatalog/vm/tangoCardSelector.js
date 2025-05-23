angularApp.directive("ngTangoCardSelector", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/PrizeCatalog/view/TangoCardSelector.htm?' + Date.now(),
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
         const pointToDollarConversionAmount = 100;
         let availableTangoCardOptions = [];
         /* Event Handling START */
         $("#btnTester", element).off("click").on("click", function(){
            LoadTangoCardOptionsFromApi(function(){
               console.log("Test click complete.");
            }, true);
         });
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
         };
         /* Data Loading START */
         function LoadDirective()
         {
            HideAll();
            //LoadTangoCardOptionsFromApi();
         }
         /* Data Loading END */
         function LoadTangoCardOptionsFromApi(callback, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            GetTangoCardOptionsFromApi(function(optionsList){
               RenderTangoCardOptions(function(){
                  if(callback != null)
                  {
                     callback();
                  }         
               }, optionsList);
            }, forceReload)
         }
         /* Data Pulls START */
         function GetTangoCardOptionsFromApi(callback, forceRefresh)
         {
            console.log("GetTangoCardOptionsFromApi()");
            if(forceRefresh == null)
            {
               forceRefresh = false;
            }

            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "getTangoCardCatalogItems"
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  if(data.errormessage != null && data.errormessage == "true")
                  {
                     console.error(`Tango Card Error: ${data.msg}`);                     
                  }
                  else
                  {
                     let returnData = JSON.parse(data.catalogItems);                     
                     availableTangoCardOptions.length = 0;
                     availableTangoCardOptions = returnData;
                     if (callback != null) {
                        callback(returnData);
                     }
                     else {
                        return returnData;
                     }
                  }
               }
            });
            
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderTangoCardOptions(callback, listToRender)
         {
            $("#tangoCardOptionsList", element).empty();
            if(listToRender == null)
            {
               listToRender = availableTangoCardOptions;
            }
            
            if(listToRender != null && listToRender.length > 0)
            {
               let defaultImageUrl = "/applib/css/images/prizes/prize-placeholder.png";

               listToRender.forEach(function(item){
                  let tangoCardOptionItemHolder = $(`<div class="tango-card-option-item-holder option-holder" />`);
                  let tangoCardOptionImageHolder = $(`<div class="tango-card-option-data-holder option-image-holder" />`);
                  let tangoCardOptionNameHolder = $(`<div class="tango-card-option-data-holder option-name-holder" />`);
                  let tangoCardOptionPriceHolder = $(`<div class="tango-card-option-data-holder option-price-holder" />`);
                  let tangoCardOptionValueHolder = $(`<div class="tango-card-option-data-holder option-value-holder" />`);
                  let tangoCardOptionButtonHolder = $(`<div class="tango-card-option-data-holder option-button-holder" />`);
                  
                  let itemImage = $(`<img src="${defaultImageUrl}" class="option-image" alt="Item Image" />`);
                  let displayName = item.DisplayName;
                  let conversionRate = item.AcuityCreditsToDollarConversion || pointToDollarConversionAmount;
                  let pricing = `${(item.ItemAmountMinimum * conversionRate)} points`;
                  let itemValue = `Value: $${item.ItemAmountMinimum}`;

                  if(item.IsVariableAmount == true)
                  {
                     let minAcuityCreditCost = (item.ItemAmountMinimum * conversionRate);
                     let maxAcuityCreditCost = (item.ItemAmountMaximum * conversionRate);

                     pricing = `${minAcuityCreditCost} - ${maxAcuityCreditCost} points`;
                     itemValue = `Value: $${item.ItemAmountMinimum} - $${item.ItemAmountMaximum}`;
                  }
                  let orderButton = $(`<button id="btnOrderItem_${item.TangoCardOptionId}" keyValue="${item.TangoCardKey}" class="button btn order-button">Order</button>`);
                  orderButton.on("click", function(){
                     let buttonId = this.id;
                     let optionId = buttonId.split("_")[1];
                     let tcVal = $(this).attr("keyValue")
                     AddItemToSelectedList(optionId, tcVal);
                  });

                  tangoCardOptionImageHolder.append(itemImage);
                  tangoCardOptionNameHolder.append(displayName);
                  tangoCardOptionPriceHolder.append(pricing);
                  tangoCardOptionValueHolder.append(itemValue);
                  tangoCardOptionButtonHolder.append(orderButton);
                  

                  tangoCardOptionItemHolder.append(tangoCardOptionImageHolder);
                  tangoCardOptionItemHolder.append(tangoCardOptionNameHolder);
                  tangoCardOptionItemHolder.append(tangoCardOptionPriceHolder);
                  tangoCardOptionItemHolder.append(tangoCardOptionValueHolder);
                  tangoCardOptionItemHolder.append(tangoCardOptionButtonHolder);

                  $("#tangoCardOptionsList", element).append(tangoCardOptionItemHolder);
               });
            }
            else
            {
               $("#tangoCardOptionsList", element).append("No Tango Card options found.");
            }
            if(callback != null)
            {
               callback(availableTangoCardOptions)
            }
         }
         /* Data Rendering END */
         /* Utility Functions START */
         function AddItemToSelectedList(listId, tangoCardKeyValue)
         {
            let item = availableTangoCardOptions.find(i=> i.TangoCardOptionId == listId);
            if(item == null)
            {
               alert("Error finding item to load.");
            }
            else
            {
               let conversionRate = item.AcuityCreditsToDollarConversion || pointToDollarConversionAmount;

               let cartItemRow = $(`<div class="cart-item-row" />`);
               let cartItemNameHolder = $(`<div class="cart-item-holder item-name" />`);
               let cartItemQtyHolder = $(`<div class="cart-item-holder item-qty" />`);
               let cartItemCostHolder = $(`<div class="cart-item-holder item-cost" />`);
               let cartItemTotalCostHolder = $(`<div class="cart-item-holder item-total-cost" />`);
               let cartItemButtonHolder = $(`<div class="cart-item-holder item-buttons" />`);
   
               let itemRemoveButton = $(`<button id="btnRemoveItemFromCart_${listId}" keyValue="${tangoCardKeyValue}" class="button btn cart-button remove"><i class="fa fa-trash"></i></button>`);
               itemRemoveButton.on("click", function(){
                  alert("Not Implemented.  Coming soon.");
               });
               // let itemQtyInput = $(`<input type="textbox" id="itemQty_${listId}" class="item-qty-input" value="1" />`);
               // let itemConversionRateInput = $(`<input type="hidden" id="itemConversionRate_${listId}" value="${conversionRate}" />`);
               // itemQtyInput.on("blur", function(){
               //    console.log("Update Qty and total cost items.");
               // });
               cartItemNameHolder.append(item.DisplayName);
               cartItemQtyHolder.append("1");
               //cartItemQtyHolder.append(itemQtyInput);
               //cartItemQtyHolder.append(itemConversionRateInput);
               if(item.IsVariableAmount == true)
               {
                  cartItemCostHolder.append(`${item.ItemAmountMinimum * conversionRate} - ${item.ItemAmountMaximum * conversionRate}`);
               }
               else
               {
                  cartItemCostHolder.append(item.ItemAmountMinimum * conversionRate);
               }
               
               cartItemTotalCostHolder.append("88888");
               cartItemButtonHolder.append(itemRemoveButton);
   
               cartItemRow.append(cartItemNameHolder);
               cartItemRow.append(cartItemQtyHolder);
               cartItemRow.append(cartItemCostHolder);
               cartItemRow.append(cartItemTotalCostHolder);
               cartItemRow.append(cartItemButtonHolder);
   
               $("#userSelectedOptionsList", element).append(cartItemRow);
            }
         }
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll()
         {
            console.info("Tango Card: HideAll()");
         }
         /* Show/Hide END */
         
         scope.load = function (forceInitalize) {
            if(forceInitalize == null)
            {
               forceInitalize = false;
            }
            if(forceInitalize == true)
            {
               scope.Initialize();
            }
            LoadDirective();
            ko.postbox.publish("userPrizeWidgetLoadComplete");
         };

         ko.postbox.subscribe("tangoCardLoad", function (forceLoad) {
            scope.load(forceLoad);
            ko.postbox.publish("userPrizeWidgetLoadComplete");
         });         
         ko.postbox.subscribe("tangoCardReload", function () {
            LoadTangoCardOptionsFromApi(function(){
               ko.postbox.publish("userPrizeWidgetLoadComplete");
            }, true);
         });
      }
   };
}]);