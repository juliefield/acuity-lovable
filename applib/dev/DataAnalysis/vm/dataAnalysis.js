
angularApp.directive("ngDataAnalysis", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/DataAnalysis/view/dataAnalysis.htm?' + Date.now(),
      scope: {
         assoc: "@",
         text: "@",
         details: "@",
         cid: "@",
         filters: "@",
         panel: "@",
         hidetopper: "@",
         toppertext: "@",
         itemtype: "@"
      },
      require: '^ngLegacyContainer',
      link: function (scope, element, attrs, legacyContainer) {
         /* Directive Variables START */
         let curIntervalId = -1;
         let loadingUrl = a$.debugPrefix() + "/applib/css/images/acuity-loading.gif"
         let availableProjects = [];
         /* Directive Variables END */
         /* Directive Events START */
         $(".loading-image", element).prop("src", loadingUrl);
         $("#btnApplyFilter", element).off("click").on("click", function () {            
            ApplyFilters();
         });
         $("#btnClearFilter", element).off("click").on("click", function () {
            ClearFilters();
         });
         $("#btnSelectAll", element).off("click").on("click", function(){
            SelectAllProjects();
         });
         /* Directive Events END */
         function Initalize() {
            HideAll();
         }
         /* Directive Specific Functions START */
         function GetAvailableProjects(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (availableProjects != null && availableProjects.length != 0 && forceReload == false) {
               if (callback != null) {
                  callback(availableProjects);
               }
               else {
                  return availableProjects;
               }
            }
            else {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserv",
                     cmd: "getProjectList",
                     projectid: 0,
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else {
                        let returnData = JSON.parse(jsonData.projectList);
                        availableProjects.length = 0;
                        if (returnData != null && returnData.length > 0) {
                           returnData.forEach(function (item) {
                              availableProjects.push(item);
                           });
                        }
                        if (callback != null) {
                           callback(availableProjects);
                        }
                     }
                  }
               });
            }

         }
         function RenderAvailableProjects(callback, projectsToRender) {
            if (projectsToRender == null) {
               projectsToRender = availableProjects;
            }
            $("#projectListFilters", element).empty();
            projectsToRender.forEach(function (item) {
               if (item.Status == "A") {
                  let projectOptionHolder = $(`<div class="project-option-holder inline-item" id="projectSelectionHolder_${item.ProjectId}" />`);
                  let projectOptionCheckbox = $(`<input type="checkbox" id="projectOptionFilter_${item.ProjectId}" name="projectOptionFilter" value="${item.ProjectId}" class="project-option-checkbox" />`);
                  let projectOptionLabel = $(`<label class="project-option-name-label">${item.Name}</label>`);

                  projectOptionHolder.append(projectOptionCheckbox);
                  projectOptionHolder.append(projectOptionLabel);

                  projectOptionHolder.off("click").on("click", function(){
                     HandleAvailableProjectClick(this.id);
                  });

                  projectOptionCheckbox.off("click").on("click", function(event){
                     event.stopPropagation();
                  });

                  $("#projectListFilters", element).append(projectOptionHolder);
               }
            });
            if (callback != null) {
               callback();;
            }
         }
         function LoadAvailableProjects(callback) {
            GetAvailableProjects(function (projects) {
               RenderAvailableProjects(callback, projects);
            }, true);
         }
         function HandleAvailableProjectClick(holderId)
         {
            let projectId = holderId.split("_")[1];
            let checkbox = $(`#projectOptionFilter_${projectId}`, element);
            $(checkbox).prop("checked", !checkbox.is(":checked"));
         }
         function ClearFilters(callback) {
            $("[id^='projectOptionFilter_']", element).each(function () {
               $(this).prop("checked", false);
            });
            if (callback != null) {
               callback();
            }
         }
         function SelectAllProjects(callback)
         {
            $("[id^='projectOptionFilter_']", element).each(function () {
               $(this).prop("checked", true);
            });
            if (callback != null) {
               callback();
            }
         }
         function ApplyFilters() {
            let projectsToRender = [];
            $("[id^='projectOptionFilter_']", element).each(function () {
               if ($(this).is(":checked")) {
                  projectsToRender.push(
                     {
                        projectId: $(this).val(),
                        dataLoadComplete: false,
                        balScoreLoadComplete: false,
                        leScoreLoadComplete: false,
                     }
                  );
               }
            });
            if(projectsToRender.length > 0)
            {
               StartIntervalChecks();
               LoadAllChartData(projectsToRender);   
            }
            else
            {
               alert("Select some projects.  Can not run analysis without at least 1 project selected.");
            }
         }
         function LoadAllChartData(projectsToRender) {
            LoadOverallBalancedScoreChart(projectsToRender);
            LoadLeaderEffectivenessChart(projectsToRender);
            LoadCoachingRateChart(projectsToRender);
            LoadTouchQualityChart(projectsToRender);
            //LoadAttritionChart(projectsToRender);
         }
         function LoadOverallBalancedScoreChart(projectsToRender) {
            ShowOverallScoreMessage();
            GetOverallBalancedScoreChart(function (chartDataToRender) {
               RenderOverallBalancedScoreChart(function(){
                  HideOverallScoreMessage();
               }, chartDataToRender);
            }, projectsToRender)
         }
         function LoadLeaderEffectivenessChart(projectsToRender) {
            ShowLeaderEffectivenessMessage();
            GetLeaderEffectivenessChart(function (chartDataToRender) {
               RenderLeaderEffectivenessChart(function () {
                  HideLeaderEffectivenessMessage();
               }, chartDataToRender);
            }, projectsToRender);
         }
         function LoadCoachingRateChart(projectsToRender)
         {
            ShowCoachingRateMessage();
            GetCoachingRateChart(function(chartDataToRender){
               RenderCoachingRateChart(function(){
                  HideCoachingRateMessage();
               }, chartDataToRender);
            }, projectsToRender);
         }
         function LoadTouchQualityChart(projectsToRender)
         {
            ShowTouchQualityMessage();
            GetTouchQualityChart(function(chartDataToRender){
               RenderTouchQualityChart(function(){
                  HideTouchQualityMessage();
               }, chartDataToRender);
            }, projectsToRender);
         }
         function GetOverallBalancedScoreChart(callback, projectsToRender) {
            let tmpArray = [];
            projectsToRender.forEach(function (item) {
               if (tmpArray.findIndex(i => i == item.projectId) < 0) {
                  tmpArray.push(item.projectId);
               }
            });
            let projectIdOnly = tmpArray.join(",").toString();
            GetBalancedScoreDataForProjects(function (balScoreData) {
               balScoreData.forEach(function (item) {
                  let projIndex = projectsToRender.findIndex(i => i.projectId == item.ProjectId);
                  if (projIndex >= 0) {
                     projectsToRender[projIndex].balScoreLoadComplete = true;
                  }
               });
               if (callback != null) {
                  callback(balScoreData);
               }
               else {
                  return balScoreData;
               }
            }, false, projectIdOnly);
         }
         function RenderOverallBalancedScoreChart(callback, chartDataToRender) {
            RenderTrendChart(callback, chartDataToRender, "overallScoreChart", "Overall Balanced Score");
         }
         function GetLeaderEffectivenessChart(callback, projectsToRender) {
            let tmpArray = [];
            projectsToRender.forEach(function (item) {
               if (tmpArray.findIndex(i => i == item.projectId) < 0) {
                  tmpArray.push(item.projectId);
               }
            });
            let projectIdOnly = tmpArray.join(",").toString();
            GetLeaderEffectivenessScoreForProject(function (leScoreData) {
               if (callback != null) {
                  callback(leScoreData);
               }
               else {
                  return leScoreData;
               }
            }, false, projectIdOnly);
         }
         function RenderLeaderEffectivenessChart(callback, chartDataToRender) {
            RenderTrendChart(callback, chartDataToRender, "leaderEffectivenessChart", "Leader Effectiveness");
         }
         
         function GetCoachingRateChart(callback, projectsToRender)
         {
            let tmpArray = [];
            projectsToRender.forEach(function (item) {
               if (tmpArray.findIndex(i => i == item.projectId) < 0) {
                  tmpArray.push(item.projectId);
               }
            });
            let projectIdOnly = tmpArray.join(",").toString();
            GetCoachingRateDataForProjects(function(coachingRateData){
               if (callback != null) {
                  callback(coachingRateData);
               }
               else {
                  return coachingRateData;
               }
            }, false, projectIdOnly);
         }
         function RenderCoachingRateChart(callback, chartDataToRender)
         {
            RenderTrendChart(callback, chartDataToRender, "coachingRateChart", "Coaching Rate Chart");
         }
         function GetTouchQualityChart(callback, projectsToRender)
         {
            let tmpArray = [];
            projectsToRender.forEach(function (item) {
               if (tmpArray.findIndex(i => i == item.projectId) < 0) {
                  tmpArray.push(item.projectId);
               }
            });
            let projectIdOnly = tmpArray.join(",").toString();
            GetTouchQualityDataForProjects(function(touchQualityData){
               if (callback != null) {
                  callback(touchQualityData);
               }
               else {
                  return touchQualityData; 
               }
            }, false, projectIdOnly);
         }
         function RenderTouchQualityChart(callback, chartDataToRender)
         {
            RenderTrendChart(callback, chartDataToRender, "touchQualityChart", "Touch Quality Chart");
         }
         /* Directive Specific Functions END */
         /* Chart Rendering START */
         function RenderTrendChart(callback, chartDataToRender, renderChartTo, chartTitle) {
            let seriesData = [];
            let categories = [];
            if (chartDataToRender == null || chartDataToRender.length == 0) {
               seriesData.push({ name: "No Data", x: 0, y: 0 });
            }
            else {
               chartDataToRender.forEach(function (item) {
                  if (categories.findIndex(i => i == item.DisplayData) < 0) {
                     categories.push(item.DisplayData);
                  }
                  let seriesKeyValue = `${item.ScoreArea}_${item.ProjectId}`;
                  let seriesItem = seriesData.find(si => si.key == seriesKeyValue);
                  let dataPoint = item.ScoreValue;
                  if (seriesItem == null) {

                     let project = availableProjects.find(p => p.ProjectId == item.ProjectId);
                     let projectName = project.Name || "Unknown Project";
                     seriesItem = new Object();
                     seriesItem.key = seriesKeyValue;
                     seriesItem.name = projectName;
                     seriesItem.data = [];
                     seriesItem.data.push(dataPoint);
                     seriesData.push(seriesItem);
                  }
                  else {
                     seriesItem.data.push(dataPoint);
                  }
               });
            }
            //overallScoreChart
            let chartObject = new Object();
            chartObject.chart = new Object();
            chartObject.chart.type = "line";
            chartObject.chart.zoomType = "xy";
            chartObject.title = new Object();
            chartObject.title.text = chartTitle || ""
            chartObject.series = seriesData;
            chartObject.xAxis = new Object();
            chartObject.xAxis.categories = categories;
            chartObject.yAxis = new Object();
            chartObject.yAxis.title = new Object();
            chartObject.yAxis.title.text = "Score";
            // chartObject.yAxis.min = 0;
            // chartObject.yAxis.max = 100;
            chartObject.legend = new Object();
            chartObject.legend.enabled = true;
            chartObject.plotOptions = new Object();
            chartObject.plotOptions.series = new Object();
            chartObject.plotOptions.series.marker = new Object();
            chartObject.plotOptions.series.marker.radius = 4;
            chartObject.plotOptions.series.dataLabels = new Object();
            chartObject.plotOptions.series.dataLabels.enabled = true;
            chartObject.plotOptions.series.dataLabels.format = `${this.name}`;
            chartObject.tooltip = new Object();
            chartObject.tooltip.useHTML = true;
            chartObject.tooltip.formatter = function () {
               if (this == null) {
                  return `No Info found.`;
               }
               return `<b>${this.series.name}</b><br/>${this.x}<br/>${this.y.toFixed(2)}`;
            }
            Highcharts.chart(renderChartTo, chartObject);
            if (callback != null) {
               callback();
            }
         }
         /* Chart Rendering END */
         /* Show/Hide START */
         function HideAll() {
            HideOverallScoreMessage();
            HideLeaderEffectivenessMessage();
            HideCoachingRateMessage();
            HideTouchQualityMessage();
         }
         function ShowOverallScoreMessage() {
            $("#overallScoreLoadingMessage", element).show();
         }
         function HideOverallScoreMessage() {
            $("#overallScoreLoadingMessage", element).hide();
         }
         function ShowLeaderEffectivenessMessage() {
            $("#leaderEffectivenessLoadingMessage", element).show();
         }
         function HideLeaderEffectivenessMessage() {
            $("#leaderEffectivenessLoadingMessage", element).hide();
         }
         function ShowCoachingRateMessage() {
            $("#coachingRateLoadingMessage", element).show();
         }
         function HideCoachingRateMessage() {
            $("#coachingRateLoadingMessage", element).hide();
         }
         function ShowTouchQualityMessage() {
            $("#touchQualityLoadingMessage", element).show();
         }
         function HideTouchQualityMessage() {
            $("#touchQualityLoadingMessage", element).hide();
         }
         /* Show/Hide END */
         /* Data Loading functions START */
         function GetBalancedScoreDataForProjects(callback, forceReload, projectIdList) {
            let scoringTrendData = [];
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserv",
                  cmd: "getProjectTrendStats",
                  projectidlist: projectIdList,
                  mqfNumber: 0,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {
                     let returnData = JSON.parse(jsonData.trendData);
                     scoringTrendData.length = 0;
                     if (returnData != null && returnData.length > 0) {
                        returnData.forEach(function (item) {
                           scoringTrendData.push(item);
                        });
                     }
                     if (callback != null) {
                        callback(scoringTrendData);
                     }
                  }
               }
            });
         }
         function GetLeaderEffectivenessScoreForProject(callback, forceReload, projectIdList) {
            let scoringTrendData = [];
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserv",
                  cmd: "getLeaderEffectivenessTrends",
                  projectidlist: projectIdList,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {
                     let returnData = JSON.parse(jsonData.trendData);
                     scoringTrendData.length = 0;
                     if (returnData != null && returnData.length > 0) {
                        returnData.forEach(function (item) {
                           scoringTrendData.push(item);
                        });
                     }

                     if (callback != null) {
                        callback(scoringTrendData);
                     }
                     else {
                        return scoringTrendData;
                     }
                  }
               }
            });            
         }
         function GetCoachingRateDataForProjects(callback, forceReload, projectIdList)
         {
            console.log("NYI: Coaching Rate Data collection for project.");
            let scoringTrendData = [];
            // a$.ajax({
            //    type: "GET",
            //    service: "C#",
            //    async: true,
            //    data: {
            //       lib: "selfserv",
            //       cmd: "getLeaderEffectivenessTrends",
            //       projectidlist: projectIdList,
            //    },
            //    dataType: "json",
            //    cache: false,
            //    error: a$.ajaxerror,
            //    success: function (jsonData) {
            //       if (jsonData.errormessage != null && jsonData.errormessage == "true") {
            //          a$.jsonerror(jsonData);
            //          return;
            //       }
            //       else {
            //          let returnData = JSON.parse(jsonData.trendData);
            //          scoringTrendData.length = 0;
            //          if (returnData != null && returnData.length > 0) {
            //             returnData.forEach(function (item) {
            //                scoringTrendData.push(item);
            //             });
            //          }

                     if (callback != null) {
                        callback(scoringTrendData);
                     }
                     else {
                        return scoringTrendData;
                     }
            //       }
            //    }
            // });
         }

         function GetTouchQualityDataForProjects(callback, forceReload, projectIdList) {
            let scoringTrendData = [];
            a$.ajax({
               type: "GET",
               service: "C#",
               async: true,
               data: {
                  lib: "selfserv",
                  cmd: "getTouchQualityTrendStats",
                  projectidlist: projectIdList,
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {
                     let returnData = JSON.parse(jsonData.trendData);
                     scoringTrendData.length = 0;
                     if (returnData != null && returnData.length > 0) {
                        returnData.forEach(function (item) {
                           scoringTrendData.push(item);
                        });
                     }
                     if (callback != null) {
                        callback(scoringTrendData);
                     }
                     else {
                        return scoringTrendData;
                     }
                  }
               }
            });
         }
         /* Data Loading functions END */
         function StartIntervalChecks()
         {
            curIntervalId = window.setInterval(function(){
               let panelsVisible = $(".loading-panel", element).is(":visible");
                $("#btnApplyFilter", element).prop("disabled", panelsVisible);
                if(panelsVisible == true)
                {
                    $("#btnApplyFilter", element).addClass("disabled");
                }
                else
                {
                  $("#btnApplyFilter", element).removeClass("disabled");
                  window.clearInterval(curIntervalId);
                }
           }, 1000);
         }
         scope.load = function () {
            Initalize();
            LoadAvailableProjects();
         }

         scope.load();

         // ko.postbox.subscribe("DataAnalysisLoad", function (itemType) {
         //    //scope.load();
         // });

      }
   }
}]);
