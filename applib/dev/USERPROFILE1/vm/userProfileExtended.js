angularApp.directive("ngUserProfileExtended", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/UserProfile1/view/userProfileExtended.htm?' + Date.now(),
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
         let currentProfileSettings = [];
         let availableVirtualPrizeCatalogThemes = [];
         let availableAvatars = [];
         //TODO: Turn into something we can hit the configs to get the full listing of this information
         let availableUserTabs = [
            { id: "myMessages", text: "Messages", displayOrder: 1, status: "A", resourceTag: "", moduleKey: "USER_MESSAGING" },
            { id: "myTasks", text: "Tasks", displayOrder: 2, status: "A", resourceTag: "", moduleKey: "GOAL_AND_TASKS" },
            { id: "myGoals", text: "Goals", displayOrder: 3, status: "A", resourceTag: "", moduleKey: "GOAL_AND_TASKS" },
            { id: "mySidekick", text: "Sidekick", displayOrder: 4, status: "A", resourceTag: "", moduleKey: "SIDEKICK" },
            { id: "myGames", text: "Flex", displayOrder: 5, status: "A", resourceTag: "", moduleKey: "FLEX" },
            { id: "myAgame", text: "A-GAME", displayOrder: 6, status: "A", resourceTag: "", moduleKey: "AGAME" },
            { id: "myAwards", text: "Awards", displayOrder: 7, status: "A", resourceTag: "", moduleKey: "AWARDS_AND_PRIZES" },
            { id: "myRequiredUserActions", text: "Required Actions", displayOrder: 8, status: "A", resourceTag: "", moduleKey: "RESOURCE_TEXT_REQUIRED_ACTIONS" },

         ];
         let bestContactTypes = [
            { id: "cellphone", text: "Cell Phone", status: "A", displayOrder: 5 },
            { id: "email", text: "Email", status: "A", displayOrder: 1 },
            { id: "altemail", text: "Alt. Email", status: "A", displayOrder: 10 },
         ]
         let currentUserSaveReports = [];
         /* Event Handling START */
         $("#currentUserAvatarImage", element).off("click").on("click", function(){
            //TODO: Load the current avatar information.
            ShowAvatarPicker();
         });
         $("#currentUserVirtualPrizeCatalogTheme", element).off("change").on("change", function () {
            ConfirmThemeChange(function () {
               SaveThemeChange(function () {
                  ko.postbox.publish("userProfileExtendedReload");
               });
            });
         });
         $("#currentUserBestContactType", element).off("change").on("change", function () {
            ConfirmBestContactChange(function () {
               SaveBestContactChange(function () {
                  ko.postbox.publish("userProfileExtendedReload");
               });
            });
         });
         $("#btnEditProfile", element).off("click").on("click", function () {
            LoadEditorForm(function () {
               ShowEditorForm();
            });
         });
         $("#btnRefreshProfile", element).off("click").on("click", function () {
            LoadCurrentProfileSettings();
         });
         $("#btnSaveCurrentUserProfile").off("click").on("click", function () {
            console.log("btnSaveCurrentUserProfile clicked");
            HideEditorForm();
         });
         $("#btnCloseColorPicker", element).off("click").on("click", function () {
            $("#currentColorPickerIndex", element).val(-1);
            HideColorPicker();
         });
         $(".btn-close").off("click").on("click", function () {
            console.log("btn-close clicked");
            ClearEditorForm(function () {
               HideEditorForm();
            });
         });
         $(".user-color-item-display-holder", element).on("click", function () {
            console.log("user-color-item-display-holder clicked");
            let id = this.id;
            let colorNumber = id.split("_")[1];
            DisplayColorPicker(function () {
               ShowColorPicker();
            }, colorNumber);
            // alert(`Color Picker here for color number: ${colorNumber}`);
         });
         $("#btnCloseAvatarPicker", element).off("click").on("click", function () {
            $("#currentUserAvatarFileName", element).val("");
            $("#currentUserAvatarFileBase", element).val("");
            HideAvatarPicker();
         });
         /* Event Handling END */
         scope.Initialize = function () {
            HideAll();
            LoadBestContactTypesOptions();
            LoadAvailablePrizeCatalogThemes();
            LoadAvailableUserDashboardTabs();
            LoadThemeOptions();
            LoadColorPicker();
            LoadAvatarPicker();
         };

         /* Data Loading START */
         function LoadDirective() {
            LoadCurrentProfileSettings(function(){
               MarkCurrentUserAvatar();
            });
         }
         function LoadColorPicker(callback) {
            var defaultColors = [
               '990033', 'ff3366', 'cc0033', 'ff0033', 'ff9999', 'cc3366', 'ffccff', 'cc6699',
               '993366', '660033', 'cc3399', 'ff99cc', 'ff66cc', 'ff99ff', 'ff6699', 'cc0066',
               'ff0066', 'ff3399', 'ff0099', 'ff33cc', 'ff00cc', 'ff66ff', 'ff33ff', 'ff00ff',
               'cc0099', '990066', 'cc66cc', 'cc33cc', 'cc99ff', 'cc66ff', 'cc33ff', '993399',
               'cc00cc', 'cc00ff', '9900cc', '990099', 'cc99cc', '996699', '663366', '660099',
               '9933cc', '660066', '9900ff', '9933ff', '9966cc', '330033', '663399', '6633cc',
               '6600cc', '9966ff', '330066', '6600ff', '6633ff', 'ccccff', '9999ff', '9999cc',
               '6666cc', '6666ff', '666699', '333366', '333399', '330099', '3300cc', '3300ff',
               '3333ff', '3333cc', '0066ff', '0033ff', '3366ff', '3366cc', '000066', '000033',
               '0000ff', '000099', '0033cc', '0000cc', '336699', '0066cc', '99ccff', '6699ff',
               '003366', '6699cc', '006699', '3399cc', '0099cc', '66ccff', '3399ff', '003399',
               '0099ff', '33ccff', '00ccff', '99ffff', '66ffff', '33ffff', '00ffff', '00cccc',
               '009999', '669999', '99cccc', 'ccffff', '33cccc', '66cccc', '339999', '336666',
               '006666', '003333', '00ffcc', '33ffcc', '33cc99', '00cc99', '66ffcc', '99ffcc',
               '00ff99', '339966', '006633', '336633', '669966', '66cc66', '99ff99', '66ff66',
               '339933', '99cc99', '66ff99', '33ff99', '33cc66', '00cc66', '66cc99', '009966',
               '009933', '33ff66', '00ff66', 'ccffcc', 'ccff99', '99ff66', '99ff33', '00ff33',
               '33ff33', '00cc33', '33cc33', '66ff33', '00ff00', '66cc33', '006600', '003300',
               '009900', '33ff00', '66ff00', '99ff00', '66cc00', '00cc00', '33cc00', '339900',
               '99cc66', '669933', '99cc33', '336600', '669900', '99cc00', 'ccff66', 'ccff33',
               'ccff00', '999900', 'cccc00', 'cccc33', '333300', '666600', '999933', 'cccc66',
               '666633', '999966', 'cccc99', 'ffffcc', 'ffff99', 'ffff66', 'ffff33', 'ffff00',
               'ffcc00', 'ffcc66', 'ffcc33', 'cc9933', '996600', 'cc9900', 'ff9900', 'cc6600',
               '993300', 'cc6633', '663300', 'ff9966', 'ff6633', 'ff9933', 'ff6600', 'cc3300',
               '996633', '330000', '663333', '996666', 'cc9999', '993333', 'cc6666', 'ffcccc',
               'ff3333', 'cc3333', 'ff6666', '660000', '990000', 'cc0000', 'ff0000', 'ff3300',
               'cc9966', 'ffcc99', 'ffffff', 'cccccc', '999999', '666666', '333333', '000000',
               '000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000'
            ];
            $("#colorPickerDisplay", element).empty();
            defaultColors.forEach(function (colorHex) {
               let colorPickerItem = $(`<div class="color-picker-item color-cell" hexVal="#${colorHex}">&nbsp;</div>`);
               colorPickerItem.css("background-color", `#${colorHex}`);
               colorPickerItem.on("click", function () {
                  let val = $(this).attr("hexVal")
                  SetNewColorPicked(function () {
                     // $("#currentColorPickerIndex", element).val(-1);
                     HideColorPicker();
                     ko.postbox.publish("userProfileExtendedReload");
                  }, val);
               });
               $("#colorPickerDisplay", element).append(colorPickerItem);
            });

            if (callback != null) {
               callback();
            }
         }
         function LoadAvatarPicker(callback)
         {
            GetAvailableAvatars(function(availableAvatarList){
               RenderAvailableAvatars(callback, availableAvatarList);
            });
         }
         function LoadAvailablePrizeCatalogThemes() {
            availableVirtualPrizeCatalogThemes.length = 0;
            //TODO: Load this from the database in some fashion.
            availableVirtualPrizeCatalogThemes = [
               {themeId: 1, ThemeName: "Dragons", ThemeTag: "dragons"},
               {themeId: 2, ThemeName: "Tiki Beach", ThemeTag: "tiki"},
               {themeId: 3, ThemeName: "Under the Sea", ThemeTag: "under-the-sea"},
               // {themeId: 4, ThemeName: "Cute Animals", ThemeTag: "cute-animals"},
               // {themeId: 5, ThemeName: "Gone Bananas!", ThemeTag: "bananas"},
               {themeId: 6, ThemeName: "Football", ThemeTag: "gridiron"},
               {themeId: 7, ThemeName: "Basketball", ThemeTag: "hoops"},
               // {themeId: 8, ThemeName: "Squishies", ThemeTag: "squishies"},
               // {themeId: 9, ThemeName: "Super Heros", ThemeTag: "super-heros"},
               // {themeId: 10, ThemeName: "Sweet Treats", ThemeTag: "sweet-treats"},
               // {themeId: 11, ThemeName: "Cars", ThemeTag: "flying-cars"},
               // {themeId: 12, ThemeName: "Prizes", ThemeTag: "prizes"},
               // {themeId: 13, ThemeName: "Treasure Hunt", ThemeTag: "treasure-hunt"},
               {themeId: 14, ThemeName: "Olympics", ThemeTag: "medalist"},
               {themeId: 15, ThemeName: "Baseball", ThemeTag: "hits"},
               {themeId: 16, ThemeName: "Unicorns", ThemeTag: "unicorns"},
               {themeId: 17, ThemeName: "Hockey", ThemeTag: "faceoff"},
               {themeId: 18, ThemeName: "Pizza", ThemeTag: "pizza"},
               {themeId: 19, ThemeName: "Tacos", ThemeTag: "taco"},
               {themeId: 20, ThemeName: "Donuts", ThemeTag: "donut"},
               // {themeId: 21, ThemeName: "Prizes", ThemeTag: "prizes"},
               // {themeId: 22, ThemeName: "Prizes", ThemeTag: "prizes"},
               // {themeId: 23, ThemeName: "Prizes", ThemeTag: "prizes"},
               // {themeId: 24, ThemeName: "Prizes", ThemeTag: "prizes"},
               // {themeId: 25, ThemeName: "Prizes", ThemeTag: "prizes"},
            ];
         }
         function LoadBestContactTypesOptions(callback) {
            $("#currentUserBestContactType", element).empty();
            $("#currentUserBestContactType", element).append($(`<option />`, { text: "", value: "" }));
            bestContactTypes = bestContactTypes.sort(function (a, b) {
               return (a.displayOrder - b.displayOrder);
            });
            bestContactTypes.forEach(function (contactTypeItem) {
               $("#currentUserBestContactType", element).append($(`<option />`, { text: contactTypeItem.text, value: contactTypeItem.id }));
            });
            if (callback != null) {
               callback();
            }
         }
         function LoadAvailableUserDashboardTabs() {
            $("#userDashboardTabDisplay", element).empty();


            availableUserTabs.forEach(function (tabItem) {
               let tabItemHolder = $(`<div class="user-profile-extended-user-tab-item-holder" id="userDashboardTab_${tabItem.id}">${tabItem.text}</div>`);

               tabItemHolder.on("click", function () {
                  let id = this.id;
                  let tabId = id.split("_")[1];
                  ConfirmUserDashboardTabChange(function (tabId) {
                     SaveUserDashboardTabChange(null, tabId)
                  }, tabId);
               });

               $("#userDashboardTabDisplay", element).append(tabItemHolder);
            });
         }
         function LoadThemeOptions(callback) {
            $("#currentUserVirtualPrizeCatalogTheme", element).empty();
            $("#currentUserVirtualPrizeCatalogTheme", element).append($(`<option />`, { text: "Default", value: "default" }));
            availableVirtualPrizeCatalogThemes.forEach(function (themeItem) {
               $("#currentUserVirtualPrizeCatalogTheme", element).append($(`<option />`, { text: themeItem.ThemeName, value: themeItem.ThemeTag }));
            });
            if (callback != null) {
               callback();
            }
         }
         function LoadCurrentProfileSettings(callback) {
            GetCurrentUserProfileExtended(function (profileSettings) {
               RenderCurrentUserProfileSettings(callback, profileSettings);
            }, legacyContainer.scope.TP1Username);
         }
         function LoadEditorForm(callback) {
            console.log("LoadEditorForm{)");
            if (callback != null) {
               callback();
            }
         }
         function ClearEditorForm(callback) {
            console.log("ClearEditorForm{)");
            if (callback != null) {
               callback();
            }
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetCurrentUserProfileExtended(callback, userIdToLoad) {
            if (userIdToLoad == null) {
               userIdToLoad = legacyContainer.scope.TP1Username;
            }
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "userprofile",
                  cmd: "getProfileSettings",
                  userid: userIdToLoad
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.userProfileSettings);
                  currentProfileSettings = returnData;

                  if (callback != null) {
                     callback(returnData);
                  }
                  else {
                     return returnData;
                  }
               }
            });
         }
         function GetSavedReportsForUser(callback, userIdToLoad) {
            if (userIdToLoad == null) {
               userIdToLoad = legacyContainer.scope.TP1Username;
            }
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "userprofile",
                  cmd: "getSavedReportsForUser",
                  userid: userIdToLoad
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.userSavedReportList);
                  currentUserSaveReports = returnData;

                  if (callback != null) {
                     callback(returnData);
                  }
                  else {
                     return returnData;
                  }
               }
            });
         }
         function GetAvailableAvatars(callback)
         {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserv",
                  cmd: "getAllAvailableAvatars",
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.availableAvatarList);
                  console.log(returnData);
                  availableAvatars = returnData;

                  if (callback != null) {
                     callback(returnData);
                  }
                  else {
                     return returnData;
                  }
               }
            });

         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderCurrentUserProfileSettings(callback, allUserSettingsList) {
            $("#currentProfileDisplayInfoDev", element).empty();
            if (allUserSettingsList == null) {
               allUserSettingsList = currentProfileSettings;
            }
            //TODO: Handle the information for the client.
            $("#lblUserFullName", element).empty();
            $("#lblUserFirstName", element).empty();
            $("#lblUserLastName", element).empty();
            $("#lblUserLastName", element).empty();
            $("#lblUserEmailAddress", element).empty();
            $("#lblUserEmailAddress2", element).empty();
            $("#lblUserCellPhone", element).empty();
            $("#currentUserBestContactType", element).val("");
            $("#lblUserId", element).empty();
            $("#lblUserId", element).append(legacyContainer.scope.TP1Username);

            let userSettings = allUserSettingsList.find(i => i.Client == 0);
            if (userSettings != null) {
               let avatarImageFileFullUrl = `${userSettings.AvatarFileLocationBaseUrl}${userSettings.AvatarFileName}`;
               avatarImageFileFullUrl = Global_CleanAvatarUrl(avatarImageFileFullUrl);
               $("#currentUserAvatarImage", element).prop("src", avatarImageFileFullUrl);
               $("#currentUserAvatarFileName", element).val(userSettings.AvatarFileName);
               $("#currentUserAvatarFileBase", element).val(userSettings.AvatarFileLocationBaseUrl);
               $("#lblUserEmailAddress", element).append(userSettings.EmailAddress);
               $("#lblUserEmailAddress2", element).append(userSettings.EmailAddress2);
               $("#lblUserCellPhone", element).append(userSettings.CellPhone);
               $("#currentUserBestContactType", element).val(userSettings.BestContactType);

               if (userSettings.UserProfileSource != null) {
                  $("#lblUserFullName", element).append(userSettings.UserProfileSource.UserFullName);
                  $("#lblUserFirstName", element).append(userSettings.UserProfileSource.FirstName);
                  $("#lblUserLastName", element).append(userSettings.UserProfileSource.LastName);
               }
               if (userSettings.UserDashboardSettings != null) {
                  let selectedTab = userSettings.UserDashboardSettings?.DefaultTabId || "myMessages";
                  MarkDashboardTabActive(selectedTab);
               }
               let currentTheme = userSettings.VirtualPrizeCatalogSettings?.CurrentTheme || "default";
               $("#currentUserVirtualPrizeCatalogTheme", element).val(currentTheme);
               $("#currentUserVirtualPrizeCatalogThemeDisplay", element).css("background", `url(/applib/css/images/themes/${currentTheme}/Background.jpg)`);
               if (userSettings.ColorsSettings != null) {
                  RenderUserColors(userSettings.ColorsSettings);
               }
               currentUserSaveReports = userSettings.SavedReports;
            }
            RenderUserSaveReports(callback);
         }
         function RenderUserColors(colorsArray) {
            $("[id^='UserColorDisplay_'", element).css("background-color", "transparent");

            let itemsCount = $("[id^='UserColorDisplay_'", element).length || 0;
            for (let index = 1; index <= itemsCount; index++) {
               $(`#UserColorDisplay_${index}`, element).show();
               $(`#UserColorDisplay_${index}`, element).css("background-color", colorsArray[index - 1]);
               if (index > colorsArray.length) {
                  $(`#UserColorDisplay_${index}`, element).hide();
               }
            }
         }
         function RenderUserSaveReports(callback, userSavedReportsList) {
            if (userSavedReportsList == null) {
               userSavedReportsList = currentUserSaveReports;
            }
            $("#currentUserSavedReportsList", element).empty();
            $("#currentUserSavedReportsCount", element).text("0");

            let savedReportsListHolder = $(`<div class="user-profile-saved-reports-listing-holder" />`);
            if (userSavedReportsList != null && userSavedReportsList.length > 0) {
               userSavedReportsList.forEach(function (savedReportItem) {
                  let savedReportItemRow = $(`<div class="user-profile-saved-report-item-row" id="userSavedReport_${savedReportItem.ReportId}" />`);

                  let savedReportNameHolder = $(`<div class="user-profile-report-name-holder" id="userSavedReportNameHolder_${savedReportItem.ReportId}" />`);
                  let savedReportName = savedReportItem.ReportName;

                  savedReportNameHolder.append(savedReportName);
                  let savedReportButtonHolder = $(`<div class="user-profile-saved-report-button-holder" id="userSavedReportButtons_${savedReportItem.ReportId}" />`);
                  let editButton = $(`<button class="user-profile-saved-report-edit-button" id="userSavedReportEditButton_${savedReportItem.ReportId}"><i class="fa fa-edit"></i></button>`);
                  editButton.on("click", function () {
                     let id = this.id;
                     let reportId = id.split("_")[1];
                     alert(`Not implemented yet. Edit report: ${reportId}`);
                  });
                  let viewButton = $(`<button class="user-profile-saved-report-edit-button" id="userSavedReportEditButton_${savedReportItem.ReportId}"><i class="fa fa-magnifying-glass"></i></button>`);
                  viewButton.on("click", function () {
                     let id = this.id;
                     let reportId = id.split("_")[1];
                     alert(`Not implemented yet. View report: ${reportId}`);
                  });
                  let removeButton = $(`<button class="user-profile-saved-report-remove-button button--red" id="userSavedReportRemoveButton_${savedReportItem.ReportId}"><i class="fa fa-trash"></i></button>`);

                  removeButton.on("click", function () {
                     let id = this.id;
                     let reportId = id.split("_")[1];
                     alert(`Not implemented yet. Remove report: ${reportId}`);
                  });

                  savedReportButtonHolder.append(viewButton);
                  savedReportButtonHolder.append("&nbsp;");
                  savedReportButtonHolder.append(editButton);
                  savedReportButtonHolder.append("&nbsp;");
                  savedReportButtonHolder.append(removeButton);

                  savedReportItemRow.append(savedReportNameHolder);
                  savedReportItemRow.append(savedReportButtonHolder);

                  savedReportsListHolder.append(savedReportItemRow);
               });
               $("#currentUserSavedReportsCount", element).text(userSavedReportsList.length);
            }
            else {
               savedReportsListHolder.append("No saved reports for user found.");
            }

            $("#currentUserSavedReportsList", element).append(savedReportsListHolder);
            if (callback != null) {
               callback();
            }
         }
         function RenderAvailableAvatars(callback, listToRender)
         {
            if(listToRender == null)
            {
               listToRender = availableAvatars;
            }
            $("#avatarPickerDisplay", element).empty();
            if(listToRender != null && listToRender.length > 0)
            {
               listToRender.forEach(function(avatarFileItem){
                  let avatarPickerItem = $(`<div class="avatar-picker-item" keyValue="${avatarFileItem.TempAvatarKey}" />`);
                  let avatarImage = $(`<img class="avatar-image" src="${avatarFileItem.FilePath}${avatarFileItem.FileName}" />`);
                  avatarPickerItem.append(avatarImage);
                  avatarPickerItem.on("click", function(){
                     let val = $(this).attr("keyValue");
                     SetNewAvatarPicked(function(){
                        HideAvatarPicker();
                        ko.postbox.publish("userProfileExtendedReload");
                     }, val);
                  });

                  $("#avatarPickerDisplay", element).append(avatarPickerItem);
               });
            }
            else
            {
               $("#avatarPickerDisplay", element).append("No Avatars found to display.");
            }
            $("#avatarsFoundCount", element).text(listToRender.length);
            if (callback != null) {
               callback();
            }
         }
         /* Data Rendering END */
         /* Form Handling START */
         function ConfirmThemeChange(callback) {
            let newTheme = $("#currentUserVirtualPrizeCatalogTheme", element).val();
            let themeObject = availableVirtualPrizeCatalogThemes.find(i => i.ThemeTag == newTheme);
            let confirmMessage = `Are you sure change your theme?`;
            if (themeObject != null) {
               confirmMessage = `Are you sure you want to set your new theme to ${themeObject.ThemeName}?`;
            }
            if (confirm(confirmMessage)) {
               if (callback != null) {
                  callback();
               }
            }
         }
         function SaveThemeChange(callback) {
            let newTheme = $("#currentUserVirtualPrizeCatalogTheme", element).val();
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "userprofile",
                  cmd: "updateVirtualPrizeCatalogTheme",
                  userid: legacyContainer.scope.TP1Username,
                  newtheme: newTheme,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  ko.postbox.publish("prizeCatalogUserHeaderReload");
                  if (callback != null) {
                     callback();
                  }
               }
            });
         }
         function ConfirmBestContactChange(callback) {
            let newBestContact = $("#currentUserBestContactType", element).val();
            let bestContactObject  = bestContactTypes.find(i => i.id == newBestContact);
            let confirmMessage = `Are you sure you want to change your best contact?`;
            if(bestContactObject != null)
            {
               confirmMessage = `Are you sure you want to set your new best contact to ${bestContactObject.text}?`;
            }

            if (confirm(confirmMessage)) {
               if (callback != null) {
                  callback();
               }
            }
         }
         function SaveBestContactChange(callback) {
            let newBestContact = $("#currentUserBestContactType", element).val();
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "userprofile",
                  cmd: "updateBestContactTypeForUser",
                  userid: legacyContainer.scope.TP1Username,
                  newbestcontact: newBestContact,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  ko.postbox.publish("prizeCatalogUserHeaderReload");
                  if (callback != null) {
                     callback();
                  }
               }
            });
         }
         function ConfirmUserDashboardTabChange(callback, newTabId) {
            let tabObject = availableUserTabs.find(i => i.id == newTabId);
            let tabName = "";
            if (tabObject != null) {
               tabName = tabObject.text;
            }
            if (confirm(`Are you sure you want to set the default to ${tabName}?`)) {
               if (callback != null) {
                  callback(newTabId);
               }
            }
         }
         function SaveUserDashboardTabChange(callback, newTabId) {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "userprofile",
                  cmd: "updateUserDashboardDefaultTab",
                  userid: legacyContainer.scope.TP1Username,
                  newTab: newTabId,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  MarkDashboardTabActive(newTabId);
                  if (callback != null) {
                     callback();
                  }
               }
            });
         }
         function SetNewColorPicked(callback, hexVal) {
            let itemIndex = $("#currentColorPickerIndex", element).val();
            let currentUserProfileIndex = currentProfileSettings.findIndex(i => i.UserName == legacyContainer.scope.TP1Username);
            if (currentUserProfileIndex >= 0 && currentProfileSettings[currentUserProfileIndex].ColorsSettings != null) {
               if (currentProfileSettings[currentUserProfileIndex].ColorsSettings.length > 0) {
                  currentProfileSettings[currentUserProfileIndex].ColorsSettings[itemIndex - 1] = hexVal;
               }
               else {
                  currentProfileSettings[currentUserProfileIndex].ColorsSettings[0] = hexVal;
               }
            }
            else {
               currentProfileSettings[currentUserProfileIndex].ColorsSettings = [];
               currentProfileSettings[currentUserProfileIndex].ColorsSettings.push(hexVal);
            }
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "userprofile",
                  cmd: "updateUserColors",
                  userid: legacyContainer.scope.TP1Username,
                  colors: JSON.stringify(currentProfileSettings[currentUserProfileIndex].ColorsSettings),
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  let returnData = JSON.parse(data.userProfileSettings);
                  currentProfileSettings = returnData;
                  if (callback != null) {
                     callback();
                  }
               }
            });

            if (callback != null) {
               callback();
            }
         }
         function SetNewAvatarPicked(callback, avatarKey)
         {
            let avatarSelected = availableAvatars.find(i => i.TempAvatarKey == avatarKey);
            if(avatarSelected != null)
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "userprofile",
                     cmd: "updateUserAvatar",
                     userid: legacyContainer.scope.TP1Username,
                     avatarfilename: avatarSelected.FileName,
                     avatarfilepath: avatarSelected.FilePath,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let returnData = JSON.parse(data.userProfileSettings);
                     currentProfileSettings = returnData;
                     if (callback != null) {
                        callback();
                     }
                  }
               });
            }
            if (callback != null) {
               callback();
            }
         }
         function DisplayColorPicker(callback, pickerNumber) {
            $("#currentColorPickerIndex", element).val(pickerNumber);
            if (callback != null) {
               callback();
            }
         }

         /* Form Handling END */
         /* Misc Information Handling START */
         function MarkDashboardTabActive(tabId) {
            $.cookie("userProfile_defaultTab", tabId); //set the cookie for other information.
            $(`[id^='userDashboardTab_']`, element).removeClass("active");
            if (tabId != null && tabId != "") {
               $(`#userDashboardTab_${tabId}`, element).addClass("active");
            }
         }
         function MarkCurrentUserAvatar(callback)
         {
            let currentAvatarUrl = `${currentProfileSettings[0].AvatarFileLocationBaseUrl}${currentProfileSettings[0].AvatarFileName}`;
            $(".avatar-picker-item", element).removeClass("active");
            $(".avatar-image", element).each(function(){
               if($(this).prop("src").indexOf(currentAvatarUrl) > -1)
               {
                  $(this.closest(".avatar-picker-item")).addClass("active");
               }
            });
         }
         /* Misc Information Handling END */
         /* Show/Hide START */
         function HideAll() {
            HideColorPicker();
            HideAvatarPicker();
            HideEditorForm();
         }
         function HideEditorForm() {
            $(".user-profile-extended-form-holder", element).hide();
         }
         function ShowEditorForm() {
            $(".user-profile-extended-form-holder", element).show();
         }
         function HideColorPicker() {
            $("#colorPickerHolder", element).hide();
         }
         function ShowColorPicker() {
            $("#colorPickerHolder", element).show();
         }
         function HideAvatarPicker() {
            $("#avatarPickerHolder", element).hide();
         }
         function ShowAvatarPicker() {
            $("#avatarPickerHolder", element).show();
         }
         /* Show/Hide END */

         scope.load = function () {
            scope.Initialize();
            LoadDirective();
         };
         scope.load();

         ko.postbox.subscribe("userProfileExtendedLoad", function () {
            scope.load();
         });
         ko.postbox.subscribe("userProfileExtendedReload", function () {
            scope.load();
         });

      }
   };
}]);
