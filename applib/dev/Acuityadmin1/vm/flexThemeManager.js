angularApp.directive("ngFlexThemeManager", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl: a$.debugPrefix() + "/applib/dev/AcuityAdmin1/view/FlexThemeManager.htm?" + Date.now(),
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

        let defaultBoardImage = `${a$.debugPrefix()}/applib/css/images/themes/default/Background.jpg`;
        let directiveLookupOptions = {
          IsDevModeOn: legacyContainer.TP1Role == "Admin",
          ThemeTypes: [],
          FinishTypes: [],
          GameUnits: [],
          Status: [
            { Id: "A", Name: "Active", ThemeClassName:"active-theme-status", },
            { Id: "I", Name: "Inactive", ThemeClassName:"inactive-theme-status", },
          ],
          AvailableImages: [],
        };
        let availableThemes = [];

        /* Event Handling START */
        $(".btn-close-editor", element)
          .off("click")
          .on("click", function () {
            console.log("FlexThemeManager.CloseEditor.Click");
            ClearEditorForm(function () {
              ClearImageSelectionForm();
              HideEditorForm();
            });
          });
        $(".btn-close-clone", element)
          .off("click")
          .on("click", function () {
            console.log("FlexThemeManager.CloseClone.Click");
            ClearCloneForm(function () {
              HideCloneForm();
            });
          });
        $(".btn-close-image-selector", element).off("click").on("click", function(){
          console.log("Close image selector clicked.\nClear the form and hide the form once complete.");
          ClearImageSelectionForm(function(){
            HideImageSelectionForm();
          });
        });
        $("#btnAddNewTheme", element)
          .off("click")
          .on("click", function () {
            console.log("FlexThemeManager.AddThemeButton.Click");
            ShowEditorForm();
          });
        $("#btnRefreshThemeList", element).off("click").on("click", function(){
          HideAllForms();
          LoadAllAvailableThemes(true);
          ClearFilters(function(){
            $("#btnFlexTheme_ApplyFilters", element).click();
          });

        });
        $("#btnFlexTheme_ApplyFilters", element)
          .off("click")
          .on("click", function () {
            ApplyFilters(function (filteredList) {
              RenderAllAvailbleThemes(null, filteredList);
            });
          });
        $("#btnFlexTheme_ClearFilters", element)
          .off("click")
          .on("click", function () {
            ClearFilters(function () {
              $("#btnFlexTheme_ApplyFilters", element).click();
            });
          });
        $("#btnSaveEditorForm", element)
          .off("click")
          .on("click", function () {
            SaveForm(function(){
              alert("Theme saved.  Refreshing themes...");
              HideEditorForm();
              LoadAllAvailableThemes(true);
            }, "Editor");
          });
        $("#btnSaveCloneForm", element)
          .off("click")
          .on("click", function () {
            SaveForm(function(){
              alert("Theme Cloned. Refreshing theme list.");
              HideCloneForm();
              LoadAllAvailableThemes(true);
            }, "Clone");
          });
          $("#btnEditorFormChangeLeaderboardImage", element).off("click").on("click", function(){
            console.log("btnEditorFormChangeLeaderboardImage clicked.");
            LoadImageSelectionForm(function(){
              ShowImageSelectionForm();
            }, "editorForm_LeaderboardImageUrl");

          });
          $("#btnEditorFormChangeBoardImage", element).off("click").on("click", function(){
            console.log("btnEditorFormChangeBoardImage clicked.");
            LoadImageSelectionForm(function(){
              ShowImageSelectionForm();
            }, "editorForm_BoardImageUrl");
          });
          $("#btnFlexThemeManager_SetImage", element).off("click").on("click", function(){
            console.log("btnFlexThemeManager_SetImage clicked.\nWrite selected information back to the form.");
            SaveImageSelectionForm(function(){
              HideImageSelectionForm();
            });
          })
        /* Event Handling END */
        function Initialize() {
          LoadLookupOptions();
        }
        function LoadDirective() {
          RenderFilterOptions();
          LoadAllAvailableThemes();
        }
        /* Data Loading START */
        function LoadLookupOptions() {
          LoadAvailableThemeTypes(function () {
            RenderFilterOptions(null, "THEME_TYPES");
          }, null);
          LoadAvailableFinishTypes();
          LoadAvailableGameUnits();
          RenderFilterOptions(null, "STATUS");
          LoadAvailableFinishTypes(function () {
            RenderFilterOptions(null, "FINISH_TYPES");
          }, null);
          LoadAvailableGameUnits(function () {
            RenderFilterOptions(null, "GAME_UNIT");
          }, null);
          LoadAvailableImages();
        }
        function LoadAvailableThemeTypes(callback, forceReload) {
          GetAvailableThemeTypes(function (themeTypesList) {
            directiveLookupOptions.ThemeTypes.length = 0;
            directiveLookupOptions.ThemeTypes = [...themeTypesList];
            if (callback != null) {
              callback();
            }
          }, forceReload);
        }
        function LoadAvailableFinishTypes(callback, forceReload) {
          GetAvailableFinishTypes(function (finishTypeList) {
            directiveLookupOptions.FinishTypes.length = 0;
            directiveLookupOptions.FinishTypes = [...finishTypeList];
            if (callback != null) {
              callback();
            }
          }, forceReload);
        }
        function LoadAvailableGameUnits(callback, forceReload) {
          GetAvailableGameUnits(function (gameUnitList) {
            directiveLookupOptions.GameUnits.length = 0;
            directiveLookupOptions.GameUnits = [...gameUnitList];
            if (callback != null) {
              callback();
            }
          }, forceReload);
        }
        function LoadAllAvailableThemes(forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          GetAllAvailableThemes(function (themesList) {
            themesList = ApplyFilters(null, themesList);
            RenderAllAvailbleThemes(function () {
              console.log("Handle post render of current themes information.");
            }, themesList);
          }, forceReload);
        }
        function LoadAvailableImages(forceReload){
          GetAllAvailableImages(null, forceReload);
        }
        //getAvailableImagesForSelections
        /* Data Loading END */
        /* Data Pulls START */
        function GetAvailableThemeTypes(callback, forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          if (directiveLookupOptions.ThemeTypes != null && directiveLookupOptions.ThemeTypes.length > 0 && forceReload == false) {
            if (callback != null) {
              callback(directiveLookupOptions.ThemeTypes);
            }
          } else {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "flex",
                cmd: "getThemeTypeList",
                isdevmode: directiveLookupOptions.IsDevModeOn,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                let returnData = JSON.parse(data.themeTypesList);
                if (callback != null) {
                  callback(returnData);
                }
              },
            });
          }
        }
        function GetAvailableFinishTypes(callback, forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          if (directiveLookupOptions.FinishTypes != null && directiveLookupOptions.FinishTypes.length > 0 && forceReload == false) {
            if (callback != null) {
              callback(directiveLookupOptions.FinishTypes);
            }
          } else {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "flex",
                cmd: "getFinishTypeList",
                isdevmode: directiveLookupOptions.IsDevModeOn,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                let returnData = JSON.parse(data.finishTypeList);
                if (callback != null) {
                  callback(returnData);
                }
              },
            });
          }
        }
        function GetAvailableGameUnits(callback, forceReload) {
          if (directiveLookupOptions.GameUnits != null && directiveLookupOptions.GameUnits.length > 0 && forceReload == false) {
            if (callback != null) {
              callback(directiveLookupOptions.GameUnits);
            }
          } else {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "flex",
                cmd: "getGameUnitList",
                isdevmode: directiveLookupOptions.IsDevModeOn,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                let returnData = JSON.parse(data.gameUnitList);
                if (callback != null) {
                  callback(returnData);
                }
              },
            });
          }
        }
        function GetAllAvailableThemes(callback, forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          if (availableThemes != null && availableThemes.length > 0 && forceReload == false) {
            if (callback != null) {
              callback(availableThemes);
            }
            return;
          } else {
            let includeInactive = true;

            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "flex",
                cmd: "getThemeList",
                includeinactive: includeInactive,
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                let returnData = JSON.parse(data.themesList);
                availableThemes.length = 0;
                availableThemes = [...returnData];
                if (callback != null) {
                  callback(returnData);
                }
              },
            });
          }
        }
        function GetAllAvailableImages(callback, forceReload){
          if (forceReload == null) {
            forceReload = false;
          }
          if (directiveLookupOptions.AvailableImages != null && directiveLookupOptions.AvailableImages.length > 0 && directiveLookupOptions.AvailableImages == false) {
            if (callback != null) {
              callback(directiveLookupOptions.AvailableImages);
            }
            return;
          } else {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: true,
              data: {
                lib: "selfserve",
                cmd: "getAvailableImagesForSelections",
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                let returnData = JSON.parse(data.availableImagesList);
                directiveLookupOptions.AvailableImages.length = 0
                directiveLookupOptions.AvailableImages = [...returnData];
                if (callback != null) {
                  callback(returnData);
                }
              },
            });
          }
        }
        /* Data Pulls END */
        /* Data Rendering START */
        function RenderFilterOptions(callback, renderType) {
          if (renderType == null || renderType == "") {
            renderType = "ALL";
          }
          if (renderType.toUpperCase() == "ALL".toUpperCase() || renderType.toUpperCase() == "THEME_TYPES".toUpperCase()) {
            $("#flexThemeFilter_ThemeType", element).empty();
            $("#flexThemeFilter_ThemeType", element).append("<option />");

            $("#editorForm_ThemeType", element).empty();
            $("#editorForm_ThemeType", element).append("<option />");
            directiveLookupOptions.ThemeTypes.forEach(function (dataItem) {
              let optionItem = $(`<option value="${dataItem.Id}">${dataItem.Name}</option>`);
              $("#flexThemeFilter_ThemeType", element).append(optionItem);

              let optionItem2 = $(`<option value="${dataItem.Id}">${dataItem.Name}</option>`);
              $("#editorForm_ThemeType", element).append(optionItem2);

              let optionItem3 = $(`<option value="${dataItem.Id}">${dataItem.Name}</option>`);
              $("#cloneForm_ThemeType", element).append(optionItem3);
            });
          }
          if (renderType.toUpperCase() == "ALL".toUpperCase() || renderType.toUpperCase() == "FINISH_TYPES".toUpperCase()) {
            // $("#flexThemeFilter_FinishType", element).empty();
            // $("#flexThemeFilter_FinishType", element).append("<option />");
            // directiveLookupOptions.FinishTypes.forEach(function (dataItem) {
            //   let optionItem = $(`<option value="${dataItem.Id}">${dataItem.Name}</option>`);
            //   $("#flexThemeFilter_FinishType", element).append(optionItem);
            // });
            $("#editorForm_FinishType", element).empty();
            $("#editorForm_FinishType", element).append("<option />");
            directiveLookupOptions.FinishTypes.forEach(function (dataItem) {
              let optionItem = $(`<option value="${dataItem.Id}">${dataItem.Name}</option>`);
              $("#editorForm_FinishType", element).append(optionItem);

              let optionItem2 = $(`<option value="${dataItem.Id}">${dataItem.Name}</option>`);
              $("#cloneForm_FinishType", element).append(optionItem2);
            });
          }
          if (renderType.toUpperCase() == "ALL".toUpperCase() || renderType.toUpperCase() == "GAME_UNIT".toUpperCase()) {
            // $("#flexThemeFilter_GameUnit", element).empty();
            // $("#flexThemeFilter_GameUnit", element).append("<option />");
            // directiveLookupOptions.GameUnits.forEach(function (dataItem) {
            //   let optionItem = $(`<option value="${dataItem.Id}">${dataItem.Name}</option>`);
            //   $("#flexThemeFilter_GameUnit", element).append(optionItem);
            // });
            $("#editorForm_GameUnit", element).empty();
            $("#editorForm_GameUnit", element).append("<option />");
            directiveLookupOptions.GameUnits.forEach(function (dataItem) {
              let optionItem = $(`<option value="${dataItem.Id}">${dataItem.Name}</option>`);
              $("#editorForm_GameUnit", element).append(optionItem);

              let optionItem2 = $(`<option value="${dataItem.Id}">${dataItem.Name}</option>`);
              $("#cloneForm_GameUnit", element).append(optionItem2);
            });
          }
          if (renderType.toUpperCase() == "ALL".toUpperCase() || renderType.toUpperCase() == "STATUS".toUpperCase()) {
            $("#flexThemeFilter_Status", element).empty();
            $("#flexThemeFilter_Status", element).append("<option />");
            $("#editorForm_Status", element).empty();
            $("#editorForm_Status", element).append("<option />");

            directiveLookupOptions.Status.forEach(function (dataItem) {
              let optionItem = $(`<option value="${dataItem.Id}">${dataItem.Name}</option>`);
              $("#flexThemeFilter_Status", element).append(optionItem);
              let optionItem2 = $(`<option value="${dataItem.Id}">${dataItem.Name}</option>`);
              $("#editorForm_Status", element).append(optionItem2);
              let optionItem3 = $(`<option value="${dataItem.Id}">${dataItem.Name}</option>`);
              $("#cloneForm_Status", element).append(optionItem3);
            });
          }
          if (callback != null) {
            callback();
          }
        }
        function RenderAllAvailbleThemes(callback, listToRender) {
          if (listToRender == null) {
            listToRender = ApplyFilters();
          }

          $("#flexThemeManagerThemeList", element).empty();

          let flexThemeManagerListHolder = $(`<div class="flex-theme-manage-list-holder" id="themeManagerListHolder" />`);

          listToRender.forEach(function (themeItem) {
            let themeStatus = themeItem.Status;
            let themeStatusClass = "active-theme-status";
            let statusObject = directiveLookupOptions.Status.find(i => i.Id == themeItem.Status);
            if(statusObject != null)
            {
              themeStatus = statusObject.Name;
              themeStatusClass = statusObject.ThemeClassName;
            }

            let flexThemeManagerItemHolder = $(`<div class="flex-theme-manager-row" id="themeManagerItemHolder_${themeItem.Id}" />`);
            flexThemeManagerItemHolder.addClass(themeStatusClass);

            let flexThemeBackgroundImageHolder = $(`<div class="flex-theme-row-background" />`);

            let flexThemeItemImagePanel = $(`<div class="flex-theme-manager-panel image-panel" />`);
            let flexThemeItemDataPanel = $(`<div class="flex-theme-manager-panel data-panel" />`);
            let flexThemeItemButtonPanel = $(`<div class="flex-theme-manager-panel button-panel" />`);

            let flexThemeImageHolder = $(`<div class="flex-theme-manager-item theme-image-holder" />`);
            let flexThemeButtonHolder = $(`<div class="flex-theme-manager-item button-holder" />`);

            let flexThemeNameHolder = $(`<div class="flex-theme-manager-data-item" />`);
            let flexThemeTypeHolder = $(`<div class="flex-theme-manager-data-item" />`);
            let flexThemeColorsHolder = $(`<div class="flex-theme-manager-data-item" />`);
            let flexThemeMaxParticipantsHolder = $(`<div class="flex-theme-manager-data-item" />`);
            let flexThemeScoringBasisHolder = $(`<div class="flex-theme-manager-data-item" />`);
            let flexThemeRequiresEndingPointsHolder = $(`<div class="flex-theme-manager-data-item" />`);
            let flexThemePhaseInfoHolder = $(`<div class="flex-theme-manager-data-item" />`);
            let flexThemeHasAnimationsInfoHolder = $(`<div class="flex-theme-manager-data-item" />`);
            let flexThemeCurrentStatusHolder = $(`<div class="flex-theme-manager-data-item" />`);

            //let previewThemeButton = $(`<button class="" id="previewTheme_${themeItem.Id}" themeId="${themeItem.Id}">Preview</button>`);
            let editThemeButton = $(`<button class="button btn flex-theme-manager-button edit-button" id="editTheme_${themeItem.Id}" themeId="${themeItem.Id}"><i class="fa fa-edit"></i></button>`);
            let cloneThemeButton = $(`<button class="button btn flex-theme-manager-button clone-button" id="cloneTheme_${themeItem.Id}" themeId="${themeItem.Id}"><i class="fa fa-clone"></i>Clone</button>`);

            // previewThemeButton.on("click", function(){
            //   let buttonId = this.id;
            //   let themeId = $(this).attr("themeId");
            //   console.log(`Preview Button Clicked ${buttonId} | ${themeId} | ${this.id}`);
            // });
            editThemeButton.on("click", function () {
              let buttonId = this.id;
              let themeId = $(this).attr("themeId");
              LoadEditorForm(function () {
                ShowEditorForm();
              }, themeId);
            });
            cloneThemeButton.on("click", function () {
              let buttonId = this.id;
              let themeId = $(this).attr("themeId");
              console.log(`Clone Button Clicked ${buttonId} | ${themeId} | ${this.id}`);
              LoadCloneForm(function () {
                ShowCloneForm();
              }, themeId);
            });

            let boardDisplayImage = defaultBoardImage;
            let themeLeaderboardImage = defaultBoardImage;

            if (themeItem.ThemeBoardDisplayImageName != null && themeItem.ThemeBoardDisplayImageName != "") {
              boardDisplayImage = a$.debugPrefix() + themeItem.ThemeBoardDisplayImageName;
            }
            if (themeItem.ThemeLeaderboardDisplayImageName != null && themeItem.ThemeLeaderboardDisplayImageName != "") {
              themeLeaderboardImage = a$.debugPrefix() + themeItem.ThemeLeaderboardDisplayImageName;
            } else if (themeItem.ThemeBoardDisplayImageName != null && themeItem.ThemeBoardDisplayImageName != "") {
              themeLeaderboardImage = a$.debugPrefix() + themeItem.ThemeBoardDisplayImageName;
            }

            let flexThemeBoardImage = $(`<img src="${boardDisplayImage}" class="flex-theme-manager-board-image" alt="Theme Background for ${themeItem.ShortName}" />`);

            flexThemeBackgroundImageHolder.css("background-image", `url('${themeLeaderboardImage}')`);

            flexThemeImageHolder.append(flexThemeBoardImage);

            flexThemeNameHolder.append(`Name: ${themeItem.Name}`);

            let themeTypeName = themeItem.ThemeTypeId;

            let themeTypeObject = themeItem.ThemeTypeIdSource || directiveLookupOptions.ThemeTypes?.find((i) => i.Id == themeItem.ThemeTypeId);
            if (themeTypeObject != null) {
              themeTypeName = themeTypeObject.Name;
            }
            flexThemeTypeHolder.append(`Theme Type: ${themeTypeName}`);
            let hasColorDefined = false;

            if (themeItem.DefaultColor1 != null && themeItem.Defaultcolor1 != "") {
              let flexColorItem1 = $(`<div class="flex-theme-color-item" />`);
              flexColorItem1.css("background-color", themeItem.DefaultColor1);
              flexColorItem1.append("&nbsp;");
              flexThemeColorsHolder.append(flexColorItem1);
              hasColorDefined = true;
            }
            if (themeItem.DefaultColor2 != null && themeItem.Defaultcolor2 != "") {
              let flexColorItem2 = $(`<div class="flex-theme-color-item" />`);
              flexColorItem2.css("background-color", themeItem.DefaultColor2);
              flexColorItem2.append("&nbsp;");
              flexThemeColorsHolder.append(flexColorItem2);
              hasColorDefined = true;
            }
            if (themeItem.DefaultColor3 != null && themeItem.Defaultcolor3 != "") {
              let flexColorItem3 = $(`<div class="flex-theme-color-item" />`);
              flexColorItem3.css("background-color", themeItem.DefaultColor3);
              flexColorItem3.append("&nbsp;");
              flexThemeColorsHolder.append(flexColorItem3);
              hasColorDefined = true;
            }
            if (themeItem.DefaultColor4 != null && themeItem.Defaultcolor4 != "") {
              let flexColorItem4 = $(`<div class="flex-theme-color-item" />`);
              flexColorItem4.css("background-color", themeItem.DefaultColor4);
              flexColorItem4.append("&nbsp;");
              flexThemeColorsHolder.append(flexColorItem4);
              hasColorDefined = true;
            }
            if (themeItem.DefaultColor5 != null && themeItem.Defaultcolor5 != "") {
              let flexColorItem5 = $(`<div class="flex-theme-color-item" />`);
              flexColorItem5.css("background-color", themeItem.DefaultColor5);
              flexColorItem5.append("&nbsp;");
              flexThemeColorsHolder.append(flexColorItem5);
              hasColorDefined = true;
            }
            if(hasColorDefined == false)
            {
              flexThemeColorsHolder.append("No Colors set for theme.");
            }

            //Max Participants
            flexThemeMaxParticipantsHolder.append(`Max Participants: ${themeItem.MaxParticipantNumber}`);
            //Requires Scoring basis
            flexThemeScoringBasisHolder.append(`Requires Scoring Basis: ${themeItem.RequiresScoringBasis}`);
            //requires Ending Points
            flexThemeRequiresEndingPointsHolder.append(`Requires Ending Points: ${themeItem.RequiresEndingPointTotal}`);
            //Phrase length (if phrase type)
            flexThemePhaseInfoHolder.append(`Requires Phase: ${themeItem.RequiresPhraseValue}<br/>`);
            let phraseLength = "No length set.";
            if(themeItem.MaxPhraseLength != null && themeItem.MaxPhraseLength != "")
            {
              phraseLength = themeItem.MaxPhraseLength
            }
            flexThemePhaseInfoHolder.append(`Max Phase Length: ${phraseLength}<br/>`);
            //current status
            flexThemeCurrentStatusHolder.append(`Status: <b>${themeStatus}</b>`);
            //Has Animations + animation Name
            if(themeItem.HasAnimation == true)
            {
              flexThemeHasAnimationsInfoHolder.append(`Animation Name: <i>${themeItem.AnimationName}</i>`);
            }

            flexThemeBackgroundImageHolder.append("&nbsp;");

            flexThemeButtonHolder.append(editThemeButton);
            flexThemeButtonHolder.append("&nbsp;");
            flexThemeButtonHolder.append(cloneThemeButton);
            // flexThemeButtonHolder.append("&nbsp;");
            // flexThemeButtonHolder.append(previewThemeButton);

            flexThemeItemImagePanel.append(flexThemeImageHolder);

            flexThemeItemDataPanel.append(flexThemeTypeHolder);
            flexThemeItemDataPanel.append(flexThemeNameHolder);
            flexThemeItemDataPanel.append(flexThemeCurrentStatusHolder);
            flexThemeItemDataPanel.append(flexThemeMaxParticipantsHolder);
            flexThemeItemDataPanel.append(flexThemeScoringBasisHolder);
            if(themeItem.RequiresEndingPointTotal == true)
            {
              flexThemeItemDataPanel.append(flexThemeRequiresEndingPointsHolder);
            }
            if(themeItem.HasAnimation == true)
            {
              flexThemeItemDataPanel.append(flexThemeHasAnimationsInfoHolder);
            }
            if(themeItem.RequiresPhraseValue == true)
            {
              flexThemeItemDataPanel.append(flexThemePhaseInfoHolder);
            }
            flexThemeItemDataPanel.append(`<hr />`);
            flexThemeItemDataPanel.append(flexThemeColorsHolder);

            flexThemeItemButtonPanel.append(flexThemeButtonHolder);

            flexThemeManagerItemHolder.append(flexThemeBackgroundImageHolder);
            flexThemeManagerItemHolder.append(flexThemeItemImagePanel);
            flexThemeManagerItemHolder.append(flexThemeItemDataPanel);
            flexThemeManagerItemHolder.append(flexThemeItemButtonPanel);

            flexThemeManagerListHolder.append(flexThemeManagerItemHolder);
          });

          RenderThemeCount(listToRender.length);
          $("#flexThemeManagerThemeList", element).append(flexThemeManagerListHolder);
          if (callback != null) {
            callback();
          }
        }
        function RenderThemeCount(themeCount) {
          $("#flexThemeManagerThemeCount", element).empty();
          if (themeCount == null || themeCount == "") {
            themeCount = 0;
          }
          $("#flexThemeManagerThemeCount", element).append(themeCount);
        }
        function RenderAvailableImages(callback, listToRender){

          if(listToRender == null)
          {
            listToRender = directiveLookupOptions.AvailableImages;
          }
          $("#availableImagesSelectonList", element).empty();
          listToRender.forEach(function(imageItem){
            let themeItemHolder = $(`<div class="flex-theme-manager-block-item-holder" />`);
            let availableImageItemHolder = $(`<div class="flex-theme-manager-image-item-selector-holder" id="availableImage_${imageItem.Id}" itemId="${imageItem.Id}" imageUrl="${imageItem.ImageUrl}" />`);
            let availableImageHolder = $(`<div class="flex-theme-manager-image-holder" id="availableImageHolder_${imageItem.Id}" itemId="${imageItem.Id}" />`);
            let availableImage = $(`<img class="flex-theme-manager-image-option" src="${imageItem.ImageUrl}" itemId="${imageItem.Id}" alt="${imageItem.Name}" />`);
            let availableImageNameHolder = $(`<div class="flex-theme-manager-image-name-holder" id="availableImageName_${imageItem.Id}" itemId="${imageItem.Id}" />`);

            availableImageHolder.append(availableImage);

            availableImageNameHolder.append(`<b>${imageItem.Name}</b>`);

            availableImageItemHolder.on("click", function(){
              let itemId = $(this).attr("itemId");
              let imageUrl = $(this).attr("imageUrl");
              SetImageSelected(function(){
                MarkCurrentSelectedImage(imageUrl);
              }, itemId, imageUrl);
            });

            themeItemHolder.append(availableImageHolder);
            themeItemHolder.append(availableImageNameHolder);

            availableImageItemHolder.append(themeItemHolder);

            $("#availableImagesSelectonList", element).append(availableImageItemHolder);
          });
          if(callback != null)
          {
            callback();
          }
        }
        /* Data Rendering END */
        /* Editor Form Handling START */
        function LoadEditorForm(callback, idToLoad) {
          console.log("FlexThemeManager.LoadEditorForm()");
          let themeObject = availableThemes.find((i) => i.Id == idToLoad);
          $("#editorForm_ThemeEnterDate").empty();
          $("#editorForm_ThemeEnterBy").empty();
          $("#editorForm_ThemeUpdateDate").empty();
          $("#editorForm_ThemeUpdateBy").empty();
          $("#editorForm_ThemeUpdateDate").text("--");
          $("#editorForm_ThemeUpdateBy").text("(--)");

          if (themeObject != null) {
            $("#editorForm_ThemeId", element).val(idToLoad);
            $("#editorForm_ThemeType", element).val(themeObject.ThemeTypeId);
            $("#editorForm_FinishType", element).val(themeObject.FinishTypeId);
            $("#editorForm_GameUnit", element).val(themeObject.GameUnitId);
            $("#editorForm_ThemeName", element).val(themeObject.Name);
            $("#editorForm_ShortName", element).val(themeObject.ShortName);
            $("#editorForm_MaxParticipantCount", element).val(themeObject.MaxParticipantNumber);
            $("#editorForm_ThemeTagName", element).val(themeObject.ThemeTagName);
            $("#editorForm_LeaderboardImageUrl", element).val(themeObject.ThemeLeaderboardDisplayImageName);
            if (themeObject.ThemeLeaderboardDisplayImageName != null && themeObject.ThemeLeaderboardDisplayImageName != "") {
              $("#editorForm_LeaderboardImage", element).prop("src", themeObject.ThemeLeaderboardDisplayImageName);
            }
            if (themeObject.ThemeBoardDisplayImageName != null && themeObject.ThemeBoardDisplayImageName != "") {
              $("#editorForm_BoardImage", element).prop("src", themeObject.ThemeBoardDisplayImageName);
            }
            $("#editorForm_BoardImageUrl", element).val(themeObject.ThemeBoardDisplayImageName);
            $("#editorForm_AnimationName", element).val(themeObject.AnimationName);
            $("#editorForm_MaxPhraseLength", element).val(themeObject.MaxPhraseLength);
            $("#editorForm_Status", element).val(themeObject.Status);
            $("#editorForm_DefaultColor1", element).val(themeObject.DefaultThemeColor1);
            $("#editorForm_DefaultColor2", element).val(themeObject.DefaultThemeColor2);
            $("#editorForm_DefaultColor3", element).val(themeObject.DefaultThemeColor3);
            $("#editorForm_DefaultColor4", element).val(themeObject.DefaultThemeColor4);
            $("#editorForm_DefaultColor5", element).val(themeObject.DefaultThemeColor5);

            $("#editorForm_ThemeEnterDate").text(new Date(themeObject.EnterDate).toLocaleDateString());
            $("#editorForm_ThemeEnterBy").text(`(${themeObject.EnterBy})`);
            if (themeObject.UpdateDate != null && themeObject.UpdateDate != "") {
              $("#editorForm_ThemeUpdateDate").text(new Date(themeObject.UpdateDate).toLocaleDateString());
              $("#editorForm_ThemeUpdateBy").text(`(${themeObject.UpdateBy})`);
            }
            //checkboxes
            $("#editorForm_HasAnimation", element).prop("checked", themeObject.HasAnimation);
            $("#editorForm_RequiresScoringBasis", element).prop("checked", themeObject.RequiresScoringBasis);
            $("#editorForm_RequiresEndingPointTotal", element).prop("checked", themeObject.RequiresEndingPointTotal);
            $("#editorForm_CalculateScoreOption", element).prop("checked", themeObject.IsCalculateScoreOptionAvailable);
            $("#editorForm_RequiresPhraseValue", element).prop("checked", themeObject.RequiresPhraseValue);
          }
          //   $("[id^='editorForm_ColorHolder']").simpleColor({
          //     livePreview: true,
          //     onSelect: function (hex, element) {
          //       let itemNumber = $(this).attr("itemNumber");
          //       $(element.attr("id")).setColor("#" + hex);
          //       $(`#editorForm_DefaultColor${itemNumber}`).val(hex);
          //     }
          // });

          if (callback != null) {
            callback();
          }
        }
        function ClearEditorForm(callback) {
          console.log("FlexThemeManager.ClearEditorForm()");
          $("#editorForm_ThemeId", element).val("-1");
          $("#editorForm_ThemeType", element).val("");
          $("#editorForm_FinishType", element).val("");
          $("#editorForm_GameUnit", element).val("");
          $("#editorForm_ThemeName", element).val("");
          $("#editorForm_ShortName", element).val("");
          $("#editorForm_MaxParticipantCount", element).val("");
          $("#editorForm_LeaderboardImageUrl", element).val("");
          $("#editorForm_ThemeTagName", element).val("");
          $("#editorForm_BoardImageUrl", element).val("");
          $("#editorForm_AnimationName", element).val("");
          $("#editorForm_MaxPhraseLength", element).val("");
          $("#editorForm_Status", element).val("");
          $("#editorForm_DefaultColor1", element).val("");
          $("#editorForm_DefaultColor2", element).val("");
          $("#editorForm_DefaultColor3", element).val("");
          $("#editorForm_DefaultColor4", element).val("");
          $("#editorForm_DefaultColor5", element).val("");
          $("#editorForm_ThemeEnterDate").empty();
          $("#editorForm_ThemeEnterBy").empty();
          $("#editorForm_ThemeUpdateDate").empty();
          $("#editorForm_ThemeUpdateBy").empty();
          $("#editorForm_ThemeUpdateDate").text("--");
          $("#editorForm_ThemeUpdateBy").text("(--)");

          $("#editorForm_LeaderboardImage", element).prop("src", "");
          $("#editorForm_BoardImage", element).prop("src", "");

          $("#editorForm_HasAnimation", element).prop("checked", false);
          $("#editorForm_RequiresScoringBasis", element).prop("checked", false);
          $("#editorForm_RequiresEndingPointTotal", element).prop("checked", false);
          $("#editorForm_CalculateScoreOption", element).prop("checked", false);
          $("#editorForm_RequiresPhraseValue", element).prop("checked", false);

          if (callback != null) {
            callback();
          }
        }
        function ClearImageSelectionForm(callback){
          console.log("ClearImageSelectionForm(callback)");
          if(callback != null)
          {
            callback();
          }
        }
        function LoadCloneForm(callback, idToClone) {
          ClearCloneForm();
          let originalCloneFormObject = availableThemes.find((i) => i.Id == idToClone);
          if (originalCloneFormObject != null) {
            let themeTypeName = originalCloneFormObject.ThemeTypeId;
            let themeTypeObject = directiveLookupOptions.ThemeTypes.find((i) => i.ThemeTypeId == originalCloneFormObject.ThemeTypeId);
            if (themeTypeObject != null) {
              themeTypeName = themeTypeObject.Name;
            }
            $("#cloneForm_OriginalThemeType", element).append(themeTypeName);
            $("#cloneForm_ThemeType", element).val(originalCloneFormObject.ThemeTypeId);

            let finishTypeName = originalCloneFormObject.FinishTypeId;
            let finishTypeObject = directiveLookupOptions.FinishTypes.find((i) => i.FinishTypeId == originalCloneFormObject.FinishTypeId);
            if (finishTypeObject != null) {
              finishTypeName = finishTypeObject.Name;
            }
            $("#cloneForm_OriginalFinishType", element).append(finishTypeName);
            $("#cloneForm_FinishType", element).val(originalCloneFormObject.FinishTypeId);

            let gameUnitName = originalCloneFormObject.GameUnitId;
            let gameUnitObject = directiveLookupOptions.GameUnits.find((i) => i.GameUnitId == originalCloneFormObject.GameUnitId);
            if (gameUnitObject != null) {
              gameUnitName = gameUnitObject.Name;
            }
            $("#cloneForm_OriginalGameUnit", element).append(gameUnitName);
            $("#cloneForm_GameUnit", element).val(originalCloneFormObject.GameUnitId);

            $("#cloneForm_OriginalThemeName", element).append(originalCloneFormObject.Name);
            $("#cloneForm_ThemeName", element).val(originalCloneFormObject.Name);

            $("#cloneForm_OriginalShortName", element).append(originalCloneFormObject.ShortName);
            $("#cloneForm_ShortName", element).val(originalCloneFormObject.ShortName);

            $("#cloneForm_OriginalMaxParticipantCount", element).append(originalCloneFormObject.MaxParticipantNumber);
            $("#cloneForm_MaxParticipantCount", element).val(originalCloneFormObject.MaxParticipantNumber);

            $("#cloneForm_OriginalAnimationName", element).append(originalCloneFormObject.AnimationName);
            $("#cloneForm_AnimationName", element).val(originalCloneFormObject.AnimationName);

            $("#cloneForm_OriginalThemeTagName", element).append(originalCloneFormObject.ThemeTagName);
            $("#cloneForm_ThemeTagName", element).val(originalCloneFormObject.ThemeTagName);

            $("#cloneForm_OriginalLeaderboardImageUrl", element).append(originalCloneFormObject.ThemeLeaderboardDisplayImageName);
            $("#cloneForm_LeaderboardImageUrl", element).val(originalCloneFormObject.ThemeLeaderboardDisplayImageName);
            $("#cloneForm_LeaderboardImage").prop("src", originalCloneFormObject.ThemeLeaderboardDisplayImageName);

            $("#cloneForm_OriginalBoardImageUrl", element).append(originalCloneFormObject.ThemeBoardDisplayImageName);
            $("#cloneForm_BoardImageUrl", element).val(originalCloneFormObject.ThemeBoardDisplayImageName);
            $("#cloneForm_BoardImage").prop("src", originalCloneFormObject.ThemeBoardDisplayImageName);

            $("#cloneForm_OriginalMaxPhraseLength", element).append(originalCloneFormObject.MaxPhraseLength);
            $("#cloneForm_MaxPhraseLength", element).val(originalCloneFormObject.MaxPhraseLength);

            $("#cloneForm_OriginalHasAnimation", element).append(originalCloneFormObject.HasAnimation == true ? "Yes" : "No");
            $("#cloneForm_HasAnimation", element).prop("checked", originalCloneFormObject.HasAnimation);

            $("#cloneForm_OriginalRequiresScoringBasis", element).append(originalCloneFormObject.RequiresScoringBasis == true ? "Yes" : "No");
            $("#cloneForm_RequiresScoringBasis", element).prop("checked", originalCloneFormObject.RequiresScoringBasis);

            $("#cloneForm_OriginalRequiresEndingPointTotal", element).append(originalCloneFormObject.RequiresEndingPointTotal == true ? "Yes" : "No");
            $("#cloneForm_RequiresEndingPointTotal", element).prop("checked", originalCloneFormObject.RequiresEndingPointTotal);

            $("#cloneForm_OriginalCalculateScoreOption", element).append(originalCloneFormObject.IsCalculateScoreOptionAvailable == true ? "Yes" : "No");
            $("#cloneForm_CalculateScoreOption", element).prop("checked", originalCloneFormObject.IsCalculateScoreOptionAvailable);

            $("#cloneForm_OriginalRequiresPhraseValue", element).append(originalCloneFormObject.RequiresPhraseValue == true ? "Yes" : "No");
            $("#cloneForm_RequiresPhraseValue", element).prop("checked", originalCloneFormObject.RequiresPhraseValue);

            let statusName = originalCloneFormObject.Status;
            let statusObject = directiveLookupOptions.Status.find((i) => i.Id == originalCloneFormObject.Status);
            if (statusObject != null) {
              statusName = statusObject.Name;
            }
            $("#cloneForm_OriginalStatus", element).append(statusName);
            $("#cloneForm_Status", element).val(originalCloneFormObject.Status);
          }
          if (callback != null) {
            callback();
          }
        }
        function ClearCloneForm(callback) {
          $("#cloneForm_ThemeId", element).val("-1");
          $("#cloneForm_ThemeType", element).val("");
          $("#cloneForm_FinishType", element).val("");
          $("#cloneForm_GameUnit", element).val("");
          $("#cloneForm_ThemeName", element).val("");
          $("#cloneForm_ShortName", element).val("");
          $("#cloneForm_MaxParticipantCount", element).val("");
          $("#cloneForm_LeaderboardImageUrl", element).val("");
          $("#cloneForm_ThemeTagName", element).val("");
          $("#cloneForm_BoardImageUrl", element).val("");
          $("#cloneForm_AnimationName", element).val("");
          $("#cloneForm_MaxPhraseLength", element).val("");
          $("#cloneForm_Status", element).val("");
          $("#cloneForm_DefaultColor1", element).val("");
          $("#cloneForm_DefaultColor2", element).val("");
          $("#cloneForm_DefaultColor3", element).val("");
          $("#cloneForm_DefaultColor4", element).val("");
          $("#cloneForm_DefaultColor5", element).val("");
          $("#cloneForm_ThemeEnterDate").empty();
          $("#cloneForm_ThemeEnterBy").empty();
          $("#cloneForm_ThemeUpdateDate").empty();
          $("#cloneForm_ThemeUpdateBy").empty();
          $("#cloneForm_ThemeUpdateDate").text("--");
          $("#cloneForm_ThemeUpdateBy").text("(--)");

          $("#cloneForm_LeaderboardImage", element).prop("src", "");
          $("#cloneForm_BoardImage", element).prop("src", "");

          $("#cloneForm_HasAnimation", element).prop("checked", false);
          $("#cloneForm_RequiresScoringBasis", element).prop("checked", false);
          $("#cloneForm_RequiresEndingPointTotal", element).prop("checked", false);
          $("#cloneForm_CalculateScoreOption", element).prop("checked", false);
          $("#cloneForm_RequiresPhraseValue", element).prop("checked", false);

          $("#cloneForm_OriginalThemeType", element).empty();
          $("#cloneForm_OriginalFinishType", element).empty();
          $("#cloneForm_OriginalGameUnit", element).empty();
          $("#cloneForm_OriginalThemeName", element).empty();
          $("#cloneForm_OriginalShortName", element).empty();
          $("#cloneForm_OriginalMaxParticipantCount", element).empty();
          $("#cloneForm_OriginalLeaderboardImageUrl", element).empty();
          $("#cloneForm_OriginalThemeTagName", element).empty();
          $("#cloneForm_OriginalBoardImageUrl", element).empty();
          $("#cloneForm_OriginalAnimationName", element).empty();
          $("#cloneForm_OriginalMaxPhraseLength", element).empty();
          $("#cloneForm_OriginalStatus", element).empty();
          // $("#cloneForm_OriginalDefaultColor1", element).empty();
          // $("#cloneForm_OriginalDefaultColor2", element).empty();
          // $("#cloneForm_OriginalDefaultColor3", element).empty();
          // $("#cloneForm_OriginalDefaultColor4", element).empty();
          // $("#cloneForm_OriginalDefaultColor5", element).empty();

          $("#cloneForm_OriginalHasAnimation", element).empty();
          $("#cloneForm_OriginalRequiresScoringBasis", element).empty();
          $("#cloneForm_OriginalRequiresEndingPointTotal", element).empty();
          $("#cloneForm_OriginalCalculateScoreOption", element).empty();
          $("#cloneForm_OriginalRequiresPhraseValue", element).empty();

          if (callback != null) {
            callback();
          }
        }
        function ValidateForm(formType, objectToValidate) {
          if (objectToValidate == null) {
            objectToValidate = CollectThemeObject(formType);
          }
          let isFormValid = false;
          let errorMessages = [];
          if (objectToValidate.FinishTypeId == null || objectToValidate.FinishTypeId == "") {
            errorMessages.push({ fieldId: "FinishTypeId", fieldName: "Finish Type", MessageText: "Finish Type required." });
          }
          if (objectToValidate.GameUnitId == null || objectToValidate.GameUnitId == "") {
            errorMessages.push({ fieldId: "GameUnitId", fieldName: "Game Unit", MessageText: "Game Unit required." });
          }
          if (objectToValidate.MaxParticipantNumber == null || objectToValidate.MaxParticipantNumber == "") {
            errorMessages.push({ fieldId: "MaxParticipantNumber", fieldName: "Max Participant Number", MessageText: "Max Participant Number required." });
          }
          if (objectToValidate.ThemeTypeId == null || objectToValidate.ThemeTypeId == "") {
            errorMessages.push({ fieldId: "ThemeTypeId", fieldName: "Theme Type", MessageText: "Theme Type required." });
          }
          if (objectToValidate.Name == null || objectToValidate.Name == "") {
            errorMessages.push({ fieldId: "ThemeName", fieldName: "Name", MessageText: "Theme Name required." });
          }
          if (objectToValidate.ShortName == null || objectToValidate.ShortName == "") {
            errorMessages.push({ fieldId: "ShortName", filedName: "Short Name", MessageText: "Short Name required." });
          }
          isFormValid = errorMessages.length == 0;

          if (isFormValid == false) {
            let alertPopupMessage = "Invalid form data:\n";
            errorMessages.forEach(function (error) {
              alertPopupMessage += `- ${error.MessageText}\n`;
            });
            alert(alertPopupMessage);
          }
          return isFormValid;
        }
        function SaveForm(callback, formType) {
          let themeObject = CollectThemeObject(formType);

          if (ValidateForm(formType, themeObject) == true) {
            console.log("Form Valid - Process the form");
            ProcessForm(callback, themeObject);
          } else {
            console.log("Form NOT Valid - Display the errors");
          }
        }
        function LoadImageSelectionForm(callback, formIdToSetOnSave){
          let currentImageInfo = $(`#${formIdToSetOnSave}`).val();
          $("#imageSelector_FormItemId", element).val(formIdToSetOnSave);
          $("#imageSelector_CurrentSetImage", element).val(currentImageInfo);
          RenderAvailableImages(function(){
            MarkCurrentSelectedImage(currentImageInfo);
          });

          if(callback != null)
          {
            callback();
          }
        }
        function SaveImageSelectionForm(callback)
        {
          let oldImage = $("#imageSelector_CurrentSetImage", element).val();
          let newImage = $("#imageSelector_NewImage", element).val();
          if(oldImage != newImage)
          {
            let formId = $("#imageSelector_FormItemId", element).val();
            let imageFormId = `${formId.replace("Url", "")}`;
            $(`#${formId}`, element).val(newImage);
            $(`#${imageFormId}`, element).prop("src", newImage);
          }
          if(callback != null)
          {
            callback();
          }
        }
        function SetImageSelected(callback, imageId, imageUrl){
          let imageObject = directiveLookupOptions.AvailableImages.find(i => i.Id == imageId);
          if(imageUrl == null)
          {
            imageUrl = defaultBoardImage;
          }
          if(imageObject == null)
          {
            imageObject = directiveLookupOptions.AvailableImages.find(i => i.ImageUrl == imageUrl);
          }
          if(imageObject != null)
          {
            imageUrl = imageObject.ImageUrl;
          }
          $("#imageSelector_NewImage", element).val(imageUrl);
          if(callback != null)
          {
            callback(imageId);
          }
        }
        function ProcessForm(callback, objectToProcess) {
          a$.ajax({
            type: "POST",
            service: "C#",
            async: true,
            data: {
              lib: "flex",
              cmd: "saveThemeInfo",
              themeinfo: JSON.stringify(objectToProcess),
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
        /* Editor Form Handling END */
        /* Misc/Util Methods START */
        function ApplyFilters(callback, listToFilter) {
          if (listToFilter == null) {
            listToFilter = availableThemes;
          }
          let filteredList = listToFilter;

          let themeTypeFilter = $("#flexThemeFilter_ThemeType", element).val();
          let finishTypeFilter = $("#flexThemeFilter_FinishType", element).val();
          let gameUnitFilter = $("#flexThemeFilter_GameUnit", element).val();
          let statusFilter = $("#flexThemeFilter_Status", element).val();
          let nameFilter = $("#flexThemeFilter_Name", element).val();
          let includeInactive = $("#flexThemeFilter_IncludeInactive", element).is(":checked");

          if (themeTypeFilter != null && themeTypeFilter != "") {
            filteredList = filteredList.filter((i) => i.ThemeTypeId == themeTypeFilter);
          }
          // if (finishTypeFilter != null && finishTypeFilter != "") {
          //   filteredList = filteredList.filter((i) => i.FinishTypeId == finishTypeFilter);
          // }
          // if (gameUnitFilter != null && gameUnitFilter != "") {
          //   filteredList = filteredList.filter((i) => i.GameUnitId == gameUnitFilter);
          // }
          if (statusFilter != null && statusFilter != "") {
            filteredList = filteredList.filter((i) => i.Status == statusFilter);
          }
          if (nameFilter != null && nameFilter != "") {
            filteredList = filteredList.filter((i) => i.Name.toLowerCase().includes(nameFilter.toLowerCase()));
          }

          filteredList = filteredList.filter((i) => i.Status == "A" || includeInactive == true);

          if (callback != null) {
            callback(filteredList);
          }
          return filteredList;
        }
        function ClearFilters(callback) {
          $("#flexThemeFilter_ThemeType", element).val("");
          // $("#flexThemeFilter_FinishType", element).val("");
          // $("#flexThemeFilter_GameUnit", element).val("");
          $("#flexThemeFilter_Status", element).val("");
          $("#flexThemeFilter_Name", element).val("");
          $("#flexThemeFilter_IncludeInactive", element).prop("checked", false);
          if (callback != null) {
            callback();
          }
        }
        function CollectThemeObject(fromFormName) {
          let returnObject = null;
          switch (fromFormName.toLowerCase()) {
            case "cloneForm":
            case "clone":
              returnObject = CollectThemeObjectFromCloneForm();
              break;
            default:
              returnObject = CollectThemeObjectFromEditorForm();
          }
          return returnObject;
        }
        function GetBlankThemeObject() {
          let returnObject = new Object();
          returnObject.ThemeId = -1;
          returnObject.Name = null;
          returnObject.ShortName = null;
          returnObject.FinishTypeId = null;
          returnObject.ThemePositions = 10000;
          returnObject.GameUnitId = null;
          returnObject.Status = null;
          returnObject.MaxParticipantNumber = null;
          returnObject.ThemeBoardDisplayImageName = null;
          returnObject.ThemeLeaderboardDisplayImageName = null;
          returnObject.ThemeTagName = null;
          returnObject.HasAnimation = false;
          returnObject.AnimationName = null;
          returnObject.RequiresScoringBasis = false;
          returnObject.RequiresEndingPointTotal = false;
          returnObject.IsCalculateScoreOptionAvailable = false;
          returnObject.RequiresPhraseValue = false;
          returnObject.MaxPhraseLength = null;
          returnObject.ThemeTypeId = null;
          returnObject.EnterDate = null;
          returnObject.EnterBy = null;
          returnObject.UpdatedOn = null;
          returnObject.UpdatedBy = null;
          returnObject.DefaultThemeColor1 = null;
          returnObject.DefaultThemeColor2 = null;
          returnObject.DefaultThemeColor3 = null;
          returnObject.DefaultThemeColor4 = null;
          returnObject.DefaultThemeColor5 = null;

          return returnObject;
        }
        function CollectThemeObjectFromEditorForm() {
          let returnObject = GetBlankThemeObject();
          returnObject.ThemeId = $("#editorForm_ThemeId", element).val();
          returnObject.Name = $("#editorForm_ThemeName", element).val();
          returnObject.ShortName = $("#editorForm_ShortName", element).val();
          returnObject.FinishTypeId = $("#editorForm_FinishType", element).val();
          // returnObject.ThemePositions = null;
          returnObject.GameUnitId = $("#editorForm_GameUnit", element).val();
          returnObject.Status = $("#editorForm_Status", element).val();
          returnObject.MaxParticipantNumber = $("#editorForm_MaxParticipantCount", element).val();
          returnObject.ThemeBoardDisplayImageName = $("#editorForm_BoardImageUrl", element).val();
          returnObject.ThemeLeaderboardDisplayImageName = $("#editorForm_LeaderboardImageUrl", element).val();
          returnObject.ThemeTagName = $("#editorForm_ThemeTagName", element).val();
          returnObject.HasAnimation = $("#editorForm_HasAnimation", element).is(":checked");
          returnObject.AnimationName = $("#editorForm_AnimationName", element).val();
          returnObject.RequiresScoringBasis = $("#editorForm_RequiresScoringBasis", element).is(":checked");
          returnObject.RequiresEndingPointTotal = $("#editorForm_RequiresEndingPointTotal", element).is(":checked");
          returnObject.IsCalculateScoreOptionAvailable = $("#editorForm_CalculateScoreOption", element).is(":checked");
          returnObject.RequiresPhraseValue = $("#editorForm_RequiresPhraseValue", element).is(":checked");
          returnObject.MaxPhraseLength = $("#editorForm_MaxPhraseLength", element).val();
          returnObject.ThemeTypeId = $("#editorForm_ThemeType", element).val();
          returnObject.EnterDate = new Date().toLocaleDateString();
          returnObject.EnterBy = legacyContainer.scope.TP1Username;
          returnObject.UpdatedOn = new Date().toLocaleDateString();
          returnObject.UpdatedBy = legacyContainer.scope.TP1Username;
          returnObject.DefaultThemeColor1 = $("#editorForm_DefaultColor1", element).val();
          returnObject.DefaultThemeColor2 = $("#editorForm_DefaultColor2", element).val();
          returnObject.DefaultThemeColor3 = $("#editorForm_DefaultColor3", element).val();
          returnObject.DefaultThemeColor4 = $("#editorForm_DefaultColor4", element).val();
          returnObject.DefaultThemeColor5 = $("#editorForm_DefaultColor5", element).val();

          return returnObject;
        }
        function CollectThemeObjectFromCloneForm() {
          let returnObject = GetBlankThemeObject();
          returnObject.ThemeId = -1;
          returnObject.Name = $("#cloneForm_ThemeName", element).val();
          returnObject.ShortName = $("#cloneForm_ShortName", element).val();
          returnObject.FinishTypeId = $("#cloneForm_FinishType", element).val();
          // returnObject.ThemePositions = null;
          returnObject.GameUnitId = $("#cloneForm_GameUnit", element).val();
          returnObject.Status = $("#cloneForm_Status", element).val();
          returnObject.MaxParticipantNumber = $("#cloneForm_MaxParticipantCount", element).val();
          returnObject.ThemeBoardDisplayImageName = $("#cloneForm_BoardImageUrl", element).val();
          returnObject.ThemeLeaderboardDisplayImageName = $("#cloneForm_LeaderboardImageUrl", element).val();
          returnObject.ThemeTagName = $("#cloneForm_ThemeTagName", element).val();
          returnObject.HasAnimation = $("#cloneForm_HasAnimation", element).is(":checked");
          returnObject.AnimationName = $("#cloneForm_AnimationName", element).val();
          returnObject.RequiresScoringBasis = $("#cloneForm_RequiresScoringBasis", element).is(":checked");
          returnObject.RequiresEndingPointTotal = $("#cloneForm_RequiresEndingPointTotal", element).is(":checked");
          returnObject.IsCalculateScoreOptionAvailable = $("#cloneForm_CalculateScoreOption", element).is(":checked");
          returnObject.RequiresPhraseValue = $("#cloneForm_RequiresPhraseValue", element).is(":checked");
          returnObject.MaxPhraseLength = $("#cloneForm_MaxPhraseLength", element).val();
          returnObject.ThemeTypeId = $("#cloneForm_ThemeType", element).val();
          returnObject.EnterDate = new Date().toLocaleDateString();
          returnObject.EnterBy = legacyContainer.scope.TP1Username;
          returnObject.UpdatedOn = new Date().toLocaleDateString();
          returnObject.UpdatedBy = legacyContainer.scope.TP1Username;
          returnObject.DefaultThemeColor1 = $("#cloneForm_DefaultColor1", element).val();
          returnObject.DefaultThemeColor2 = $("#cloneForm_DefaultColor2", element).val();
          returnObject.DefaultThemeColor3 = $("#cloneForm_DefaultColor3", element).val();
          returnObject.DefaultThemeColor4 = $("#cloneForm_DefaultColor4", element).val();
          returnObject.DefaultThemeColor5 = $("#cloneForm_DefaultColor5", element).val();
          return returnObject;
        }
        function MarkCurrentSelectedImage(imageUrl){
          $(".flex-theme-manager-image-item-selector-holder").removeClass("active");
          let imageObject = directiveLookupOptions.AvailableImages.find(i => i.ImageUrl == imageUrl);
          if(imageObject != null)
          {
            let itemId = imageObject.Id;
            $(`#availableImage_${itemId}`, element).addClass("active");
          }
        }
        /* Misc/Util Methods END */
        /* Show/Hide START */
        function HideAll() {
          HideAllForms();
        }
        function HideAllForms() {
          HideEditorForm();
          HideCloneForm();
          HideImageSelectionForm();
        }
        function HideEditorForm() {
          HideImageSelectionForm();
          $("#flexThemeManagerFormHolder_Editor", element).hide();
        }
        function ShowEditorForm() {
          HideCloneForm();
          $("#flexThemeManagerFormHolder_Editor", element).show();
        }
        function HideCloneForm() {
          $("#flexThemeManagerFormHolder_Clone", element).hide();
        }
        function ShowCloneForm() {
          HideEditorForm();
          $("#flexThemeManagerFormHolder_Clone", element).show();
        }
        function HideImageSelectionForm() {
          $("#flexThemeManagerImageFormSelectionHolder", element).hide();
        }
        function ShowImageSelectionForm() {
          $("#flexThemeManagerImageFormSelectionHolder", element).show();
        }
        /* Show/Hide END */
        scope.load = function () {
          Initialize();
          LoadDirective();
        };

        ko.postbox.subscribe("FlexThemeManagerInit", function () {
          Initialize();
        });

        ko.postbox.subscribe("FlexThemeManagerLoad", function () {
          scope.load();
        });
      },
    };
  },
]);
