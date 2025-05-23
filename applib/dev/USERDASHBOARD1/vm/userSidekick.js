angularApp.directive("ngUserSidekick", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/USERDASHBOARD1/view/userSidekick.htm?' + Date.now(),
      scope: {
         assoc: "@",
         text: "@",
         details: "@",
         cid: "@",
         filters: "@",
         panel: "@",
         hidetopper: "@",
         toppertext: "@"
      },
      require: '^ngLegacyContainer',
      link: function (scope, element, attrs, legacyContainer) {
         var userId = legacyContainer.scope.TP1Username;
         var journalEntries = [];
         var excludeReasonCodes = [];
         function Initalize() {
            HideDisplayForm();
            appLib.LoadResourceText();
            LoadExcludeReasonCodes();
            ///GetAllResources();
         }

         function GetMyJournalEntries(callback)
         {
            LoadMyJournalEntries(function(journalEntries){
               RenderMyJournalEntries(journalEntries, function(){
                  if(callback != null)
                  {
                     callback();
                  }
                  return;
               });
            });
         }
         function LoadExcludeReasonCodes(callback, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            if(excludeReasonCodes == null || excludeReasonCodes.length == 0 || forceReload == true)
            {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getExcludedReasonCodes"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function(jsonData){
                     if(jsonData.errormessage != null && jsonData.errormessage == "true")
                     {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else
                     {
                        let excludeList = JSON.parse(jsonData.excludReasonCodeList)
                        excludeReasonCodes.length = 0;
                        excludeReasonCodes = excludeList;

                        if(callback != null)
                        {
                           callback();
                        }
                        else
                        {
                           return excludeList;
                        }
                     }
                  }
               });
            }
         }
         function LoadMyJournalEntries(callback)
         {
            if(journalEntries != null && journalEntries.length > 0)
            {
               if(callback != null)
               {
                  callback(journalEntries);
               }
               else
               {
                  return journalEntries;
               }
            }
            else
            {
               a$.ajax({
                  type: "POST",
                  service: "JScript",
                  async: true,
                  data: {
                     lib: "editor",
                     cmd: "loaddataview",
                     dataview: "DAS:JournalTEST",
                     CSR: userId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function(jsonData){
                     if(jsonData.errormessage != null && jsonData.errormessage == "true")
                     {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else
                     {
                        let myEntries = [];
                        if(jsonData.table != null && jsonData.table.records != null)
                        {
                           myEntries = jsonData.table.records;
                           journalEntries.length = 0;
                           journalEntries = myEntries;
                        }
                        if(callback != null)
                        {
                           callback(myEntries);
                        }
                        else
                        {
                           return myEntries;
                        }
                     }
                  }
               });
            }
         }
         function RenderMyJournalEntries(entriesToRender, callback)
         {
            let itemsToRender = entriesToRender;
            let maxEntriesToShow = 10; //TODO: Determine how many to show
            itemsToRender = FilterJournalEntries(itemsToRender);

            let journalEntryHolder = $("<div class=\"user-journal-entry-holder\"/>");
            $("#userJournalEntries", element).empty();

            if(itemsToRender != null && itemsToRender.length > 0)
            {
               if(itemsToRender.length < maxEntriesToShow)
               {
                  maxEntriesToShow = itemsToRender.length;
               }

               SortJournalEntries(itemsToRender);

               let journalEntryHeader = $("<div class=\"header-holder\"/>");
               let dateResourceText = GetResourceText("RESOURCE_TEXT_DATE");
               journalEntryHeader.append($("<div class=\"user-journal-date user-journal-header-item\">" + dateResourceText + "</div>"));
               journalEntryHeader.append($("<div class=\"user-journal-reason user-journal-header-item\">Reason</div>"));
               journalEntryHeader.append($("<div class=\"user-journal-delivered-by user-journal-header-item\">Delivered By</div>"));
               journalEntryHeader.append($("<div class=\"user-journal-button user-journal-header-item\">&nbsp;</div>"));

               for(let ec = 0; ec < maxEntriesToShow ; ec++)
               {
                  let entryItem = itemsToRender[ec];
                  let journalRow = $("<div class=\"user-journal-item-row data-item\"/>");

                  let entryDateHolder = $("<div class=\"user-journal-date data-item\"/>");
                  let entryDate = new Date(entryItem.Date).toLocaleDateString();
                  entryDateHolder.append(entryDate);

                  let entryByHolder = $("<div class=\"user-journal-delivered-by data-item\"/>");
                  entryByHolder.append(entryItem.DeliveredBy);

                  let entryReasonHolder = $("<div class=\"user-journal-reason data-item\" />");
                  entryReasonHolder.append(entryItem.Reason);

                  let buttonHolder = $("<div class=\"user-journal-button data-item\" />");
                  let displayButton = $("<button id=\"displayJournalEntry_" + entryItem.id + "\">View</button>");
                  $(displayButton).off("click").on("click", function(){
                     let buttonId = this.id;
                     let id = buttonId.split("_")[1];
                     DisplayJournalEntry(id);
                  });

                  buttonHolder.append(displayButton);

                  journalRow.append(entryDateHolder);
                  journalRow.append(entryReasonHolder);
                  journalRow.append(entryByHolder);
                  journalRow.append(buttonHolder);

                  journalEntryHolder.append(journalRow);
               }
               $("#userJournalEntries", element).append(journalEntryHeader);
            }
            else
            {
               let divNoEntryMessageHolder = $("<div class=\"empty-state user-sidekick-no-message-holder\" />");
               let divNoEntryLabelHolder = $("<p class=\"user-sidekick-no-message-text\" />");
               let divNoEntryMessageText = "Sorry, there are no Sidekick entries.";

               divNoEntryLabelHolder.append(divNoEntryMessageText);

               divNoEntryMessageHolder.append(divNoEntryLabelHolder);

               journalEntryHolder.append(divNoEntryMessageHolder);
            }
            $("#userJournalEntries", element).append(journalEntryHolder);

            if(callback != null)
            {
               callback();
            }
            return;
         }
         function FilterJournalEntries(listToFilter)
         {
            let returnList = listToFilter;
            let tempReturn = [];
            for(let lIndex = 0; lIndex < returnList.length;lIndex++)
            {
               let item = returnList[lIndex];
               if(item.Reason != null)
               {
                  let iIndex = excludeReasonCodes.findIndex(i => i.Code.toLowerCase() == item.Reason.toLowerCase());
                  if(iIndex < 0)
                  {
                     tempReturn.push(item);
                  }
               }
            }

            if(tempReturn.length > 0)
            {
               returnList = tempReturn;
            }

            return returnList;

         }
         function SortJournalEntries(journalEntriesToSort)
         {
            journalEntriesToSort.sort(function(a,b){
               if(a.Date != null && new Date(a.Date) > new Date(b.Date))
               {
                  return -1;
               }
               if(a.Date != null && new Date(a.Date) < new Date(b.Date))
               {
                  return 1;
               }
               return 0;
            });
         }
         function DisplayJournalEntry(entryId)
         {
            let entry = journalEntries.find(x => x.id == entryId);
            if(entry != null)
            {
               $("#displayFormItemDate", element).empty();
               let itemDate = new Date(entry.Date).toLocaleDateString();
               $("#displayFormItemDate", element).append(itemDate);

               $("#displayFormItemDeliveredBy", element).empty();
               $("#displayFormItemDeliveredBy", element).append(entry.DeliveredBy);

               $("#displayFormItemDeliveredBy", element).empty();
               $("#displayFormItemDeliveredBy", element).append(entry.DeliveredBy);

               $("#displayFormItemReason", element).empty();
               $("#displayFormItemReason", element).append(entry.Reason);

               $("#displayFormItemDetails", element).empty();
               $("#displayFormItemDetails", element).append(entry.DetailsIssues);

               $("#displayFormItemResolution", element).empty();
               let resolutionInformation = "";
               HideResolutionSection();
               if(entry.ResolutionFollowup != null && entry.ResolutionFollowup != "")
               {
                  resolutionInformation = entry.ResolutionFollowup;
                  ShowResolutionSection();
               }
               $("#displayFormItemResolution", element).append(resolutionInformation);

               $("#displayFormItemGoalInformation", element).empty();
               HideGoalSection();
               let goalData = $("<div />");
               if(entry.goal_kpi != null && entry.goal_kpi != "")
               {
                  goalData.append("<div>");
                  goalData.append("<span class=\"sidekick-data-label\">KPI:&nbsp;</span>");
                  goalData.append("<span>" + entry.goal_kpi + "</span>");
                  goalData.append("</div>");
                  if(entry.goal_date != null && entry.goal_date !== "")
                  {
                     goalData.append("<div>");
                     goalData.append("<span class=\"sidekick-data-label\">Date:&nbsp;</span>");
                     goalData.append("<span>" + new Date(entry.goal_date).toLocaleDateString() + "</span>");
                     goalData.append("</div>");
                  }
                  if(entry.goal_from_x != null && entry.goal_from_x !== "")
                  {
                     goalData.append("<div>");
                     goalData.append("<span class=\"sidekick-data-label\">Start Score:&nbsp;</span>");
                     goalData.append("<span>" + entry.goal_from_x + "</span>");
                     goalData.append("</div>");
                  }
                  if(entry.goal_to_x != null && entry.goal_to_x !== "")
                  {
                     goalData.append("<div>");
                     goalData.append("<span class=\"sidekick-data-label\">End Score:&nbsp;</span>");
                     goalData.append("<span>" + entry.goal_to_x + "</span>");
                     goalData.append("</div>");
                  }
                  ShowGoalSection();
               }

               $("#displayFormItemGoalInformation", element).append(goalData);

               ShowDisplayForm();
            }
         }
         function HideAll()
         {
            HideDisplayForm();
         }
         function HideDisplayForm()
         {
            $(".user-sidekick-display-form").hide();
            $("#journalDisplayForm", element).hide();
         }
         function ShowDisplayForm()
         {
            $("#journalDisplayForm", element).show();
         }
         function HideResolutionSection()
         {
            $(".sidekick-resolution-section-holder", element).hide();
         }
         function ShowResolutionSection()
         {
            $(".sidekick-resolution-section-holder", element).show();
         }
         function HideGoalSection()
         {
            $(".sidekick-goal-section-holder", element).hide();
         }
         function ShowGoalSection()
         {
            $(".sidekick-goal-section-holder", element).show();
         }
         function GetResourceText(key, language)
         {
            let resourceText = appLib.GetResourceText(key, language, null);
            return resourceText;
         }

         scope.load = function (callback) {
            console.log("Directive: UserSidekick Load()");
            Initalize();
            let loadingUrl = a$.debugPrefix() + "/applib/css/images/acuity-loading.gif"
            $("#userPerformanceLoadingImage", element).attr("src", loadingUrl);

            $(".close-display-form", element).off("click").on("click", function(){
               HideDisplayForm();
            });

            GetMyJournalEntries();
            appLib.HandleResourceTexts(null);
            if(callback != null)
            {
               callback();
            }
         }

         HideAll();

         ko.postbox.subscribe("UserSidekickLoad", function(){
            HideAll();
            scope.load();
         });
      }
   }
}]);
