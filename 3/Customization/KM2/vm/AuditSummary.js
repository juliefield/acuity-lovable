angularApp.directive("ngAuditSummary", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/3/Customization/KM2/view/AuditSummary.htm?' + Date.now(),
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
         let dataLoadType = null;
         let hasDetails = false;
         SetAttrValues(attrs);
         let initialData = [];
         /* Event Handling START */
         $("#btnCloseDetails", element).off("click").on("click", function () {
            console.log("Close details clicked.  Determine what to do other than hide the details panel.");
            HideDetails();
         });
         /* Event Handling END */
         function Initialize() {
            HideAll();
            SetDatePickers();
            //RenderDirectiveFooter();
         };
         function SetDatePickers() {
         }
         function SetAttrValues(attrs) {
            if (attrs.dataType != null || attrs.datatype != null) {
               dataLoadType = (attrs.dataType || attrs.datatype);
            }
            if (attrs.hasDetails != null || attrs.hasdetails != null) {
               hasDetails = (attrs.hasDetails || attrs.hasDetails);
            }
         }
         /* Data Loading START */
         function LoadDirective() {
            HideAll();
            LoadSummaryChart();
         }
         function LoadSummaryChart() {
            GetSummaryChartData(function (summaryData) {
               RenderSummaryChartData(null, summaryData);
            });
         }
         /* Data Loading END */
         /* Data Pulls START */
         function GetSummaryChartData(callback, forceReload) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (forceReload == false && initialData != null && initialData.length > 0) {
               if (callback != null) {
                  callback(initialData);
               }
            }
            else {
               if (callback != null) {
                  callback(initialData);
               }
            }
         }
         /* Data Pulls END */
         /* Data Rendering START */
         function RenderSummaryChartData(callback, dataForRendering) {
            if (dataForRendering == null) {
               dataForRendering = initialData;
            }

            let categoriesList = [];
            let seriesData = [];
            let chartTitle = "";
            seriesData.push({
               name: "Audits Failed",
               className: "compliance-customization-audits-data-series-failed",
               data: [],
            });
            seriesData.push({
               name: "Audits Passed",
               className: "compliance-customization-audits-data-series-passed",
               data: [],
            });

            switch (dataLoadType.toLowerCase()) {
               case "auditor-complete":
                  categoriesList.length = 0;
                  dataForRendering.forEach(function (data) {
                     if (categoriesList.findIndex(c => c.EvaluatorUserId == data.EvaluatorUserId) < 0) {
                        let evaluatorObject = {
                           EvaluatorUserId: data.EvaluatorUserId,
                           EvaluatorFullName: data.EvaluatorFullName?.trim(),
                           Name: data.EvaluatorFullName?.trim(),
                           Id: data.EvaluatorUserId,
                        }
                        categoriesList.push(evaluatorObject);
                        //categoriesList.push(data.EvaluatorUserId);
                     }
                  });
                  categoriesList = categoriesList.sort((a, b) => {
                     if (a.EvaluatorFullName.toLowerCase() < b.EvaluatorFullName.toLowerCase()) {
                        return -1;
                     }
                     else if (a.EvaluatorFullName.toLowerCase() > b.EvaluatorFullName.toLowerCase()) {
                        return 1;
                     }
                     else {
                        return 0;
                     }
                  });
                  categoriesList.forEach(function (cat) {
                     let failData = dataForRendering.filter(m => m.EvaluatorUserId == cat.EvaluatorUserId && m.Rating?.toLowerCase() == "Fail".toLowerCase());
                     let passData = dataForRendering.filter(m => m.EvaluatorUserId == cat.EvaluatorUserId && m.Rating?.toLowerCase() != "Fail".toLowerCase());
                     seriesData.find(s => s.name == "Audits Failed").data.push(failData?.length || 0);
                     seriesData.find(s => s.name == "Audits Passed").data.push(passData?.length || 0);
                  });
                  chartTitle = "Auditor Summary";
                  break;
               case "client-complete":
                  categoriesList.length = 0;
                  dataForRendering.forEach(function (data) {
                     if (categoriesList.findIndex(c => c.ProjectId == data.ProjectId) < 0) {
                        let projectDataObject = {
                           ProjectId: data.ProjectId,
                           ProjectName: data.ProjectName?.trim(),
                           Name: data.ProjectName?.trim(),
                           Id: data.ProjectId,
                        };
                        categoriesList.push(projectDataObject);
                        //categoriesList.push(data.ProjectId);
                     }
                  });
                  categoriesList = categoriesList.sort((a, b) => {
                     if (a.ProjectName.toLowerCase() < b.ProjectName.toLowerCase()) {
                        return -1;
                     }
                     else if (a.ProjectName.toLowerCase() > b.ProjectName.toLowerCase()) {
                        return 1;
                     }
                     else {
                        return 0;
                     }
                  });
                  categoriesList.forEach(function (cat) {
                     let failData = dataForRendering.filter(m => m.ProjectId == cat.ProjectId && m.Rating?.toLowerCase() == "Fail".toLowerCase());
                     let passData = dataForRendering.filter(m => m.ProjectId == cat.ProjectId && m.Rating?.toLowerCase() != "Fail".toLowerCase());
                     seriesData.find(s => s.name == "Audits Failed").data.push(failData?.length || 0);
                     seriesData.find(s => s.name == "Audits Passed").data.push(passData?.length || 0);
                  });
                  chartTitle = "Client Summary";
                  break;
            }
            let finalCategoriesList = [];
            categoriesList.forEach(function (item) {
               finalCategoriesList.push(item.Name);
            });

            let chartDef = {};
            chartDef.chart = {
               type: "bar",
               zoomType: "xy",
            };
            //chartDef.chart.type = "bar";
            chartDef.title = {};
            chartDef.title.text = null;
            chartDef.series = seriesData;
            chartDef.xAxis = {
               categories: finalCategoriesList, //categoriesList,
               scrollbar: {
                  enabled: true,
               },
            };
            chartDef.yAxis = {
               scrollbar: {
                  enabled: true,
               },
            };
            chartDef.yAxis.title = {
               text: "Audits",
            };
            chartDef.yAxis.stackLabels = {
               enabled: true,
               className: "compliance-customization-audits-data-series-total",
               formatter: function () {
                  return this.total.toLocaleString();
               },
            };
            chartDef.legend = {
               layout: "horizontal",
               align: "center",
               verticalAlign: "bottom",
               floating: false,
            };
            chartDef.plotOptions = {
               bar: {
                  dataLabels: {
                     enabled: true,
                     color: "#ffffff",
                     formatter: function () {
                        return this.y.toLocaleString();
                     },
                  }
               },
               series: {
                  stacking: "normal",
                  dataLabels: {
                     enabled: true
                  },
                  point: {
                     events: {
                        click: function (event) {
                           LoadSummaryChartDetails(null, this);
                        }
                     },
                  },
               },
            };

            chartDef.tooltip = {
               //format: "Total: {point.stackTotal}",
            };
            chartDef.credits = {
               enabled: false,
            }

            $("#auditSummaryChart", element).each(function () {
               Highcharts.chart(this, chartDef);
            });

            $("#chartSummaryTitleLabel", element).empty();
            $("#chartSummaryTitleLabel", element).append(chartTitle);
            ko.postbox.publish("ComplianceLoadComplete", `ChartLoad_${dataLoadType}`);
            if (callback != null) {
               callback();
            }
         }
         // function RenderDirectiveFooter() {
         //    let startDate = null;
         //    let endDate = null;

         //    if (legacyContainer.scope.filters != null) {
         //       startDate = new Date(legacyContainer.scope.filters.StartDate);
         //       endDate = new Date(legacyContainer.scope.filters.EndDate);
         //    }
         //    $("#directiveTimeFrame", element).empty();
         //    if (startDate != null && endDate != null) {
         //       $("#directiveTimeFrame", element).append(`${startDate.toLocaleDateString()} through ${endDate.toLocaleDateString()}`);
         //    }
         // }
         /* Data Rendering END */
         /* Editor Loading START */
         /* Editor Loading END */
         /* Editor Validation & Saving START */
         /* Editor Validation & Saving END */
         /* Sorting Options START */
         /* Sorting Options END */
         /* Utility Functions START */
         function LoadSummaryChartDetails(callback, chartPointObject) {
            ShowDetailsLoading();
            window.setTimeout(function () {
               FindSummaryChartDetails(function (chartDetailData) {
                  RenderSummaryChartDetails(function () {
                     HideDetailsLoading();
                     if (callback != null) {
                        callback();
                     }
                  }, chartDetailData);
               }, chartPointObject);
            }, 500);
         }
         function FindSummaryChartDetails(callback, chartPointObject) {
            let returnData = initialData;

            //let seriesName = chartPointObject.series.name;
            // if(seriesName.toLowerCase() == "Audits Passed".toLowerCase())
            // {
            //    returnData = returnData.filter(i => i.Rating?.toLowerCase() != "Fail".toLowerCase());
            // }
            // else if (seriesName.toLowerCase() == "Audits Failed".toLowerCase()){
            //    returnData = returnData.filter(i => i.Rating?.toLowerCase() == "Fail".toLowerCase());
            // }
            if (dataLoadType.toLowerCase() == "auditor-complete".toLowerCase()) {
               returnData = returnData.filter(i => i.EvaluatorFullName.toLowerCase() == chartPointObject.category?.toLowerCase());
            }
            else if (dataLoadType.toLowerCase() == "client-complete".toLowerCase()) {
               returnData = returnData.filter(i => i.ProjectName.toLowerCase() == chartPointObject.category?.toLowerCase());
            }
            if (callback != null) {
               callback(returnData);
            }
         }
         function RenderSummaryChartDetails(callback, dataToRender) {
            let headerText = "Summary Details";
            if (dataToRender != null && dataToRender.length > 0) {
               let firstObject = dataToRender[0];
               switch (dataLoadType.toLowerCase()) {
                  case "auditor-complete".toLowerCase():
                     headerText = `Summary Details for ${firstObject.EvaluatorFullName}`;
                     break;
                  case "client-complete".toLowerCase():
                     headerText = `Summary Details for ${firstObject?.ProjectName}`;
                     break;
               }
            }

            let detailsData = {
               type: `auditsummary-${dataLoadType}`,
               headerText: headerText,
               filteredData: dataToRender,
               detailRecords: dataToRender,
               //detailRecords: initialData,
            };
            ko.postbox.publish("km2ComplianceDashboardDetailsLoad", detailsData);
            if (callback != null) {
               callback();
            }
         }
         /* Utility Functions END */
         /* Show/Hide START */
         function HideAll() {
            HideDetailsLoading();
            //HideDetails();
         }
         // function HideDetails() {
         //    $("#auditSummaryDetailsForm", element).hide();
         // }
         // function ShowDetails() {
         //    $("#auditSummaryDetailsForm", element).show();
         // }
         // function HideEditorForm() {
         //    $("#virtualPrizeCatalogEditorFormHolder", element).hide();
         // }
         // function ShowEditorForm() {
         //    $("#virtualPrizeCatalogEditorFormHolder", element).show();
         // }
         function ShowDetailsLoading() {
            $("#chartLoadingMessage", element).show();
         }
         function HideDetailsLoading() {
            $("#chartLoadingMessage", element).hide();
         }

         /* Show/Hide END */

         scope.load = function () {
            Initialize();
            LoadDirective();
         };
         ko.postbox.subscribe("km2ComplianceDashboardReload", function (params) {
            console.log("Dashboard Refresh/Reload called.");
            initialData.length = 0;
            if (params != null) {
               if (params.filters != null) {
                  //set filter information here.
               }
               if (params.data != null) {
                  initialData = params.data;
               }
            }
            LoadDirective();
         });
         ko.postbox.subscribe("km2ComplianceDashboardLoad", function (params) {
            initialData.length = 0;
            if (params != null) {
               if (params.filters != null) {
                  //set filter information here.
               }
               if (params.data != null) {
                  initialData = params.data;
               }
            }
            scope.load();
         });
         ko.postbox.subscribe("km2ComplianceDashboardApplyFilter", function (params) {
            initialData.length = 0;
            if (params != null) {
               if (params.filters != null) {
                  //set filter information here.
               }
               if (params.data != null) {
                  initialData = params.data;
               }
            }
            scope.load();
         });
      }
   };
}]);