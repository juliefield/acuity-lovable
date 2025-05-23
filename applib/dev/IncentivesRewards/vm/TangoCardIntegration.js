angularApp.directive("ngTangoCardIntegration", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl:
        a$.debugPrefix() +
        "/applib/dev/IncentivesRewards/view/TangoCardIntegration.htm?" +
        Date.now(),
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
        userId: "@",
      },
      require: "^ngLegacyContainer",
      link: function (scope, element, attrs, legacyContainer) {
        HideAll();
        let currentUserProfile = null;
        let currentUserBalance = null;
        let availableTangoCardOptions = {
          LastLoadDate: null,
          BrandOptions: [],
          ItemOptions: [],
          CatalogOptions: [],
        };
        let dollarPointsConversionValue = 0.01;
        let defaultOptionImage =
          window.location.protocol +
          "//" +
          window.location.hostname +
          "/jq/avatars/empty_headshot.png";
        const tcOptionImageReferenceKey = "200w-326ppi";
        /* Event Handling START */
        $(".btn-close", element)
          .off("click")
          .on("click", function () {
            ClearSelectionItemForm();
            HideSelectionItemForm();
          });
        $("#btnDoRedeemItem", element)
          .off("click")
          .on("click", function () {
            ValidateSelectionItemForm(function () {
              SaveSelectionItemForm(function () {
                HideSelectionItemForm();
                window.setTimeout(function () {
                  alert("Redemption successful.");
                  ko.postbox.publish("IRPASManagementReload", true);
                }, 500);
              });
            });
          });
          $("#tangoCardAvailableCatalogSelector", element).off("change").on("change", function(){            
            let catalogIdSelected = $(this).val();
            LoadAvailableBrandsForCatalog(null, catalogIdSelected);
          });
        /* Event Handling END */
        scope.Initialize = function () {
          HideAll();
          LoadCurrentCatalogs();
          LoadCurrentUserProfileInformation();
        };
        function SetDatePickers() { }
        /* Data Loading START */
        function LoadDirective(callback, forceReload) {
          HideAll();
          LoadAvailableTangoCardOptions(callback, forceReload);
        }
        /* Data Loading END */
        function LoadAvailableTangoCardOptions(callback, forceReload) {
          GetAvailableTangoCardOptions(function (tangoCardList) {
            RenderAvailableTangoCardOptions(function () {
              if (callback != null) {
                callback();
              }
            }, tangoCardList);
          }, forceReload);
        }
        function LoadCurrentCatalogs(callback)
        {
          GetCurrentCatalogs(function(catalogList){
            RenderCurrentCatalogs(callback, catalogList);
          });
        }
        function LoadAvailableBrandsForCatalog(callback, catalogIdToLoad)
        {
          let catalogObject = availableTangoCardOptions.CatalogOptions.find(c => c.Id == catalogIdToLoad);

          if(catalogObject != null && catalogObject.BrandsList != null)
          {
            availableTangoCardOptions.BrandOptions = catalogObject.BrandsList;
          }
          
          RenderAvailableBrandsForCatalog(null, catalogObject?.BrandsList);

          if(callback != null)
          {
            callback();
          }
        }
        /* Data Pulls START */
        function GetAvailableTangoCardOptions(callback, forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          //availableTangoCardOptions.ItemOptions = [];

          let returnData = [];
          if(callback != null)
          {
            callback(returnData);
          }
        }
        function GetCurrentCatalogs(callback)
        {
          a$.ajax({
            type: "POST",
            service: "C#",
            async: false,
            data: {
              lib: "selfserv",
              cmd: "getAvailableTangoCardCatalogList",
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              let returnData = JSON.parse(data.tangoCardCatalogList);
              availableTangoCardOptions.CatalogOptions.length = 0;
              availableTangoCardOptions.CatalogOptions = returnData;
              if (callback != null) {
                callback(returnData);
              }
            },
          });
        }
        /* Data Pulls END */
        /* Data Rendering START */
        function RenderCurrentCatalogs(callback, listToRender)
        {
          if(listToRender == null)
          {
            listToRender = availableTangoCardOptions.CatalogOptions;
          }
          $("#tangoCardAvailableCatalogSelector", element).empty();
          $("#tangoCardAvailableCatalogSelector", element).append(`<option></option>`);
          listToRender.forEach(function(catalogItem){
            let option = $(`<option value="${catalogItem.Id}">${catalogItem.Name}</option>`);
            $("#tangoCardAvailableCatalogSelector", element).append(option);
          });
          if(callback != null)
          {
            callback();
          }
        }
        function RenderAvailableBrandsForCatalog(callback, listToRender)
        {
          if(listToRender == null)
          {
            listToRender = availableTangoCardOptions.BrandOptions;
          }
          $("#tangoCardItemsListHolder", element).empty();
          let tangoCardItemsHolder = $(`<div class="tango-card-integration-list-options-holder" />`);

          if(listToRender != null && listToRender.length > 0)
          {
            listToRender.forEach(function (brandDataItem) {
              if (brandDataItem.Status.toLowerCase() == "active".toLowerCase()) {
                let tangoCardOptionHolder = $(`<div class="tango-card-integration-list-option-item" brandCode="${brandDataItem.TangoCardBrandKey}" />`);
                let tangoCardOptionImageHolder = $(`<div class="tango-card-integration-option-data-holder tc-option-image" brandCode="${brandDataItem.TangoCardBrandKey}" />`);
                let tangoCardOptionNameHolder = $(`<div class="tango-card-integration-option-data-holder tc-option-name" brandCode="${brandDataItem.TangoCardBrandKey}" />`);
                let tangoCardOptionCostHolder = $(`<div class="tango-card-integration-option-data-holder tc-option-cost"  brandCode="${brandDataItem.TangoCardBrandKey}"/>`);
                let tangoCardOptionButtonHolder = $(`<div class="tango-card-integration-option-data-holder tc-option-button-holder"  brandCode="${brandDataItem.TangoCardBrandKey}"/>`);
                let imageUrl = defaultOptionImage;
                if(brandDataItem.BrandImages != null)
                {
                  imageUrl = brandDataItem.BrandImages.ImageUrl3;
                }
                
                //let brandCostMinDollars = GetBrandCostFromItemsList(brandDataItem.items,"min");
                //let brandCostMaxDollars = GetBrandCostFromItemsList(brandDataItem.items,"max");
                let brandCostMinDollars = GetBrandCostFromItemsList(brandDataItem.BrandItems,"min");
                let brandCostMaxDollars = GetBrandCostFromItemsList(brandDataItem.BrandItems,"max");

                let brandCostMin = ConvertDollarValueToPoints(brandCostMinDollars);
                let brandCostMax = ConvertDollarValueToPoints(brandCostMaxDollars);

                let optionImage = $(`<img src="${imageUrl}" alt="${brandDataItem.Name} option" id="tangoCardBrandOption|_${brandDataItem.TangoCardBrandKey}" brandCode="${brandDataItem.TangoCardBrandKey}" />`);
                tangoCardOptionImageHolder.append(optionImage);
                if (brandDataItem.ShortDescription != null) {

                  optionImage.on("click", function (event) {
                    let brandCode = $(this).attr("brandCode");
                    $("#tcProductCodeSelected", element).val(brandCode);
                    LoadSelectionItemForm(function () {
                      ShowSelectionItemForm();
                    }, brandCode);

                    event.stopPropagation();
                  });
                  let optionDescriptionHolder = $(`<div class="tc-option-description-holder" id="tangoCardBrandDescriptionHolder|_${brandDataItem.TangoCardBrandKey}" brandCode="${brandDataItem.TangoCardBrandKey}" />`);
                  let descCloseButton = $(`<button id="btnCloseDesc_${brandDataItem.TangoCardBrandKey}" class="button btn btn-close-brand" brandCode="${brandDataItem.TangoCardBrandKey}"><i class="fa fa-close"></i></button>`);
                  descCloseButton.on("click", function () {
                    let brandCode = $(this).attr("brandCode");
                    ToggleDescription(brandCode);
                  });
                  let closeButtonHolder = $(`<div class="close-button-holder" />`);
                  closeButtonHolder.append(descCloseButton);
                  let descriptionSpacer = $(`<div class="" />`);
                  descriptionSpacer.append("&nbsp;");

                  optionDescriptionHolder.append(closeButtonHolder);
                  let shortDescription = brandDataItem.ShortDescription;
                  shortDescription = CleanHtmlText(shortDescription);
                  
                  optionDescriptionHolder.append(shortDescription);
                  optionDescriptionHolder.append(descriptionSpacer);

                  tangoCardOptionImageHolder.append(optionDescriptionHolder);
                }

                tangoCardOptionNameHolder.append(`${brandDataItem.Name}`);
                tangoCardOptionNameHolder.append(`<br />`);

                if (brandDataItem.BrandItems != null && brandDataItem.BrandItems.length > 1) {
                  tangoCardOptionNameHolder.append(`<span class="tango-card-integration-items-available-count">(${brandDataItem.BrandItems.length} options)</span>`);
                }
                if (brandCostMax != brandCostMin) {
                  tangoCardOptionCostHolder.append(`${brandCostMin} - ${brandCostMax} points`);
                } else {
                  tangoCardOptionCostHolder.append(`${brandCostMax} points`);
                }
                let tcGetOptionButton = $(`<button id="btnRedeemTangoCardItem|_${brandDataItem.TangoCardBrandKey}" class="button btn tc-option-button" brandCode="${brandDataItem.TangoCardBrandKey}">Redeem</button>`);

                tcGetOptionButton.on("click", function (event) {
                  let brandCode = $(this).attr("brandCode");
                  $("#tcProductCodeSelected", element).val(brandCode);                  
                  LoadSelectionItemForm(function () {
                    ShowSelectionItemForm();
                  }, brandCode);

                  event.stopPropagation();
                });

                tangoCardOptionButtonHolder.append(tcGetOptionButton);

                tangoCardOptionHolder.append(tangoCardOptionImageHolder);
                tangoCardOptionHolder.append(tangoCardOptionNameHolder);
                tangoCardOptionHolder.append(tangoCardOptionCostHolder);
                tangoCardOptionHolder.append(tangoCardOptionButtonHolder);

                tangoCardItemsHolder.append(tangoCardOptionHolder);
              }
            });
          }
          else
          {
            tangoCardItemsHolder.append("No Tango Card Items found to display.  Select a catalog to display.");
          }

          $("#tangoCardItemsListHolder", element).append(tangoCardItemsHolder);
          HideAllBrandDescriptions();

          if(callback != null)
          {
            callback();
          }
        }
        
        function RenderAvailableTangoCardOptions(callback, listToRender) {
          if (listToRender == null) {            
            listToRender = availableTangoCardOptions.BrandOptions;
          }
          availableTangoCardOptions.ItemOptions.length = 0;
          
          $("#tangoCardItemsListHolder", element).empty();

          let tangoCardItemsHolder = $(`<div class="tango-card-integration-list-options-holder" />`);
          if (listToRender != null && listToRender.length > 0) {
            listToRender.forEach(function (brandDataItem) {
              if (
                brandDataItem.status.toLowerCase() == "active".toLowerCase()
              ) {
                brandDataItem.items?.forEach(function (item) {
                  availableTangoCardOptions.ItemOptions.push(item);
                });
                let tangoCardOptionHolder = $(
                  `<div class="tango-card-integration-list-option-item" brandCode="${brandDataItem.brandKey}" />`,
                );
                let tangoCardOptionImageHolder = $(
                  `<div class="tango-card-integration-option-data-holder tc-option-image" brandCode="${brandDataItem.brandKey}" />`,
                );
                let tangoCardOptionNameHolder = $(
                  `<div class="tango-card-integration-option-data-holder tc-option-name" brandCode="${brandDataItem.brandKey}" />`,
                );
                let tangoCardOptionCostHolder = $(
                  `<div class="tango-card-integration-option-data-holder tc-option-cost"  brandCode="${brandDataItem.brandKey}"/>`,
                );
                let tangoCardOptionButtonHolder = $(
                  `<div class="tango-card-integration-option-data-holder tc-option-button-holder"  brandCode="${brandDataItem.brandKey}"/>`,
                );
                let imageUrl = defaultOptionImage;
                let brandCostMinDollars = GetBrandCostFromItemsList(
                  brandDataItem.items,
                  "min",
                );
                let brandCostMaxDollars = GetBrandCostFromItemsList(
                  brandDataItem.items,
                  "max",
                );
                let brandCostMin =
                  ConvertDollarValueToPoints(brandCostMinDollars);
                let brandCostMax =
                  ConvertDollarValueToPoints(brandCostMaxDollars);

                if (brandDataItem.imageUrls != null) {
                  imageUrl = brandDataItem.imageUrls[tcOptionImageReferenceKey];
                }
                let optionImage = $(
                  `<img src="${imageUrl}" alt="${brandDataItem.brandName} option" id="tangoCardBrandOption|_${brandDataItem.brandKey}" brandCode="${brandDataItem.brandKey}" />`,
                );
                tangoCardOptionImageHolder.append(optionImage);
                if (brandDataItem.shortDescription != null) {

                  optionImage.on("click", function (event) {
                    let brandCode = $(this).attr("brandCode");
                    $("#tcProductCodeSelected", element).val(brandCode);
                    LoadSelectionItemForm(function () {
                      ShowSelectionItemForm();
                    }, brandCode);

                    event.stopPropagation();
                  });
                  let optionDescriptionHolder = $(
                    `<div class="tc-option-description-holder" id="tangoCardBrandDescriptionHolder|_${brandDataItem.brandKey}" brandCode="${brandDataItem.brandKey}" />`,
                  );
                  let descCloseButton = $(
                    `<button id="btnCloseDesc_${brandDataItem.brandKey}" class="button btn btn-close-brand" brandCode="${brandDataItem.brandKey}"><i class="fa fa-close"></i></button>`,
                  );
                  descCloseButton.on("click", function () {
                    let brandCode = $(this).attr("brandCode");
                    ToggleDescription(brandCode);
                  });
                  let closeButtonHolder = $(
                    `<div class="close-button-holder" />`,
                  );
                  closeButtonHolder.append(descCloseButton);
                  let descriptionSpacer = $(`<div class="" />`);
                  descriptionSpacer.append("&nbsp;");

                  optionDescriptionHolder.append(closeButtonHolder);
                  optionDescriptionHolder.append(
                    brandDataItem.hortDescription,
                  );
                  optionDescriptionHolder.append(descriptionSpacer);

                  tangoCardOptionImageHolder.append(optionDescriptionHolder);
                }
                tangoCardOptionNameHolder.append(`${brandDataItem.brandName}`);
                tangoCardOptionNameHolder.append(`<br />`);
                if (
                  brandDataItem.items != null &&
                  brandDataItem.items.length > 1
                ) {
                  tangoCardOptionNameHolder.append(
                    `<span class="tango-card-integration-items-available-count">(${brandDataItem.items.length} options)</span>`,
                  );
                }
                if (brandCostMax != brandCostMin) {
                  tangoCardOptionCostHolder.append(
                    `${brandCostMin} - ${brandCostMax} points`,
                  );
                } else {
                  tangoCardOptionCostHolder.append(`${brandCostMax} points`);
                }
                let tcGetOptionButton = $(
                  `<button id="btnRedeemTangoCardItem|_${brandDataItem.brandKey}" class="button btn tc-option-button" brandCode="${brandDataItem.brandKey}">Redeem</button>`,
                );

                tcGetOptionButton.on("click", function (event) {
                  let brandCode = $(this).attr("brandCode");
                  $("#tcProductCodeSelected", element).val(brandCode);
                  LoadSelectionItemForm(function () {
                    ShowSelectionItemForm();
                  }, brandCode);

                  event.stopPropagation();
                });
                tangoCardOptionButtonHolder.append(tcGetOptionButton);

                tangoCardOptionHolder.append(tangoCardOptionImageHolder);
                tangoCardOptionHolder.append(tangoCardOptionNameHolder);
                tangoCardOptionHolder.append(tangoCardOptionCostHolder);
                tangoCardOptionHolder.append(tangoCardOptionButtonHolder);

                tangoCardItemsHolder.append(tangoCardOptionHolder);
              }
            });
          } else {
            tangoCardItemsHolder.append(
              "No Tango Card Items found to display.",
            );
          }

          $("#tangoCardItemsListHolder", element).append(tangoCardItemsHolder);
          HideAllBrandDescriptions();

          if (callback != null) {
            callback();
          }
        }
        function RenderPointsToUseValue(points) {
          $("#tcIntegrationPointsToUse", element).empty();
          $("#tcIntegrationPointsToUse", element).append(points);
        }

        /* Data Rendering END */
        /* Editor Loading START */
        function LoadSelectionItemForm(callback, brandCodeToLoad) {
          let brandObject = availableTangoCardOptions.BrandOptions.find((i) => i.TangoCardBrandKey == brandCodeToLoad);
          let minValue = null;
          let maxValue = null;

          let currentUserAvailablePointsBalance = 0;
          let currentUserAvailableDollarBalance = 0;
          if (currentUserBalance != null) {
            currentUserAvailablePointsBalance = (currentUserBalance.TotalPointsEarned || 0) - (currentUserBalance.TotalPointsUsed || 0);
          }
          currentUserAvailableDollarBalance = parseFloat(currentUserAvailablePointsBalance * dollarPointsConversionValue);

          if (brandObject != null) {
            if (brandObject.BrandItems != null) {
              let imageUrl = brandObject.BrandImages.ImageUrl3;
              let brandOptionImage = $(`<img src="${imageUrl}" />`);
              $("#optionBrandImageHolder", element).empty();
              $("#optionBrandImageHolder", element).append(brandOptionImage);
              //load description
              $("#optionBrandDescriptionInformationHolder", element).empty();
              $("#optionBrandDescriptionInformationHolder", element).append(CleanHtmlText(brandObject.Description));
              
              if(brandObject.BrandRequirements != null && brandObject.BrandRequirements != "")
              {
                if (brandObject.BrandRequirements.TermsAndConditionsInstructions != null && brandObject.BrandRequirements.TermsAndConditionsInstructions != "") {
                  let tcInfoHolder = $(`<div class="tango-card-item-terms-conditions-holder" />`);
                  tcInfoHolder.append("<h4>Terms and Conditions</h4>");
                  tcInfoHolder.append(CleanHtmlText(brandObject.BrandRequirements.TermsAndConditionsInstructions));
                  $("#optionBrandDescriptionInformationHolder", element).append(tcInfoHolder);
                }
                // if (brandObject.BrandRequirements.DisclaimerInstructions != null && brandObject.BrandRequirements.DisclaimerInstructions != "") {
                //   let disclaimerInfoHolder = $(`<div class="tango-card-item-disclaimer-holder" />`);
                //   disclaimerInfoHolder.append("<h4>Disclaimer</h4>");
                //   disclaimerInfoHolder.append(CleanHtmlText(brandObject.BrandRequirements.DisclaimerInstructions));
                //   $("#optionBrandDescriptionInformationHolder", element).append(disclaimerInfoHolder);
                // }
              }

              //load items
              let itemOptionHolder = $(`<div class="tango-card-available-item-options-holder" />`);
              let itemOptions = brandObject.BrandItems;
              itemOptions = itemOptions.sort((a, b) => {
                let aValue = null;
                if (a.FaceValue != null) {
                  aValue = a.FaceValue;
                } else if (a.MinValue != null) {
                  aValue = a.MinValue;
                }
                if (aValue != null && aValue < (b.FaceValue || b.MinValue)) {
                  return -1;
                } else if (aValue != null && aValue > (b.FaceValue || b.MinValue)) {
                  return 1;
                } else {
                  return 0;
                }
              });
              itemOptions.forEach(function (availableItem) {
                let availableItemOption = $(`<div class="tango-card-option-item" id="variableItemOptionHolder|_${availableItem.TangoCardId}" productCode="${availableItem.TangoCardId}" />`);
                let availableItemNameHolder = $(`<div class="tango-card-option-item-name-holder" />`);

                if (availableItem.FaceValue != null) {
                  minValue = null;
                  maxValue = null;
                  dollarValueRedeem = availableItem.FaceValue;

                  let availableItemOptionSelector = $(`<input type="radio" id="availableItemRadio|_${availableItem.TangoCardId}"  name="avaialbleItemRadio" value="${availableItem.TangoCardId}" class="tango-card-input-option tc-textbox" productCode="${availableItem.TangoCardId}" brandKey="${availableItem.TangoCardBrandKey}" />`);

                  availableItemOptionSelector.off("change").on("change", function () {
                    let productCode = $(this).attr("productCode");
                    let brandKey = $(this).attr("brandKey");

                      CalculatePointsRequirements(function (requiredPoints) {
                        RenderPointsToUseValue(requiredPoints);
                      }, productCode, brandKey);
                    });

                  availableItemNameHolder.append(`<b>${availableItem.RewardName}</b>`);

                  if (dollarValueRedeem > currentUserAvailableDollarBalance) {
                    $(availableItemOptionSelector).prop("disabled", "disabled");
                    $(availableItemNameHolder).addClass("not-enough-user-points");
                  }

                  availableItemOption.append(availableItemOptionSelector);
                  availableItemOption.append(availableItemNameHolder);
                } else if (availableItem.MinValue != null ||availableItem.MaxValue != null) {
                  minValue = availableItem.MinValue;
                  maxValue = availableItem.MaxValue;
                  dollarValueRedeem = null;

                  availableItemOption.removeClass("tango-card-option-item");
                  availableItemOption.addClass("tango-card-option-item-full-line");

                  availableItemNameHolder.append(`<b>${availableItem.RewardName}</b>`);

                  let availableItemCostHolder = $(`<div class="tango-card-option-item-cost-holder" />`);
                  availableItemCostHolder.append(`${availableItem.MinValue.toLocaleString("en-US", { style: "currency", currency: "USD" })} - ${availableItem.MaxValue.toLocaleString("en-US", { style: "currency", currency: "USD" })}`);

                  let optionInputHolder = $(`<div class="tango-card-option-item-flex-value-holder" />`);
                  let optionInput = $(`<input type="textbox" class="tango-card-input-option tc-radio" id="variableItemInput|_${availableItem.TangoCardId}" productCode="${availableItem.TangoCardId}" brandKey="${availableItem.TangoCardBrandKey}" placeholder="$0.00" />`);
                  optionInput.off("blur").on("blur", function () {
                    let productCode = $(this).attr("productCode");
                    let brandKey = $(this).attr("brandKey");
                    CalculatePointsRequirements(function (requiredPoints) {
                      RenderPointsToUseValue(requiredPoints);
                    }, productCode, brandKey);
                  });
                  optionInputHolder.append(optionInput);

                  availableItemOption.append(availableItemNameHolder);
                  availableItemOption.append(availableItemCostHolder);
                  availableItemOption.append(optionInputHolder);
                }


                itemOptionHolder.append(availableItemOption);
              });


              $("#optionBrandAvailableItemsHolder", element).empty();
              $("#optionBrandAvailableItemsHolder", element).append(itemOptionHolder);
            }
          }

          $("#tcProductCodeBrandName", element).val(brandObject.Name);
          $("#tcProductCodeDollarValueToRedeem", element).val("");
          $("#tcProductCodeMaxValue", element).val("");
          $("#tcProductCodeMinValue", element).val("");
          $("#tcProductCodeSelectedProductName", element).val("");
          if (minValue != null) {
            $("#tcProductCodeMinValue", element).val(minValue);
          }
          if (maxValue != null) {
            $("#tcProductCodeMaxValue", element).val(maxValue);
          }
          let userFirstName = currentUserProfile.FirstName;
          let userLastName = currentUserProfile.LastName;
          $("#tcIntegrationUserFirstName", element).val(userFirstName);
          $("#tcIntegrationUserLastName", element).val(userLastName);

          if (
            currentUserProfile.EmailAddress != null &&
            currentUserProfile.EmailAddress != ""
          ) {
            $("#tcIntegrationEmailToSendTo", element).val(
              currentUserProfile.EmailAddress,
            );
          }
          if (callback != null) {
            callback();
          }
        }
        // /* Editor Loading END */
        /* Editor Validation & Saving START */
        function ClearSelectionItemForm(callback) {
          $("#tcIntegrationPointsToUse", element).empty();
          $("#tcIntegrationPointsToUse", element).append("Select Below 👇");
          $("#tcProductCodeSelected", element).val("");
          $("#tcProductCodeDollarValueToRedeem", element).val("");
          $("#tcProduceCodeMinValue", element).val("");
          $("#tcProduceCodeMaxValue", element).val("");
          $("#tcProductCodePointsToUse", element).val(0);
          $("#tcProductCodeBrandName", element).val("");
          $("#tcProductCodeSelectedProductName", element).val("");

          if (callback != null) {
            callback();
          }
        }
        function ValidateSelectionItemForm(callback) {
          let isValid = false;
          let errorMessages = [];
          let currentUserAvailablePointsBalance = 0;
          if (currentUserBalance != null) {
            currentUserAvailablePointsBalance = (currentUserBalance.TotalPointsEarned || 0) - (currentUserBalance.TotalPointsUsed || 0);
          }
          let availableFunds = parseFloat(currentUserAvailablePointsBalance * dollarPointsConversionValue);

          //let userFullName = $("#tcIntegrationUserName", element).val();
          let userFirstName = $("#tcIntegrationUserFirstName", element).val();
          let userLastName = $("#tcIntegrationUserLastName", element).val();
          let userEmailAddress = $(
            "#tcIntegrationEmailToSendTo",
            element,
          ).val();
          let productCode = $("#tcProductCodeSelected", element).val();
          let productMinValue = parseFloat(
            $("#tcProductCodeMinValue", element).val(),
          );
          let productMaxValue = parseFloat(
            $("#tcProductCodeMaxValue", element).val(),
          );
          let valueToRedeem = parseFloat(
            $("#tcProductCodeDollarValueToRedeem", element).val(),
          );

          // if (userFullName == null || userFullName == "") {
          //   errorMessages.push({
          //     message: "User Name required.",
          //     fieldId: "tcIntegrationUserName",
          //     fieldClass: null,
          //   });
          // }
          if (userFirstName == null || userFirstName == "") {
            errorMessages.push({
              message: "First Name required.",
              fieldId: "tcIntegrationUserFirstName",
              fieldClass: null,
            });
          }
          if (userLastName == null || userLastName == "") {
            errorMessages.push({
              message: "Last Name required.",
              fieldId: "tcIntegrationUserLastName",
              fieldClass: null,
            });
          }
          if (userEmailAddress == null || userEmailAddress == "") {
            errorMessages.push({
              message: "Email Address required.",
              fieldId: "tcIntegrationEmailToSendTo",
              fieldClass: null,
            });
          } else if (userEmailAddress.indexOf("@") < 0) {
            errorMessages.push({
              message: "Email Address not properly formatted.",
              fieldId: "tcIntegrationEmailToSendTo",
              fieldClass: null,
            });
          }

          if (productCode == null || productCode == "") {
            errorMessages.push({
              message: "Product Code Error.",
              fieldId: "tcProductCodeSelected",
              fieldClass: null,
            });
          }
          if (valueToRedeem == null || valueToRedeem <= 0) {
            errorMessages.push({
              message: "Dollar value to redeem required.",
              fieldId: "tcProductCodeDollarValueToRedeem",
              fieldClass: null,
            });
          } else {
            if (productMinValue != null && productMinValue != "" && valueToRedeem < productMinValue) {
              errorMessages.push({
                message: "Dollar value to redeem is too small.",
                fieldId: "tcProductCodeMinValue",
                fieldClass: null,
              });
            }
            if (productMaxValue != null && productMaxValue != "" && valueToRedeem > productMaxValue) {
              errorMessages.push({
                message: "Dollar value to redeem is too large.",
                fieldId: "tcProductCodeMaxValue",
                fieldClass: null,
              });
            }
            if (valueToRedeem > availableFunds) {
              errorMessages.push({
                message: `You do not have enough points to redeem that dollar value.  Max amount you can claim is ${availableFunds.toLocaleString("en-US", { style: "currency", currency: "USD" })}`,
                fieldId: "tcProductCodeDollarValueToRedeem",
                fieldClass: null,
              });
            }
          }
          isValid = errorMessages.length == 0;
          if (isValid == true) {
            if (callback != null) {
              callback();
            }
          } else {
            let errorMessagePopupMessage = "Errors found:";
            errorMessages.forEach(function (message) {
              errorMessagePopupMessage += `\n${message.message}`;
            });
            alert(errorMessagePopupMessage);
          }
        }
        function SaveSelectionItemForm(callback) {
          let pointsToUse = $("#tcProductCodePointsToUse", element).val();
          let userFullName = $("#tcIntegrationUserName", element).val();
          let userFirstName = $("#tcIntegrationUserFirstName", element).val();
          let userLastName = $("#tcIntegrationUserLastName", element).val();
          let userEmailAddress = $("#tcIntegrationEmailToSendTo", element).val();
          let productCode = $("#tcProductCodeSelected", element).val();
          let valueToRedeem = parseFloat(
            $("#tcProductCodeDollarValueToRedeem", element).val(),
          );
          //let claimedBrandName = $("#tcProductCodeBrandName", element).val();
          let selectedProductName = $(
            "#tcProductCodeSelectedProductName",
            element,
          ).val();
          let quantityClaimed = 1;

          let objectToSave = {
            IRPASUserPointsClaimDetailId: -1,
            UserId: legacyContainer.scope.TP1Username,
            ClaimedItemName: selectedProductName,
            ClaimedOnDate: new Date().toLocaleDateString(),
            ClaimedQuantity: quantityClaimed,
            PointsCost: pointsToUse,
            DollarValue: valueToRedeem,
            ClaimedItemFromSystem: "TangoCard",
            ClaimedItemFromKey: productCode,
            UserFullNameOnClaimedItem: userFullName,
            UserFirstNameOnClaimedItem: userFirstName,
            UserLastNameOnClaimedItem: userLastName,
            UserEmailAddressOnClaimedItem: userEmailAddress,
            FulfillmentDate: null,
            FulfillmentBy: null,
            Status: "A",
            EntBy: legacyContainer.scope.TP1Username,
            EntDt: new Date().toLocaleDateString(),
            UpdBy: legacyContainer.scope.TP1Username,
            UpdDt: new Date().toLocaleDateString(),
          };

          a$.ajax({
            type: "POST",
            service: "C#",
            async: false,
            data: {
              lib: "selfserv",
              cmd: "saveIRPASUserRewardClaimDetail",
              objectToSave: JSON.stringify(objectToSave),
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              
              ko.postbox.publish("IRPASManagementUserBalanceReload", true);
              AddClaimSignal(null, objectToSave);
              HideSelectionItemForm();
              if (callback != null) {
                callback();
              }
            },
          });
        }
        /* Editor Validation & Saving END */
        /* Sorting Options START */
        /* Sorting Options END */
        /* Utility Functions START */
        function LoadCurrentUserProfileInformation(callback) {
          if (currentUserProfile == null) {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: false,
              data: {
                lib: "selfserv",
                cmd: "getUserProfile",
                userid: legacyContainer.scope.TP1Username,
                deepLoad: false,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                let returnObject = JSON.parse(data.userFullProfile);
                currentUserProfile = returnObject;

                if (callback != null) {
                  callback(returnData);
                }
              },
            });
          }
        }
        function GetBrandCostFromItemsList(itemList, costType) {
          let returnValue = null;
          if (costType == null || costType == "") {
            costType = "max";
          }
          if (itemList == null || itemList.length == 0) {
            return 0.0;
          }
          itemList.forEach(function (item) {
            switch (costType.toLowerCase()) {
              case "min".toLowerCase():
                if (item.FaceValue != null && (returnValue == null || item.FaceValue < returnValue)) {
                  returnValue = item.FaceValue;
                } else if (item.MinValue != null && (returnValue == null || item.MinValue < returnValue)) {
                  returnValue = item.MinValue;
                }
                break;
              case "max".toLowerCase():
                if (item.FaceValue != null && item.FaceValue > returnValue) {
                  returnValue = item.FaceValue;
                } else if (item.MinValue != null && item.MinValue > returnValue) {
                  returnValue = item.MaxValue;
                }
                break;
            }
          });
          if (returnValue == null) {
            returnValue = 0.0;
          }
          return parseFloat(returnValue);
        }
        function ConvertDollarValueToPoints(valueToConvert) {
          let returnValue = valueToConvert;
          if (
            dollarPointsConversionValue != null &&
            dollarPointsConversionValue != 0
          ) {
            returnValue = returnValue / dollarPointsConversionValue;
          }
          return returnValue;
        }
        function CalculatePointsRequirements(callback, productCode, brandKey) {
          let requiredPoints = 0;
          let brandObjects = availableTangoCardOptions.BrandOptions.find(b => b.TangoCardBrandKey == brandKey);
          let selectedItemObject = brandObjects.BrandItems.find((i) => i.TangoCardId == productCode);
          let inputAmount = 0;
          if (selectedItemObject != null) {
            if (selectedItemObject.ValueType.toLowerCase() == "FIXED_VALUE".toLowerCase()) {
              inputAmount = selectedItemObject.FaceValue;
              requiredPoints = ConvertDollarValueToPoints(selectedItemObject.FaceValue);
            } else if (selectedItemObject.ValueType.toLowerCase() =="VARIABLE_VALUE".toLowerCase()) {
              let inputObjectList = $("[id^='variableItemInput|_']");
              let inputValue = $(inputObjectList[0]).val() || 0;
              inputAmount = $(inputObjectList[0]).val() || 0;
              requiredPoints = ConvertDollarValueToPoints(inputValue);
            }
          }
          $("#tcProductCodeSelectedProductName", element).val(selectedItemObject.RewardName);

          $("#tcProductCodeDollarValueToRedeem", element).val(inputAmount);
          $("#tcProductCodePointsToUse", element).val(requiredPoints);

          if (callback != null) {
            callback(requiredPoints);
          }
        }
        function AddClaimSignal(callback, claimedObject) {
          a$.ajax({
            type: "POST",
            service: "C#",
            async: false,
            data: {
              lib: "selfserv",
              cmd: "addIRPASClaimSignal",
              offerType: "tangoCard",
              claimedUserId: claimedObject.UserId,
              claimedItemName: claimedObject.ClaimedItemName,
              //objectInfo: JSON.stringify(claimedObject),
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              if (callback != null) {
                callback();
              }
            },
          });
        }
        function CleanHtmlText(originalText)
        {
          let returnText = originalText;
          returnText = returnText?.replaceAll("&lt;", "<");
          returnText = returnText?.replaceAll("&gt;", ">");
          returnText = returnText?.replaceAll("&amp;reg;", "&reg;")
          returnText = returnText?.replaceAll("&amp;amp;", "&amp;")
          returnText = returnText?.replaceAll("&amp;ndash;", "&ndash;");
          returnText = returnText?.replaceAll("&amp;trade;", "&trade;");
          returnText = returnText?.replaceAll("&amp;copy;", "&copy;");
          returnText = returnText?.replaceAll("&amp;nbsp;", "&nbsp;");
          returnText = returnText?.replaceAll("&amp;rsquo;", "&rsquo;");
          returnText = returnText?.replaceAll("&amp;#39;", "&#39;");
          returnText = returnText?.replaceAll("&amp;quot;", "&quot;");
          returnText = returnText?.replaceAll("&quot;", `\"`);
          return returnText;
        }
        /* Utility Functions END */
        /* Show/Hide START */
        function HideAll() {
          HidePhyicalAddressCollectionInput();
          HideSelectionItemForm();
          HideAllBrandDescriptions();
        }
        function HideAllBrandDescriptions() {
          //$("[id^='tangoCardBrandDescriptionHolder']", element).hide();
          $(".tc-option-description-holder", element).hide();
        }
        function HideSelectionItemForm() {
          $("#tangoCardItemSelectionForm", element).hide();
        }
        function ShowSelectionItemForm() {
          $("#tangoCardItemSelectionForm", element).show();
        }
        function HidePhyicalAddressCollectionInput() {
          $("#tcIntegration_PhysicalAddressInputHolder", element).hide();
        }
        function ShowPhyicalAddressCollectionInput() {
          $("#tcIntegration_PhysicalAddressInputHolder", element).show();
        }
        function ToggleDescription(brandCode) {
          let isVisible = $(
            `[id='tangoCardBrandDescriptionHolder|_${brandCode}'`,
          ).is(":visible");
          if (isVisible) {
            $(`[id='tangoCardBrandDescriptionHolder|_${brandCode}'`).hide();
          } else {
            $(`[id='tangoCardBrandDescriptionHolder|_${brandCode}'`).show();
          }
        }
        /* Show/Hide END */

        scope.load = function () {
          scope.Initialize();
          LoadDirective();
        };
        //scope.load();

        ko.postbox.subscribe("IRPASManagementInit", function () {
          scope.Initialize();
        });
        ko.postbox.subscribe("IRPASManagementLoad", function () {
          //scope.load();
          LoadDirective();
        });
        ko.postbox.subscribe("IRPASManagementReload", function (forceReload) {
          LoadDirective(null, forceReload);
        });
        ko.postbox.subscribe(
          "CurrentUserBalanceLoaded",
          function (userBalanceSummary) {
            currentUserBalance = null;
            currentUserBalance = userBalanceSummary[0];
          },
        );
      },
    };
  },
]);

