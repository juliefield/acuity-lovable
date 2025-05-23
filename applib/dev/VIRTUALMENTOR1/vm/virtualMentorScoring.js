angularApp.directive("ngVirtualMentorScoring", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/VIRTUALMENTOR1/view/virtualMentorScoring.htm?' + Date.now(),
      scope: {
         assoc: "@",
         text: "@",
         details: "@",
         cid: "@",
         filters: "@",
         panel: "@",
         hidetopper: "@",
         toppertext: "@",
      },
      require: '^ngLegacyContainer',
      link: function (scope, element, attrs, legacyContainer) {
         var possibleAreas = [];
         var possibleWeights = [];
         let specAreaWeight = 85;

         scope.Initialize = function () {
            SetDatePickerFields();
            LoadAreaWeights();
         };
         function SetDatePickerFields() {
         }
         function HandleScoringList(forceReload, callback) {
            LoadScoringList(forceReload, function (listData) {
               //TODO: sort here?
               RenderScoringList(listData, function () {
                  if (callback != null) {
                     callback();
                  }
               });
            });
         }
         function LoadScoringList(forceReload, callback) {
            if (forceReload == null) {
               forceReload = false;
            }
            if (possibleAreas != null && possibleAreas.length > 0 && forceReload == false) {
               if (callback != null) {
                  callback(possibleAreas);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: true,
                  data: {
                     lib: "selfserve",
                     cmd: "getVirtualMentorAllCalculationAreas"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let areaList = JSON.parse(data.calculationAreas);
                     possibleAreas.length = 0;
                     possibleAreas = areaList;
                     if (callback != null) {
                        callback(areaList);
                     }
                  }
               });
            }
         }
         function RenderScoringList(listToRender, callback) {
            if (listToRender == null) {
               listToRender = possibleAreas;
            }

            let calculationAreaHolder = $("<div class=\"calculation-area-list\" />");
            $("#virtualMentorScoringOptionList", element).empty();
            if (listToRender != null && listToRender.length > 0) {
               for (let ac = 0; ac < listToRender.length; ac++) {
                  let areaItem = listToRender[ac];
                  let id = areaItem.VirtualMentorCalculationAreaId;
                  
                  let areaItemRowHolder = $("<div class=\"calculation-area-list-row\" />");
                  let areaItemNameHolder = $("<div class=\"calculation-area-list-item area-name\" />");
                  areaItemNameHolder.append(areaItem.Name);

                  let areaItemSliderHolder = $("<div class=\"calculation-area-list-item area-slider\" id=\"areaWeightSliderHolder_" + id + "\" />");
                  let areaItemWeightHolder = $("<div class=\"calculation-area-list-item area-weight\" />");
                  let areaItemWeightInput = $("<input type=\"textbox\" class=\"area-weight-input\" id=\"areaWeight_" + id + "\" calcarea=\"" + areaItem.WeightCalculationArea + "\" />");
                  areaItemWeightInput.on("change", function () {
                     let itemId = this.id;
                     let areaId = itemId.split("_")[1];                     
                     GetAndRenderNewWeight(areaId);
                     CalculateRemainingWeight();
                  });

                  let areaWeight = parseFloat(GetAreaWeightForArea(areaItem.VirtualMentorCalculationAreaId)).toFixed(2);

                  let areaWeightPlusButton = $("<button class=\"button btn\" id=\"areaWeightAdd_" + id + "\"><i class=\"fa fa-arrow-up\"></i></button>");
                  areaWeightPlusButton.on("click", function(){
                     let itemId = this.id;
                     let areaId = itemId.split("_")[1];
                     ModifyAreaWeight(areaId, 1);
                  });
                  
                  let areaWeightMinusButton = $("<button class=\"button btn\" id=\"areaWeightMinus_" + id + "\"><i class=\"fa fa-arrow-down\"></i></button>");
                  areaWeightMinusButton.on("click", function(){
                     let itemId = this.id;
                     let areaId = itemId.split("_")[1];
                     ModifyAreaWeight(areaId, -1);
                  });
                  RenderSliderWeightValue(areaWeight, areaItemSliderHolder);

                  areaItemSliderHolder.append();

                  areaItemWeightInput.val(areaWeight);

                  areaItemWeightHolder.append(areaWeightMinusButton);
                  areaItemWeightHolder.append("&nbsp;");
                  areaItemWeightHolder.append(areaItemWeightInput);
                  areaItemWeightHolder.append("&nbsp;");
                  areaItemWeightHolder.append(areaWeightPlusButton);

                  areaItemRowHolder.append(areaItemNameHolder);
                  areaItemRowHolder.append(areaItemSliderHolder);
                  areaItemRowHolder.append(areaItemWeightHolder);

                  calculationAreaHolder.append(areaItemRowHolder);
               }
            }
            else {
               calculationAreaHolder.append("No Calculation Areas found.");
            }
            CalculateRemainingWeight();
            $("#virtualMentorScoringOptionList", element).append(calculationAreaHolder);

            if (callback != null) {
               callback();
            }
         }
         function LoadAreaWeights(callback) {
            if (possibleWeights != null && possibleWeights.length > 0) {
               if (callback != null) {
                  callback(possibleWeights);
               }
            }
            else {
               a$.ajax({
                  type: "POST",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "selfserve",
                     cmd: "getVirtualMentorAllCalculationWeights"
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (data) {
                     let weightsList = $.parseJSON(data.calculationWeights);
                     possibleWeights.length = 0;
                     possibleWeights = weightsList;
                     if (callback != null) {
                        callback(weightsList);
                     }
                  }
               });
            }
         }
         function GetAreaWeightForArea(areaId) {
            let returnValue = 0;

            return returnValue;
         }
         function GetAndRenderNewWeight(id) {            
            let availableWeight = Number($("#remainingWeight", element).val());
            let weightValue = $("#areaWeight_" + id, element).val();            
            let objectToRenderTo = $("#areaWeightSliderHolder_" + id, element);

            if(availableWeight == null)
            {
               availableWeight = 100;
            }
            $("#weightError", element).empty();

            if(Number(availableWeight) < 0)
            {
               $("#weightError", element).append("No weight left.");
            }
            else
            {
               RenderSliderWeightValue(weightValue, objectToRenderTo);
            }
         }
         function RenderSliderWeightValue(value, renderToObject) {
            $(renderToObject).empty();
            let sliderHolder = $("<div class=\"virtual-mentor-slider-holder area-slider\" />");
            let pctValue = parseFloat(value);
            //let backgroundBar = $("<div class=\"virtual-mentor-background-bar empty-bar\" />");
            let completionBar = $("<div class=\"virtual-mentor-filled-bar progress-bar\" />");
            // let tickBar = $("<div class=\"virtual-mentor-tick-bar tick-item\" />");

            completionBar.width(pctValue + "%");
            completionBar.html("");

            //tickBar.html("");

            //sliderHolder.append(backgroundBar);
            sliderHolder.append(completionBar);
            //sliderHolder.append(tickBar);

            $(renderToObject).append(sliderHolder);

         }
         function CalculateRemainingWeight() {
            let remainingWeightValue = 100;
            $("[id^='areaWeight_']", element).each(function () {
               let value = $(this).val();
               remainingWeightValue -= value;
            });
            $("#remainingWeightOption", element).empty();
            let remainingValueFormatted = Number(remainingWeightValue / 100).toLocaleString("en", { style: "percent" });
            $("#remainingWeightOption", element).text(remainingValueFormatted);
            $("#remainingWeight", element).val(remainingWeightValue);            
         }
         function ModifyAreaWeight(id, amountToModify)
         {
            let availableWeight = Number($("#remainingWeight", element).val());
            if(availableWeight == null)
            {
               availableWeight = 100;
            }

            $("#weightError", element).empty();
            
            if((Number(availableWeight) - amountToModify) < 0 || (Number(availableWeight) - amountToModify) > 100)
            {
               $("#weightError", element).append("Weight available Error.");
            }
            else
            {
               let currentAmount = $("#areaWeight_" + id, element).val();
               let newAmount = Number(currentAmount) + Number(amountToModify);
               if(newAmount < 0)
               {
                  newAmount = 0;
               }
               else if (newAmount > 100)
               {
                  newAmount = 100;
               }
               $("#areaWeight_" + id, element).val(newAmount);
            }
            RefreshAllWeightSliders();
         }
         function DoEqualWeightAllocation()
         {
            let areaCount = possibleAreas.length;
            if(areaCount > 0)
            {
               let weightValue = Number(100 / areaCount).toFixed(0);
               $("[id^='areaWeight_'", element).each(function(){
                  $(this).val(weightValue);
               });
            }
            else
            {
               console.error("No areas found to distribute weights over.");
            }
         }
         function ResetWeightForm()
         {
            $("[id^='areaWeight_']", element).each(function(){               
                  $(this).val(0);
            });
         }
         function DoWeightedAllocation(areaToWeight)
         {
            let areaCount = (possibleAreas.length -1);
            let specificAreaWeight = specAreaWeight;
            let remainingWeight = Math.floor((100 -specAreaWeight) / areaCount).toFixed(0);
            $("[id^='areaWeight_']", element).each(function(){
               let calcArea = $(this).attr("calcarea");
               if(calcArea == areaToWeight)
               {
                  $(this).val(specificAreaWeight);
               }
               else
               {
                  $(this).val(remainingWeight);
               }
            });
         }
         function AssignPredefinedWeightAllocation(value) {
            if (value == null) {
               value = "eq";
            }
            switch (value) {
               case "eq":
                  DoEqualWeightAllocation();
                  break;
               case "clear":
                  case "reset":
                     ResetWeightForm();
                     break;
               default:
                  DoWeightedAllocation(value);
                  break;
            }
            RefreshAllWeightSliders();
         }
         function BuildWeightArrayFromForm()
         {
            let returnArray = [];

            $("[id^='areaWeight_']", element).each(function(){               
               let itemId = this.id;
               let areaId = itemId.split("_")[1];
               let value = this.value;
               let areaObject = possibleAreas.find(a => a.VirtualMentorCalculationAreaId == areaId);
               let calcArea = $(this).attr("calcarea");
               let nameValue = areaId;
               if(areaObject != null)
               {
                  nameValue = areaObject.Name;
                  calcArea = areaObject.WeightCalculationArea;
               }
               
               let arrayObject = new Object();
               arrayObject.areaid = areaId;
               arrayObject.name = nameValue;               
               arrayObject.calcarea = calcArea;
               arrayObject.weightvalue = value;

               returnArray.push(arrayObject);
            });            
            return returnArray;
         }
         function RefreshAllWeightSliders()
         {
            $("[id^='areaWeight_']", element).each(function(){
               $(this).change();
            });
         }

         scope.load = function () {
            scope.Initialize();
            HandleScoringList();
            $("[id$='Allocation']", element).off("click").on("click", function(){               
               let itemValue = $(this).val();
               AssignPredefinedWeightAllocation(itemValue);
            });
            $("#generateListButton", element).off("click").on("click", function(){
               let weightArray = BuildWeightArrayFromForm();
               ko.postbox.publish("VirtualMentorLoadWeightedList", weightArray);
            });
            $("#saveConfigurationButton", element).off("click").on("click", function(){
               console.info("saveConfigurationButton clicked...do something.");
               alert("Save not yet implemented.");
            });
         };

         ko.postbox.subscribe("virtualMentorScoringReload", function (forceReload) {
            if (forceReload == true) {
               possibleAreas.length = 0;
            }
            HandleScoringList(forceReload);
         });
         ko.postbox.subscribe("virtualMentorScoringLoad", function () {
            scope.load();
         });
      }
   };
}]);