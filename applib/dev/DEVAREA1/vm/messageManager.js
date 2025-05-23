angularApp.directive("ngMessageManager", ['api', '$rootScope', function(api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/DEVAREA1/view/messageManager.htm?' + Date.now(),
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
                scope.CurrentMessagesList = [];
                scope.MessageTypeList = [];
                scope.DeliveryOptionsList = [];
                scope.AvailableTemplateList = [];
                scope.ClientList = [];

                HideAll();
                SetDatePickerFields();
                LoadClientList();
                LoadMessageTypeList();
                LoadDeliveryOptionsList();
                LoadAvailableTemplateList();
                LoadOptionsList("ALL");
            };
    
            function HideAll()
            {
                HideEditorForm();
                HidePreview();
                HideHistory();
            }
            function SetDatePickerFields()
            {

            }            
            function LoadClientList()
            {
                //TODO: (cdj) - Determine where we can make this less static and more data driven
                //CLN in golden is the location.
                scope.ClientList.length = 0;                
                scope.ClientList.push({value:28, text: "Convergent"});
                scope.ClientList.push({value:29, text: "Bluegreen"});                
                scope.ClientList.push({value:42, text: "Chime"});
                scope.ClientList.push({value:43, text: "Cox"});
                scope.ClientList.push({value:45, text: "Convergent"});
                scope.ClientList.push({value:47, text: "Veyo"});
                scope.ClientList.push({value:48, text: "Performant"});
                scope.ClientList.push({value:49, text: "Frost-Arnett"});
                scope.ClientList.push({value:50, text: "Act"});
                scope.ClientList.push({value:51, text: "United"});
                scope.ClientList.push({value:53, text: "Premier Credit"});
                scope.ClientList.push({value:54, text: "Performant Recovery"});
                scope.ClientList.push({value:55, text: "RCM"});
                scope.ClientList.push({value:56, text: "Self-serve"});
                scope.ClientList.push({value:57, text: "Performant Healthcare"});
                scope.ClientList.push({value:58, text: "Compliance Demo"});
                scope.ClientList.push({value:59, text: "Collective Solution"});
                scope.ClientList.push({value:60, text: "KM2"});
            }
            function LoadPagingInformation(data, pageSize, currentPage)
            {
                let totalPages = Math.ceil(data.length / pageSize);
                if(currentPage > totalPages)
                {
                    currentPage = 1;
                }
                $(".message-manager-data-list-current-page", element).empty();
                if(totalPages > 0)
                {
                    
                    for(var i = 1; i <= totalPages; i++)
                    {
                        let pageItem = $("<option value=\"" + i +  "\">" + i + "</option>");
                        if(currentPage == i)
                        {
                            $(pageItem).attr("selected", "selected");
                        }
                        
                        $(".message-manager-data-list-current-page", element).append(pageItem);
                    }
                }
                $(".message-manager-data-list-record-count", element).text(data.length);
                $(".message-manager-data-list-total-page-count", element).text(totalPages);
                
                
            }
            function LoadMessageTypeList(callback)
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
                        scope.MessageTypeList.length = 0;
                        if (userMessageTypeList != null) {
                            for (var i = 0; i < userMessageTypeList.length; i++) {
                                scope.MessageTypeList.push(userMessageTypeList[i]);
                            }
                        }
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });
            }
            function LoadDeliveryOptionsList(callback)
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
                        scope.DeliveryOptionsList.length = 0;
                        if (deliveryTypeList != null) {
                            for (var i = 0; i < deliveryTypeList.length; i++) {
                                scope.DeliveryOptionsList.push(deliveryTypeList[i]);
                            }
                        }
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                }); 
            }
            function LoadAvailableTemplateList(callback)
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
                        var userMessageTemplateList = $.parseJSON(data.userMessageTemplateList);
                        scope.AvailableTemplateList.length = 0;
                        if (userMessageTemplateList != null) {
                            for (var i = 0; i < userMessageTemplateList.length; i++) {
                                scope.AvailableTemplateList.push(userMessageTemplateList[i]);
                            }
                        }
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                }); 
            }
            function LoadOptionsList(typeToLoad, callback)
            {
                if(typeToLoad != null)
                {
                    typeToLoad = typeToLoad.toLowerCase();
                }
                
                let loadAll = (typeToLoad == null || typeToLoad == "all");

                if(typeToLoad == "clients" || loadAll)
                {
                    $(".message-manager-client-id", element).empty();
                    let emptyOption = $("<option>All Clients</option>");

                    $(".message-manager-client-id", element).append(emptyOption);

                    for(let i = 0; i < scope.ClientList.length; i++)
                    {
                        let item = scope.ClientList[i];
                        let option = $("<option />");
                        option.attr("value", item.value);
                        option.text(item.text);

                        $(".message-manager-client-id", element).append(option);
                    }
                }
                if(typeToLoad == "templates" || loadAll)
                {
                    $(".message-manager-editor-message-template", element).empty();
                    let emptyOption = $("<option />");
                    $(".message-manager-editor-message-template", element).append(emptyOption);

                    for(let i = 0; i < scope.AvailableTemplateList.length; i++)
                    {
                        let item = scope.AvailableTemplateList[i];
                        let option = $("<option />");
                        option.attr("value", item.UserMessageTemplateId);
                        option.text(item.Name);

                        $(".message-manager-editor-message-template", element).append(option);
                    }
                }
                if(typeToLoad == "messagetypes" || loadAll)
                {
                    $(".message-manager-editor-message-type", element).empty();
                    let emptyOption = $("<option />");
                    $(".message-manager-editor-message-type", element).append(emptyOption);

                    for(let i = 0; i < scope.MessageTypeList.length; i++)
                    {
                        let item = scope.MessageTypeList[i];
                        let option = $("<option />");
                        option.attr("value", item.UserMessageTypeId);
                        option.text(item.Name);

                        $(".message-manager-editor-message-type", element).append(option);
                    }
                }
                if(callback != null)
                {
                    callback();
                }
            }
            function LoadMessageById(messageid)
            {
                let userMessage = null;
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "selfserve",
                        cmd: "getUserMessageById",
                        usermessageid: messageid
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        userMessage = $.parseJSON(data.userMessage);                        
                        return userMessage;
                    }
                }); 

                return userMessage;
            }
            function GetMessageTypeName(messageTypesList, callback)
            {
                let returnValue = "";
                
                if(messageTypesList != null && messageTypesList.length > 0)
                {
                    let messageTypeArray = [];

                    for(let i = 0; i < messageTypesList.length; i++)
                    {
                        let messageType = messageTypesList[i];
                        messageTypeArray.push(messageType.MessageTypeName);
                    }
                    returnValue = messageTypeArray.join(",");
                }
                else
                {
                    returnValue = "Unknown";
                }
                
                if(callback != null)
                {
                    callback(returnValue);
                }
                else
                {
                    return returnValue;

                }
            }
            function GetTemplateName(templateId, callback)
            {
                let returnValue = "";

                if(templateId != null && templateId != "")
                {
                    let template = scope.AvailableTemplateList.find(t => t.UserMessageTemplateId == templateId);
                    if(template != null)
                    {
                        returnValue = template.TemplateName;
                    }
                }
                return returnValue;
            }
            function GetDeliveryOptionsName(messageDeliveryTypeList, callback)
            {
                let returnValue = "";
                if(messageDeliveryTypeList != null && messageDeliveryTypeList.length > 0)
                {
                    let deliveryOptionsArray = [];

                    for(let i = 0; i < messageDeliveryTypeList.length; i++)
                    {
                        let optionTypeOption = messageDeliveryTypeList[i];
                        let deliveryOption = scope.DeliveryOptionsList.find(x=> x.UserMessageDeliveryTypeId == optionTypeOption.UserMessageDeliveryTypeId);
                        if(deliveryOption != null)
                        {
                            deliveryOptionsArray.push(deliveryOption.DeliveryTypeName);
                        }
                    }
                    returnValue = deliveryOptionsArray.join(", ");
                }
                else
                {
                    returnValue = "Unknown";
                }
                if(callback != null)
                {
                    callback(returnValue);
                }
                else
                {
                    return returnValue;
                }
            }
            function HideEditorForm()
            {
                $(".message-manager-editor-form-holder", element).hide();
            }
            function ShowEditorForm()
            {
                $(".message-manager-editor-form-holder", element).show();
            }
            function HidePreview()
            {
                $(".message-manager-preview-holder", element).hide();
            }
            function ShowPreview()
            {
                $(".message-manager-preview-holder", element).show();
            }
            function HideHistory()
            {
                $(".message-manager-history-holder", element).hide();
            }
            function ShowHistory()
            {
                $(".message-manager-history-holder", element).show();
            }
            function ClearEditorForm(callback)
            {
                $(".message-manager-editor-form-user-message-id", element).val("")
                $(".message-manager-client-id", element).val(0);
                $(".message-manager-editor-message-type", element).val("");
                $(".message-manager-editor-message-name", element).val("");
                $(".message-manager-editor-message-desc", element).val("");
                $(".message-manager-editor-subject-line", element).val("");
                $(".message-manager-editor-is-active", element).prop("checked", true);
                $(".message-manager-editor-message-template", element).val("");
                $(".message-manager-editor-handling-list-holder", element).empty();
                    
                if(callback != null)
                {
                    callback();
                }
            }
            function LoadEditorForm(idToLoad, callback)
            {
                if(idToLoad != null) 
                {
                    idToLoad = parseInt(idToLoad);
                }                
                let dataToLoad = scope.CurrentMessagesList.find(m => m.UserMessageId == idToLoad);
                $(".message-manager-editor-form-user-message-id", element).val(idToLoad)

                if(dataToLoad != null)
                {
                    if(dataToLoad.UserMessageTemplate == null || dataToLoad.UserMessageMessageDeliveryTypes == null)
                    {
                        let dataIndex = scope.CurrentMessagesList.findIndex(e => e.UserMessageId == idToLoad);
                        dataToLoad = LoadMessageById(idToLoad);                        
                        if(dataIndex > -1)
                        {
                            scope.CurrentMessagesList[dataIndex] = dataToLoad;
                        }
                    }
                    $(".message-manager-client-id", element).val(dataToLoad.Client);
                    $(".message-manager-editor-message-type", element).val(dataToLoad.UserMessageTypeId);
                    $(".message-manager-editor-message-name", element).val(dataToLoad.MessageName);
                    $(".message-manager-editor-message-desc", element).val(dataToLoad.MessageDesc);
                    $(".message-manager-editor-subject-line", element).val(dataToLoad.SubjectLine);
                    let isActive = dataToLoad.IsActive;
                    $(".message-manager-editor-is-active", element).prop("checked", isActive);
                    let  messageTemplate = dataToLoad.UserMessageTemplateIdSource;
                    if(messageTemplate == null)
                    {   
                        let  messageTemplateList = scope.AvailableTemplateList.find(x => x.UserMessageId == idToLoad);                        
                        
                        if(messageTemplateList != null && messageTemplateList.length > 1)
                        {
                            messageTemplate = messageTemplateList[0];
                        }
                        else
                        {
                            messageTemplate = messageTemplateList;
                        }
                    }
                    $(".message-manager-editor-message-template", element).val(messageTemplate.UserMessageTemplateId);
                    $(".message-manager-editor-preview-button", element).off("click").on("click", function(){
                        let templateId = $(".message-manager-editor-message-template", element).val();
                        LoadMessagePreview(messageTemplate.UserMessageTemplateId, templateId);
                    });
                    LoadDeliveryOptionsInEditor(dataToLoad);

                }
                if(callback != null)
                {
                    callback();
                }
                else
                {
                    ShowEditorForm();
                }
            }
            function LoadMessagePreview(messageIdToPreview, templateIdToPreview, callback)
            {
                let previewHtml = "No template information available to preview";
                $(".message-manager-preview-body", element).empty();                    
                if(templateIdToPreview != null)
                {
                    let messageData = scope.AvailableTemplateList.find(t => t.UserMessageTemplateId == parseInt(templateIdToPreview));
                    if(messageData != null)
                    {
                        previewHtml = messageData.TemplateHtml;
                    }
                }
                else
                {
                    let messageData = scope.CurrentMessagesList.find(m => m.UserMessageId == parseInt(messageIdToPreview));
                    if(messageData != null)
                    {
                        if(messageData.UserMessageTemplate != null)
                        {
                            previewHtml = messageData.UserMessageTemplate.TemplateHtml;
                        }
                    } 
                    }

            
                $(".message-manager-preview-body", element).append(previewHtml);
                
                if(callback != null)
                {
                    callback();
                }
                else
                {
                    ShowPreview();
                }
            }
            function ClearPreview()
            {
                $(".message-manager-preview-body", element).empty();
            }
            
            function SaveMessageEditorForm(callback)
            {
                let message = CollectManagerEditorForm();
                if(message != null)
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "selfserve",
                            cmd: "saveUserMessage",
                            usermessage: JSON.stringify(message)
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
            function CollectManagerEditorForm()
            {
                let returnObject = new Object();

                returnObject.UserMessageId = parseInt($(".message-manager-editor-form-user-message-id", element).val());
                returnObject.Client = parseInt($(".message-manager-client-id", element).val()) || 0;
                returnObject.UserMessageTypeId = parseInt($(".message-manager-editor-message-type", element).val());
                returnObject.UserMessageTemplateId = parseInt($(".message-manager-editor-message-template", element).val());
                returnObject.MessageName = $(".message-manager-editor-message-name", element).val();
                returnObject.MessageDesc = $(".message-manager-editor-message-desc", element).val();
                returnObject.SubjectLine = $(".message-manager-editor-subject-line", element).val();
                returnObject.IsActive = $(".message-manager-editor-is-active", element).is(":checked");
                returnObject.CreateDate  = new Date().toLocaleDateString("en-US");
                returnObject.CreateBy = legacyContainer.scope.TP1Username;
                returnObject.UpdateDate  = new Date().toLocaleDateString("en-US");
                returnObject.UpdateBy = legacyContainer.scope.TP1Username;

                return returnObject;
            }
            function ValidateManagerEditorForm(callback)
            {
                let formValid = true;
                let errorMessages = [];
                //TODO: Determine what is needed for a valid form.
                /*
                    errorMessages.push({ message: "Status Required", fieldclass: ".group-manager-editor-group-status", fieldid: "" });
                    formValid = false;
                */

                if (formValid) 
                {
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
            function HandleMessageManagerLoad()
            {
                scope.LoadMessageList(function(){
                    DisplayMessagesList();                    
                });
            }

            function LoadDeliveryOptionsInEditor(dataObject, callback)
            {
                $(".message-manager-editor-handling-list-holder", element).empty();
                let deliveryOptionsHolder = $("<div />");
                let possibleDeliveryOptions = scope.DeliveryOptionsList;


                for(let i = 0; i < possibleDeliveryOptions.length; i++)
                {
                    let isOptionFound = false;
                    let item = possibleDeliveryOptions[i];
                    let optionIndex = -1;

                    if(dataObject.UserMessageMessageDeliveryTypes != null && item != null)
                    {
                        optionIndex = dataObject.UserMessageMessageDeliveryTypes.findIndex(um => um.UserMessageDeliveryTypeId == item.UserMessageDeliveryTypeId);
                        isOptionFound = (optionIndex >=0);
                    }

                    let deliveryOptionRow = $("<div class=\"editor-delivery-option-list-row\" />");

                    let deliveryOptionName = $("<div class=\"inline-item delivery-option-list-name\" />");
                    if(isOptionFound == true)
                    {
                        deliveryOptionRow.addClass("foundOption");
                        deliveryOptionName.append("<span class=\"green-check\"><i class=\"fas fa-check-circle\"></i>&nbsp;&nbsp;</span>");
                    }
                    deliveryOptionName.append(item.Name);
                    
                    let deliveryOptionButtonHolder = $("<div class=\"inline-item delivery-option-list-button-holder\" />");
                    
                    let deliveryOptionAddButton = $("<button id=\"addDeliveryOption_" + item.UserMessageDeliveryTypeId + "\" class=\"list-item-button\"><i class=\"fas fa-plus\"></i></button>");
                    $(deliveryOptionAddButton, element).off("click").on("click", function(){
                        var id = this.id;
                        var optionId = id.split('_')[1];
                        alert("Add clicked.  Functioanlity NYI.");                        
                    });

                    let deliveryOptionDeleteButton = $("<button id=\"removeDeliveryOption_" + item.UserMessageDeliveryTypeId + "\" class=\"list-item-button\"><i class=\"fas fa-trash\"></i></button>");
                    $(deliveryOptionDeleteButton, element).off("click").on("click", function(){
                        var id = this.id;
                        var optionId = id.split('_')[1];
                        alert("Remove clicked.  Functioanlity NYI.");                        
                    });
                    deliveryOptionButtonHolder.append(deliveryOptionAddButton);
                    deliveryOptionButtonHolder.append(deliveryOptionDeleteButton);
                    
                    deliveryOptionRow.append(deliveryOptionName);
                    deliveryOptionRow.append(deliveryOptionButtonHolder);

                    deliveryOptionAddButton.hide();
                    deliveryOptionDeleteButton.hide();                     
                    if(isOptionFound == true)
                    {   
                        deliveryOptionDeleteButton.show();
                    }
                    else
                    {
                        deliveryOptionAddButton.show();   
                    }

                    deliveryOptionsHolder.append(deliveryOptionRow);
                }
                $(".message-manager-editor-handling-list-holder", element).append(deliveryOptionsHolder);
                if(callback != null)
                {
                    callback();
                }
            }

            function DisplayMessagesList(callback)
            {
                $(".message-manager-list-data", element).empty();

                if(scope.CurrentMessagesList.length > 0)
                {

                    let messageList = scope.CurrentMessagesList;
                    //start paging handling
                    //TODO: (cdj) Move the paging handling into a more generic function
                    let pageSize = $(".message-manager-data-list-page-size", element).val();
                    if(pageSize.toLowerCase() == "all")
                    {
                        pageSize = messageList.length;
                    }
                    else
                    {
                        pageSize = parseInt(pageSize);
                    }
                    let currentPage = parseInt($(".message-manager-data-list-current-page", element).val()) || 1;
                    let totalPages = LoadPagingInformation(messageList, pageSize, currentPage);
                    if(totalPages < currentPage)
                    {
                        currentPage = 1;
                    }
                    messageList = scope.CurrentMessagesList.slice(((currentPage -1) * pageSize), (((currentPage -1) * pageSize) + pageSize));
                    //end paging handling 
                    let allMessagesList = $("<div />");

                    for(let i = 0; i < messageList.length; i++)
                    {
                        let item = messageList[i];

                        let messageRow = $("<div class=\"message-manger-data-item-row\" />");
                        let messageNameHolder = $("<div class=\"data-list-item message-name\" />");
                        messageNameHolder.append(item.Name);
                        let templateNameHolder = $("<div class=\"data-list-item message-template-name\" id=\"previewMessage_" + item.UserMessageId + "\" />");
                        let templateName = "";
                        if(item.UserMessageTemplateIdSource != null)
                        {
                            templateName = item.UserMessageTemplateIdSource.TemplateName;
                        }
                        else if (item.UserMessageTemplateId != null)
                        {
                            templateName = GetTemplateName(item.UserMessageTemplateId);
                        }
                        templateNameHolder.append(templateName);
                        if(templateName != "")
                        {
                            $(templateNameHolder, element).on("click", function(){
                                let buttonId = this.id;
                                let id = buttonId.split('_')[1];
                                LoadMessagePreview(id);
                            });
                        }

                        let messageDeliveryOptionsHolder = $("<div class=\"data-list-item delivery-options\" />");                        
                        let deliveryOptionsString = GetDeliveryOptionsName(item.UserMessageMessageDeliveryTypes);                        
                        messageDeliveryOptionsHolder.append(deliveryOptionsString);


                        let messageButtonHolder = $("<div class=\"data-list-item button-holder-inline\" />");
                        let editMessageButton = $("<button id=\"editMessage_" + item.UserMessageId + "\"><i class=\"far fa-edit\"></i></button>");
                        $(editMessageButton, element).on("click", function(){
                            let buttonId = this.id;
                            let id = buttonId.split('_')[1];
                            LoadEditorForm(id);
                        });
                        //let previewMessageButton = $("<button id=\"previewMessage_" + item.UserMessageId + "\"><i></i> Preview</button>");
                        // $(previewMessageButton, element).on("click", function(){
                        //     let buttonId = this.id;
                        //     let id = buttonId.split('_')[1];
                        //     LoadMessagePreview(id);
                        // });
                        let sentHistoryButton = $("<button id=\"showHistoryMessage_" + item.UserMessageId + "\"><i></i> History</button>");
                        $(sentHistoryButton, element).on("click", function(){
                            let buttonId = this.id;
                            let id = buttonId.split('_')[1];
                            ShowHistory();
                        });

                        messageButtonHolder.append(editMessageButton);
                        // messageButtonHolder.append("&nbsp;");
                        // messageButtonHolder.append(previewMessageButton);
                        // messageButtonHolder.append("&nbsp;");
                        // messageButtonHolder.append(sentHistoryButton);
                        
                        let messageDescRow = $("<div class=\"data-list-item-desc\" />");
                        messageDescRow.append(item.Desc);

                        messageRow.append(messageNameHolder);
                        messageRow.append(templateNameHolder);
                        messageRow.append(messageDeliveryOptionsHolder);
                        messageRow.append(messageButtonHolder);

                        messageRow.append(messageDescRow);

                        allMessagesList.append(messageRow);
                    }
                    $(".message-manager-list-data", element).append(allMessagesList);    
    
                }
                else
                {
                    $(".message-manager-list-data", element).append("No Messages found.");
                }

                if(callback != null)
                {
                    callback();
                }
            }
            scope.LoadMessageList = function(callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "selfserve",
                        cmd: "getUserMessageList",
                        deepload: true
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        var userMessageList = $.parseJSON(data.userMessageList);
                        scope.CurrentMessagesList.length = 0;
                        if (userMessageList != null) {
                            for (var i = 0; i < userMessageList.length; i++) {
                                scope.CurrentMessagesList.push(userMessageList[i]);
                            }
                        }
                        if(callback != null)
                        {
                            callback(data);
                        }
                    }
                });
            }

            scope.load = function() {
                scope.Initialize();
                HandleMessageManagerLoad();
                $(".message-manager-add-new", element).off("click").on("click", function(){
                    ClearEditorForm();
                    ShowEditorForm();
                });
                $(".message-manager-editor-form-save-button", element).off("click").on("click", function(){
                    ValidateManagerEditorForm(function(){
                        SaveMessageEditorForm(function(){
                            HandleMessageManagerLoad();
                            HideEditorForm();
                        });
                    });
                });
                $(".message-manager-editor-form-close-button", element).off("click").on("click", function(){
                    ClearEditorForm();
                    HideEditorForm();
                });
                $(".message-manager-preview-close-button", element).off("click").on("click", function(){                    
                    ClearPreview();
                    HidePreview();
                });
                $(".message-manager-history-close-button", element).off("click").on("click", function(){                                        
                    HideHistory();
                });
                $(".message-manager-data-list-current-page", element).off("change").on("change", function(){
                    DisplayMessagesList();
                });
                $(".message-manager-data-list-page-size", element).off("change").on("change", function(){
                    DisplayMessagesList();
                });
            };
            scope.load();
        }
    };
    }]);