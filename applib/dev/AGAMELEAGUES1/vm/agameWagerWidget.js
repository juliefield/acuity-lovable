angularApp.directive("ngAgameWagerWidget", ["api", "$rootScope", function(api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/AGAMELEAGUES1/view/agameWagerWidget.htm?' + Date.now(),
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
         HideWidget();
         scope.prefixInfo = a$.gup("prefix");
         scope.baseBookUrl = window.location.protocol + "//" + window.location.hostname + "/3/ng/AgameLeague/AGameWager.aspx";

         let daysUntilRosterLockParamValue = 2;
         let maxWagerAmount = 250;
         let isCurrentRosterLocked = false;

         let hasModule = false;
         let currentWager = null;
         let nextWager = null;
         let previousWager = null;
         /* Directive control events section START */
         $("#btnWagerWidgetCreate", element).off("click").on("click", function () {
            ValidateWager(function () {
               SaveWager(function () {
                  currentWager = null;
                  LoadWidgetData();
               }, "create");
            });
         });
         $("#btnWagerWidgetAccept", element).off("click").on("click", function () {
            ValidateWager(function () {
               SaveWager(function () {
                  ko.postbox.publish("aGameWagerReload");
               }, "accept");
            });
         });
         $("#btnWagerWidgetReject", element).off("click").on("click", function () {
            SaveWager(function () {
               currentWager = null;
               LoadWidgetData();
            }, "reject");
         });
         $("#btnWagerWidgetCounter", element).off("click").on("click", function () {
            ValidateWager(function () {
               SaveWager(function () {
                  currentWager = null;
                  LoadWidgetData();
               }, "counter");
            });
         });
         $("#wagerWidgetImage", element).off("click").on("click", function () {
            //console.log("Navigate to the users book.");
            let hasPrefix = false;
            let documentLocation = scope.baseBookUrl;
            if (scope.prefixInfo != null && scope.prefixInfo != "") {
               documentLocation += "?prefix=" + scope.prefixInfo;
               hasPrefix = true;
            }
            ko.postbox.publish("SetNavigation", { type: "WagerBook"});
            //4("Navigate to: " + documentLocation);
            //document.location = documentLocation;
         });
         /* Directive control events section END */
         scope.Initialize = function () {
            HideAll();
            GetRosterLockDays();
         };
         function ClearMemoryWagers() {
            currentWager = null;
            previousWager = null;
            nextWager = null;
         }
         function GetRosterLockDays() {
            appLib.getConfigParameterByName("DAYS_UNTIL_AGAME_ROSTER_LOCK", function (param) {
               if (param != null) {
                  daysUntilRosterLockParamValue = parseInt(param.ParamValue);
               }
            });
         }
         function CheckRosterLocked(weekStartDate, daysUntilRosterLocked, callback) {
            if (daysUntilRosterLocked == null) {
               daysUntilRosterLocked = daysUntilRosterLockParamValue;
            }
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "flex",
                  cmd: "isRosterLocked",
                  weekstartdate: weekStartDate,
                  daysUntilRosterLock: daysUntilRosterLocked
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  if (data.errormessage != null && data.errormessage != "") {
                     a$.jsonerror(data);
                     return;
                  }
                  else {
                     let returnValue = false;
                     returnValue = JSON.parse(data.rosterLocked);
                     if (callback != null) {
                        callback(returnValue);
                     }
                     else {
                        return returnValue;
                     }
                  }
               }
            });
         }
         /* Widget Loading START */
         function LoadWidgetData() {
            nextWager = null;
            previousWager = null;
            LoadCurrentWager(function (returnWager) {
               if (returnWager != null) {
                  CheckRosterLocked(new Date(returnWager.WeekStartDate).toLocaleDateString(), daysUntilRosterLockParamValue, function (returnValue) {
                     isCurrentRosterLocked = returnValue;
                     if (returnValue == false) {
                        LoadButtonsForWager(null, returnWager);
                     }
                  });
                  LoadUserBalance(null, returnWager);
                  LoadMessageForUser(null, returnWager, "current");
                  // if(isCurrentRosterLocked == true){
                  //    LoadNextWager(function(nextWager){
                  //       LoadMessageForUser(null, nextWager, "next");
                  //       LoadButtonsForWager(null, nextWager);
                  //    });
                  // }
               }
            });
            LoadPreviousWager(function (prevWager) {
               LoadMessageForUser(null, prevWager, "previous");
            });

         }
         function LoadUserBalance(callback, wagerObject) {
            if (wagerObject == null) {
               wagerObject = currentWager;
            }

            let userBalance = currentWager.CurrentBalance || currentWager.AvailableBalance || 0;
            let currentWagerAmount = currentWager.WagerAmount;
            let userBalanceFormatted = userBalance.toLocaleString("en-US", { style: "currency", currency: "USD" });
            let currentWagerAmountFormatted = 0.00.toLocaleString("en-US", { style: "currency", currency: "USD" });

            $("#currentUserBudgetAmount", element).empty();
            $("#currentUserBudgetAmount", element).append(userBalanceFormatted);
            if(currentWagerAmount != null && currentWagerAmount != "")
            {
               currentWagerAmountFormatted = currentWagerAmount.toLocaleString("en-US", { style: "currency", currency: "USD" });;

            }
            $("#currentUserWagerAmount", element).empty();
            $("#currentUserWagerAmount", element).append(currentWagerAmountFormatted);

            if (callback != null) {
               callback();
            }
         }
         function LoadMessageForUser(callback, wagerObject, messageTypeToLoad) {
            if (wagerObject == null) {
               if (messageTypeToLoad.toLowerCase() == "previous") {
                  wagerObject = previousWager;
               }
               else {
                  wagerObject = currentWager;
               }
            }
            if (wagerObject == null) {
               return;
            }
            if (messageTypeToLoad == null) {
               messageTypeToLoad = "current";
            }

            let againstUserName = wagerObject.WagerAgainstUserFullName;
            let weekNumber = wagerObject.WeekNumber || 1;
            if (againstUserName == null || againstUserName == "") {
               againstUserName = wagerObject.WagerAgainstUserId;
            }
            let messageText = "Week " + weekNumber + " Wager vs. " + againstUserName;
            let wagerAmount = wagerObject.WagerAmount || 0;
            let wagerAmountFormatted = wagerAmount.toLocaleString("en-US", { style: "currency", currency: "USD" });
            switch (wagerObject.WagerStatusId) {
               case 1: //Negotiating
                  if (wagerObject.LastStatusChangeByUserId == legacyContainer.scope.TP1Username) {
                     //messageText = "Waiting on other to decide.";
                     messageText = "Awaiting opponent's response.";
                  }
                  else {
                     //messageText = againstUserName + " has offered a wager of " + wagerAmountFormatted;
                     messageText = "Week " + weekNumber + " Wager: " + wagerAmountFormatted;
                  }
                  break;
               case 2: //Accepted
                  if (messageTypeToLoad.toLowerCase() == "previous") {
                     if (wagerObject.AGameWagerDetailIdSource != null) {
                        let wagerOutcome = wagerObject.AGameWagerDetailIdSource.WagerOutcome.toLowerCase() || "unknown";
                        if (wagerObject.AGameWagerDetailIdSource.WagerOutcome.toLowerCase() === "win") {
                           //messageText = "You won " + wagerAmountFormatted + " from " + againstUserName + "!";
                           messageText = "You're in the money! " + againstUserName + " owes ya " + wagerAmountFormatted + ".";
                        }
                        else if (wagerObject.AGameWagerDetailIdSource.WagerOutcome.toLowerCase() === "tie") {
                           //messageText = "You tied with " + againstUserName + ".";
                           messageText = "Square deal.  Nobody owes nobody.";
                        }
                        else if (wagerObject.AGameWagerDetailIdSource.WagerOutcome.toLowerCase() === "loss") {
                           //messageText = "You lost " + wagerAmountFormatted + ".";
                           messageText = "Tough break, kid.  You owe " + againstUserName + " " + wagerAmountFormatted + ".";
                        }
                        else {
                           messageText = "Outcome for week " + weekNumber + " unknown.";
                        }

                        $("#previousUserWagerMessageHolder", element).removeClass("win").removeClass("loss").removeClass("tied").removeClass("unknown");
                        $("#previousUserWagerMessageHolder", element).addClass(wagerOutcome);
                        ShowPreviousWager();
                     }
                     else {
                        HidePreviousWager();
                        messageText = "Week " + weekNumber + " outcome for user here.";
                     }

                  }
                  else {
                     //messageText = "Wager for " + wagerAmountFormatted + " has been accepted. GAME ON!";
                     messageText = "Week " + weekNumber + " Wager accepted. GAME ON!";
                  }
                  break;
               case 3: //Rejected
                  //messageText = "Your wager with " + againstUserName + " has been rejected.";
                  messageText = "Week " + weekNumber + " Wager rejected.";
                  break;
               case 4: //Countered
                  if (wagerObject.LastStatusChangeByUserId == legacyContainer.scope.TP1Username) {
                     //messageText = "Waiting on " + againstUserName + " to accept, reject or counter your wager.";
                     messageText = "Awaiting opponent's response.";
                  }
                  else {
                     //messageText = againstUserName + " has offered a counter wager of " + wagerAmountFormatted;
                     messageText = "Week " + weekNumber + " wager:" + wagerAmountFormatted;
                  }
                  break;
               case 5: //Timed Out
                  messageText = "Week " + weekNumber + " Wager Timed out.";
                  break;
               case 6: //No Wager Made
                  messageText = "No Wager for week " + weekNumber + ".";
                  break;
            }
            let renderTo = "currentUserWagerMessage";
            HidePreviousWager();
            if (messageTypeToLoad.toLowerCase() == "next") {
               renderTo = "nextUserWagerMessage";
            }
            else if (messageTypeToLoad.toLowerCase() == "previous") {
               renderTo = "previousUserWagerMessage";
               ShowPreviousWager();
            }

            $("#" + renderTo, element).empty();
            $("#" + renderTo, element).append(messageText);

            if (callback != null) {
               callback();
            }
         }
         function LoadButtonsForWager(callback, wagerObject) {
            HideAllButtons();
            HideWagerInputField();

            if (wagerObject.WagerStatusId == null) {
               ShowProposeButton();
               ShowWagerInputField();
            }
            else {
               switch (wagerObject.WagerStatusId) {
                  case 1://Negotiating
                  case 4://Countered
                     if (wagerObject.LastStatusChangeByUserId != legacyContainer.scope.TP1Username) {
                        ShowAcceptButton();
                        ShowCounterButton();
                        ShowRejectButton();
                        ShowWagerInputField();
                     }
                     break;
                  case 3: //Rejected
                     ShowProposeButton();
                     break;
               }

            }
            if (callback != null) {
               callback();
            }
         }
         function LoadCurrentWager(callback) {
            GetCurrentWager(function (wagerToLoad) {
               currentWager = wagerToLoad;
               RenderCurrentWager(callback, wagerToLoad);
            });
         }
         // function LoadNextWager(callback)
         // {
         //    GetNextWager(function(wagerToLoad){
         //       nextWager = wagerToLoad;
         //       RenderNextWager(callback, wagerToLoad);
         //    });
         //    ShowNextWager();
         // }
         function GetCurrentWager(callback) {
            if (currentWager != null) {
               if (callback != null) {
                  callback(currentWager);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getCurrentWagerForUser",
                     userid: legacyContainer.scope.TP1Username
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     if (data.errormessage != null && data.errormessage != "") {
                        a$.jsonerror(data);
                        return;
                     }
                     else {
                        var returnWager = JSON.parse(data.currentWager);
                        if (returnWager.length == 0 || returnWager.Id <= 0) //no ID means we have nothing to show.
                        {
                           returnWager = null;
                        }
                        currentWager = returnWager;
                        if (callback != null) {
                           callback(returnWager);
                        }
                     }
                  }
               });
            }
         }
         function RenderCurrentWager(callback, wagerObjectToRender) {
            if (wagerObjectToRender == null || wagerObjectToRender.Id <= 0) {
               HideWidget();
            }
            else {
               $("#currentWagerDetailId", element).val(wagerObjectToRender.AGameWagerDetailId);
               $("#currentWagerAgainstUserId", element).val(wagerObjectToRender.WagerAgainstUserId);
               if (wagerObjectToRender.WagerAmount != 0) {
                  $("#currentWagerInputAmount", element).val(wagerObjectToRender.WagerAmount);
               }
            }
            if (callback != null) {
               callback(wagerObjectToRender);
            }
         }
         function GetNextWager(callback) {
            if (nextWager != null) {
               if (callback != null) {
                  callback(nextWager);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getNextWagerForUser",
                     userid: legacyContainer.scope.TP1Username
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     if (data.errormessage != null && data.errormessage != "") {
                        a$.jsonerror(data);
                        return;
                     }
                     else {
                        var returnWager = JSON.parse(data.nextWager);
                        if (returnWager.length == 0 || returnWager.Id <= 0) //no ID means we have nothing to show.
                        {
                           returnWager = null;
                        }
                        nextWager = returnWager;
                        if (callback != null) {
                           callback(returnWager);
                        }

                     }
                  }
               });
            }
         }
         function RenderNextWager(callback, wagerObjectToRender) {
            if (wagerObjectToRender == null) {
               wagerObjectToRender = nextWager;
            }
            $("#currentWagerDetailId", element).val(wagerObjectToRender.AGameWagerDetailId);
            $("#currentWagerAgainstUserId", element).val(wagerObjectToRender.WagerAgainstUserId);
            if (wagerObjectToRender.WagerAmount != 0) {
               $("#currentWagerInputAmount", element).val(wagerObjectToRender.WagerAmount);
            }
            if (callback != null) {
               callback(wagerObjectToRender);
            }
         }
         function LoadPreviousWager(callback) {
            GetPreviousWager(function (wagerToLoad) {
               previousWager = wagerToLoad;
               RenderPreviousWager(callback, wagerToLoad);
            });

         }
         function GetPreviousWager(callback) {
            if (previousWager != null) {
               if (callback != null) {
                  callback(previousWager);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: "getPreviousWagerForUser",
                     userid: legacyContainer.scope.TP1Username
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     if (data.errormessage != null && data.errormessage != "") {
                        a$.jsonerror(data);
                        return;
                     }
                     else {
                        var returnWager = JSON.parse(data.previousWager);
                        if (returnWager != null && (returnWager.length == 0 || returnWager.Id <= 0)) //no ID means we have nothing to show.
                        {
                           returnWager = null;
                        }
                        previousWager = returnWager;
                        if (callback != null) {
                           callback(returnWager);
                        }
                     }
                  }
               });
            }
         }
         function RenderPreviousWager(callback, wagerObjectToRender) {
            if (wagerObjectToRender == null) {
               wagerObjectToRender = previousWager;
            }
            if (callback != null) {
               callback();
            }
         }
         /* Widget Loading END */
         /* Wager Editor Options Handling START*/
         function ClearWagerEditor(callback) {
            console.log("ClearWagerEditor()");
            if (callback != null) {
               callback();
            }
         }
         function SaveWager(callback, saveType) {
            let detailId = $("#currentWagerDetailId", element).val();
            let amount = $("#currentWagerInputAmount", element).val();

            if (amount == null || amount == "") {
               amount = currentWager.WagerAmount;
            }
            let saveCommand = "";
            if (saveType == null || saveType == "") {
               saveType = "create";
            }

            if (saveType.toLowerCase() == "create") {
               saveCommand = "createWagerFromWidget";
            }
            else if (saveType.toLowerCase() == "accept") {
               saveCommand = "acceptWager";
            }
            else if (saveType.toLowerCase() == "reject") {
               saveCommand = "rejectWager";
            }
            else if (saveType.toLowerCase() == "counter") {
               saveCommand = "counterWagerFromWidget";
            }
            if (saveCommand != null && saveCommand != "") {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "flex",
                     cmd: saveCommand,
                     detailid: detailId,
                     amount: amount
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     if (data.errormessage != null && data.errormessage != "") {
                        a$.jsonerror(data);
                        return;
                     }
                     else {
                        let wagerObjectToSignal = currentWager;
                        wagerObjectToSignal.wagerAmount = amount;
                        if (saveType.toLowerCase() == "accept" || saveType.toLowerCase() == "reject") {
                           AddWagerFinalizedSignal(wagerObjectToSignal, saveType.toLowerCase());
                        }
                        else {
                           AddWagerSignal(wagerObjectToSignal, saveType);
                        }
                        if (callback != null) {
                           callback();
                        }
                     }
                  }
               });
            }
            else {
               console.log("Unknown save type.");
               alert("Save of wager failed.  Unknown Command.");
            }
         }
         function ValidateWager(callback) {
            let wagerAmountToSave = $("#currentWagerInputAmount", element).val();
            let allowedMaxWager = maxWagerAmount;
            let errorMessages = [];

            let isValidInputs = true;

            if (currentWager != null) {
               let availableBalance = currentWager.AvailableBalance;
               if (availableBalance < maxWagerAmount) {
                  allowedMaxWager = availableBalance;
               }
            }

            if (wagerAmountToSave == null || wagerAmountToSave == "") {
               isValidInputs = false;
               errorMessages.push({ message: "Amount Required", fieldclass: "", fieldid: "currentWagerInputAmount" });
            }
            else if (wagerAmountToSave > allowedMaxWager) {
               isValidInputs = false;
               errorMessages.push({ message: "Max wager amount of $" + allowedMaxWager + " exceeded.", fieldclass: "", fieldid: "currentWagerInputAmount" });
            }
            else if (wagerAmountToSave < 0)
            {
               isValidInputs = false;
               errorMessages.push({ message: "You can not wager less than $0.", fieldclass: "", fieldid: "currentWagerInputAmount" });
            }

            if (isValidInputs == true) {
               if (callback != null) {
                  callback();
               }
            }
            else {
               var messageString = "Errors Found: ";
               for (var m = 0; m < errorMessages.length; m++) {
                  let item = errorMessages[m];

                  messageString += "\n" + item.message;

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

               alert(messageString);
            }
         }
         // function CollectWagerDataObject() {
         //    let id = $("#wagerAgainstId", element).val();
         //    let wagerAmount = $("#wagerAmount", element).val();
         //    let returnObject = myCurrentLeagueWagerHeader.AGameWagerDetails.find(i => i.AGameWagerDetailId == id);
         //    returnObject.WagerAmount = wagerAmount;

         //    return returnObject;
         // }
         /* Wager Editor Options Handling END*/
         /* Wager Signal Handling START  */
         function AddWagerSignal(wagerObject, saveType) {
            if (saveType == null || saveType == "") {
               saveType = "initial";
            }
            let offerType = saveType;

            if (wagerObject.WagerStatusId != null && wagerObject.WagerStatusId != "") {
               offerType = "updated";
            }

            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "addWagerSignal",
                  userId: wagerObject.WagerAgainstUserId,
                  detailId: wagerObject.AGameWagerDetailId,
                  offerType: offerType,
                  offerAmount: wagerObject.WagerAmount
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  if (data.errormessage != null && data.errormessage != "") {
                     a$.jsonerror(data);
                     return;
                  }
                  else {
                     return;
                  }
               }
            });
         }
         function AddWagerFinalizedSignal(wagerObject, offerType) {
            if (wagerObject == null) {
               wagerObject = currentWager;
            }
            a$.ajax({
               type: "POST",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserve",
                  cmd: "addWagerSignal",
                  userId: wagerObject.WagerAgainstUserId,
                  detailId: wagerObject.AGameWagerDetailId,
                  offerType: offerType,
                  offerAmount: wagerObject.WagerAmount
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (data) {
                  if (data.errormessage != null && data.errormessage != "") {
                     a$.jsonerror(data);
                     return;
                  }
                  else {
                     return;
                  }
               }
            });
         }
         function ProcessWagerSignal(signalObject) {
            ClearMemoryWagers();
            ko.postbox.publish("aGameWagerReload");
         }

         /* Signal Handling END  */
         /*Show/Hide/Collapse/Toggle*/
         function HideAll() {
            HideWidget();
            HideAllButtons();
            HideWagerInputField();
            HideNextWager();
            HidePreviousWager();
         }
         function HideAllButtons() {
            HideProposeButton();
            HideAcceptButton();
            HideRejectButton();
            HideCounterButton();
         }
         function HideProposeButton() {
            $("#btnWagerWidgetCreate", element).hide();
         }
         function ShowProposeButton() {
            $("#btnWagerWidgetCreate", element).show();
         }
         function HideAcceptButton() {
            $("#btnWagerWidgetAccept", element).hide();
         }
         function ShowAcceptButton() {
            $("#btnWagerWidgetAccept", element).show();
         }
         function HideRejectButton() {
            $("#btnWagerWidgetReject", element).hide();
         }
         function ShowRejectButton() {
            $("#btnWagerWidgetReject", element).show();
         }
         function HideCounterButton() {
            $("#btnWagerWidgetCounter", element).hide();
            $("#lblWagerWidgetOr", element).hide();
         }
         function ShowCounterButton() {
            $("#btnWagerWidgetCounter", element).show();
            $("#lblWagerWidgetOr", element).show();
         }
         function HideWagerInputField() {
            $("#currentWagerInputAmount", element).hide();
         }
         function ShowWagerInputField() {
            $("#currentWagerInputAmount", element).show();
         }
         function ShowNextWager() {
            $("#nextWagerHolder", element).show();
            $(".wager-widget-holder_container", element).removeClass("hidenextwager");
         }
         function HideNextWager() {
            $("#nextWagerHolder", element).hide();
            $(".wager-widget-holder_container", element).addClass("hidenextwager");
         }
         function ShowPreviousWager() {
            $("#previousUserWagerMessageHolder", element).show();
         }
         function HidePreviousWager() {
            $("#previousUserWagerMessageHolder", element).hide();
         }
         function HideWidget() {
            $("#agameWagerWidget", element).hide();
         }
         function ShowWidget() {

            $("#agameWagerWidget", element).show();
         }

         scope.load = function () {
            scope.Initialize();
            HideWidget();
            hasModule = appLib.canAccessAGameLeague() && appLib.canAccessAGameWager();
            if (hasModule == true) {
               LoadWidgetData();
               if (currentWager != null || nextWager != null) {
                  ShowWidget();
               }
            }
         };
         ko.postbox.subscribe("aGameWagerReload", function () {
            ClearMemoryWagers();
            LoadWidgetData();
            if (currentWager != null || nextWager != null) {
               ShowWidget();
            }
         });
         ko.postbox.subscribe("aGameWagerLoad", function () {
            scope.load();
         });
         ko.postbox.subscribe("userLeagueLoad", function () {
            scope.load();
         });
         ko.postbox.subscribe("Signal", function (so) {
            ProcessWagerSignal(so);
         });
      }
   }
}]);
