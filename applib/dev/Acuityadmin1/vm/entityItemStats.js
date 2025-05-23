angularApp.directive("ngEntityItemStats", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/entityItemStats.htm?' + Date.now(),
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
         let sectionToLoad = "";
         let currentItemId = -1;
         let forceReload = false;
         var currentStatsItems = [];

         scope.Initialize = function () {
            currentStatsItems.length = 0;
         };

         function LoadEntityItemStats(callback) {
            GetEntityItemStats(currentItemId, forceReload, function (itemsToRender) {
               RenderEntityItemStats(itemsToRender, callback);
            });
         }

         function GetEntityItemStats(itemId, forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (currentStatsItems != null && currentStatsItems.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(currentStatsItems);
               }
            }
            else {               
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserv",
                     cmd: "getStats",
                     id: itemId,
                     scope: sectionToLoad
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     var statsList = JSON.parse(data.CurrentStatsList);
                     currentStatsItems.length = 0;
                     currentStatsItems = statsList;
                     if (callback != null) {
                        callback(statsList);
                     }
                  }
               });
            }
         }
         function RenderEntityItemStats(listToRender, callback) {
            if (listToRender == null) {
               listToRender = currentStatsItems;
            }
            $("#entityItemStatsHolder", element).empty();
            
            let itemStatsHolder = $("<div class=\"user-stats-holder\" />");
            if (listToRender != null && listToRender.length > 0) {
               let currentStatsSection = "";

               for (let sIndex = 0; sIndex < listToRender.length; sIndex++) {

                  let statsItem = listToRender[sIndex];
                  if (currentStatsSection != statsItem.StatDisplaySection) {
                     let itemStatsSection = $("<div class=\"user-stats-section-holder\" />");
                     let itemStatsSectionLabel = $("<span class=\"user-stats-section-label\" />");
                     itemStatsSectionLabel.append(statsItem.StatDisplaySection)

                     itemStatsSection.append(itemStatsSectionLabel);
                     itemStatsHolder.append(itemStatsSection);

                     currentStatsSection = statsItem.StatDisplaySection;
                  }
                  let itemStatsListRow = $("<div class=\"user-stats-row-holder\" />");
                  let itemStatNameHolder = $("<div class=\"user-stats-name\" />");
                  itemStatNameHolder.append(statsItem.StatName);
                  let itemStatValueHolder = $("<div class=\"user-stats-value\" />");
                  itemStatValueHolder.append(statsItem.StatValueFormatted);

                  itemStatsListRow.append(itemStatNameHolder);
                  itemStatsListRow.append(itemStatValueHolder);

                  itemStatsHolder.append(itemStatsListRow);
               }
            }
            else {
               itemStatsHolder.append("No stats found or defined.");
            }
            $("#entityItemStatsHolder", element).append(itemStatsHolder);
            if (callback != null) {
               callback();
            }
         }

         scope.load = function () {
            scope.Initialize();
            LoadEntityItemStats();
         };

         ko.postbox.subscribe("itemStatsTabReload", function(){
            currentStatsItems.length = 0;
            scope.load();
         });
         ko.postbox.subscribe("itemStatsTabLoad", function (publishItem) {
            currentStatsItems.length = 0;
            sectionToLoad = publishItem.section;
            currentItemId = publishItem.id;
            scope.load();
         });
      }
   };
}]);