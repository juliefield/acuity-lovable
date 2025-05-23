angularApp.directive("ngAgameThemeAdmin", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl: a$.debugPrefix() + "/applib/dev/AGAMEADMIN1/view/agameThemeAdmin.htm?" + Date.now(),
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
        let agameThemesList = [];
        let availablePositions = [];
        let availableDestinations = [];
        let defaultBackgroundImage = "/applib/css/images/themes/default/Background.jpg";
        let defaultIconImage = "/applib/css/images/agame-countdown-icon.png";
        let defaultImage = "/applib/css/images/launch-agame.png";
        let defaultThemeLogoImage = "/applib/css/images/launch-agame.png";
        /* Events Handling START */
        $(".btn-close", element)
          .off("click")
          .on("click", function () {
            console.log("🚀  |  agameThemeAdmin.js:27  |  Close form clicked.");
            ClearEditorForm(function () {
              HideThemeEditorForm();
            });
          });
        $(".btn-close-position-editor", element)
          .off("click")
          .on("click", function () {
            console.log("🚀  |  agameThemeAdmin.js:27  |  Close form - position - clicked.");
            ClearPositionEditorForm(function () {
              HidePositionEditorForm();
            });
          });
        $(".btn-close-destination-editor", element)
          .off("click")
          .on("click", function () {
            console.log("🚀  |  agameThemeAdmin.js:27  |  Close form - destination - clicked.");
            ClearDestinationEditorForm(function () {
              HideDestinationEditorForm();
            });
          });
        $("#btnAddNewTheme", element)
          .off("click")
          .on("click", function () {
            console.log("🚀  |  agameThemeAdmin.js:31  |  Add New Theme Clicked Handler");
            ShowThemeEditorForm();
          });
        $("#btnSaveEditorForm", element)
          .off("click")
          .on("click", function () {
            console.log("🚀  |  agameThemeAdmin.js:35  |  Save Editor Clicked Handler");
            HideThemeEditorForm();
          });
        $("#btnAddNewPositionOption", element)
          .off("click")
          .on("click", function () {
            console.log("Add New position option clicked.  Show a form to add the information.");
            ShowPositionEditorForm();
          });

        $("#btnAddNewDestinationOption", element)
          .off("click")
          .on("click", function () {
            console.log("Add New Destination option clicked.  Show a form to add the information.");
            ShowDestinationEditorForm();
          });
        $("#agameThemeEditor_ThemeLogo_ImageHolder", element)
          .off("click")
          .on("click", function () {
            console.log("Theme Logo Clicked. Create change option");
            alert("NYI: Change logo option clicked.");
          });
        $("#agameThemeEditor_ThemeImage_ImageHolder", element)
          .off("click")
          .on("click", function () {
            console.log("Theme Image Clicked. Create change option");
            alert("NYI: Change theme image option clicked.");
          });
        $("#agameThemeEditor_ThemeBackgroundImage_ImageHolder", element)
          .off("click")
          .on("click", function () {
            console.log("Theme background Clicked. Create change option");
            alert("NYI: Change background image option clicked.");
          });
        $("#agameThemeEditor_ThemeDefaultTeamIcon_ImageHolder", element)
          .off("click")
          .on("click", function () {
            console.log("Theme default team icon Clicked. Create change option");
            alert("NYI: Change team icon image option clicked.");
          });
        $("[name^='agameThemeEditor_DestinationReferenceType']").off("change").on("change", function(){
          let sectionToHandle = $(this).val();
          console.log("🚀  |  agameThemeAdmin.js:106  |  $  |  sectionToHandle:", sectionToHandle);
          let sectionToShow = "Unknown";
          switch(sectionToHandle.toLowerCase()){
            case "file":
              sectionToShow = "formSection_Destination_File";
              break;
            case "nonfile":
              sectionToShow = "formSection_Destination_NonFile";
              break;
          }
          ShowDestinationEditorTypeSection(sectionToShow);
        });
        /* Events Handling END*/
        function Initialize() {
          GetCurrentPositions(null, true);
          GetAllThemeDestinations();
        }
        /* Load Functions START */
        function LoadCurrentThemes(callback) {
          GetCurrentThemes(function (themesList) {
            RenderCurrentThemes(callback, themesList);
          });
        }
        function LoadPositionEditorForTheme(callback, themeId) {
          $("#themeEditorPositionList", element).empty();
          let themePositionList = availablePositions.filter((i) => i.ThemeId == themeId);
          let positionCounter = 1;
          let totalPositionsFound = 0;
          if (themePositionList != null && themePositionList.length > 0) {
            themePositionList.forEach(function (themeItem) {
              let positionRow = $(`<div class="agame-theme-editor-position-list-item-row" />`);
              let positionName = themeItem.Name || themeItem.PositionName || `Position ${positionCounter}`;
              let positionQuantity = themeItem.Quantity || themeItem.DefaultQuantity || 1;
              let defaultPositionMultiplier = themeItem.Multiplier || themeItem.DefaultMultiplier || 1;

              let positionEditButton = $(`<button id="positionNameEditButton_${themeId}_${positionCounter}" class="" themeId="${themeId}" positionId="${themeItem.Id}" positionCounter="${positionCounter}"><i class="fa fa-edit"></i></button>`);
              let positionNameHolder = $(`<span id="positionNameHolder_${themeId}_${positionCounter}" class="" themeId="${themeId}" positionId="${themeItem.Id}" positionCounter="${positionCounter}" />`);
              let positionQuantityHolder = $(`<span id="positionQuantityHolder_${themeId}_${positionCounter}" class="" themeId="${themeId}" positionId="${themeItem.Id}" positionCounter="${positionCounter}" />`);
              let positionMultiplierHolder = $(`<span id="positionDefaultMultiplierHolder_${themeId}_${positionCounter}" class="" themeId="${themeId}" positionId="${themeItem.Id}" positionCounter="${positionCounter}" />`);

              positionEditButton.on("click", function () {
                let themeId = $(this).attr("themeId");
                let positionId = $(this).attr("positionId");
                let positionCounter = $(this).attr("positionCounter");
                console.log(`Position Edit Button Clicked.  Do something. ${themeId}| ${positionId} | ${positionCounter}`);
                LoadPositionEditorForm(
                  function () {
                    ShowPositionEditorForm();
                  },
                  themeId,
                  positionId,
                  positionCounter
                );
              });

              positionNameHolder.append(`[${positionName}]`);
              positionQuantityHolder.append(`[${positionQuantity}]`);
              positionMultiplierHolder.append(`[${defaultPositionMultiplier}]`);

              positionRow.append(`${positionCounter}`);
              positionRow.append(positionNameHolder);
              positionRow.append(positionQuantityHolder);
              positionRow.append(positionMultiplierHolder);
              positionRow.append(positionEditButton);

              $("#themeEditorPositionList", element).append(positionRow);
              totalPositionsFound += themeItem.Quantity || themeItem.DefaultQuantity || 0;
              positionCounter++;
            });
          }
          $("#agameThemeEditor_PositionListCount", element).empty();
          $("#agameThemeEditor_PositionListCount", element).append(totalPositionsFound);

          if (callback != null) {
            callback();
          }
        }
        function LoadDestinationEditorForTheme(callback, themeId) {
          $("#themeEditorDestinationList", element).empty();
          GetCurrentThemeDesitinations(function(destinationList){
            RenderCurrentThemeEditorDestinations(function(){
              if(callback != null)
              {
                callback();
              }
            }, destinationList);
          }, themeId);

          if (callback != null) {
            callback();
          }
        }

        function BuildPositionListForTheme(themeId, renderToItem) {
          let returnPositionList = $(`<ul class="agame-theme-position-list-holder" themeId="${themeId}" />`);
          let themePositionList = availablePositions.filter((i) => i.ThemeId == themeId);
          let positionCounter = 0;
          if (themePositionList != null && themePositionList.length > 0) {
            themePositionList.forEach((element) => {
              let listItem = $(`<li class="agame-theme-position-list-item" themeId="${themeId}" positionId="${element.Id}" />`);
              let positionName = element.Name || element.PositionName || `Position ${positionCounter}`;
              if (element.DefaultQuantity > 1) {
                positionName = `${positionName} (${element.DefaultQuantity})`;
              }
              listItem.text(positionName);
              returnPositionList.append(listItem);
              //positionCounter++;
              positionCounter += element.DefaultQuantity;
            });
          } else {
            positionCounter = 1;
            while (positionCounter <= 8) {
              let listItem = $(`<li class="agame-theme-position-list-item" themeId="${themeId}" positionId="0" positionCounter="${positionCounter}" />`);
              listItem.text(` **** Position ${positionCounter} NAME NEEDED ****`);
              returnPositionList.append(listItem);
              positionCounter++;
            }
            positionCounter > 8 ? (positionCounter = 8) : positionCounter;
          }
          if (renderToItem != null) {
            $(renderToItem).append(`<div>Positions (${positionCounter})</div>`);
            $(renderToItem).append(returnPositionList);
            return;
          } else {
            return returnPositionList;
          }
        }

        function BuildDestinationListForTheme(themeId, renderToItem) {
          let destinationList = $(`<ul class="agame-theme-destionation-list-holder" themeId="${themeId}" />`);

          let destinationsForTheme = GetCurrentThemeDesitinations(null,themeId);
          destinationsForTheme.forEach(function(destination){
            let listItem = $(`<li class="agame-theme-destination-list-item" themeId="${themeId}" destinationId="${destination.Id}" destinationCounter="${destination.DestinationNumber}" />`);
            listItem.text(destination.Name);
            destinationList.append(listItem);
          });

          if (renderToItem != null) {
            $(renderToItem).append(destinationList);
          } else {
            return destinationList;
          }
        }
        /* Load Functions END */
        /* Get Data Functions START */
        function GetCurrentThemes(callback) {
          a$.ajax({
            type: "POST",
            service: "C#",
            async: true,
            data: {
              lib: "flex",
              cmd: "getAGameThemeList",
            },
            dataType: "json",
            cache: false,
            error: function (response) {
              a$.ajaxerror(response);
            },
            success: function (data) {
              if (data.errormessage != null && data.errormessage == "true") {
                a$.jsonerror(data);
                return;
              } else {
                let returnData = JSON.parse(data.aGameThemeList);
                console.log("🚀  |  agameThemeAdmin.js:80  |  GetCurrentThemes  |  returnData:", returnData);
                agameThemesList.length = 0;
                agameThemesList = [...returnData];
                if (callback != null) {
                  callback(returnData);
                }
              }
            },
          });
        }
        function GetCurrentPositions(callback, forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          if (availablePositions != null && availablePositions.length > 0 && forceReload == false) {
            let loadEvent = new CustomEvent("agameThemeAdmin_PositionsLoaded", {});
            window.dispatchEvent(loadEvent);

            if (callback != null) {
              callback(availablePositions);
            }
          } else {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "flex",
                cmd: "getAllAGameDefaultPositions",
              },
              dataType: "json",
              cache: false,
              error: function (response) {
                a$.ajaxerror(response);
              },
              success: function (data) {
                if (data.errormessage != null && data.errormessage == "true") {
                  a$.jsonerror(data);
                  return;
                } else {
                  let returnData = JSON.parse(data.defaultPositionsList);
                  console.log("🚀  |  agameThemeAdmin.js:151  |  GetCurrentPositions  |  returnData:", returnData);
                  availablePositions.length = 0;
                  availablePositions = [...returnData];

                  let loadEvent = new CustomEvent("agameThemeAdmin_PositionsLoaded", {});
                  window.dispatchEvent(loadEvent);

                  if (callback != null) {
                    callback(returnData);
                  }
                }
              },
            });
          }
        }
        function GetCurrentThemeDesitinations(callback, themeId) {
          let returnInfo = availableDestinations.filter(i => i.ThemeId == themeId);
          if (callback != null) {
            callback(returnInfo);
          }
          else
          {
            return returnInfo;
          }
        }
        function GetAllThemeDestinations(callback) {
          a$.ajax({
            type: "POST",
            service: "C#",
            async: false,
            data: {
              lib: "flex",
              cmd: "getAllAGameThemeDestinationData",
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              if (data.errormessage != null && data.errormessage != "") {
                a$.jsonerror(data);
                return;
              } else {
                let destinationList = JSON.parse(data.destinationList);
                availableDestinations.length = 0;
                availableDestinations = [... destinationList];
                console.log("🚀  |  agameThemeAdmin.js:354  |  GetThemeDestinations  |  data.destinationList:", data.destinationList);
                if (callback != null) {
                  callback();
                }
              }
            },
          });
        }
        /* Get Data Functions END */
        /* Render Functions START */
        function RenderCurrentThemes(callback, listToRender) {
          console.log("🚀  |  agameThemeAdmin.js:69  |  RenderCurrentThemes  |  function:", RenderCurrentThemes);
          if (listToRender == null) {
            listToRender = agameThemesList;
          }
          let themeListingCount = 0;
          $("#agameThemeListing", element).empty();
          let themeListingHolder = $(`<div id="themeListingHolder" class="agame-theme-listing-holder" />`);
          if (listToRender != null && listToRender.length > 0) {
            console.log("🚀  |  agameThemeAdmin.js:74  |  RenderCurrentThemes  |  listToRender:", listToRender);
            themeListingCount = listToRender.length;
            listToRender.forEach((themeItem) => {
              let themeHasDestintations = themeItem.HasDestinationPopups || false;
              let themeItemHolder = $(`<div class="agame-theme-listing-item-holder" id="themeItemHolder_${themeItem.Id}" themeId="${themeItem.Id}" />`);

              let themeBackgroundHolder = $(`<div class="agame-theme-data-background-holder" id="themeBackgroundHolder_${themeItem.Id}" themeId="${themeItem.Id}" />`);
              let themeImageHolder = $(`<div class="agame-theme-data-item-holder image-holder" id="themeImageHolder_${themeItem.Id}" themeId="${themeItem.Id}" />`);
              let themeIconHolder = $(`<div class="agame-theme-data-item-holder icon-holder" id="themeIconHolder_${themeItem.Id}" themeId="${themeItem.Id}" />`);
              let themeNameHolder = $(`<div class="agame-theme-data-item-holder theme-name" />`);
              let themeButtonHolder = $(`<div class="agame-theme-data-item-holder theme-buttons" />`);
              let positionListHolder = $(`<div class="agame-theme-data-item-holder position-list-holder" />`);
              let destinationListHolder = $(`<div class="agame-theme-data-item-holder destionation-list-holder" />`);
              let editThemeButton = $(`<button class="agame-theme-data-item edit-theme-button" id="editThemeButton_${themeItem.Id}" themeId=${themeItem.Id}><i class="fa fa-edit"></i></button>`);

              editThemeButton.on("click", function () {
                let themeId = $(this).attr("themeId");
                console.log("🚀  |  agameThemeAdmin.js:107  |  editThemeButton.on  |  themeId:", themeId);
                LoadThemeEditorForm(function () {
                  ShowThemeEditorForm();
                }, themeId);
              });

              let themeName = themeItem.Name;
              //TODO: Handle the gameTypeName from database or some config listing?
              let gameTypeName = "Team";
              if (themeItem.GameType.toUpperCase() == "I".toUpperCase()) {
                gameTypeName = "Individual";
              }
              let backgroundImageSource = themeItem.ThemeBackgroundImage || defaultBackgroundImage;
              let themeIconImageSource = themeItem.ThemeDefaultTeamIcon || defaultIconImage;
              let themeImageSource = themeItem.ThemeImage || defaultImage;

              let themeBackgroundImage = $(`<img src="${backgroundImageSource}" class="agame-theme-background-image" />`);
              let themeIconImage = $(`<img src="${themeIconImageSource}" class="agame-theme-icon-image" />`);
              let themeImage = $(`<img src="${themeImageSource}" class="agame-theme-image" />`);

              BuildPositionListForTheme(themeItem.Id, positionListHolder);
              if (themeHasDestintations == true) {
                BuildDestinationListForTheme(themeItem.Id, destinationListHolder);
              }

              themeBackgroundHolder.append(themeBackgroundImage);

              themeImageHolder.append(themeImage);
              themeIconHolder.append(themeIconImage);

              themeButtonHolder.append(editThemeButton);
              themeNameHolder.append(themeName);
              themeNameHolder.append(`<br />`);
              themeNameHolder.append(`(${gameTypeName})`);

              themeItemHolder.append(themeBackgroundHolder);
              themeItemHolder.append(themeImageHolder);
              themeItemHolder.append(themeIconHolder);
              themeItemHolder.append(themeNameHolder);
              themeItemHolder.append(themeButtonHolder);
              themeItemHolder.append(positionListHolder);
              themeItemHolder.append(destinationListHolder);

              themeListingHolder.append(themeItemHolder);
            });
          } else {
            console.log("🚀  |  agameThemeAdmin.js:78  |  RenderCurrentThemes  |  No Records found.");
            themeListingHolder.append("No Themes found.");
          }
          $("#agameThemeFoundCount", element).empty();
          $("#agameThemeFoundCount", element).append(themeListingCount);

          $("#agameThemeListing", element).append(themeListingHolder);
          if (callback != null) {
            callback();
          }
        }
        function RenderCurrentThemeEditorDestinations(callback, listToRender)
        {
          if(listToRender != null)
          {
            let destCounter = 1;
            listToRender.forEach(function(destinationItem){
              let destinationRow = $(`<div class="agame-theme-editor-position-list-item-row" />`);
              let destinationName = destinationItem.Name
              let destinationId = destinationItem.Id;
              let themeId = destinationItem.ThemeId;

              let destinationEditButton = $(
                `<button id="destinationEditButton_${themeId}_${destinationId}" class="button btn destination-edit-button" themeId="${themeId}" destinationId="${destinationId}" destinationCounter="${destCounter}"><i class="fa fa-edit"></i></button>`
              );

              let destinationNameHolder = $(`<span id="destinationNameHolder_${themeId}_${destinationId}" />`);

              destinationEditButton.on("click", function () {
                let themeId = $(this).attr("themeId");
                let destinationId = $(this).attr("destinationId");
                let destinationCounter = $(this).attr("destinationCounter");
                console.log(`Dest Edit Button Clicked.  Do something. ${themeId}| ${destinationId} | ${destinationCounter}`);
                GetCurrentThemeDesitinations(null, themeId);
                LoadDestinationEditorForm(
                  function () {
                    ShowDestinationEditorForm();
                  },
                  themeId,
                  destinationId,
                  destinationCounter
                );
              });
              destinationNameHolder.append(destinationName);

              destinationRow.append(`${destCounter}`);
              destinationRow.append(destinationNameHolder);
              destinationRow.append(destinationEditButton);

               $("#themeEditorDestinationList", element).append(destinationRow);
              destCounter++;
            });
            if(callback != null)
            {
              callback();
            }
          }
        }
        /* Render Functions END */

        /* Form Handling Functions START */
        function LoadThemeEditorForm(callback, themeId) {
          console.log("🚀  |  agameThemeAdmin.js:298  |  LoadThemeEditorForm | themeId:", themeId);
          let themeObject = agameThemesList.find((i) => i.Id == themeId);
          if (themeObject != null) {
            $("#agameThemeEditor_ThemeId", element).val(themeId);
            $("#agameThemeEditor_Name", element).val(themeObject.Name);
            $("#agameThemeEditor_GameType", element).val(themeObject.GameType);
            $("#agameThemeEditor_ShortName", element).val(themeObject.ThemeShortName);
            $("#agameThemeEditor_ThemeTag", element).val(themeObject.ThemeTag);

            $("#agameThemeEditor_ThemeLogo", element).val(themeObject.ThemeLogoImage);
            $("#agameThemeEditor_ThemeLogo_ImageHolder", element).prop("src", themeObject.ThemeLogoImage);

            $("#agameThemeEditor_ThemeImage", element).val(themeObject.ThemeImage);
            $("#agameThemeEditor_ThemeImage_ImageHolder", element).prop("src", themeObject.ThemeImage);
            //
            $("#agameThemeEditor_ThemeBackgroundImage", element).val(themeObject.ThemeBackgroundImage);
            $("#agameThemeEditor_ThemeBackgroundImage_ImageHolder", element).prop("src", themeObject.ThemeBackgroundImage);
            //
            $("#agameThemeEditor_ThemeDefaultTeamIcon", element).val(themeObject.ThemeDefaultTeamIcon);
            $("#agameThemeEditor_ThemeDefaultTeamIcon_ImageHolder", element).prop("src", themeObject.ThemeDefaultTeamIcon);

            $("#agameThemeEditor_HasDestinations", element).prop("checked", themeObject.HasDestinationPopups == true);

            $("#agameThemeEditor_DefaultColor1Selector", element).empty();
            $("#agameThemeEditor_DefaultColor1Selector", element).append("&nbsp;");
            $("#agameThemeEditor_DefaultColor2Selector", element).empty();
            $("#agameThemeEditor_DefaultColor2Selector", element).append("&nbsp;");
            $("#agameThemeEditor_DefaultColor3Selector", element).empty();
            $("#agameThemeEditor_DefaultColor3Selector", element).append("&nbsp;");
            // $("#agameThemeEditor_DefaultColor4Selector", element).empty();
            // $("#agameThemeEditor_DefaultColor4Selector", element).append("&nbsp;");
            // $("#agameThemeEditor_DefaultColor5Selector", element).empty();
            // $("#agameThemeEditor_DefaultColor5Selector", element).append("&nbsp;");

            if (themeObject.DefaultIconColor1 != null && themeObject.DefaultIconColor1 != "") {
              $("#agameThemeEditor_DefaultColor1Selector", element).append(themeObject.DefaultIconColor1);
              $("#agameThemeEditor_DefaultColor1Selector", element).css("background-color", `${themeObject.DefaultIconColor1}`);
            }
            if (themeObject.DefaultIconColor2 != null && themeObject.DefaultIconColor2 != "") {
              $("#agameThemeEditor_DefaultColor2Selector", element).append(themeObject.DefaultIconColor2);
              $("#agameThemeEditor_DefaultColor2Selector", element).css("background-color", `${themeObject.DefaultIconColor2}`);
            }
            if (themeObject.DefaultIconColor3 != null && themeObject.DefaultIconColor3 != "") {
              $("#agameThemeEditor_DefaultColor3Selector", element).append(themeObject.DefaultIconColor3);
              $("#agameThemeEditor_DefaultColor3Selector", element).css("background-color", `${themeObject.DefaultIconColor3}`);
            }
            // if (themeObject.DefaultIconColor4 != null && themeObject.DefaultIconColor4 != "") {
            //   $("#agameThemeEditor_DefaultColor4Selector", element).append(themeObject.DefaultIconColor4);
            //   $("#agameThemeEditor_DefaultColor4Selector", element).css("background-color", `${themeObject.DefaultIconColor4}`);
            // }
            // if (themeObject.DefaultIconColor5 != null && themeObject.DefaultIconColor5 != "") {
            //   $("#agameThemeEditor_DefaultColor5Selector", element).append(themeObject.DefaultIconColor5);
            //   $("#agameThemeEditor_DefaultColor5Selector", element).css("background-color", `${themeObject.DefaultIconColor5}`);
            // }

            LoadPositionEditorForTheme(null, themeId);
            if (themeObject.HasDestinationPopups == true) {
              LoadDestinationEditorForTheme(null, themeId);
            }
          }

          if (callback != null) {
            callback();
          }
        }
        function LoadPositionEditorForm(callback, themeId, positionId, positionCounter) {
          console.log(`LoadPositionEditorForm(callback, ${themeId}, ${positionId}, ${positionCounter})`);
          let positionObject = availablePositions.find((i) => i.ThemeId == themeId && i.PositionId == positionId);
          if (positionObject != null) {
            $("#agameThemeEditor_PositionName", element).val(positionObject.PositionName);
            $("#agameThemeEditor_PositionDefaultQuantity", element).val(positionObject.DefaultQuantity);
            $("#agameThemeEditor_PositionDefaultMultiplier", element).val(positionObject.DefaultMultiplier);
            $("#agameThemeEditor_PositionId", element).val(positionObject.PositionId);
          } else {
            console.log(`Position information not found in array.  We need to do something with this for editing.\nThemeID: ${themeId}\nPositionId:${positionId}\nPositionCounter:${positionCounter}\n`);
          }
          if (callback != null) {
            callback();
          }
        }
        function LoadDestinationEditorForm(callback, themeId, destinationId, destinationCounter) {
          console.log(`LoadDestinationEditorForm(callback, ${themeId}, ${destinationId}, ${destinationCounter})`);
          let destinationObject = availableDestinations.find(i => i.ThemeId == themeId && i.DestinationId == destinationId);
          let fileDisplayValue = "nonfile";
          if (destinationObject != null) {
            $("#agameThemeEditor_DestinationId", element).val(destinationObject.Id);
            $("#agameThemeEditor_DestinationThemeId", element).val(destinationObject.ThemeId);
            $("#agameThemeEditor_DestinationName", element).val(destinationObject.DestinationName);
            $("#agameThemeEditor_DestinationNumber", element).val(destinationObject.DestinationNumber);
            if(destinationObject.UseFileAsDisplayInfo == true)
            {
              fileDisplayValue = "file";
            }
            $("#agameThemeEditor_HeaderImage", element).val(destinationObject.HeaderImageUrl);
            $("#agameThemeEditor_DestinationTokenUrl", element).val(destinationObject.DestinationTokenImageUrl);
            $("#agameThemeEditor_DestinationHtml", element).val(destinationObject.DestinationThemeMarkup);
            $("#agameThemeEditor_DestinationFileUrl", element).val(destinationObject.DestinationFileReferencePath);
          } else {
            console.log(`Destination information not found in array.  We need to do something with this for editing.\nThemeID: ${themeId}\DestinationId:${destinationId}\nDestinationCounter:${destinationCounter}\n`);
          }
          $(`input:radio[name=agameThemeEditor_DestinationReferenceType][value="${fileDisplayValue}"]`, element).attr("checked","checked")
          $(`input:radio[name=agameThemeEditor_DestinationReferenceType][value="${fileDisplayValue}"]`, element).trigger("change");

          if (callback != null) {
            callback();
          }
        }
        function ClearEditorForm(callback) {
          $("#agameThemeEditor_ThemeId", element).val("-1");
          $("#agameThemeEditor_Name", element).val("");
          $("#agameThemeEditor_GameType", element).val("T");
          $("#agameThemeEditor_ShortName", element).val("");
          $("#agameThemeEditor_ThemeTag", element).val("");
          $("#agameThemeEditor_ThemeLogo", element).val("");
          $("#agameThemeEditor_ThemeLogo_ImageHolder", element).prop("src", defaultThemeLogoImage);
          $("#agameThemeEditor_ThemeImage", element).val("");
          $("#agameThemeEditor_ThemeImage_ImageHolder", element).prop("src", defaultImage);
          $("#agameThemeEditor_ThemeBackgroundImage", element).val("");
          $("#agameThemeEditor_ThemeBackgroundImage_ImageHolder", element).prop("src", defaultBackgroundImage);
          $("#agameThemeEditor_ThemeDefaultTeamIcon", element).val("");
          $("#agameThemeEditor_ThemeDefaultTeamIcon_ImageHolder", element).prop("src", defaultIconImage);
          $("#agameThemeEditor_HasDestinations", element).prop("checked", false);
          $("#themeEditorDestinationList", element).empty();
          $("#themeEditorPositionList", element).empty();

          $("#agameThemeEditor_DefaultColor1Selector", element).empty();
          $("#agameThemeEditor_DefaultColor2Selector", element).empty();
          $("#agameThemeEditor_DefaultColor3Selector", element).empty();
          // $("#agameThemeEditor_DefaultColor4Selector", element).empty();
          // $("#agameThemeEditor_DefaultColor5Selector", element).empty();

          $("#agameThemeEditor_DefaultColor1Selector", element).css("background-color", `transparent`);
          $("#agameThemeEditor_DefaultColor2Selector", element).css("background-color", `transparent`);
          $("#agameThemeEditor_DefaultColor3Selector", element).css("background-color", `transparent`);
          // $("#agameThemeEditor_DefaultColor4Selector", element).css("background-color", `transparent`);
          // $("#agameThemeEditor_DefaultColor5Selector", element).css("background-color", `transparent`);

          $("#agameThemeEditor_PositionListCount", element).empty();

          $("#themeEditorPositionList", element).empty();
          if (callback != null) {
            callback();
          }
        }

        function ClearPositionEditorForm(callback) {
          $("#agameThemeEditor_PositionName", element).val("");
          $("#agameThemeEditor_PositionDefaultQuantity", element).val("");
          $("#agameThemeEditor_PositionDefaultMultiplier", element).val("");
          $("#agameThemeEditor_PositionId", element).val(-1);
          if (callback != null) {
            callback();
          }
        }
        function ClearDestinationEditorForm(callback) {
          $("#agameThemeEditor_DestinationId", element).val(-1);
          $("#agameThemeEditor_DestinationThemeId", element).val(-1);
          $("#agameThemeEditor_DestinationName", element).val("");
          $("#agameThemeEditor_DestinationNumber", element).val("");
          $("#agameThemeEditor_HeaderImage", element).val("");
          $("#agameThemeEditor_DestinationTokenUrl", element).val("");
          $("#agameThemeEditor_DestinationHtml", element).val("");
          $("#agameThemeEditor_DestinationFileUrl", element).val("");
          $(`input[type=radio]`, element).removeAttr("checked");
          HideAllDestinationEditorTypeSection();
          if (callback != null) {
            callback();
          }
        }
        /* Form Handling Functions END */
        /*Show/Hide START*/
        function HideAll() {
          HideAllEditorForms();
        }
        function HideAllEditorForms() {
          HideThemeEditorForm();
          HidePositionEditorForm();
          HideDestinationEditorForm();
          HideAllDestinationEditorTypeSection();
        }
        function HideThemeEditorForm() {
          $("#themeEditorForm", element).hide();
        }
        function ShowThemeEditorForm() {
          $("#themeEditorForm", element).show();
        }
        function HidePositionEditorForm() {
          $("#positionEditorForm", element).hide();
        }
        function ShowPositionEditorForm() {
          $("#positionEditorForm", element).show();
        }
        function HideDestinationEditorForm() {
          $("#destinationEditorForm", element).hide();
        }
        function ShowDestinationEditorForm() {
          $("#destinationEditorForm", element).show();
        }
        function HideAllDestinationEditorTypeSection() {
          $("[id^='formSection_Destination_']", element).hide();
        }
        function HideDestinationEditorTypeSection(sectionId){
          $(`#${sectionId}`, element).hide();
        }
        function ShowDestinationEditorTypeSection(sectionId){
          HideAllDestinationEditorTypeSection();
          $(`#${sectionId}`, element).show();
        }

        /*Show/Hide END*/
        scope.load = function () {
          Initialize();
          LoadCurrentThemes();
        };
        scope.load();
        ko.postbox.subscribe("AgameThemeAdminLoad", function () {
          scope.load();
        });
        window.addEventListener("agameThemeAdmin_PositionsLoaded", function () {
          //TODO: determine what all needs to be done on the event
          RenderCurrentThemes();
        });
      },
    };
  },
]);
