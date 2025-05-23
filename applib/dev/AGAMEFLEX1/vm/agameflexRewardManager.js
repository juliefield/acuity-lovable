angularApp.directive("ngAgameFlexRewardManager", ['api', '$rootScope', function (api, $rootScope) {
   return {
       templateUrl: a$.debugPrefix() + '/applib/dev/AGAMEFLEX1/view/agameflexRewardManager.htm?' + Date.now(),
       scope: {
           assoc: "@",
           text: "@",
           details: "@",
           cid: "@",
           filters: "@",
           panel: "@",
           hidetopper: "@",
           toppertext: "@",
           includeheader: "@"
       },
       require: '^ngLegacyContainer',
       link: function (scope, element, attrs, legacyContainer) {
           
        function Initialize() {
            scope.ManualRewards = [];

            HideEntryForm();
            scope.HideUserStatus();
            
            LoadManualRewardData();
        };

        scope.ShowUserStatus = function (displayForTiming) {
            var currentDisplayStatus = $(".flex-game-user-status", element).css("display");

            if (displayForTiming == null) {
                displayForTiming = 60000 //1 minute is default for displaying data. 
            }

            if (currentDisplayStatus == "none") {
                $(".flex-game-user-status", element).show();
                window.setTimeout(function () {
                    scope.HideUserStatus();
                }, displayForTiming);
            }
        };
        scope.HideUserStatus = function () {
            var currentDisplayStatus = $(".flex-game-user-status", element).css("display");
            if (currentDisplayStatus != "none") {
                $(".flex-game-user-status", element).hide();
            }
        };
        scope.WriteUserStatus = function (message, displayForTiming, callback) {
            scope.HideUserStatus();
            $(".flex-game-user-status", element).html(message);
            scope.ShowUserStatus(displayForTiming);
            if (callback != null) {
                callback();
            }
        };

        function HideEntryForm() {
            $(".flex-rewards-manager-form-editor-holder", element).hide();
        }
        function ShowEntryFrom() {
            $(".flex-rewards-manager-form-editor-holder", element).show();               
        }
        function LoadManualRewardData()
        {
            scope.WriteUserStatus("Loading Manual Reward options...");
            GetManualRewards(function(){
                RenderManualRewards();
            });   
        }
        function GetManualRewards(callback)
        {
            scope.WriteUserStatus("Getting Manual Reward options...");
            let manualRewardOptions = [];
            a$.ajax({
                type: "POST",
                service: "C#",
                async: true,
                data: {
                    lib: "flex",
                    cmd: "getCurrentManualRewardOptions"
                },
                dataType: "json",
                cache: false,
                error: function (response) {
                    a$.ajaxerror(response);
                },
                success: function (data) {
                    manualRewardOptions = $.parseJSON(data.manualRewardOptions);
                    scope.ManualRewards.length = 0;
                    for(let i = 0; i < manualRewardOptions.length;i++){
                    scope.ManualRewards.push(manualRewardOptions[i]);
                    }
                    if (callback != null) {
                    callback();
                    }
                }
            });
        }
        function RenderManualRewards(dataToDisplay, callback)
        {
            let manualRewardHolder = $("<div class=\"manual-reward-list-holder\" />");
            let manualRewardHeader = $("<div class=\"manual-reward-list-header\" />");

            let manualRewardNameHeader = $("<div class=\"manual-reward-list-header-column manual-reward-list-item-name\" />");
            manualRewardNameHeader.append("Name");
            let manualRewardStatusHeader = $("<div class=\"manual-reward-list-header-column manual-reward-list-item-status\" />");
            manualRewardStatusHeader.append("Status");
            let manualRewardDescHeader = $("<div class=\"manual-reward-list-header-column manual-reward-list-item-desc\" />");
            manualRewardDescHeader.append("Description");
            let manualRewardButtonHeader = $("<div class=\"manual-reward-list-header-column manual-reward-list-item-button-holder\" />");
            manualRewardButtonHeader.append("&nbsp;");
            
            manualRewardHeader.append(manualRewardNameHeader);
            manualRewardHeader.append(manualRewardStatusHeader);
            manualRewardHeader.append(manualRewardDescHeader);
            manualRewardHeader.append(manualRewardButtonHeader);

            if(dataToDisplay == null)
            {
            dataToDisplay = scope.ManualRewards;
            }
            for(let i = 0; i < dataToDisplay.length; i++)
            {
            let item = dataToDisplay[i];       
            let itemHolder = $("<div class=\"manual-reward-list-row-holder\" />");

            let manualRewardNameHolder = $("<div class=\"manual-reward-list-item-name\" />");
            let imageUrl = "/3/ng/AgameFlex/images/prize-images/default.jpg";
            let manualRewardThumbImage = $("<img class=\"RewardThumb\" />");
            if(item.ImageUrl != null && item.ImageUrl != "")
            {
                imageUrl = item.ImageUrl;
            }            
            manualRewardThumbImage.prop("src", imageUrl);            
            manualRewardNameHolder.append(manualRewardThumbImage);
            manualRewardNameHolder.append("<strong>" + item.RewardName + "</strong>");

            let statusHolder = $("<div class=\"manual-reward-list-item-status\"/>");
            let statusName = "Active";
            if(item.IsActive == false)
            {
                statusName = "Inactive";
                statusHolder.addClass("inactive-status");
            }
            statusHolder.append(statusName);
            let manualRewardDescHolder = $("<div class=\"manual-reward-list-item-desc\" />");
            manualRewardDescHolder.append(item.RewardDesc);

            let buttonHolder = $("<div class=\"manual-reward-list-item-button-holder\" />");
            if(item.Client != 0)
            {
                let editButton = $("<button id=\"editManualReward_" + item.Id + "\" class=\"manual-reward-list-item-button\"><i class=\"fa fa-edit\"></i></button>");
                $(editButton, element).off("click").on("click", function(){
                    let buttonId = this.id;
                    let id = buttonId.split('_')[1];                            
                    LoadManualRewardEntryForm(id, function(){
                        ShowEntryFrom();
                    });
                });
                buttonHolder.append(editButton);
            }
            else
            {
                buttonHolder.append("Pre-defined Area (not editable)");
            }

            itemHolder.append(manualRewardNameHolder);            
            itemHolder.append(statusHolder);
            itemHolder.append(manualRewardDescHolder);
            itemHolder.append(buttonHolder);

            manualRewardHolder.append(itemHolder);             
            }

            $(".flex-rewards-manager-list", element).empty();
            $(".flex-rewards-manager-list", element).append(manualRewardHeader);
            $(".flex-rewards-manager-list", element).append(manualRewardHolder);

            scope.HideUserStatus();
            if(callback != null)
            {
                callback();
            }
           }

           function LoadManualRewardEntryForm(id, callback)
           {
               let manualReward = scope.ManualRewards.find(r => r.Id == id);
               if(manualReward != null)
               {
                    $("#flex-rewards-manager-manual-reward-id", element).val(manualReward.ManualRewardId);
                    $(".flex-rewards-manager-manual-reward-edit-name", element).val(manualReward.RewardName);
                    $(".flex-rewards-manager-manual-reward-edit-desc", element).val(manualReward.RewardDesc);
                    $(".flex-rewards-manager-manual-reward-edit-is-active", element).prop("checked",manualReward.IsActive);
               }

               if(callback != null)
               {
                callback();
               }
           }
           function ClearManualRewardsEntryForm(callback)
           {
                $("#flex-rewards-manager-manual-reward-id", element).val("-1");
                $(".flex-rewards-manager-manual-reward-edit-name", element).val("");
                $(".flex-rewards-manager-manual-reward-edit-desc", element).val("");
                $(".flex-rewards-manager-manual-reward-edit-is-active", element).prop("checked",true);
                if(callback != null)
                {
                    callback();
                }
           }
           function SaveManualRewardsEntryForm(callback)
           {
                let manualReward = new Object();
                manualReward.ManualRewardId = $("#flex-rewards-manager-manual-reward-id", element).val();
                manualReward.Client = -1;
                manualReward.RewardName = $(".flex-rewards-manager-manual-reward-edit-name", element).val();
                manualReward.RewardDesc = $(".flex-rewards-manager-manual-reward-edit-desc", element).val();               
                manualReward.IsActive = $(".flex-rewards-manager-manual-reward-edit-is-active", element).is(":checked");   
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "flex",
                        cmd: "saveManualRewardOption",
                        manualreward: JSON.stringify(manualReward)
                    },
                    dataType: "json",
                    cache: false,
                    error: function (response) {
                        a$.ajaxerror(response);
                    },
                    success: function (data) { 
                        let id = data.manualRewardId;
                        ClearManualRewardsEntryForm();
                        if (callback != null) {
                            callback();
                        }
                    }
                });
           }
           scope.load = function () {
               Initialize();
               
               $(".flex-rewards-manager-add-new", element).off("click").on("click", function(){
                ClearManualRewardsEntryForm(function(){
                        ShowEntryFrom();
                  });
               });
               $(".flex-rewards-manager-editor-button-cancel", element).off("click").on("click", function(){
                ClearManualRewardsEntryForm(function(){
                        HideEntryForm();
                  });
               });
               $(".flex-rewards-manager-btn-return-game-list", element).off("click").on("click", function() {                    
                   var prefixInfo = a$.gup("prefix");
                   var hrefLocation = "default.aspx";
                   if (prefixInfo != null && prefixInfo != "") {
                       hrefLocation += "?prefix=" + prefixInfo;
                   }

                   document.location.href = hrefLocation;
               });
               $(".flex-rewards-manager-scoring-area-edit-form-btn-save", element).off("click").on("click", function(){
                    SaveManualRewardsEntryForm(function(){
                        HideEntryForm();
                        LoadManualRewardData();
                    });
               });                
               
               $(".flex-rewards-manager-manual-reward-edit-is-active", element).off("click").on("click", function(){
                   let isActive = $(this).prop("checked");
                   let displayName = "Active";
                   if(!isActive)
                   {
                       displayName = "Inactive";
                   }                   
                   $(".edit-item-status-displayname", element).text(displayName);
               });
           };
           scope.load();
       }

   };
}]);