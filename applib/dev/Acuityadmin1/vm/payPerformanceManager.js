angularApp.directive("ngPayPerformanceManager", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/PayPerformanceManager.htm?' + Date.now(),
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
         let loadingUrl = a$.debugPrefix() + "/applib/css/images/acuity-loading.gif"
         $("#payChartLoadingImage", element).attr("src", loadingUrl);
         HideAll();
         /* Data Objects START */
         let defaultMinValue = 0;
         let defaultMaxValue = 10;
         let originalProjectList = [];
         let projectList = [];
         let availableProjectList = [];
         let p4pChartData = [];
         let p4pBandData = [];
         let plotBandColors = [
            "ghostwhite",
            "lightgray",
             "lightgreen",
             "gainsboro",
             "lightcyan"
         ];
         /* Data Objects END */

         /* Page Event Options START */
         $("#btnCreateNew", element).off("click").on("click", function(){
            alert("WIP: Not implemented.\nShould ask which project you want to create for.\nWhen Saved, update all of the previous items for project to inactive and set some end dates for anything open for the project, and create with some default data.");
         });
         $("#btnClearForm", element).off("click").on("click", function(){
            DoClearForm();
         });
         $("#btnCalculate", element).off("click").on("click", function(){
            HandleCalculation();
         });
         $("#btnSaveForm", element).off("click").on("click", function(){
            DoFormSave();
         });
         $("#btnReset", element).off("click").on("click", function(){
            HandleProjectChanged();
         });
         $("#btnRefreshP4P", element).off("click").on("click", function(){
            scope.load();
         });
         $("#useCurrentNumberAgents", element).off("click").on("click",function(){
            let curCount = parseInt($("#curAgentCountHolder", element).val());
            $("#agentCount", element).val(curCount);
         });
         $("#btnShowPayoutInformation", element).off("click").on("click", function(){
            HandlePayoutTypeInfoDisplay();
         });
         $("#btnShowTierTypeInformation", element).off("click").on("click", function(){
            HandleTierTypeInfoDisplay();
         });
         $("#projectSelected", element).off("change").on("change", function () {
            HandleProjectChanged();
         });
         $("#payoutTiers", element).off("change").on("change", function () {
            HandleTierNumberChanged();
         });
         $("#tierPayoutType", element).off("change").on("change", function () {
            HandleTierPayoutChanged();
         });
         $("#tierType", element).off("change").on("change", function(){
            HandleTierTypeChange();
         });
         /* Page Event Options END */

         scope.Initialize = function(){
            SetDatePickers();
            GetMinMaxDefaultValues();
            HideUseAgentCountOption();
            $(".user-instructions-information", element).hide();
            GetAllAvailableProjects(null, true);
            LoadProjectExtendedList();
            $.extend(true, originalProjectList, projectList);
            SetupForm();
            SetFormDefaults();
            ClearCurrentProjectCounts();
         };
         function SetDatePickers()
         {
            $(".datepicker", element).datepicker();
         }
         function GetMinMaxDefaultValues() {
            appLib.getConfigParameterByName("MIN_SCORE_VALUE", function (parameter) {
               if (parameter != null) {
                  defaultMinValue = parseInt(parameter.ParamValue);
               }
            });
            appLib.getConfigParameterByName("MAX_SCORE_VALUE", function (parameter) {
               if (parameter != null) {
                  defaultMaxValue = parseInt(parameter.ParamValue);
               }
            });

         }
         function LoadProjectExtendedList(callback)
         {
            GetProjectExtendedList(callback, true);
         }
         function GetProjectExtendedList(callback, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            if(forceReload == true || projectList.length == 0)
            {
               projectList.length = 0;
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getAllExtendedProjectInformation",
                     deepload: true
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function(data) {

                     let returnList = $.parseJSON(data.projectExtendedList);
                     projectList.length = 0;
                     for(let pIndex = 0; pIndex < returnList.length; pIndex++)
                     {
                        projectList.push(returnList[pIndex]);
                     }
                     if (callback != null) {
                        callback();
                     }
                     return;
                  }
               });
            }
         }
         function GetAllAvailableProjects(callback, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }            
            if(forceReload == true || availableProjectList.length == 0)
            {
               availableProjectList.length = 0;
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getProjectList",
                     projectid: 0,
                     deepload: false
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function(data) {

                     let returnList = $.parseJSON(data.projectList);
                     availableProjectList.length = 0;
                     for(let pIndex = 0; pIndex < returnList.length; pIndex++)
                     {
                        availableProjectList.push(returnList[pIndex]);
                     }
                     if (callback != null) {
                        callback();
                     }
                     return;
                  }
               });
            }
         }
         function GetCurrentCountsForProject(callback, projectId)
         {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "getAllCurrentStatsForProject",
                  projectId: projectId
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function(data) {
                  let countsObject = $.parseJSON(data.currentProjectStats);
                  if(callback != null)
                  {
                     callback(countsObject);
                  }
                  else
                  {
                     return returnValue;
                  }
               }
            });
         }
         function SetupForm() {
            LoadAvailableProjects();
         }
         function LoadAvailableProjects() {
            $("#projectSelected", element).empty();
            $("#projectSelected", element).append($("<option />"));            
            let activeProjects = availableProjectList.filter(i => i.IsActive == true);
            $(activeProjects).each(function (i) {
               let option = $("<option />", { text: this.ProjectDesc, value: this.ProjectId });
               $("#projectSelected", element).append(option);
            });
         }
         function DoClearForm() {
            SetFormDefaults();
            ClearTotals();
            ClearCurrentProjectCounts();
            HideUseAgentCountOption();
         }
         function DoFormSave() {
            let objectToSave = GetFormDataObject();
            ValidateForm(function(validatedObject){
               SaveForm(function(){
                  //TODO: Determine what we do after the inforamtion has been saved.
                  $("#btnReset", element).click();
               },validatedObject);
            }, objectToSave);
         }
         function ValidateForm(callback, objectToValidate)
         {
            LogInfo("ValidateForm()");
            if(callback != null)
            {
               callback(objectToValidate);
            }
         }
         function SaveForm(callback, objectToSave)
         {
            a$.ajax({
               type: "POST",
               service: "C#",
               async: false,
               data: {
                  lib: "selfserve",
                  cmd: "savePayForPerformanceInformation",
                  projectExtended: JSON.stringify(objectToSave)
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function(data) {
                  let returnList = $.parseJSON(data.projectExtendedList);
                  projectList.length = 0;
                  for(let pIndex = 0; pIndex < returnList.length; pIndex++)
                  {
                     projectList.push(returnList[pIndex]);
                  }
                  if (callback != null) {
                     callback();
                  }
                  return;
               }
            });
         }
         function ClearTierInformation()
         {
            $("[id$='PayoutId']",element).val("");
            $(".tier-data-input-text", element).val("");
            $(".tier-data-input-hidden", element).val("");
         }
         function ClearTotals() {
            // $("#baseAgentCount", element).empty();
            // $("#basePayoutTotal", element).empty();
            // $("#basePayPer", element).empty();
            $("#originalTotalAgentBonusOnlyPay", element).empty();
            $(".agent-base-pay-amount", element).empty();
            $("[id$='AgentCount']", element).empty();
            $("[id$='AgentBasePay']", element).empty();
            $("[id$='AgentBonusPay']", element).empty();
            $("[id$='PayoutTotal']", element).empty();
            $("[id$='AgentBonusOnlyTotal']", element).empty();
            $("[id$='AgentBasePay']", element).empty();
            $("[id$='PayPer']", element).empty();

            $("#originalTotal", element).empty();
            $("#totalAgentCount", element).empty();
            $("#grandTotal", element).empty();
            $("#avgPayPer", element).empty();
            $("#diffTotal", element).empty();
         }
         function ClearCurrentProjectCounts()
         {
            $("[id^='selectProjectStatsCount_']", element).empty();
            $("[id^='selectProjectStatsCount_']", element).append(0);
         }
         function SetFormDefaults() {            
            $("#currentExtendedId", element).val("");
            $("#projectSelected", element).val("");
            $("#agentHoursPerPayout", element).val("");
            $("#tierType", element).val("");
            $("#tierPayoutType", element).val("");
            $("#payoutTiers", element).val(0);
            $("#agentCount", element).val("");
            $("#currentAgentBasePay", element).val("");
            $("#newAgentBasePay", element).val("");
            $("#curAgentCountHolder", element).val(0);
            $("#currentAgentCount", element).empty();            
            $("#implementationStartDate", element).val("");
            $("#implementationEndDate", element).val("");
            $("id[$='PayoutId']", element).val("");
            $("id[^='totalAgentsInTier']", element).val("");
            $("id[$='AmountInceasePercentage']", element).val("");
            $("id[$='AmountInceaseFlat']", element).val("");
            $("id[$='AmountInceaseAdditional']", element).val("");

            HandleTierTypeChange();
            HandleTierNumberChanged();
            HandlePostCalculationDisplay();
         }
         function GetFormDataObject() {
            let returnObject = {};
            returnObject.ProjectExtendedId = $("#currentExtendedId", element).val();
            returnObject.ProjectId = $("#projectSelected", element).val();
            returnObject.TotalAgentsOnProject = parseInt($("#agentCount", element).val()) || 0;
            returnObject.PayPeriodTypesId = null;
            returnObject.HoursPerAgentPerPayout = parseFloat($("#agentHoursPerPayout", element).val()) || 0;
            returnObject.CurrentBaseHourlyPayPerAgent = parseFloat($("#currentAgentBasePay", element).val()) || 0;
            returnObject.NewBaseHourlyPayPerAgent = parseFloat($("#newAgentBasePay", element).val()) || 0;
            returnObject.NumberOfPayoutTiers = $("#payoutTiers", element).val();
            returnObject.TierPayoutType = $("#tierPayoutType", element).val();
            returnObject.AgentsPerTierType = $("#tierType", element).val();
            returnObject.ImplementationStartDate  = null;
            returnObject.ImplementationEndDate  = null;
            if($("#implementationStartDate", element).val() != null && $("#implementationStartDate", element).val() != "")
            {
               returnObject.ImplementationStartDate = new Date($("#implementationStartDate", element).val()).toLocaleDateString();
            }
            if($("#implementationEndDate", element).val() != null && $("#implementationEndDate", element).val() != "")
            {
               returnObject.ImplementationEndDate =  new Date($("#implementationEndDate", element).val()).toLocaleDateString();
            }
            returnObject.Status = "A";
            returnObject.TierData = [];

            for (let i = 1; i <= 5; i++) {
               let tierInfo = {};
               tierInfo.ProjectTierPayoutDataId = $("#tier" + i + "PayoutId", element).val() || -1;
               tierInfo.ProjectExtendedId = returnObject.ProjectExtendedId;
               tierInfo.ProjectId = returnObject.ProjectId;
               tierInfo.TierNumber = i;
               tierInfo.AgentsValueInTier = parseFloat($("#totalAgentsInTier" + i, element).val()) || 0;
               tierInfo.IncreasePayRatePercentage = parseFloat($("#tier" + i + "AmountInceasePercentage", element).val()) || 0;
               tierInfo.IncreasePayRateAdditional = parseFloat($("#tier" + i + "AmountInceaseAdditional", element).val()) || 0;
               tierInfo.IncreasePayRateFlatAmount = parseFloat($("#tier" + i + "AmountInceaseFlat", element).val()) || 0;
               tierInfo.Status = "A";
               returnObject.TierData.push(tierInfo);
            }
            return returnObject;
         }
         function HandleCalculation() {
            let calcObject = GetFormDataObject();
            let calculationValidations = [];
            DoCalculation(calcObject, calculationValidations);
            RenderCalculationValidations(calculationValidations);
            LogObjectData(calcObject);
            HandlePostCalculationDisplay();
         }
         function HandleProjectChanged() {
            p4pChartData.length = 0;
            p4pBandData.length = 0;
            HideCreateNewButton();
            let projectIdSelected = $("#projectSelected", element).val();
            ClearTotals();
            ClearTierInformation();
            if (projectIdSelected == "" || projectIdSelected == 0 || projectIdSelected == null) {
               DoClearForm();
            }
            else {
               let currentAgentCount = 0;
               GetCurrentCountsForProject(function(countsObject){
                  RenderCurrentCountsForProject(countsObject);
                  currentAgentCount = countsObject.agents;
               }, projectIdSelected);
               let project = projectList.find(p => p.ProjectId == projectIdSelected);
               let currentExtendedId = -1;
               let agentCount = 0;
               let currentAgentBasePay = 0;
               let newAgentBasePay = 0;
               let payoutTiers = 1;
               let hoursPerAgentPerPayout = 0;
               let tierType = "hardCount".toLowerCase();
               let tierPayoutType = "additionalRate".toLowerCase();
               LogObjectData(project);
               let implementationStartDate = null;
               let implementationEndDate = null;

               if (project != null) {
                  currentExtendedId = project.ProjectExtendedId || -1;
                  agentCount = project.TotalAgentsOnProject;
                  currentAgentBasePay = project.CurrentBaseHourlyPayPerAgent;
                  newAgentBasePay = project.NewBaseHourlyPayPerAgent;
                  payoutTiers = project.NumberOfPayoutTiers || 1;
                  hoursPerAgentPerPayout = project.HoursPerAgentPerPayout;
                  tierPayoutType = project.TierPayoutType.toLowerCase();
                  tierType = project.AgentsPerTierType.toLowerCase();
                  if(project.ImplementationStartDate != null && project.ImplementationStartDate != "") 
                  {
                     implementationStartDate = new Date(project.ImplementationStartDate);
                  }
                  if(project.ImplementationEndDate != null && project.ImplementationEndDate != "") 
                  {
                     implementationEndDate = new Date(project.ImplementationEndDate);
                  }
               }
               $("#currentAgentCount", element).empty();
               $("#currentAgentCount", element).append(currentAgentCount);
               $("#curAgentCountHolder", element).val(currentAgentCount);

               $("#currentExtendedId", element).val(currentExtendedId);
               $("#agentCount", element).val(agentCount);
               $("#currentAgentBasePay", element).val(currentAgentBasePay);
               $("#newAgentBasePay", element).val(newAgentBasePay);
               $("#payoutTiers", element).val(payoutTiers);
               $("#agentHoursPerPayout", element).val(hoursPerAgentPerPayout);
               $("#tierPayoutType", element).val(tierPayoutType);
               $("#tierType", element).val(tierType);
               $("#implementationStartDate", element).val("");
               $("#implementationEndDate", element).val("");

               if(implementationStartDate != null && implementationStartDate != "")
               {
                  $("#implementationStartDate", element).val(new Date(implementationStartDate).toLocaleDateString());
               }
               if(implementationEndDate != null && implementationEndDate != "")
               {
                  $("#implementationEndDate", element).val(new Date(implementationEndDate).toLocaleDateString());
               } 
               
               $("#payoutTiers", element).change();
               $("#tierType", element).change();
               ShowUseAgentCountOption();
               showCreateNewButton();
               LoadChartsForProject(projectIdSelected);
            }
            
            $("#btnCalculate", element).click();
         }
         function HandleTierNumberChanged() {

            let payoutTiersCount = parseInt($("#payoutTiers", element).val());
            $("[id^='tierList_']", element).hide();
            for (let i = 0; i <= payoutTiersCount; i++) {
               $("#tierList_" + i, element).show();
            }
            LoadCurrentTierInformation();
         }
         function HandleTierPayoutChanged() {
            HandleTierInputsDisplay();
         }
         function LoadCurrentTierInformation() {
            let projectIdToLoad = $("#projectSelected", element).val();
            let tierPayoutType = $("#tierPayoutType", element).val();
            ClearTierInformation();
            if (projectIdToLoad != null && projectIdToLoad != "") {
               let project = projectList.find(p => p.ProjectId == projectIdToLoad);
               if (project != null) {
                  if(project.TierData != null)
                  {
                     project.TierData.forEach(function(item){
                        let tierNumber = item.TierNumber;
                        let itemValue = item.AgentsValueInTier;
                        let tierId = item.ProjectTierPayoutDataId || -1;

                        $("#tier" + tierNumber + "PayoutId", element).val(tierId);
                        $("#totalAgentsInTier" + tierNumber).val(item.AgentsValueInTier);

                              if (tierPayoutType.toLowerCase() == "flatrate".toLowerCase()) {
                           $("#tier" + tierNumber + "AmountInceaseFlat", element).val(item.IncreasePayRateFlatAmount);
                        }
                        else if (tierPayoutType.toLowerCase() == "additionalrate".toLowerCase()) {
                           $("#tier" + tierNumber + "AmountInceaseAdditional", element).val(item.IncreasePayRateAdditional);
                        }
                        else {
                           $("#tier" + tierNumber + "AmountInceasePercentage", element).val(item.IncreasePayRatePercentage);
                        }
                     });
                  }
               }
            }
            HandleTierInputsDisplay(tierPayoutType);

         }
         function DoCalculation(item, messageList) {
            if (item.TierData == null) {
                item.TierData = [];
            }
            if(messageList == null)
            {
               messageList = [];
            }
            let yearlyBaseHourlyNumber = 2000;
            let tierCount = item.NumberOfPayoutTiers;
            let payoutType = item.TierPayoutType;
            let totalAgentsOnProject = parseInt(item.TotalAgentsOnProject) || 0;
            let agentsPerTierType = item.AgentsPerTierType;
            let hoursPerAgentPerPayout = item.HoursPerAgentPerPayout;
            let currentBaseHourlyPayPerAgent = item.CurrentBaseHourlyPayPerAgent;
            let newBaseHourlyPayPerAgent = item.NewBaseHourlyPayPerAgent;

            let tier1Object = item.TierData.find(t => t.TierNumber == 1);
            let tier2Object = item.TierData.find(t => t.TierNumber == 2);
            let tier3Object = item.TierData.find(t => t.TierNumber == 3);
            let tier4Object = item.TierData.find(t => t.TierNumber == 4);
            let tier5Object = item.TierData.find(t => t.TierNumber == 5);
            let tier1PayValue = 0;
            let tier2PayValue = 0;
            let tier3PayValue = 0;
            let tier4PayValue = 0;
            let tier5PayValue = 0;
            let tier1AgentCount = 0;
            let tier2AgentCount = 0;
            let tier3AgentCount = 0;
            let tier4AgentCount = 0;
            let tier5AgentCount = 0;
            
            if (agentsPerTierType.toLowerCase() == "percentage".toLowerCase()) {
               tier1AgentCount = Math.ceil((totalAgentsOnProject * ((tier1Object?.AgentsValueInTier / 100) || 0)));
               tier2AgentCount = Math.ceil((totalAgentsOnProject * ((tier2Object?.AgentsValueInTier / 100) || 0)));
               tier3AgentCount = Math.ceil((totalAgentsOnProject * ((tier3Object?.AgentsValueInTier / 100) || 0)));
               tier4AgentCount = Math.ceil((totalAgentsOnProject * ((tier4Object?.AgentsValueInTier / 100) || 0)));
               tier5AgentCount = Math.ceil((totalAgentsOnProject * ((tier5Object?.AgentsValueInTier / 100) || 0)));
            }
            else {
               tier1AgentCount = (tier1Object?.AgentsValueInTier || 0);
               tier2AgentCount = (tier2Object?.AgentsValueInTier || 0);
               tier3AgentCount = (tier3Object?.AgentsValueInTier || 0);
               tier4AgentCount = (tier4Object?.AgentsValueInTier || 0);
               tier5AgentCount = (tier5Object?.AgentsValueInTier || 0);
            }
            if (payoutType.toLowerCase() == "percentage".toLowerCase()) {
               tier1PayValue = (newBaseHourlyPayPerAgent * (1 + (tier1Object.IncreasePayRatePercentage / 100)));
               tier2PayValue = (newBaseHourlyPayPerAgent * (1 + (tier2Object.IncreasePayRatePercentage / 100)));
               tier3PayValue = (newBaseHourlyPayPerAgent * (1 + (tier3Object.IncreasePayRatePercentage / 100)));
               tier4PayValue = (newBaseHourlyPayPerAgent * (1 + (tier4Object.IncreasePayRatePercentage / 100)));
               tier5PayValue = (newBaseHourlyPayPerAgent * (1 + (tier5Object.IncreasePayRatePercentage / 100)));
            }
            else if (payoutType.toLowerCase() == "additionalRate".toLowerCase()) {
               tier1PayValue = (newBaseHourlyPayPerAgent + tier1Object.IncreasePayRateAdditional);
               tier2PayValue = (newBaseHourlyPayPerAgent + tier2Object.IncreasePayRateAdditional);
               tier3PayValue = (newBaseHourlyPayPerAgent + tier3Object.IncreasePayRateAdditional);
               tier4PayValue = (newBaseHourlyPayPerAgent + tier4Object.IncreasePayRateAdditional);
               tier5PayValue = (newBaseHourlyPayPerAgent + tier5Object.IncreasePayRateAdditional);
            }
            else {
               tier1PayValue = tier1Object.IncreasePayRateFlatAmount;
               tier2PayValue = tier2Object.IncreasePayRateFlatAmount;
               tier3PayValue = tier3Object.IncreasePayRateFlatAmount;
               tier4PayValue = tier4Object.IncreasePayRateFlatAmount;
               tier5PayValue = tier5Object.IncreasePayRateFlatAmount;
            }
            let baseAgentCount = (totalAgentsOnProject - tier1AgentCount - tier2AgentCount - tier3AgentCount - tier4AgentCount - tier5AgentCount);
            let baseAmount = parseFloat(baseAgentCount * newBaseHourlyPayPerAgent * hoursPerAgentPerPayout);
            let newTotalAmount = (totalAgentsOnProject * newBaseHourlyPayPerAgent * hoursPerAgentPerPayout);
            
            let tier1Amount = parseFloat(tier1AgentCount * tier1PayValue * hoursPerAgentPerPayout);
            let tier2Amount = parseFloat(tier2AgentCount * tier2PayValue * hoursPerAgentPerPayout);
            let tier3Amount = parseFloat(tier3AgentCount * tier3PayValue * hoursPerAgentPerPayout);
            let tier4Amount = parseFloat(tier4AgentCount * tier4PayValue * hoursPerAgentPerPayout);
            let tier5Amount = parseFloat(tier5AgentCount * tier5PayValue * hoursPerAgentPerPayout);

            //let baseBonusOnlyAmount = parseFloat(tier1AgentCount * (hoursPerAgentPerPayout - hoursPerAgentPerPayout) * hoursPerAgentPerPayout);
            let baseBonusOnlyAmount = 0.00;
            let tier1BonusOnlyAmount = parseFloat(tier1AgentCount * (tier1PayValue - newBaseHourlyPayPerAgent) * hoursPerAgentPerPayout);
            let tier2BonusOnlyAmount = parseFloat(tier2AgentCount * (tier2PayValue - newBaseHourlyPayPerAgent) * hoursPerAgentPerPayout);
            let tier3BonusOnlyAmount = parseFloat(tier3AgentCount * (tier3PayValue - newBaseHourlyPayPerAgent) * hoursPerAgentPerPayout);
            let tier4BonusOnlyAmount = parseFloat(tier4AgentCount * (tier4PayValue - newBaseHourlyPayPerAgent) * hoursPerAgentPerPayout);
            let tier5BonusOnlyAmount = parseFloat(tier5AgentCount * (tier5PayValue - newBaseHourlyPayPerAgent) * hoursPerAgentPerPayout);

            let grandTotal = parseFloat(baseAmount + tier1Amount + tier2Amount + tier3Amount + tier4Amount + tier5Amount);
            let avgPayPerAgent = 0;
            let totalBonusOnlyPay = (tier1BonusOnlyAmount + tier2BonusOnlyAmount + tier3BonusOnlyAmount + tier4BonusOnlyAmount + tier5BonusOnlyAmount);

            if (totalAgentsOnProject != 0) {
               avgPayPerAgent = parseFloat(parseFloat((grandTotal / hoursPerAgentPerPayout)) / totalAgentsOnProject);
               if(Number.isNaN(avgPayPerAgent))
               {
                  avgPayPerAgent = 0;
               }
            }
            let totalOriginal = (totalAgentsOnProject * currentBaseHourlyPayPerAgent * hoursPerAgentPerPayout)
            let diffTotal = grandTotal - totalOriginal;
            let dollarFormatting = {
               style: "currency",
               currency: "USD",
            };
            /* Process possible problematic info START */
            if(totalAgentsOnProject <= 0)
            {
               messageList.push({message: "No Agents set for project."});
            }
            if(hoursPerAgentPerPayout <= 0)
            {
               messageList.push({message: "Hours Per Agent not set or is 0."});
            }
            if(currentBaseHourlyPayPerAgent <= 0)
            {
               messageList.push({message: "Current Base pay for the agents less than or equal to 0."});
            }
            if(newBaseHourlyPayPerAgent <= 0)
            {
               messageList.push({message: "New Base pay for the agents less than or equal to 0."});
            }
            if(item.ImplementationStartDate == null || item.ImplementationStartDate  == "")
            {
               messageList.push({message: "No Start Date for program set."});
            }
            if(agentsPerTierType == "")
            {
               messageList.push({message: "Agents per tier type not set, using a static number of 0."});
            }
            if(payoutType == "")
            {
               messageList.push({message: "Payout type not set, using a flat rate of 0."});
            }
            
            if(tierCount == 0)
            {
               messageList.push({message: "No tiers set for pay."});
            }
            else if(tierCount > 0)
            {
               if(tierCount >= 1)
               {
                  if(tier1Amount < 0)
                  {
                     messageList.push({message: "Tier 1 Total Payout is negative."});
                  }
                  if(tier1AgentCount == 0)
                  {
                     messageList.push({message: "No Agents found for tier 1."});
                  }
                  if(tier1PayValue == 0)
                  {
                     messageList.push({message: "No Pay Value set for tier 1."});
                  }
               }
               if(tierCount >= 2)
               {
                  if(tier2Amount < 0)
                  {
                     messageList.push({message: "Tier 2 Total Payout is negative."});
                  }
                  if(tier2AgentCount == 0)
                  {
                     messageList.push({message: "No Agents found for tier 2."});
                  }
                  if(tier2PayValue == 0)
                  {
                     messageList.push({message: "No Pay Value set for tier 2."});
                  }
               }
               if(tierCount >= 3)
               {
                  if(tier3Amount < 0)
                  {
                     messageList.push({message: "Tier 3 Total Payout is negative."});
                  }
                  if(tier3AgentCount == 0)
                  {
                     messageList.push({message: "No Agents found for tier 3."});
                  }
                  if(tier3PayValue == 0)
                  {
                     messageList.push({message: "No Pay Value set for tier 3."});
                  }
               }
               if(tierCount >= 4)
               {
                  if(tier4Amount < 0)
                  {
                     messageList.push({message: "Tier 4 Total Payout is negative."});
                  }
                  if(tier4AgentCount == 0)
                  {
                     messageList.push({message: "No Agents found for tier 4."});
                  }
                  if(tier4PayValue == 0)
                  {
                     messageList.push({message: "No Pay Value set for tier 4."});
                  }
               }
               if(tierCount >= 5)
               {
                  if(tier5Amount < 0)
                  {
                     messageList.push({message: "Tier 5 Total Payout is negative."});
                  }
                  if(tier5AgentCount == 0)
                  {
                     messageList.push({message: "No Agents found for tier 5."});
                  }
                  if(tier5PayValue == 0)
                  {
                     messageList.push({message: "No Pay Value set for tier 5."});
                  }
               }
            }
            if(baseAgentCount < 0)
            {
               messageList.push({message: "Bonus pay to more agents than on the project."});
            }
            
            /* Process possible problematic info END */
            $("#newAgentCount", element).text(totalAgentsOnProject);
            $("#newTotalAgentBonusPay", element).text((0.00).toLocaleString("en-US", dollarFormatting));
            $("#newTotalAgentBonusOnlyPay", element).text("--");
            $("#newTotal", element).text(newTotalAmount.toLocaleString("en-US", dollarFormatting));
            let curVsNewDiff = 0.00;
            curVsNewDiff = parseFloat(newTotalAmount - totalOriginal);
            $("#currentVsNewDiff", element).text(curVsNewDiff.toLocaleString("en-US", dollarFormatting));

            $("#baseAgentCount", element).text(baseAgentCount);
            $("#tier1AgentCount", element).text(tier1AgentCount);
            $("#tier2AgentCount", element).text(tier2AgentCount);
            $("#tier3AgentCount", element).text(tier3AgentCount);
            $("#tier4AgentCount", element).text(tier4AgentCount);
            $("#tier5AgentCount", element).text(tier5AgentCount);
            $("#totalAgentCount", element).text(totalAgentsOnProject);
            $("#originalAgentCount", element).text(totalAgentsOnProject);
            $(".agent-base-pay-amount", element).text(newBaseHourlyPayPerAgent.toLocaleString("en-US", dollarFormatting));
            //$("#originalTotalAgentBasePay", element).text(currentBaseHourlyPayPerAgent.toLocaleString("en-US", dollarFormatting));
            $(".agent-base-pay-amount-original", element).text(currentBaseHourlyPayPerAgent.toLocaleString("en-US", dollarFormatting));

            $("#baseAgentBonusPay", element).text((0.00).toLocaleString("en-US", dollarFormatting));
            $("#tier1AgentBonusPay", element).text((tier1PayValue - newBaseHourlyPayPerAgent).toLocaleString("en-US", dollarFormatting));
            $("#tier2AgentBonusPay", element).text((tier2PayValue - newBaseHourlyPayPerAgent).toLocaleString("en-US", dollarFormatting));
            $("#tier3AgentBonusPay", element).text((tier3PayValue - newBaseHourlyPayPerAgent).toLocaleString("en-US", dollarFormatting));
            $("#tier4AgentBonusPay", element).text((tier4PayValue - newBaseHourlyPayPerAgent).toLocaleString("en-US", dollarFormatting));
            $("#tier5AgentBonusPay", element).text((tier5PayValue - newBaseHourlyPayPerAgent).toLocaleString("en-US", dollarFormatting));
            $("#totalAgentBonusPay", element).text((avgPayPerAgent - newBaseHourlyPayPerAgent).toLocaleString("en-US", dollarFormatting));
            $("#originalTotalAgentBonusPay", element).text((0.00).toLocaleString("en-US", dollarFormatting));

            $("#basePayPer", element).text(newBaseHourlyPayPerAgent.toLocaleString("en-US", dollarFormatting));
            $("#tier1PayPer", element).text(tier1PayValue.toLocaleString("en-US", dollarFormatting));
            $("#tier2PayPer", element).text(tier2PayValue.toLocaleString("en-US", dollarFormatting));
            $("#tier3PayPer", element).text(tier3PayValue.toLocaleString("en-US", dollarFormatting));
            $("#tier4PayPer", element).text(tier4PayValue.toLocaleString("en-US", dollarFormatting));
            $("#tier5PayPer", element).text(tier5PayValue.toLocaleString("en-US", dollarFormatting));
            $("#avgPayPer", element).text(avgPayPerAgent.toLocaleString("en-US", dollarFormatting));

            $("#baseAgentBonusOnlyTotal", element).text(baseBonusOnlyAmount.toLocaleString("en-US", dollarFormatting));
            $("#tier1AgentBonusOnlyTotal", element).text(tier1BonusOnlyAmount.toLocaleString("en-US", dollarFormatting));
            $("#tier2AgentBonusOnlyTotal", element).text(tier2BonusOnlyAmount.toLocaleString("en-US", dollarFormatting));
            $("#tier3AgentBonusOnlyTotal", element).text(tier3BonusOnlyAmount.toLocaleString("en-US", dollarFormatting));
            $("#tier4AgentBonusOnlyTotal", element).text(tier4BonusOnlyAmount.toLocaleString("en-US", dollarFormatting));
            $("#tier5AgentBonusOnlyTotal", element).text(tier5BonusOnlyAmount.toLocaleString("en-US", dollarFormatting));

            $("#totalAgentBonusOnly", element).text("--");
            $("#originalTotalAgentBonusOnlyPay", element).text("--");

            $("#basePayoutTotal", element).text(baseAmount.toLocaleString("en-US", dollarFormatting));
            $("#tier1PayoutTotal", element).text(tier1Amount.toLocaleString("en-US", dollarFormatting));
            $("#tier2PayoutTotal", element).text(tier2Amount.toLocaleString("en-US", dollarFormatting));
            $("#tier3PayoutTotal", element).text(tier3Amount.toLocaleString("en-US", dollarFormatting));
            $("#tier4PayoutTotal", element).text(tier4Amount.toLocaleString("en-US", dollarFormatting));
            $("#tier5PayoutTotal", element).text(tier5Amount.toLocaleString("en-US", dollarFormatting));
            $("#grandTotal", element).text(grandTotal.toLocaleString("en-US", dollarFormatting));

            $("#originalTotal", element).text(totalOriginal.toLocaleString("en-US", dollarFormatting));
            $("#diffTotal", element).text(diffTotal.toLocaleString("en-US", dollarFormatting));
            let yearlyPayoutTotal = 0;
            let yearlyOriginalPayoutTotal = 0;
            let yearlyPayoutDifferenceTotal = 0;
            let payoutsCount = 0;

            if(hoursPerAgentPerPayout > 0)
            {
               payoutsCount = parseFloat(Math.ceil(yearlyBaseHourlyNumber / hoursPerAgentPerPayout));
               yearlyPayoutTotal = parseFloat(grandTotal * payoutsCount);
               yearlyOriginalPayoutTotal = parseFloat(totalOriginal * payoutsCount);
               yearlyPayoutDifferenceTotal = parseFloat(yearlyPayoutTotal - yearlyOriginalPayoutTotal);
            }
            $("#yearlyPayoutCount", element).text(parseInt(Math.ceil(payoutsCount)));
            $("#yearlyPayoutTotalNoBonus", element).text(yearlyOriginalPayoutTotal.toLocaleString("en-US", dollarFormatting ));
            $("#yearlyPayoutTotal", element).text(yearlyPayoutTotal.toLocaleString("en-US", dollarFormatting ));
            $("#yearlyPayoutDifference", element).text(yearlyPayoutDifferenceTotal.toLocaleString("en-US", dollarFormatting ));
         }
         function RenderCurrentCountsForProject(countsObject)
         {
            $("[id^='selectProjectStatsCount_']", element).each(function(){
               let id = this.id;
               let area = id.split("_")[1]?.toLowerCase();
               let countValueForArea = 0;
               if(area != null && area != "")
               {
                  countValueForArea = countsObject[area] || 0;
               }
               $(this).empty();
               $(this).append(countValueForArea);
            });
         }
         function RenderCalculationValidations(messagesList)
         {
            HideWarningListHolder();
            $("#calculationWarningsList", element).empty();
            if(messagesList.length > 0)
            {
               $(messagesList).each(function(){
                  if(this.message != null)
                  {
                     let messageItem = $("<li>" + this.message + "</li>");
                     $("#calculationWarningsList", element).append(messageItem);
                  }
               });
               ShowWarningListHolder();
            }
            LogObjectData(messagesList, "Message List");
         }
         function HandlePayoutTypeInfoDisplay() {
            let isCurVisible = $("#payoutTypeInfo", element).is(":visible");
            if (isCurVisible == true) {
               $("#payoutTypeInfo", element).hide();
            }
            else {
               $("#payoutTypeInfo", element).show();
            }
         }
         function HandleTierTypeInfoDisplay() {
            let isCurVisible = $("#tierTypeInfo", element).is(":visible");
            if (isCurVisible == true) {
               $("#tierTypeInfo", element).hide();
            }
            else {
               $("#tierTypeInfo", element).show();
            }
         }
         function HandlePostCalculationDisplay() {
            let payoutTiersCount = parseInt($("#payoutTiers", element).val());
            $("[id^='PayoutRow_Tier']", element).hide();
            for (let i = 0; i <= payoutTiersCount; i++) {
               $("#PayoutRow_Tier" + i).show();
            }
         }
         function HandleTierInputsDisplay(payoutType) {
            if (payoutType == null) {
               payoutType = $("#tierPayoutType", element).val();
            }
            $("[class^='form_input-holder-']", element).hide();
            $(".form_input-holder-" + payoutType.toLowerCase(), element).show();

         }
         function HandleTierTypeChange()
         {
            let tierTypeValue = $("#tierType", element).val();
            let agentCountTypeLabel = "";
            switch(tierTypeValue)
            {
               case "hardcount":
                  agentCountTypeLabel = "Total Agents"
                  break;
               case "percentage":
                  agentCountTypeLabel = "Percentage of Agents"
                  break;
               default:
                  agentCountTypeLabel = "Agents"
                  break;
            }
            $(".totalAgentsInTierLabel").empty();
            $(".totalAgentsInTierLabel").append(agentCountTypeLabel);
         }
         function LoadChartsForProject(projectId)         
         {
            HandleBalScoreAttritionBandedTrendChart(projectId);
         }
         function HandleBalScoreAttritionBandedTrendChart(projectId, forceReload)
         {
            if(forceReload == null)
            {
               forceReload = false;
            }
            WritePayChartLoadingMessage("Collecting data to display...");
            window.setTimeout(function(){
               GetBalScoreAttritionBandedTrendChartData(projectId, forceReload, function(chartData, bandData){
                  WritePayChartLoadingMessage("Writing chart data to screen...");
                  window.setTimeout(function(){
                     RenderBalScoreAttritionBandedTrendChart(chartData, bandData, function(){
                        HideChartLoading();
                     });
                  },500);
               });
            }, 500);
         }
         function GetBalScoreAttritionBandedTrendChartData(projectId, forceReload, callback)
         {

            if(forceReload == null)
            {
               forceReload = false;
            }
            
            if(forceReload == true || p4pChartData.length == 0 || p4pBandData.length == 0)
            {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getPayForPerformanceTrendChartDataWithBands",
                     projectid: projectId,
                     deepload: false,
                     includeAttrition: true,
                     startDate: null,
                     endDate: null, 
                     mqfNumber: 0,
                     subTypeId: 0,
                     monthsToDisplay: 12
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function(data) {
                     let trendData = JSON.parse(data.trendData);
                      let bandData = [];
                      if(data.bandData != null)
                      {
                         bandData = JSON.parse(data.bandData);
                      }
                     trendData.forEach(function(item){
                        p4pChartData.push(item);
                     });
                     bandData.forEach(function(item){
                        p4pBandData.push(item);
                     });                     
                     if (callback != null) {
                        callback(trendData, bandData);
                     }
                  }
               });
            }
            else
            {
               if(callback != null)
               {
                  callback(p4pChartData, p4pBandData);
               }
            }
         }
         function RenderBalScoreAttritionBandedTrendChart(trendData, bandData, callback)
         {
            let categories = [];
            let seriesData = [];
            let chartBands = [];
            let scaleUp = true;

            trendData.forEach(function(item){
               let categoryIndex = categories.findIndex(i => i == item.DisplayData);
               if(categoryIndex < 0)
               {
                  categories.push(item.DisplayData);
               }
               let seriesIndex = seriesData.findIndex(i => i.name == item.ScoreArea);
               let dataPoint = item.ScoreValue;
               //if(item.ScoreArea == "Attrition")
               //{
                 //dataPoint = ((100 - item.ScoreValue) / 10);
               //}
               if(seriesIndex < 0)
               {
                  seriesData.push({
                     name: item.ScoreArea,
                     data: [],                     
                  });
                  seriesIndex = seriesData.length - 1;
               }
               
               seriesData[seriesIndex].data.push(dataPoint);
            });
            bandData.forEach(function (item) {
               if (item.ImplementationStartDate != null) {
                  let itemIndex = bandData.findIndex(i => i == item);
                  let implementationStartFirstOfMonth = new Date(item.ImplementationStartDate);                  
                  let firstOfMonthFullStartDate = new Date(implementationStartFirstOfMonth.getFullYear(), implementationStartFirstOfMonth.getMonth(), 1);

                  if (itemIndex > plotBandColors.length) {
                     itemIndex = 0;
                  }
                  let fromCategoryIndex = categories.findIndex(i => i == trendData.find(i => new Date(i.StartDate).toLocaleDateString() == new Date(firstOfMonthFullStartDate).toLocaleDateString())?.DisplayData);
                  let toCategoryIndex = (categories.length - 1); //assume we still have an ongoing program.
                  if (item.ImplementationEndDate != null) {
                     let implementationEndDate = new Date(item.ImplementationEndDate);
                     if(implementationEndDate.getDate() > 1)
                     {
                        implementationEndDate = new Date(implementationEndDate.getFullYear(), (implementationEndDate.getMonth() + 1), 1);
                     }
                     toCategoryIndex = categories.findIndex(i => i == trendData.find(i => new Date(i.StartDate).toLocaleDateString() == new Date(implementationEndDate).toLocaleDateString())?.DisplayData);
                  }
                  let bandHeaderText = `${new Date(item.ImplementationStartDate).toLocaleDateString()} - ${new Date(item.ImplementationEndDate).toLocaleDateString()}`;
                  if (item.ImplementationEndDate == null || item.ImplementationEndDate == "") {
                     bandHeaderText = `${new Date(item.ImplementationStartDate).toLocaleDateString()} - today`;
                  }

                  chartBands.push({
                        color: plotBandColors[itemIndex],
                        label: {
                           text: `<b>${bandHeaderText}</b>`,
                           align: "center",
                        },
                        from: fromCategoryIndex,
                        to: toCategoryIndex,
                        zIndex: 0
                     });
               }
            });

            let chartObject = new Object();
            chartObject.chart = new Object();
            chartObject.chart.type = "line";
            chartObject.chart.zoomType = "xy";
            chartObject.title = new Object();
            chartObject.title.text = "Performance Information";
            chartObject.series = seriesData;
            chartObject.xAxis = new Object();
            chartObject.xAxis.categories = categories;
            chartObject.xAxis.plotBands = chartBands;
            chartObject.yAxis = new Object();            
            chartObject.yAxis.title = new Object();
            chartObject.yAxis.title.text = "Score";
            chartObject.yAxis.min = defaultMinValue;
            chartObject.yAxis.max = defaultMaxValue;
            chartObject.legend = new Object();
            chartObject.legend.layout = "vertical";
            chartObject.legend.align = "right";
            chartObject.legend.verticalAlign = "middle";
            chartObject.legend.floating = false;
            chartObject.plotOptions = new Object();
            chartObject.plotOptions.series = new Object();
            chartObject.plotOptions.series.connectNulls = true;
            chartObject.plotOptions.series.dataLabels = new Object();
            chartObject.plotOptions.series.dataLabels.enabled = false;
            chartObject.tooltip = new Object();
            chartObject.tooltip.useHTML = true;
             chartObject.tooltip.formatter = function () {
                  let returnFormatter = `<b>${this.series.name}</b><hr/>${this.x}<br/>${this.y.toFixed(2)}`;
                  if(this.series.name == "Attrition")
                  {
                    returnFormatter = `<b>${this.series.name}</b><hr/>${this.x}<br/>${this.y.toFixed(2)}%`;
                  }
                  return returnFormatter;                  
             };

            Highcharts.chart("BalScoreAttritionBandChart", chartObject);
            
            if(callback != null)
            {
               callback();
            }
         }
         
         function HideAll()
         {
            HideChartLoading();
            HideUseAgentCountOption();
            HideWarningListHolder();
            HideCreateNewButton();
         }
         function HideChartLoading()
         {
            $("#chartLoadingHolder", element).hide();
         }
         function ShowChartLoading()
         {
            $("#chartLoadingHolder", element).show();
         }
         function WritePayChartLoadingMessage(messageString, callback)
         {
            if(messageString == null || messageString == "")
            {
               messageString = "Loading chart data...";
            }
            $("#payChartLoadingMessage", element).empty();            
            $("#payChartLoadingMessage", element).append(messageString);
            ShowChartLoading();
            if(callback != null)
            {
               callback();
            }
         }
         function HideUseAgentCountOption()
         {
            $("#useCurrentNumberAgents", element).hide();
         }
         function ShowUseAgentCountOption()
         {
            $("#useCurrentNumberAgents", element).show();
         }
         function HideWarningListHolder()
         {
            $("#calculationWarningsHolder", element).hide();
         }
         function ShowWarningListHolder()
         {
            $("#calculationWarningsHolder", element).show();
         }
         function HideCreateNewButton()
         {
            $("#btnCreateNew", element).hide();
         }
         function showCreateNewButton()
         {
            $("#btnCreateNew", element).show();
         }
         function WriteAllObjects() {
            LogObjectData(projectList, "Current State");
            LogObjectData(originalProjectList, "Original State");
         }
         function LogInfo(dataMessage) {
            console.log(dataMessage);
         }
         function LogObjectData(object, label) {
            if (object != null && object != "") {
               if(label != null && label != "")
               {
                  console.log(label + ": " + JSON.stringify(object));
               }
               else
               {
                  console.log(JSON.stringify(object));
               }
            }
         }
         scope.load = function () {
            scope.Initialize();
            //LogObjectData(projectList, "Project List:\n");
            //LogObjectData(availableProjectList, "Available Project List:\n");
         };

         ko.postbox.subscribe("payPerformanceLoad", function () {
            scope.load();
         });

      }
   };
}]);
