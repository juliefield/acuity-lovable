angularApp.directive("ngIrpasRosterInformation", [
  "api",
  "$rootScope",
  function (api, $rootScope) {
    return {
      templateUrl:
        a$.debugPrefix() +
        "/applib/dev/IncentivesRewards/view/IrpasRosterInformation.htm?" +
        Date.now(),
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
        let userRewardsToday = [];
        let rosterDataInformation = {
          LastUpdateDate: null,
          TotalPointsToday: 0,
          DollarValuePerPoint: null,
          ProgramStartDate: null,
          AwardToRolesList: null,
        };
        //TODO: Determine how to handle the various ACUITY roles
        //For now we will use a hard coded list...but we could look to moving this into something from the server.
        let availableRoles = [
          {
            id: "Admin",
            text: "Super Duper Admin people",
            status: "I",
            displayOrder: 0,
            roleDescription: "",
          },
          {
            id: "CorpAdmin",
            text: "CorpAdmin",
            status: "A",
            displayOrder: 10,
            roleDescription:
              "Upper level of Acuity Users that can do just about everything.",
          },
          {
            id: "CSR",
            text: "CSR/Agent",
            status: "A",
            displayOrder: 20,
            roleDescription:
              "Agents or CSRS that work the phones and/or chats.",
          },
          {
            id: "Group Leader",
            text: "Group Leaders",
            status: "A",
            displayOrder: 30,
            roleDescription: null,
          },
          {
            id: "Management",
            text: "Management",
            status: "A",
            displayOrder: 40,
            roleDescription: null,
          },
          {
            id: "Quality Assurance",
            text: "Quality Assurance",
            status: "A",
            displayOrder: 50,
            roleDescription: null,
          },
          {
            id: "Team Leader",
            text: "Team Leader",
            status: "A",
            displayOrder: 60,
            roleDescription: null,
          },
        ];
        let canChangeRoleAwardAssignments = false;
        /* Event Handling START */
        $("#btnForceUpdate", element)
          .off("click")
          .on("click", function () {
            DoRosterUpdate(function () {
              LoadRosterInformation(function () {
                console.log("Roster should update the information.");
              }, true);
            });
          });
        $("#btnChangeAwardToRoles", element)
          .off("click")
          .on("click", function () {
            LoadAwardToRolesForm(function () {
              ShowAwardToRolesForm();
            });
          });
        $("#btnSelectAllRolesToAward", element)
          .off("click")
          .on("click", function () {
            MarkAllRolesForAward();
          });
        $("#btnClearAllRolesToAward", element)
          .off("click")
          .on("click", function () {
            ClearAllRolesForAward();
          });
        $(".btn-close", element)
          .off("click")
          .on("click", function () {
            console.log("Change Award To Roles CLOSE button clicked.");
            //clear the form
            HideAwardToRolesForm();
          });
        $("#btnSaveAwardToRolesList", element)
          .off("click")
          .on("click", function () {
            SaveAwardToRolesForm(function () {
              RenderAwardToRolesList();
              window.setTimeout(function(){
                HideAwardToRolesForm();
              }, 500);
            });
          });
        /* Event Handling END */
        scope.Initialize = function () {
          HideAll();
        };
        function SetDatePickers() {}
        /* Data Loading START */
        function LoadDirective() {
          HideAll();
          LoadRosterInformation();
          //if(legacyContainer.scope.TP1Role == "A
          canChangeRoleAwardAssignments = (legacyContainer.scope.TP1Role == "Admin" || legacyContainer.scope.TP1Role == "CorpAdmin");
          
          if(canChangeRoleAwardAssignments == true)
          {
            ShowChangeAwardToRoleButton();
          }
        }
        function LoadRosterInformation(callback, forceReload) {
          GetRosterInformation(function (rosterData) {
            RenderRosterInformation(function () {
              if (callback != null) {
                callback();
              }
            }, rosterData);
          }, forceReload);
        }
        /* Data Loading END */
        /* Data Pulls START */
        function GetRosterInformation(callback, forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          GetRosterLastUploadInfo(null, true);

          if (callback != null) {
            callback();
          }
        }
        function GetRosterLastUploadInfo(callback, forceReload) {
          if (forceReload == null) {
            forceReload = false;
          }
          if (
            rosterDataInformation.LastUpdateDate != null &&
            forceReload == false
          ) {
            if (callback != null) {
              callback();
            }
          } else {
            a$.ajax({
              type: "POST",
              service: "C#",
              async: false,
              data: {
                lib: "selfserv",
                cmd: "getRecentRosterImportDate",
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                let returnData = JSON.parse(data.rosterImportData);
                if (returnData.LastImportDate != null) {
                  rosterDataInformation.LastUpdateDate = new Date(
                    returnData.LastImportDate
                  );
                }
                if (callback != null) {
                  callback(returnData);
                }
              },
            });
          }
        }
        //getIRPASPointsByDay
        /* Data Pulls END */
        /* Data Rendering START */
        function RenderRosterInformation(callback, rosterData) {
          if (rosterData == null) {
            rosterData = rosterDataInformation;
          }
          RenderProgramStartDate();
          RenderDollarValuePerPoint(rosterData);
          RenderRosterLastUpdate(rosterData);
          RenderTotalPointsToday(rosterData);
          RenderDollarValueForToday(rosterData);
          RenderAwardToRolesList();
          RenderAwardToRolesForm();
          if (callback != null) {
            callback();
          }
        }
        function RenderProgramStartDate() {
          $("#lblProgramStartDate", element).empty();
          let startDate = "1/1/2000";
          appLib.getConfigParameterByName(
            "IRPAS_PROGRAM_START_DATE",
            function (parameter) {
              startDate = parameter.ParamValue;
              rosterDataInformation.ProgramStartDate = startDate;
            }
          );
          if (
            rosterDataInformation.ProgramStartDate == null ||
            rosterDataInformation.ProgramStartDate == ""
          ) {
            rosterDataInformation.ProgramStartDate = startDate;
          }
          $("#lblProgramStartDate", element).append(
            new Date(startDate).toLocaleDateString()
          );
        }
        function RenderRosterLastUpdate(rosterData) {
          if (rosterData == null) {
            rosterData = rosterDataInformation;
          }
          if (
            rosterData.LastUpdateDate != null &&
            rosterData.LastUpdateDate != ""
          ) {
            $("#lblRosterLastUpdatedDate", element).empty();
            let rosterUpdateDateTime = `${new Date(
              rosterData.LastUpdateDate
            ).toLocaleDateString()} @ ${new Date(
              rosterData.LastUpdateDate
            ).toLocaleTimeString()}`;
            $("#lblRosterLastUpdatedDate", element).append(
              rosterUpdateDateTime
            );
          }
        }
        function RenderTotalPointsToday(rosterData) {
          if (rosterData == null) {
            rosterData = rosterDataInformation;
          }
          if (
            rosterData.TotalPointsToday != null &&
            rosterData.TotalPointsToday != ""
          ) {
            $("#lblTotalPointsAwardedToday", element).empty();
            $("#lblTotalPointsAwardedToday", element).append(
              rosterData.TotalPointsToday
            );
          }
        }
        function RenderDollarValueForToday(rosterData) {
          if (rosterData == null) {
            rosterData = rosterDataInformation;
          }
          if (
            rosterData.DollarValuePerPoint != null &&
            rosterData.DollarValuePerPoint != ""
          ) {
            $("#lblTotalDollarValueToday", element).empty();
            let dollarValue = rosterData.DollarValuePerPoint || 0;
            let totalDollarValue = rosterData.TotalPointsToday * dollarValue;

            $("#lblTotalDollarValueToday", element).append(
              totalDollarValue.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            );
          }
        }
        function RenderDollarValuePerPoint(rosterData) {
          if (rosterData == null) {
            rosterData = rosterDataInformation;
          }
          let value = rosterData.DollarValuePerPoint || 0;
          $("#lblDollarValuePerPoint", element).empty();
          $("#lblDollarValuePerPoint", element).append(
            value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })
          );
        }
        function RenderAwardToRolesList() {
          let awardToRolesList = "--";
          $("#lblAwardToRolesList", element).empty();
          appLib.getConfigParameterByName(
            "IRPAS_AWARD_POINTS_ROLES",
            function (parameter) {
              awardToRolesList = parameter.ParamValue;
              rosterDataInformation.AwardToRolesList = awardToRolesList;
            }
          );
          if (
            rosterDataInformation.AwardToRolesList == null ||
            rosterDataInformation.AwardToRolesList == "" ||
            rosterDataInformation.AwardToRolesList == "--"
          ) {
            rosterDataInformation.AwardToRolesList = awardToRolesList;
          }
          $("#lblAwardToRolesList", element).append(awardToRolesList);
        }
        function RenderAwardToRolesForm(callback) {
          $("#availableRolesToAwardPointToList", element).empty();
          $("#availableRolesDescriptionNotes", element).empty();
          availableRoles.forEach(function (roleInfoObject) {
            if (roleInfoObject.status == "A") {
              let roleSelectionHolder = $(
                `<div class="award-to-role-option-holder" />`
              );
              let roleSelectCheckbox = $(
                `<input type="checkbox" name="awardPointsToRoleInput" value="${roleInfoObject.id}"> ${roleInfoObject.text}`
              );
              let roleSelectNameHolder = $(`<div class="award-to-role-name-holder" />`);
              let roleSelectName = roleInfoObject.text;

              roleSelectNameHolder.append(roleSelectName);

              roleSelectNameHolder.on("click", function(){
                let closeCheckbox = $(this).closest("div").parent().find("[type=checkbox]");
                let isClosestChecked = $(closeCheckbox).is(":checked");
                closeCheckbox.prop("checked",!isClosestChecked);
                closeCheckbox.attr("checked",!isClosestChecked);
              });

              roleSelectionHolder.append(roleSelectCheckbox);
              roleSelectionHolder.append(roleSelectNameHolder);

              $("#availableRolesToAwardPointToList", element).append(
                roleSelectionHolder
              );

              if (
                roleInfoObject.roleDescription != null &&
                roleInfoObject.roleDescription != ""
              ) {
                let roleDescHolder = $(
                  `<div class="award-to-role-description-holder" />`
                );
                let roleNameHolder = $(
                  `<div class="award-to-role-desc-name-holder atr-desc-name" />`
                );
                roleNameHolder.append(`${roleInfoObject.text}: `);
                let roleDescTextHolder = $(
                  `<div class="award-to-role-desc-text-holder atr-desc-text" />`
                );
                roleDescTextHolder.append(`${roleInfoObject.roleDescription}`);
                roleDescHolder.append(roleNameHolder);
                roleDescHolder.append(roleDescTextHolder);

                $("#availableRolesDescriptionNotes", element).append(
                  roleDescHolder
                );
              }
            }
          });
          if (callback != null) {
            callback();
          }
        }
        /* Data Rendering END */
        /* Editor Loading START */
        function LoadAwardToRolesForm(callback) {
          let currentAssignment = rosterDataInformation.AwardToRolesList;
          if (
            currentAssignment.toLocaleLowerCase() == "All".toLocaleLowerCase()
          ) {
            $("[name='awardPointsToRoleInput']", element).each(function () {
              $(this).prop("checked", true);
              $(this).attr("checked", true);
            });
          } else {
            let currentAssignmentArray = currentAssignment.split(",");
            currentAssignmentArray.forEach(function (roleValue) {
              $(
                "input:checkbox[name='awardPointsToRoleInput'][value='" +
                  roleValue.trim() +
                  "']",
                element
              ).attr("checked", true);
            });
          }
          if (callback != null) {
            callback();
          }
        }
        function SaveAwardToRolesForm(callback) {
          ValidateAwardToRolesForm(function () {
            let rolesArray = [];
            $("[name='awardPointsToRoleInput']", element).each(function () {
              if ($(this).is(":checked") == true) {
                rolesArray.push($(this).prop("value"));
              }
            });

            let possibleRolesCount = availableRoles.filter(i => i.status == "A").length;
            if(possibleRolesCount > 0 && rolesArray.length > 0 && rolesArray.length == possibleRolesCount)
            {
              rolesArray.length = 0;
              rolesArray.push("All");
            }
            if(rolesArray.length == 0)
            {
              rolesArray.push("None");
            }
            a$.ajax({
              type: "POST",
              service: "C#",
              async: false,
              data: {
                lib: "selfserve",
                cmd: "updateConfigParameterValueByName",
                parameterName: "IRPAS_AWARD_POINTS_ROLES",
                newValue: rolesArray.join(","),
              },
              dataType: "json",
              cache: false,
              error: a$.ajaxerror,
              success: function (data) {
                if (data.errormessage != null && data.errormessage == "true") {
                  a$.jsonerror(data);
                  return;
                } else {
                  rosterDataInformation.AwardToRolesList = null;
                  if (callback != null) {
                    callback(data);
                  }
                }
              },
            });
          });
        }
        /* Editor Loading END */
        /* Editor Validation & Saving START */
        function ValidateAwardToRolesForm(callback) {
          let isValid = true;
          console.log("ValidateAwardToRolesForm(callback)");
          if (isValid == true) {
            if (callback != null) {
              callback();
            }
          } else {
            alert("Errors found in form.");
          }
        }
        /* Editor Validation & Saving END */
        /* Sorting Options START */
        /* Sorting Options END */
        /* Utility Functions START */
        function FindAndSetRewards_Today(callback, data) {
          userRewardsToday.length = 0;
          userRewardsToday = data.find(
            (i) =>
              new Date(i.AwardDate).toLocaleDateString() ==
                new Date().toLocaleDateString() &&
              i.RecordType?.toLowerCase() == "Awarded".toLowerCase()
          );
          rosterDataInformation.TotalPointsToday = 0;
          if (userRewardsToday != null) {
            rosterDataInformation.TotalPointsToday =
              userRewardsToday.TotalPoints;
          }
          if (callback != null) {
            callback();
          }
        }
        function DoRosterUpdate(callback) {
          a$.ajax({
            type: "POST",
            service: "C#",
            async: false,
            data: {
              lib: "selfserv",
              cmd: "doIrpasUserAwardProcessing",
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: function (data) {
              if (callback != null) {
                callback(returnData);
              }
            },
          });
        }
        function MarkAllRolesForAward() {
          $("[name='awardPointsToRoleInput']", element).each(function () {
            $(this).prop("checked", true);
            $(this).attr("checked", true);
          });
        }
        function ClearAllRolesForAward() {
          $("[name='awardPointsToRoleInput']", element).each(function () {
            $(this).prop("checked", false);
            $(this).attr("checked", false);
          });
        }
        /* Utility Functions END */
        /* Show/Hide START */
        function HideAll() {
          HideAwardToRolesForm();
          HideChangeAwardToRoleButton();
        }
        function HideAwardToRolesForm() {
          $("#awardToRolesFormHolder", element).hide();
        }
        function ShowAwardToRolesForm() {
          $("#awardToRolesFormHolder", element).show();
        }
        function HideChangeAwardToRoleButton() {
          $("#btnChangeAwardToRoles", element).hide();
        }
        function ShowChangeAwardToRoleButton() {
          $("#btnChangeAwardToRoles", element).show();
        }
        /* Show/Hide END */

        scope.load = function () {
          scope.Initialize();
          LoadDirective();
        };

        ko.postbox.subscribe("IRPASManagementInit", function (data) {
          scope.Initialize();
        });
        ko.postbox.subscribe("IRPASManagementLoad", function (data) {
          //scope.load();
          LoadDirective();
        });
        ko.postbox.subscribe("IRPASManagementUserDataLoaded", function () {
          //TODO: Determine if there is anything here we need to handle.
        });
        ko.postbox.subscribe("IRPASRewardsToday", function (data) {
          if (data != null) {
            FindAndSetRewards_Today(null, data);
            RenderTotalPointsToday();
            RenderDollarValueForToday();
          }
        });
        ko.postbox.subscribe(
          "IRPASProgramSummaryDataLoad",
          function (summaryData) {
            if (summaryData != null) {
              rosterDataInformation.DollarValuePerPoint =
                summaryData.DollarPerPointValue;
            }
            RenderDollarValuePerPoint();
            RenderDollarValueForToday();
          }
        );
      },
    };
  },
]);
