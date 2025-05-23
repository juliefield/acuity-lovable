angularApp.directive("ngConfigParamManager", ['api', '$rootScope', function (api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/ACUITYADMIN1/view/configParameterManager.htm?' + Date.now(),
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
            var configParameters = [];
            var dataLoaded = false;
            scope.Initialize = function () {
                HideAll();
                LoadCurrentConfigParameters();
            };

            function LoadCurrentConfigParameters(callback) {
                let forceReload = (configParameters.length == 0);
                appLib.getConfigParameters(forceReload, function (parameterList) {
                    dataLoaded = true;
                    configParameters = parameterList;
                    if (callback != null) {
                        callback(parameterList);
                    }
                });
            }

            function LoadConfigParameters(callback) {
                if (configParameters != null && configParameters.length > 0) {
                    RenderCurrentConfigParameters(null, callback);
                }
                else {
                    LoadCurrentConfigParameters(function (itemsToRender) {
                        RenderCurrentConfigParameters(itemsToRender, callback);
                    });
                }
            }
            function RenderCurrentConfigParameters(listToRender, callback) {
                let listToFilter = listToRender;
                if (listToFilter == null) {
                    listToFilter = configParameters;
                }
                let filteredList = ApplyFilters(listToFilter);
                listToRender = SortParameterList(filteredList)

                let configParameterListingHolder = $("<div class=\"config-listing-holder\" />");

                if (listToRender != null && listToRender.length > 0) {
                    for (let pc = 0; pc < listToRender.length; pc++) {
                        let configItem = listToRender[pc];
                        let isSystemValue = configItem.IsSystemValue || false;

                        let configParamRowHolder = $("<div class=\"config-parameter-display-list-item-holder\" />");
                        if (isSystemValue == true) {
                            configParamRowHolder.addClass("is-system-value-item");
                        }

                        let configParameterNameHolder = $("<div class=\"config-parameter-item-holder\" />");
                        configParameterNameHolder.append("<strong>Name:</strong> ");
                        configParameterNameHolder.append(configItem.ParamName);

                        let configParameterValueHolder = $("<div class=\"config-parameter-item-holder\" />");
                        configParameterValueHolder.append("<strong>Value:</strong> ");
                        configParameterValueHolder.append(configItem.ParamValue);

                        let configParameterDescHolder = $("<div class=\"config-parameter-item-holder\" />");
                        configParameterDescHolder.append("<strong>Description:</strong> ");
                        configParameterDescHolder.append(configItem.Description);

                        let configParameterValidationHolder = $("<div class=\"config-parameter-item-holder\" />");
                        let expressionValue = configItem.RegularExpressionForValidation + "&nbsp;";
                        configParameterValidationHolder.append("<strong>Validation Expression:</strong> ");
                        configParameterValidationHolder.append(expressionValue);

                        let configButtonHolder = $("<div class=\"config-parameter-button-holder\" />");
                        let editButton = $("<button class=\"\" id=\"editConfigParam_" + configItem.ConfigParameterId + "\"><i class=\"fa fa-edit\"></i> Edit Configuration</button>");
                        editButton.on("click", function () {
                            let id = this.id;
                            let configId = id.split("_")[1];
                            LoadEditorForm(configId, function () {
                                ShowEditorForm();
                            });
                        });
                        if (isSystemValue == false) {
                            configButtonHolder.append(editButton);
                        }


                        configParamRowHolder.append(configParameterNameHolder);
                        configParamRowHolder.append(configParameterValueHolder);
                        configParamRowHolder.append(configParameterDescHolder);
                        configParamRowHolder.append(configParameterValidationHolder);
                        configParamRowHolder.append(configButtonHolder);

                        configParameterListingHolder.append(configParamRowHolder);
                    }
                }
                else {
                    configParameterListingHolder.append("No Config Parameters found.");
                }
                $("#configParametersList", element).empty();
                $("#configParametersList", element).append(configParameterListingHolder);

                if (callback != null) {
                    callback();
                }
            }
            function LoadEditorForm(idToLoad, callback) {
                if (idToLoad > 0) {
                    let configItem = configParameters.find(id => id.ConfigParameterId == idToLoad);

                    if (configItem != null) {
                        $("#configEditor_Id", element).val(idToLoad);
                        $("#configEditor_ParamName", element).val(configItem.ParamName);
                        $("#configEditor_ParamValue", element).val(configItem.ParamValue);
                        $("#configEditor_RegEx", element).val(configItem.RegularExpressionForValidation);
                        $("#configEditor_Desc", element).val(configItem.Description);
                    }
                }

                if (callback != null) {
                    callback();
                }
            }
            function SaveConfigParameter(objectToSave, callback) {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "selfserve",
                        cmd: "saveConfigParameter",
                        configparameter: JSON.stringify(objectToSave)
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function (data) {
                        if (data.errormessage != null && data.errormessage == "true") {
                            a$.jsonerror(data);
                            return;
                        }
                        else {

                            configParameters.length = 0;

                            if (callback != null) {
                                callback(data);
                            }
                        }
                    }
                });
            }
            function ValidateEditorForm(callback) {
                var formValid = true;
                var errorMessages = [];
                var paramId = $("#configEditor_Id", element).val();
                var paramName = $("#configEditor_ParamName", element).val();
                var paramValue = $("#configEditor_ParamValue", element).val();
                var paramValidation = $("#configEditor_RegEx", element).val();

                if (paramName == null || paramName == "") {
                    errorMessages.push({ message: "Name Required", fieldclass: "", fieldid: "configEditor_ParamName" });
                    formValid = false;
                }
                else {
                    if (parseInt(paramId) <= 0) {
                        let nameExistItem = configParameters.find(p => p.ParamName.toUpperCase() == paramName.toUpperCase());
                        if (nameExistItem != null) {
                            errorMessages.push({ message: "Parameter Names must be unique.", fieldclass: "", fieldid: "configEditor_ParamName" });
                            formValid = false;
                        }
                    }
                }
                if (paramValue == null || paramValue == "") {
                    errorMessages.push({ message: "Value Required", fieldclass: "", fieldid: "configEditor_ParamValue" });
                    formValid = false;
                }
                else {
                    if (paramValidation != null && paramValidation != "") {
                        let regEx = new RegExp(paramValidation);
                        if (!regEx.test(paramValue)) {
                            errorMessages.push({ message: "Value does not conform to validation expression.", fieldclass: "", fieldid: "configEditor_ParamValue" });
                            formValid = false;
                        }
                    }
                }

                if (formValid) {
                    if (callback != null) {
                        callback();
                    }
                } else {
                    var messageString = "";
                    if (errorMessages.length > 0) {
                        messageString += "<i class=\"fas fa-exclamation-triangle\"></i> <strong>Correct the following errors:</strong> <ul>";
                    }
                    for (var m = 0; m < errorMessages.length; m++) {
                        let item = errorMessages[m];

                        messageString += "<li>" + item.message + "</li>";
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
                    if (messageString != "") {
                        messageString += "</ul>";

                        $(".error-information-holder", element).html(messageString);
                        $(".error-information-holder", element).show();
                    }
                }
            }
            function SaveEditorForm(callback) {
                let configToSave = CollectFormDataForParameter();
                SaveConfigParameter(configToSave, function () {
                    LoadConfigParameters();
                    HideEditorForm();
                });
                if (callback != null) {
                    callback();
                }

            }
            function ClearEditorForm(callback) {
                $("#configEditor_Id", element).val(-1);
                $("#configEditor_ParamName", element).val("");
                $("#configEditor_ParamValue", element).val("");
                $("#configEditor_RegEx", element).val("");
                $("#configEditor_Desc", element).val("");

                $(".error-information-holder", element).empty();
                $(".error-information-holder", element).hide();
                $(".errorField", element).each(function () {
                    $(this).removeClass("errorField");
                });

                if (callback != null) {
                    callback();
                }
            }
            function CollectFormDataForParameter() {
                let returnObject = new Object();
                returnObject.ConfigParameterId = $("#configEditor_Id", element).val();
                returnObject.ParamName = $("#configEditor_ParamName", element).val();
                returnObject.ParamValue = $("#configEditor_ParamValue", element).val();
                returnObject.Description = $("#configEditor_Desc", element).val();
                returnObject.RegularExpressionForValidation = $("#configEditor_RegEx", element).val();
                returnObject.IsSystemValue = false;
                returnObject.CreatedBy = legacyContainer.scope.TP1Username;
                returnObject.CreatedOn = new Date().toLocaleDateString();
                returnObject.UpdatedBy = legacyContainer.scope.TP1Username;
                returnObject.UpdatedOn = new Date().toLocaleDateString();

                return returnObject;
            }
            function ClearFilters(callback) {
                $("#configManager_nameFilter", element).val("");
                if (callback != null) {
                    callback();
                }
            }
            function ApplyFilters(listToFilter) {
                let paramNameFilter = $("#configManager_nameFilter", element).val() || "";
                let filteredList = listToFilter;

                if (paramNameFilter != "") {
                    filteredList = filteredList.filter(p => p.ParamName.toUpperCase().includes(paramNameFilter.toUpperCase()));
                }

                return filteredList;
            }
            function SortParameterList(listToSort, fieldToSort) {
                let sortedList = listToSort;
                switch (fieldToSort?.toLowerCase()) {
                    case "system":
                        sortedList = sortedList.sort((a, b) => a.IsSystemValue > b.IsSystemValue ? -1 : 0);
                        break;
                    case "name":
                        sortedList = sortedList.sort((a, b) => a.ParamName > b.ParamName ? 1 : -1);
                        break;
                    default:
                        sortedList = sortedList.sort((a, b) => a.ParamName > b.ParamName ? 1 : -1);
                        break;
                }

                return sortedList;
            }
            function HideAll() {
                HideEditorForm();
            }
            function HideConfigLoadingMessage() {
                $("#configManagerLoadingHolder", element).hide();
            }
            function ShowConfigLoadingMessage() {
                $("#configManagerLoadingHolder", element).show();
            }
            function ShowEditorForm() {
                $("#configParameterFormPanel", element).show();
            }
            function HideEditorForm() {
                $("#configParameterFormPanel", element).hide();
            }

            scope.load = function () {
                scope.Initialize();
                LoadConfigParameters();
                $("#configManager_nameFilter", element).off("blur").on("blur", function () {
                    ShowConfigLoadingMessage();
                    LoadConfigParameters(function () {
                        HideConfigLoadingMessage();
                    });
                });

                $("#configmanager_clearFilter", element).off("click").on("click", function () {
                    ClearFilters(function () {
                        LoadConfigParameters(function () {
                            HideConfigLoadingMessage();
                        })
                    });
                });

                $(".btn-close", element).off("click").on("click", function () {
                    ClearEditorForm(function () {
                        HideEditorForm();
                        ko.postbox.publish("configManagerReload", false);
                    });
                });

                $("#btnSaveConfigParameter", element).off("click").on("click", function () {
                    ValidateEditorForm(function () {
                        SaveEditorForm(function () {
                            ClearEditorForm();
                            HideEditorForm();
                            ko.postbox.publish("configManagerReload", true);
                        });
                    });
                });
                $("#btnAddNewParameter", element).off("click").on("click", function () {
                    ClearEditorForm(function () {
                        ShowEditorForm();
                    });
                });
                HideConfigLoadingMessage();
            };

            ko.postbox.subscribe("configManagerReload", function (requireReload) {
                if (requireReload == true) {
                    configParameters.length = 0;
                }
                window.setTimeout(function () {
                    LoadConfigParameters();
                }, 500);
            });
            ko.postbox.subscribe("configManagerLoad", function () {
                scope.load();
            });
        }
    };
}]);