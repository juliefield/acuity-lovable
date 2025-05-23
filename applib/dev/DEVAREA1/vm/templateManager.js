angularApp.directive("ngTemplateManager", ['api', '$rootScope', function(api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/DEVAREA1/view/templateManager.htm?' + Date.now(),
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
        link: function(scope, element, attrs, legacyContainer) {
    
            scope.Initialize = function() {
                scope.TemplateFieldList = [];
                scope.DeliveryTypeList = [];
                scope.UserMessageTypes = [];
                scope.CurrentDatabaseTables = [];
                scope.CurrentDatabaseColumns = [];
                scope.AvailableTemplates = [];

                HideAll()
                SetDatePickers();

                LoadTemplateFieldsList();
                LoadAvailableDataTablesList();
                LoadAllAvailableTemplates();
                LoadOptionsList("ALL");
            };
            
            function HideAll()
            {
                HideTemplateFieldEditor();
                HideTemplateEditor();
                HideDeliveryTypesEditor();
                HideUserMessageTypesEditor();
                HideAddNewItemButton();
                
            }
            function SetDatePickers()
            {

            }
            function SetListDescriptionInformation(stringToDisplay, callback)
            {
                $(".template-manager-list-type-desc-holder", element).empty();

                $(".template-manager-list-type-desc-holder", element).append(stringToDisplay);
                if (callback != null)
                {
                    callback();
                }
            }
            function LoadAvailableDataTablesList()
            {
                scope.CurrentDatabaseTables.length = 0;
                //TODO: (cdj): Get the tables we can map fields to list here.
                scope.CurrentDatabaseTables.push({value:"USR", name:"User"});
                scope.CurrentDatabaseTables.push({value:"TEAM", name:"Team"});
                scope.CurrentDatabaseTables.push({value:"GRP", name:"Group"});
            }
            function LoadAvailableDatabaseColumnsForTable(tableName)
            {
                scope.CurrentDatabaseColumns.length = 0;
                //TODO: (cdj): Get the columns for the table listed                
                tableName = tableName.toLowerCase();
                if(tableName == "usr")
                {
                    scope.CurrentDatabaseColumns.push({value:"user_id", name:"User Id"});
                    scope.CurrentDatabaseColumns.push({value:"FIRSTNM", name:"First Name"});
                    scope.CurrentDatabaseColumns.push({value:"LASTNM", name:"Last Name"});
                    scope.CurrentDatabaseColumns.push({value:"FIRSTNM_LASTNM", name:"Full Name"});                    
                }
                else if(tableName == "team")
                {
                    scope.CurrentDatabaseColumns.push({value:"Team_id", name:"Team Id"});
                    scope.CurrentDatabaseColumns.push({value:"Team_Name", name:"Team Name"});
                }
            }
            function LoadOptionsList(typeToLoad, callback)
            {
                let loadAll = (typeToLoad == null || typeToLoad.toLowerCase() == "all");

                if(typeToLoad == "dbtables" || loadAll)
                {
                    $(".template-manager-editor-database-table-value", element).empty();
                    let emptyOption = $("<option />");
                    $(".template-manager-editor-database-table-value", element).append(emptyOption);

                    for(let i = 0; i < scope.CurrentDatabaseTables.length; i++)
                    {
                        let item = scope.CurrentDatabaseTables[i];
                        let option = $("<option />");
                        option.attr("value", item.value.toLowerCase());
                        option.text(item.name);

                        $(".template-manager-editor-database-table-value", element).append(option);
                    }
                }
                if(typeToLoad == "dbcolumns" || loadAll)
                {
                    $(".template-manager-editor-database-column-value", element).empty();
                    let emptyOption = $("<option />");
                    $(".template-manager-editor-database-column-value", element).append(emptyOption);

                    for(let i = 0; i < scope.CurrentDatabaseColumns.length; i++)
                    {
                        let item = scope.CurrentDatabaseColumns[i];
                        let option = $("<option />");
                        option.attr("value", item.value.toLowerCase());
                        option.text(item.name);

                        $(".template-manager-editor-database-column-value", element).append(option);
                    }
                }
                if(callback != null)
                {
                    callback();
                }
            }
            function LoadTemplateFieldsList(callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "selfserve",
                        cmd: "getTemplateFieldList"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        var templateFieldList = $.parseJSON(data.templateFieldsList);
                        scope.TemplateFieldList.length = 0;
                        if (templateFieldList != null) {
                            for (var i = 0; i < templateFieldList.length; i++) {
                                scope.TemplateFieldList.push(templateFieldList[i]);
                            }
                        }
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });
            }
            function LoadDeliveryTypeList(callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getDeliveryTypeList"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        var deliveryTypeList = $.parseJSON(data.deliveryTypeList);
                        
                        scope.DeliveryTypeList.length = 0;
                        if (deliveryTypeList != null) {
                            for (var i = 0; i < deliveryTypeList.length; i++) {
                                scope.DeliveryTypeList.push(deliveryTypeList[i]);
                            }
                        }
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });
            }
            function LoadAllAvailableTemplates(callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getUserMessageTemplateList"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        var templateList = $.parseJSON(data.userMessageTemplateList);
                        scope.AvailableTemplates.length = 0;
                        if (templateList != null) {
                            for (var i = 0; i < templateList.length; i++) {
                                scope.AvailableTemplates.push(templateList[i]);
                            }
                        }
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });
            }
            function LoadUserMessageTypeList(callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getUserMessageTypeList"
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        var userMessageTypeList = $.parseJSON(data.userMessageTypeList);
                        scope.UserMessageTypes.length = 0;
                        if (userMessageTypeList != null) {
                            for (var i = 0; i < userMessageTypeList.length; i++) {
                                scope.UserMessageTypes.push(userMessageTypeList[i]);
                            }
                        }
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });
            }
            function HideAddNewItemButton()
            {
                $("#addNewItem", element).hide();
            }
            function ShowAddNewItemButton(textValue)
            {
                if(textValue != null && textValue != "")
                {   
                }
                $("#addNewItem", element).show();
            }
            function HideTemplateFieldEditor()
            {
                $(".template-manager-template-field-editor-holder", element).hide();
            }
            function ShowTemplateFieldEditor()
            {
                $(".template-manager-template-field-editor-holder", element).show();
            }
            function HideDeliveryTypesEditor()
            {
                $(".template-manager-delivery-type-editor-holder", element).hide();
            }
            function ShowDeliveryTypesEditor()
            {
                $(".template-manager-delivery-type-editor-holder", element).show();
            }
            function HideUserMessageTypesEditor()
            {
                $(".template-manager-user-message-type-editor-holder", element).hide();
            }
            function ShowUserMessageTypesEditor()
            {
                $(".template-manager-user-message-type-editor-holder", element).show();
            }
            function HideTemplateEditor()
            {
                $(".template-manager-user-message-template-editor-holder", element).hide();
            }
            function ShowTemplateEditor()
            {
                $(".template-manager-user-message-template-editor-holder", element).show();
            }
            function LoadTemplateFieldList(callback)
            {
                if(scope.TemplateFieldList.length == 0)
                {
                    LoadTemplateFieldsList();
                }
                SetListDescriptionInformation("Template Fields listed below are what will be used to assign information");
                DisplayTemplateFieldList(callback);                
            }
            function DisplayTemplateFieldListHeader()
            {
                $(".template-manager-list-holder-header", element).empty();
                let templateListHeader = $("<div />");
                let templateListHeaderRow = $("<div class=\"template-manager-list-holder-row-header\" />");

                let templateFieldKeyHeader = $("<div class=\"data-list-header-item template-field-field-key\" />");
                templateFieldKeyHeader.append("Field Key");

                let templateFieldNameHeader = $("<div class=\"data-list-header-item template-field-field-name\" />");
                templateFieldNameHeader.append("Field Name");

                let templateFieldDefaultValueHeader = $("<div class=\"data-list-header-item template-field-default-value\" />");
                templateFieldDefaultValueHeader.append("Default Value");
                let templateFieldTableNameHeader = $("<div class=\"data-list-header-item template-field-table-name\" />");
                templateFieldTableNameHeader.append("Table");
                let templateFieldTableColumnHeader = $("<div class=\"data-list-header-item template-field-table-column\" />");
                templateFieldTableColumnHeader.append("Column");
                let templateFieldReferenceCountHeader = $("<div class=\"data-list-header-item template-field-reference-count\" />");
                templateFieldReferenceCountHeader.append("Ref. #");

                let templateFieldButtonHolderHeader = $("<div class=\"data-list-header-item template-field-button-holder\" />");
                templateFieldButtonHolderHeader.append("&nbsp;");

                templateListHeaderRow.append(templateFieldKeyHeader);
                templateListHeaderRow.append(templateFieldNameHeader);
                templateListHeaderRow.append(templateFieldTableNameHeader);
                templateListHeaderRow.append(templateFieldTableColumnHeader);
                templateListHeaderRow.append(templateFieldReferenceCountHeader);
                templateListHeaderRow.append(templateFieldDefaultValueHeader);
                templateListHeaderRow.append(templateFieldButtonHolderHeader);

                templateListHeader.append(templateListHeaderRow);
                $("#addNewItem", element).text("Add New Template Field");
                ShowAddNewItemButton();
                $("#addNewItem", element).off("click").on("click", function(){
                    ClearTemplateFieldEditor(function(){
                        ShowTemplateFieldEditor();
                    });
                });

                $(".template-manager-list-holder-header", element).append(templateListHeader);

            } 
            function DisplayTemplateFieldList(callback)
            {
                DisplayTemplateFieldListHeader();
                $(".template-manager-list-holder-body", element).empty();
                let templateListHolder = $("<div />");
                let filteredFieldList = scope.TemplateFieldList;
                for(let i = 0; i < filteredFieldList.length; i++)
                {
                    let item = filteredFieldList[i];

                    let templateListRow = $("<div class=\"template-manager-list-holder-row-data\" />");

                    let templateFieldKey = $("<div class=\"data-list-item template-field-field-key\" />");
                    templateFieldKey.append(item.TemplateFieldKey);

                    let templateFieldName = $("<div class=\"data-list-item template-field-field-name\" />");
                    templateFieldName.append(item.TemplateFieldName);

                    let templateFieldDefaultValue = $("<div class=\"data-list-item template-field-default-value\" />");
                    let defaultValue = item.DefaultValue || "&nbsp;";
                    templateFieldDefaultValue.append(defaultValue);


                    let templateFieldTableName = $("<div class=\"data-list-item template-field-table-name\" />");
                    let tableName = item.TableName || "&nbsp;";
                    templateFieldTableName.append(tableName);

                    let templateFieldTableColumn = $("<div class=\"data-list-item template-field-table-column\" />");
                    let tableColumn = item.TableColumn || "&nbsp;";
                    templateFieldTableColumn.append(tableColumn);
                    let templateFieldReferenceCount = $("<div class=\"data-list-item template-field-reference-count\" />");
                    let referenceCount = item.UsageCount;
                    templateFieldReferenceCount.append(referenceCount);

                    let templateFieldButtonHolder = $("<div class=\"data-list-item template-field-button-holder\" />");
                    let editButton = $("<button id=\"editTemplateField_" + i + "\" value=\"" + item.TemplateFieldKey + "\"><i class=\"fas fa-edit\"></i></button>");
                    $(editButton).off("click").on("click", function(){
                        let keyValue = this.value;                        
                        LoadTemplateFieldEditor(keyValue, function(){
                            ShowTemplateFieldEditor();
                        });
                    });
                    let deleteButton = $("<button id=\"deleteTemplateField_" + i + "\" value=\"" + item.TemplateFieldKey + "\"><i class=\"fas fa-trash\"></i></button>");
                    $(deleteButton).off("click").on("click", function(){
                        let keyValue = this.value;                        
                        let itemName = item.TemplateFieldName;
                        if(confirm("Are you sure you wish to delete " +  itemName + "?"))
                        {
                            DeleteTemplateField(keyValue, function(){
                                LoadTemplateFieldsList(function(){
                                    LoadTemplateFieldList();
                                });
                            });
                        }
                    });
                    
                    templateFieldButtonHolder.append(editButton);
                    if(referenceCount == 0)
                    {
                        templateFieldButtonHolder.append("&nbsp;");
                        templateFieldButtonHolder.append(deleteButton);
                    }
                    

                    templateListRow.append(templateFieldKey);
                    templateListRow.append(templateFieldName);
                    templateListRow.append(templateFieldTableName);
                    templateListRow.append(templateFieldTableColumn);
                    templateListRow.append(templateFieldReferenceCount);
                    templateListRow.append(templateFieldDefaultValue);
                    templateListRow.append(templateFieldButtonHolder);

                    templateListHolder.append(templateListRow);
                }
                $(".template-manager-list-holder-body", element).append(templateListHolder);
                if(callback != null)
                {
                    callback();
                }
            }
            function HandleDatabaseTableMappingChange(value)
            {
                if(value == null)
                {
                    value = $(".template-manager-editor-database-table-value", element).val() || "";
                }
                if(value != "")
                {
                    LoadAvailableDatabaseColumnsForTable(value);
                    LoadOptionsList("dbcolumns");
                }
            }
            function LoadDeliveryList(callback)
            {
                if(scope.DeliveryTypeList.length == 0)
                {
                    LoadDeliveryTypeList();
                }
                SetListDescriptionInformation("Current list of available delivery types.");
                DisplayDeliveryTypeListHeader();
                DisplayDeliveryTypeList();
            }
            function DisplayDeliveryTypeListHeader()
            {
                $(".template-manager-list-holder-header", element).empty();
                let deliveryTypeListHeader = $("<div />");
                
                let deliveryTypeHeaderRow = $("<div class=\"delivery-type-manager-list-holder-row-header\" />");

                let deliveryTypeNameHeader = $("<div class=\"data-list-header-item delivery-type-name\" />");
                deliveryTypeNameHeader.append("Name");

                let deliveryTypeDescHeader = $("<div class=\"data-list-header-item delivery-type-desc\" />");
                deliveryTypeDescHeader.append("Desc");

                let deliveryTypeButtonHolderHeader = $("<div class=\"data-list-header-item delivery-type-button-holder \" />");
                deliveryTypeButtonHolderHeader.append("&nbsp;");

                deliveryTypeHeaderRow.append(deliveryTypeNameHeader);
                deliveryTypeHeaderRow.append(deliveryTypeDescHeader);
                deliveryTypeHeaderRow.append(deliveryTypeButtonHolderHeader);

                deliveryTypeListHeader.append(deliveryTypeHeaderRow);

                $("#addNewItem", element).text("Add New Delivery Type");
                ShowAddNewItemButton();
                $("#addNewItem", element).off("click").on("click", function(){
                    ClearDeliveryTypeEditor(function(){                        
                        ShowDeliveryTypesEditor();
                    });
                });

                $(".template-manager-list-holder-header", element).append(deliveryTypeListHeader);
            }
            function DisplayDeliveryTypeList(callback)
            {
                $(".template-manager-list-holder-body", element).empty();
                let deliveryTypeListHolder = $("<div />");
                let filteredDeliveryTypes = scope.DeliveryTypeList;

                for(let i = 0; i < filteredDeliveryTypes.length; i++)
                {
                    let item = filteredDeliveryTypes[i];
                    let deliveryTypeRow = $("<div class=\"delivery-type-list-holder-row-data\" />");

                    let deliveryTypeName = $("<div class=\"data-list-item delivery-type-name\" />");
                    deliveryTypeName.append(item.DeliveryTypeName);

                    let deliveryTypeDesc = $("<div class=\"data-list-item delivery-type-desc\" />");
                    deliveryTypeDesc.append(item.DeliveryTypeDesc);

                    let deliveryTypeButtonHolder = $("<div class=\"data-list-item delivery-type-button-holder\" />");
                    let editButton = $("<button id=\"editDeliveryType_" + item.UserMessageDeliveryTypeId + "\"><i class=\"fas fa-edit\"></i></button>");

                    $(editButton).off("click").on("click", function(){
                        let buttonId = this.id;
                        let idToEdit = buttonId.split('_')[1];
                        LoadDeliveryTypeEditor(idToEdit, function(){
                            ShowDeliveryTypesEditor();
                        });
                    });


                    deliveryTypeButtonHolder.append(editButton);

                    deliveryTypeRow.append(deliveryTypeName);
                    deliveryTypeRow.append(deliveryTypeDesc);
                    deliveryTypeRow.append(deliveryTypeButtonHolder);

                    deliveryTypeListHolder.append(deliveryTypeRow);
                }

                $(".template-manager-list-holder-body", element).append(deliveryTypeListHolder);
                if(callback != null)
                {
                    callback();
                }
            }
            function LoadUserMessageList(callback)
            {
                if(scope.UserMessageTypes.length == 0)
                {
                    LoadUserMessageTypeList();
                }
                SetListDescriptionInformation("Current list of user mesage types.  This is what determines the rules for the message to be delivered.");
                DisplayUserMessageTypeListHeader();
                DisplayUserMessageTypeList();
            }
            function DisplayUserMessageTypeListHeader()
            {
                $(".template-manager-list-holder-header", element).empty();
                let userMessageTypeListHeader = $("<div />");
                let userMessageTypeHeaderRow = $("<div class=\"user-message-type-list-holder-row-header\" />");

                let userMessageTypeNameHeader = $("<div class=\"data-list-header-item user-message-type-name\" />");
                userMessageTypeNameHeader.append("Name");

                let userMessageTypeDescHeader = $("<div class=\"data-list-header-item user-message-type-desc\" />");
                userMessageTypeDescHeader.append("Desc");

                let userMessageTypeButtonHolderHeader = $("<div class=\"data-list-header-item user-message-type-button-holder\" />");
                userMessageTypeButtonHolderHeader.append("&nbsp;");

                userMessageTypeHeaderRow.append(userMessageTypeNameHeader);
                userMessageTypeHeaderRow.append(userMessageTypeDescHeader);
                userMessageTypeHeaderRow.append(userMessageTypeButtonHolderHeader);

                userMessageTypeListHeader.append(userMessageTypeHeaderRow);
                $("#addNewItem", element).text("Add New User Message Type");
                ShowAddNewItemButton();
                $("#addNewItem", element).off("click").on("click", function(){
                    ClearUserMessageTypesEditor(function(){
                        ShowUserMessageTypesEditor();
                    });
                });
                $(".template-manager-list-holder-header", element).append(userMessageTypeListHeader);

            }
            function DisplayUserMessageTypeList(callback)
            {
                $(".template-manager-list-holder-body", element).empty();
                let userMessageTypeListHolder = $("<div />");
                let filteredUserMessageTypes = scope.UserMessageTypes;

                for(let i = 0; i < filteredUserMessageTypes.length; i++)
                {
                    let item = filteredUserMessageTypes[i];
                    let userMessageTypeRow = $("<div class=\"user-message-type-list-holder-row-data\" />");

                    let userMessageTypeName = $("<div class=\"data-list-item user-message-type-name\" />");
                    userMessageTypeName.append(item.MessageTypeName);

                    let userMessageTypeDesc = $("<div class=\"data-list-item user-message-type-desc\" />");
                    userMessageTypeDesc.append(item.MessageDesc);

                    let userMessageTypeButtonHolder = $("<div class=\"data-list-item user-message-type-button-holder\" />");
                    let editButton = $("<button id=\"editUserMessageType_" + item.UserMessageTypeId + "\"><i class=\"fas fa-edit\"></i></button>");

                    $(editButton).off("click").on("click", function(){
                        let buttonId = this.id;
                        let idToEdit = buttonId.split('_')[1];
                        LoadUserMessageTypeEditor(idToEdit, function(){
                            ShowUserMessageTypesEditor();
                        });
                    });


                    userMessageTypeButtonHolder.append(editButton);

                    userMessageTypeRow.append(userMessageTypeName);
                    userMessageTypeRow.append(userMessageTypeDesc);
                    userMessageTypeRow.append(userMessageTypeButtonHolder);

                    userMessageTypeListHolder.append(userMessageTypeRow);
                }

                $(".template-manager-list-holder-body", element).append(userMessageTypeListHolder);
                if(callback != null)
                {
                    callback();
                }
            }
            function LoadTemplateList(callback)
            {
                if(scope.AvailableTemplates.length == 0)
                {
                    LoadAvailableDatabaseColumnsForTable();
                }
                SetListDescriptionInformation("Current available templates.");
                DisplayTemplateListHeader();
                DisplayTemplateList();
            }
            function DisplayTemplateListHeader()
            {
                $(".template-manager-list-holder-header", element).empty();
                let templateListHeader = $("<div />");
                
                let templateHeaderRow = $("<div class=\"user-message-template-manager-list-holder-row-header\" />");

                let templateNameHeader = $("<div class=\"data-list-header-item user-message-template-name\" />");
                templateNameHeader.append("Name");

                let templateIsActiveHeader = $("<div class=\"data-list-header-item data-list-is-active\" />");
                templateIsActiveHeader.append("Active?");
                // let deliveryTypeDescHeader = $("<div class=\"data-list-header-item delivery-type-desc\" />");
                // deliveryTypeDescHeader.append("Desc");

                let templateButtonHolderHeader = $("<div class=\"data-list-header-item user-message-template-button-holder \" />");
                templateButtonHolderHeader.append("&nbsp;");

                templateHeaderRow.append(templateNameHeader);
                // deliveryTypeHeaderRow.append(deliveryTypeDescHeader);
                templateHeaderRow.append(templateIsActiveHeader);
                templateHeaderRow.append(templateButtonHolderHeader);

                templateListHeader.append(templateHeaderRow);

                $("#addNewItem", element).text("Add New Template");
                ShowAddNewItemButton();
                $("#addNewItem", element).off("click").on("click", function(){
                    ClearTemplateEditor(function(){
                        LoadTemplateEditor(null, function(){
                            ShowTemplateEditor();
                        });
                    });
                });

                $(".template-manager-list-holder-header", element).append(templateListHeader);
            }
            function DisplayTemplateList(callback)
            {
                $(".template-manager-list-holder-body", element).empty();
                let templateListHolder = $("<div />");
                let filteredTemplateLIst = scope.AvailableTemplates;

                for(let i = 0; i < filteredTemplateLIst.length; i++)
                {
                    let item = filteredTemplateLIst[i];
                    let templateRow = $("<div class=\"user-message-template-list-holder-row-data\" />");

                    let templateName = $("<div class=\"data-list-item user-message-template-name\" />");
                    templateName.append(item.TemplateName);

                    let templateIsActive = $("<div class=\"data-list-item data-list-is-active\" />");                    

                    let isActiveString = "Yes";
                    if(item.IsActive != true)
                    {
                        isActiveString = "No";
                    }
                    templateIsActive.append(isActiveString);

                    let templateButtonHolder = $("<div class=\"data-list-item user-message-template-button-holder\" />");
                    let editButton = $("<button id=\"editTemplate_" + item.UserMessageTemplateId + "\"><i class=\"fas fa-edit\"></i></button>");

                    $(editButton).off("click").on("click", function(){
                        let buttonId = this.id;
                        let idToEdit = buttonId.split('_')[1];
                        LoadTemplateEditor(idToEdit, function(){
                            ShowTemplateEditor();
                        });
                    });


                    templateButtonHolder.append(editButton);

                    templateRow.append(templateName);                    
                    templateRow.append(templateIsActive);                    
                    templateRow.append(templateButtonHolder);

                    templateListHolder.append(templateRow);
                }

                $(".template-manager-list-holder-body", element).append(templateListHolder);
                if(callback != null)
                {
                    callback();
                }
            }
            function ClearTemplateFieldEditor(callback)
            {
                $(".template-manager-editor-field-key-value", element).val("");
                $(".template-manager-editor-field-name-value", element).val("");
                $(".template-manager-editor-database-table-value", element).val("");
                $(".template-manager-editor-database-column-value", element).val("");                
                $(".template-manager-editor-field-default-value", element).val("");
                $(".template-field-is-active-value", element).prop("checked", true);

                if(callback != null){
                    callback();
                }
            }
            function ClearDeliveryTypeEditor(callback)
            {
                $(".template-manager-editor-delivery-type-id", element).val(-1);
                $(".template-manager-editor-delivery-type-name", element).val("");
                $(".template-manager-editor-delivery-type-desc", element).val("");
                $(".template-manager-editor-delivery-type-is-active", element).prop("checked", true);
                
                if(callback != null)
                {
                    callback();
                }
            }
            function ClearUserMessageTypesEditor(callback)
            {
                $(".template-manager-editor-user-message-type-id", element).val(-1);
                $(".template-manager-editor-user-message-type-name", element).val("");
                $(".template-manager-editor-user-message-type-desc", element).val("");
                $(".template-manager-editor-user-message-type-is-active", element).prop("checked", true);
                if(callback != null)
                {
                    callback();
                }
            }
            function ClearTemplateEditor(callback)
            {
                $(".template-manager-editor-template-id", element).val(-1);
                
                $(".template-manager-editor-template-name", element).val("");
                $(".template-manager-editor-template-html", element).val("");          
                $(".template-manager-editor-template-html-viewer", element).empty();
                $(".template-manager-editor-template-found-fields-holder", element).empty();
                $(".template-manager-editor-is-active", element).prop("checked", true);
                
                if(callback != null)
                {
                    callback();
                }
            }
            function LoadTemplateFieldEditor(keyToLoad, callback)
            {
                let templateField = scope.TemplateFieldList.find(x => x.TemplateFieldKey == keyToLoad);
                
                if(templateField != null)
                {
                    
                    $(".template-manager-editor-field-key-value", element).val(templateField.TemplateFieldKey);
                    $(".template-manager-editor-field-name-value", element).val(templateField.TemplateFieldName);
                    $(".template-manager-editor-database-table-value", element).val(templateField.TableName.toLowerCase());
                    HandleDatabaseTableMappingChange(templateField.TableName);                    
                    $(".template-manager-editor-database-column-value", element).val(templateField.TableColumn.toLowerCase());
                    $(".template-manager-editor-field-default-value", element).val(templateField.DefaultValue);
                    $(".template-field-is-active-value", element).prop("checked", true);
                    if(templateField.IsActive != true)
                    {
                        $(".template-field-is-active-value", element).frop("checked", false);
                    } 
                }
                else
                {
                    $(".template-manager-editor-field-key-value", element).val(keyToLoad);
                }
                if(callback != null)
                {
                    callback();
                }
                else
                {
                    ShowTemplateFieldEditor();
                }
            }
            function LoadTemplateEditor(idToLoad, callback)
            {
                if(idToLoad != null)
                {
                    idToLoad = parseInt(idToLoad);
                }

                let template = scope.AvailableTemplates.find(t => t.UserMessageTemplateId == idToLoad);
                let currentTemplateFields = null;
                if(template != null)
                {
                    $(".template-manager-editor-template-id", element).val(idToLoad);
                    $(".template-manager-editor-template-name", element).val(template.TemplateName);
                    let templateHtml = HandleInputFormatting(template.TemplateHtml);
                    $(".template-manager-editor-template-html", element).val(templateHtml);
                    HandleTemplateHtmlChange();

                    $(".template-manager-editor-is-active", element).prop("checked", template.IsActive);
                    
                    currentTemplateFields = template.TemplateFields;                    
                }                
                LoadTemplateFieldsForTemplate(currentTemplateFields, idToLoad)
                if(callback != null)
                {
                    callback();
                }
            }
            function HandleInputFormatting(value)
            {
                let returnInput = "";
                let replacementString = new RegExp(/<br>/gi);
                returnInput = value.replaceAll(replacementString, "<br>\n");

                return returnInput;
            }   

            function LoadTemplateFieldsForTemplate(currentItems, idToLoad, callback)
            {
                $(".template-manager-editor-template-fields-list", element).empty();
                let templateItemListHolder = $("<div />");
                let templateHeaderRow = $("<div class=\"template-manager-editor-field-list-row\" />");

                let templateFieldNameHeader = $("<div class=\"data-list-header-item template-field-field-name-list-item\" />");
                templateFieldNameHeader.append("Name");
                let templateFieldKeyHeader = $("<div class=\"data-list-header-item template-field-field-key-list-item\" />");
                templateFieldKeyHeader.append("Key");
                let templateFieldButtonHolderHeader = $("<div class=\"data-list-header-item button-holder\" />");
                templateFieldButtonHolderHeader.append("&nbsp;");

                templateHeaderRow.append(templateFieldNameHeader);
                templateHeaderRow.append(templateFieldKeyHeader);
                templateHeaderRow.append(templateFieldButtonHolderHeader);

                templateItemListHolder.append(templateHeaderRow);

                for(let i = 0; i < scope.TemplateFieldList.length; i++)
                {
                    let isFieldAssigned = false;
                    let fieldIndex = -1;
                    let item = scope.TemplateFieldList[i];

                    if(currentItems != null && item != null)
                    {
                        fieldIndex = currentItems.findIndex(t=> t.TemplateFieldKey == item.TemplateFieldKey);
                    }
                    isFieldAssigned = (fieldIndex >= 0);

                    let templateItemRow = $("<div class=\"template-manager-editor-field-list-row\" />");

                    let templateFieldName = $("<div class=\"inline-item template-field-field-name-list-item\" />");
                    if(isFieldAssigned == true)
                    {
                        templateFieldName.addClass("foundOption");
                        templateFieldName.append("<span class=\"green-check\"><i class=\"fas fa-check-circle\"></i>&nbsp;&nbsp;</span>");
                    }
                    templateFieldName.append(item.Name);

                    let templateFieldKey = $("<div class=\"inline-item template-field-field-key-list-item\" />");
                    templateFieldKey.append(item.TemplateFieldKey);

                    let templateFieldButtonHolder = $("<div class=\"inline-item button-holder\" />");
                    let templateFieldAddButton = $("<button id=\"addTemplateField_" + idToLoad + "\" value=\"" + item.TemplateFieldKey + "\" class=\"list-item-button\"><i class=\"fas fa-plus\"/></i></button>");
                    
                    $(templateFieldAddButton, element).on("click", function(){
                        let buttonId = this.id;
                        let templateId = buttonId.split('_')[1];                        
                        let optionValue = this.value;
                        AssignFieldToTemplate(optionValue, templateId, function(){
                            LoadAllAvailableTemplates(function(){
                                LoadTemplateEditor(templateId, function(){
                                    ShowTemplateEditor();
                                });    
                            });
                        });
                    });
                    let templateFieldRemoveButton = $("<button  id=\"removeTemplateField_" + idToLoad + "\" value=\"" + item.TemplateFieldKey + "\" class=\"list-item-button\"><i class=\"fas fa-trash\"/></i></button>");
                    $(templateFieldRemoveButton, element).on("click", function(){
                        let buttonId = this.id;
                        let templateId = buttonId.split('_')[1];                        
                        let optionValue = this.value;
                        RemoveFieldFromTemplate(optionValue, templateId, function(){
                            LoadAllAvailableTemplates(function(){
                                LoadTemplateEditor(templateId, function(){
                                    ShowTemplateEditor();
                                });    
                            });
                        });
                    });
                    templateFieldButtonHolder.append(templateFieldAddButton);
                    templateFieldButtonHolder.append(templateFieldRemoveButton);
                    
                    templateItemRow.append(templateFieldName);
                    templateItemRow.append(templateFieldKey);
                    templateItemRow.append(templateFieldButtonHolder);

                    templateFieldAddButton.hide();
                    templateFieldRemoveButton.hide();
                    if(isFieldAssigned == true)
                    {
                        templateFieldRemoveButton.show();
                    }
                    else
                    {
                        templateFieldAddButton.show();
                    }

                    templateItemListHolder.append(templateItemRow);

                }
                $(".template-manager-editor-template-fields-list", element).append(templateItemListHolder);
                
                if(callback != null)
                {
                    callback();
                }
            }
            function SaveTemplateFieldEditor(callback)
            {
                let templateFieldObject = CollectTemplateFieldEditorFromForm();
                if(templateFieldObject != null)
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "selfserve",
                            cmd: "saveTemplateField",
                            templatefield: JSON.stringify(templateFieldObject)
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function(data){          
                            if(callback != null)
                            {
                                callback(data);
                            }
                        }
                    });                    
                }
            }
            function SaveDeliveryTypesEditor(callback)
            {
                let deliveryTypeObject = CollectDeliveryTypeEditorFromForm();                
                if(deliveryTypeObject != null)
                {
                    //saveDeliveryType
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "selfserve",
                            cmd: "saveDeliveryType",
                            deliverytype: JSON.stringify(deliveryTypeObject)
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function(data){          
                            let id = parseInt(data.deliveryTypeId);
                            if(callback != null)
                            {
                                callback(id);
                            }
                        }
                    });
                }
            }
            function SaveUserMessageTypesEditor(callback)
            {
                let userMessageType = CollectUserMessageTypeEditorFromForm();
                if(userMessageType != null)
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "selfserve",
                            cmd: "saveUserMessageType",
                            usermessagetype: JSON.stringify(userMessageType)
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function(data){          
                            let id = parseInt(data.userMessageTypeId);
                            if(callback != null)
                            {
                                callback(id);
                            }
                        }
                    });    
                }
            }
            function CollectDeliveryTypeEditorFromForm()
            {
                let returnObject = new Object();
                returnObject.UserMessageDeliveryTypeId = $(".template-manager-editor-delivery-type-id", element).val();
                returnObject.DeliveryTypeName =  $(".template-manager-editor-delivery-type-name", element).val();
                returnObject.DeliveryTypeDesc =  $(".template-manager-editor-delivery-type-desc", element).val();
                returnObject.IsActive = $(".template-manager-editor-delivery-type-is-active", element).is(":checked");
                returnObject.CreateDate = new Date().toLocaleDateString("en-US");
                returnObject.CreateBy = legacyContainer.scope.TP1Username;
                
                return returnObject;
            }
            function CollectUserMessageTypeEditorFromForm()
            {
                let returnObject = new Object();
                returnObject.UserMessageTypeId = $(".template-manager-editor-user-message-type-id", element).val();
                returnObject.MessageTypeName = $(".template-manager-editor-user-message-type-name", element).val();
                returnObject.MessageDesc = $(".template-manager-editor-user-message-type-desc", element).val();
                returnObject.IsActive = $(".template-manager-editor-user-message-type-is-active", element).is(":checked");
                returnObject.CreateDate = new Date().toLocaleDateString("en-US");
                returnObject.CreateBy = legacyContainer.scope.TP1Username;

                return returnObject;
            }
            function SaveTemplateEditor(callback)
            {
                let templateObject = CollectTemplateEditorFromForm();
                if(templateObject != null)
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "selfserve",
                            cmd: "saveUserMessageTemplate",
                            template: JSON.stringify(templateObject)
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function(data){                            
                            if(callback != null)
                            {
                                callback(data);
                            }
                        }
                    });    
                }
            }
            function DeleteTemplateField(templateFieldKey, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "selfserve",
                        cmd: "deleteTemplateField",
                        templatefieldkey: templateFieldKey
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        console.log("field Removed - possibly notify of information");
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });    
            }
            function CollectTemplateFieldEditorFromForm(callback)
            {
                let returnObject = new Object();
                let defaultValue = $(".template-manager-editor-field-default-value", element).val();
                defaultValue == "" ? null : defaultValue;
                let tableName = $(".template-manager-editor-database-table-value", element).val();
                tableName == "" ? null : tableName 
                let tableColumn = $(".template-manager-editor-database-column-value", element).val();
                tableColumn == "" ? null : tableColumn;

                returnObject.TemplateFieldKey = $(".template-manager-editor-field-key-value", element).val();
                returnObject.TemplateFieldName = $(".template-manager-editor-field-name-value", element).val();
                returnObject.TableName = tableName;
                returnObject.TableColumn = tableColumn;                
                returnObject.DefaultValue = defaultValue;
                returnObject.IsActive = $(".template-field-is-active-value", element).is(":checked");
                returnObject.CreateDate = new Date().toLocaleDateString("en-US");
                returnObject.CreateBy = legacyContainer.scope.TP1Username;

                if(callback != null)
                {
                    callback(returnObject);
                }

                return returnObject;
            }
            function CollectTemplateEditorFromForm(callback)
            {
                let returnObject = new Object();
                returnObject.UserMessageTemplateId = parseInt($(".template-manager-editor-template-id", element).val());                
                returnObject.TemplateName = $(".template-manager-editor-template-name", element).val();
                returnObject.TemplateHtml = $(".template-manager-editor-template-html", element).val();
                returnObject.IsActive = $(".template-manager-editor-is-active", element).is(":checked");
                returnObject.CreateDate = new Date().toLocaleDateString();
                returnObject.CreateBy = legacyContainer.scope.TP1Username;
                returnObject.UpdateDate = new Date().toLocaleDateString();
                returnObject.UpdateBy = legacyContainer.scope.TP1Username;
                                
                if(callback != null)
                {
                    callback(returnObject);
                }
                return returnObject;
            }
            function AssignFieldToTemplate(templateFieldKey, templateId, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "selfserve",
                        cmd: "assignTemplateFieldToTemplate",
                        templatefieldkey: templateFieldKey,
                        templateid: templateId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });    
            }
            function RemoveFieldFromTemplate(templateFieldKey, templateId, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "selfserve",
                        cmd: "removeTemplateFieldFromTemplate",
                        templatefieldkey: templateFieldKey,
                        templateid: templateId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });    
            }
            function LoadDeliveryTypeEditor(idToLoad, callback)
            {
                if(idToLoad != null)
                {
                    idToLoad = parseInt(idToLoad);
                }
                let deliveryType = scope.DeliveryTypeList.find(i => i.UserMessageDeliveryTypeId == idToLoad);
                $(".template-manager-editor-delivery-type-id", element).val(idToLoad);
                if(deliveryType != null)
                {
                    $(".template-manager-editor-delivery-type-name", element).val(deliveryType.DeliveryTypeName);
                    $(".template-manager-editor-delivery-type-desc", element).val(deliveryType.DeliveryTypeDesc);
                    $(".template-manager-editor-delivery-type-is-active", element).prop("checked", true);
                    if(deliveryType.IsActive != true)
                    {
                        $(".template-manager-editor-delivery-type-is-active", element).prop("checked", false);
                    }
                }

                if(callback != null)
                {
                    callback();
                }
                else
                {
                    ShowDisplayTypeEditor();
                }
            }
            function LoadUserMessageTypeEditor(idToLoad, callback)
            {
                if(idToLoad != null)
                {
                    idToLoad = parseInt(idToLoad);
                }
                let userMessageType = scope.UserMessageTypes.find(i => i.UserMessageTypeId == idToLoad);
                $(".template-manager-editor-user-message-type-id", element).val(idToLoad);

                if(userMessageType != null)
                {   
                    $(".template-manager-editor-user-message-type-name", element).val(userMessageType.MessageTypeName);
                    $(".template-manager-editor-user-message-type-desc", element).val(userMessageType.MessageDesc);
                    $(".template-manager-editor-user-message-type-is-active", element).prop("checked", true);

                    if(userMessageType.IsActive != true)
                    {
                        $(".template-manager-editor-user-message-type-is-active", element).prop("checked", false);
                    }
                }
                if(callback != null)
                {
                    callback();
                }
                else
                {
                    ShowUserMessageTypesEditor();
                }
            }
            function ValidateTemplateFieldEditorForm(callback)
            {
                $(".error-information-holder", element).empty();                
                let formValid = true;
                let errorMessages = [];

                let templateKeyValue = $(".template-manager-editor-field-key-value", element).val();
                let templateName = $(".template-manager-editor-field-name-value", element).val();

                if(templateKeyValue == null || templateKeyValue == "")
                {
                    formValid = false;
                    errorMessages.push({ message: "Field Key Required", fieldclass: ".template-manager-editor-field-key-value", fieldid: "" });
                }
                else
                {
                    if (templateKeyValue[0] != "{" || templateKeyValue[templateKeyValue.length -1] != "}")
                    {
                        formValid = false;
                        errorMessages.push({ message: "Field Key be in format of {yourkeyhere}", fieldclass: ".template-manager-editor-field-key-value", fieldid: "" });
                    }
                }
                if(templateName == null || templateName == "")
                {
                    formValid = false;
                    errorMessages.push({ message: "Name Required", fieldclass: ".template-manager-editor-field-name-value", fieldid: "" });
                }


                if(formValid == true)
                {
                    if(callback != null)
                    {
                        callback();
                    }
                }
                else
                {
                    var messageString = "";
                    if (errorMessages.length > 0) {
                        messageString += "<i class=\"fas fa-exclamation-triangle\"></i> <strong>Correct the following errors:</strong> <ul>";
                    }
                    for (var m = 0; m < errorMessages.length; m++) {
                        let item = errorMessages[m];

                        messageString += "<li>" + item.message + "</li>";
                        if (item.fieldclass != "") {
                            $(item.fieldclass, element).addClass("errorField");
                            $(item.fieldclass, element).off("blur").on("blur", function() {
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
            function ValidateTemplateEditorForm(callback)
            {
                $(".error-information-holder", element).empty();                
                let formValid = true;
                let errorMessages = [];

                
                // if(templateName == null || templateName == "")
                // {
                //     formValid = false;
                //     errorMessages.push({ message: "Name Required", fieldclass: ".template-manager-editor-field-name-value", fieldid: "" });
                // }


                if(formValid == true)
                {
                    if(callback != null)
                    {
                        callback();
                    }
                }
                else
                {
                    var messageString = "";
                    if (errorMessages.length > 0) {
                        messageString += "<i class=\"fas fa-exclamation-triangle\"></i> <strong>Correct the following errors:</strong> <ul>";
                    }
                    for (var m = 0; m < errorMessages.length; m++) {
                        let item = errorMessages[m];

                        messageString += "<li>" + item.message + "</li>";
                        if (item.fieldclass != "") {
                            $(item.fieldclass, element).addClass("errorField");
                            $(item.fieldclass, element).off("blur").on("blur", function() {
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
            function ValidateDeliveryTypesEditorForm(callback)
            {
                $(".error-information-holder", element).empty();                
                let formValid = true;
                let errorMessages = [];
                let deliveryTypeName = $(".template-manager-editor-delivery-type-name", element).val();
                
                if(deliveryTypeName == null || deliveryTypeName == "")
                {
                    formValid = false;
                    errorMessages.push({ message: "Name Required", fieldclass: ".template-manager-editor-delivery-type-name", fieldid: "" });
                }

                if(formValid == true)
                {
                    if(callback != null)
                    {
                        callback();
                    }
                }
                else
                {
                    var messageString = "";
                    if (errorMessages.length > 0) {
                        messageString += "<i class=\"fas fa-exclamation-triangle\"></i> <strong>Correct the following errors:</strong> <ul>";
                    }
                    for (var m = 0; m < errorMessages.length; m++) {
                        let item = errorMessages[m];

                        messageString += "<li>" + item.message + "</li>";
                        if (item.fieldclass != "") {
                            $(item.fieldclass, element).addClass("errorField");
                            $(item.fieldclass, element).off("blur").on("blur", function() {
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
            function ValidateUserMessageTypeEditorForm(callback)
            {
                $(".error-information-holder", element).empty();                
                let formValid = true;
                let errorMessages = [];
                let userMessageTypeName = $(".template-manager-editor-user-message-type-name", element).val();
                
                if(userMessageTypeName == null || userMessageTypeName == "")
                {
                    formValid = false;
                    errorMessages.push({ message: "Name Required", fieldclass: ".template-manager-editor-user-message-type-name", fieldid: "" });
                }

                if(formValid == true)
                {
                    if(callback != null)
                    {
                        callback();
                    }
                }
                else
                {
                    var messageString = "";
                    if (errorMessages.length > 0) {
                        messageString += "<i class=\"fas fa-exclamation-triangle\"></i> <strong>Correct the following errors:</strong> <ul>";
                    }
                    for (var m = 0; m < errorMessages.length; m++) {
                        let item = errorMessages[m];

                        messageString += "<li>" + item.message + "</li>";
                        if (item.fieldclass != "") {
                            $(item.fieldclass, element).addClass("errorField");
                            $(item.fieldclass, element).off("blur").on("blur", function() {
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
            function HandleTemplateHtmlChange()
            {
                let html = $(".template-manager-editor-template-html", element).val();
                $(".template-manager-editor-template-html-viewer", element).html(html);
                ScanTemplateHtmlForFields();
            }
            function ScanTemplateHtmlForFields()
            {
                let keys = [];
                let currentHtml = $(".template-manager-editor-template-html", element).val();
                if(currentHtml != null && currentHtml.length > 0)
                {
                    let startingIndex = -1;
                    let endingIndex = -1;
                    let currentKeyData = "";                    
                    for(var i = 0; i < currentHtml.length; i++)
                    {
                        if(currentHtml[i] == "{")
                        {
                            startingIndex = i;
                        }
                        
                        if(startingIndex > -1)
                        {
                            currentKeyData += currentHtml[i];
                        }
                        if(currentHtml[i] == "}")
                        {
                            endingIndex = i;
                        }
                        if(startingIndex > -1 && endingIndex > -1)
                        {
                            keys.push(currentKeyData);
                            startingIndex = -1;
                            endingIndex = -1;
                            currentKeyData = "";
                        }
                    }
                }
                $(".template-manager-editor-template-found-fields-holder", element).empty();
                let foundFieldsHolder = $("<div />");
                let templateId = $(".template-manager-editor-template-id", element).val();
                let template = scope.AvailableTemplates.find(t => t.UserMessageTemplateId == parseInt(templateId));

                for(let i = 0; i < keys.length; i++)
                {
                    let keyItem = keys[i];
                    let keyInfoRow = $("<div  class=\"found-fields-row\"/>");
                    let keyInfoName = $("<div class=\"inline-item\" />");
                    keyInfoName.append(keyItem);
                    let keyInfoButtonHolder = $("<div class=\"inline-item\" />");

                    let keyInfoButton = $("<button class=\"template-manager-editor-add-new-field-option\"><i class=\"fal fa-plus\"></i></button>");
                    $(keyInfoButton, element).off("click").on("click", function(){
                        let value = this.value;
                        LoadTemplateFieldEditor(value, function(){                            
                            ShowTemplateFieldEditor();
                        });
                    });

                    let isValidTemplateField = false;
                    let isFieldAssigned = false;

                    if(keyItem != null && keyItem != "" && keyItem != "{}")
                    {
                        isValidTemplateField =  (scope.TemplateFieldList.findIndex(i => i.TemplateFieldKey == keyItem) >= 0);                        
                        if(template != null)
                        {
                            isFieldAssigned = (template.TemplateFields.findIndex(i => i.TemplateFieldKey == keyItem) >= 0);
                        }
                    }

                    if(isValidTemplateField && isFieldAssigned)
                    {
                        keyInfoRow.addClass("lightgreen");
                    }
                    else if(isValidTemplateField && !isFieldAssigned)
                    {
                        keyInfoName.append("&nbsp;&nbsp;&nbsp;");
                        keyInfoName.append("(Key not assigned)");
                        keyInfoRow.addClass("lightyellow");

                    }
                    else
                    {
                        keyInfoName.append("&nbsp;&nbsp;&nbsp;");
                        keyInfoName.append("(Key not found)");
                        keyInfoRow.addClass("lightred");
                    }                    
                    if(!isValidTemplateField)
                    {
                        keyInfoButton.prop("value", keyItem);

                        keyInfoButtonHolder.append(keyInfoButton);
                    }

                    keyInfoRow.append(keyInfoName);
                    keyInfoRow.append(keyInfoButtonHolder);

                    foundFieldsHolder.append(keyInfoRow);
                }
                $(".template-manager-editor-template-found-fields-holder", element).append(foundFieldsHolder);
            }
            scope.load = function() {
                scope.Initialize();

                $("#templateFieldsHeaderButton", element).off("click").on("click", function(){
                    LoadTemplateFieldList();                    
                });
                $("#deliverTypesHeaderButton", element).off("click").on("click", function(){
                    LoadDeliveryList();
                });
                $("#userMessageTypesHeaderButton", element).off("click").on("click", function(){
                    LoadUserMessageList();
                });
                $("#userMessageTemplateHeaderButton", element).off("click").on("click", function(){
                    LoadTemplateList();
                });
                $(".template-manager-template-field-editor-close-button", element).off("click").on("click", function(){
                    ClearTemplateEditor(function(){
                        HideTemplateFieldEditor();
                    });
                });
                $(".template-manager-delivery-type-editor-close-button", element).off("click").on("click", function(){
                    ClearDeliveryTypeEditor(function(){
                        HideDeliveryTypesEditor();
                    });
                });
                $(".template-manager-user-message-type-editor-close-button", element).off("click").on("click", function(){
                    ClearUserMessageTypesEditor(function(){
                        HideUserMessageTypesEditor();
                    });
                    
                });
                $(".template-manager-user-message-template-editor-close-button", element).off("click").on("click", function(){
                    ClearTemplateEditor(function(){
                        HideTemplateEditor();
                    });
                });
                $(".template-manager-template-field-editor-save-button", element).off("click").on("click", function(){
                    ValidateTemplateFieldEditorForm(function(){
                        SaveTemplateFieldEditor(function(){
                            LoadTemplateFieldsList(function(){
                                LoadTemplateFieldList();
                            });
                            HideTemplateFieldEditor();
                        });
                    });                    
                });
                $(".template-manager-delivery-type-editor-save-button", element).off("click").on("click", function(){
                    ValidateDeliveryTypesEditorForm(function(){
                        SaveDeliveryTypesEditor(function(){
                            LoadDeliveryTypeList(function(){
                                LoadDeliveryList();
                            });
                            HideDeliveryTypesEditor();
                        });
                    });
                    
                });
                $(".template-manager-user-message-type-editor-save-button", element).off("click").on("click", function(){
                    ValidateUserMessageTypeEditorForm(function(){
                        SaveUserMessageTypesEditor(function(){
                            LoadUserMessageTypeList(function(){
                                LoadUserMessageList();
                            });
                            HideUserMessageTypesEditor();
                        });    
                    });
                });
                $(".template-manager-user-message-template-editor-save-button", element).off("click").on("click", function(){
                    ValidateTemplateEditorForm(function(){
                        SaveTemplateEditor(function(){
                            LoadAllAvailableTemplates(function(){
                                LoadTemplateList();
                            });
                            HideTemplateEditor();
                        });    
                    });
                });
                $(".template-manager-editor-database-table-value", element).off("change").on("change", function(){
                    HandleDatabaseTableMappingChange();
                });
                $(".template-manager-editor-template-field-scan-button", element).off("click").on("click", function(){
                    ScanTemplateHtmlForFields();
                });
                $(".template-manager-editor-template-html", element).off("keyup").on("keyup", function(){
                    HandleTemplateHtmlChange();
                });
            };
            scope.load();
        }
    };
    }]);