
angularApp.directive("ngUserProfile", ['api', '$rootScope', function (api, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/USERPROFILE1/view/userprofile.htm?' + Date.now(),
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

            function GetUserData(userId, callback)
            {
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "userprofile",
                        cmd: "getUserData2",
                        userid: userId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: function(data){
                        if(data.errormessage != null && data.errormessage == "true")
                        {
                            a$.jsonerror(data);
                            return;
                        }
                        else
                        {
                            let userInfo = $.parseJSON(data.userinfo);
                            if(userInfo != null)
                            {
                                scope.ClearAndHideNoteInputForm();
                                BuildUserProfile(userInfo);
                            }
    
                        }
                    }
                });                
            }
            function BuildUserProfile(userObject)
            {
                if(userObject == null || userObject.UserId == "")
                {
                    //TODO: Handle User not found.
                    return;
                }

                let avatarFileName = a$.debugPrefix() + "/jq/avatars/empty_headshot.png";                
                if(userObject.AvatarImageFile != null && userObject.AvatarImageFile != "")
                {
                    avatarFile = a$.scrubAvatarLocation(currentUser.AvatarImageFileName, true);
                }

            }
            scope.loaduser = function (userid) {
                scope.userid = userid;
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "userprofile",
                        cmd: "getUserData",
                        userid: userid
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loadeduser
                });
                function loadeduser(json) {
                    if (a$.jsonerror(json)) { 
                    } else {
                        if (!a$.exists(json.userinfo)) {
                            console.log("User not found.  Origin: " + json.origin);
                        }
                        else {
                            scope.ClearAndHideNoteInputForm();
                            scope.BuildUserProfileFromJson(json, $(".agent-profile-panel", element));
                        }
                    }
                }
            }
            scope.LoadUserNotes = function (userid) {
                scope.userid = userid;

                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: true,
                    data: {
                        lib: "userprofile",
                        cmd: "getUserNotes",
                        userid: userid,
                        currentUserId: legacyContainer.scope.TP1Username
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: WriteUserNotes
                });

                function WriteUserNotes(json) {
                    if (a$.jsonerror(json)) { } else {
                        if (!a$.exists(json.userNotes)) {
                            console.log("No User Notes found.Origin: " + json.origin);
                        }
                        else {
                            var holderObject = $(".agent-notes-panel", element);
                            var userNotes = $.parseJSON(json.userNotes);
                            scope.BuildUserNotesFromJson(userNotes, element);
                            holderObject.show();
                        }

                    }
                }
            }
            scope.SaveUserNote = function (userid) {
                scope.userid = userid;
                var noteInfo = GetUserNoteForSave(userid);

                if (noteInfo != null) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "userprofile",
                            cmd: "saveUserNote",
                            usernote: JSON.stringify(noteInfo)
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: ReloadUserNoteData
                    });
                }
                else {
                    alert("You must enter something in the text of the note in order to save.");
                }

                function ReloadUserNoteData() {
                    scope.ClearAndHideNoteInputForm();
                    scope.ShowUserNotes(null, scope.userid);

                }


                function GetUserNoteForSave(userid) {
                    var currentUser = legacyContainer.scope.TP1Username;

                    var userNoteId = $(".user-profile-note-id", element).val();
                    var enterByValue = $(".user-profile-note-enterby-userid", element).val();
                    var noteText = $(".user-profile-note-text", element).text();
                    if(enterByValue == null || $.trim(enterByValue) == "")
                    {
                        enterByValue = currentUser;
                    }
                    if(noteText == "")
                    {
                        noteText = $("#user-profile-note-text", element).val();
                    }
                    noteText = $.trim(noteText);
                    if (noteText == "") {
                        return null;
                    }

                    var noteToSave = new Object();
                    if(userNoteId != null && userNoteId != "")
                    {
                        noteToSave.UserNoteId = userNoteId;
                        noteToSave.UpdatedBy = currentUser;
                        noteToSave.UpdatedOn = new Date().toLocaleDateString("en-US");
                    }
                    else
                    {
                        noteToSave.UserNoteId = 0;
                        noteToSave.UpdatedBy = null;
                        noteToSave.UpdatedOn = null;
                    }

                    noteToSave.UserId = userid;
                    noteToSave.EnterByUserId = enterByValue;
                    noteToSave.NoteText = noteText;
                    noteToSave.CreatedOn = new Date().toLocaleDateString("en-US");
                    noteToSave.CreatedBy = currentUser;

                    return noteToSave;
                }
            }
            scope.ClearNoteInputForm = function () {
                $(".user-profile-note-id").val("");
                $(".user-profile-note-enterby-userid").val("");
                $("#user-profile-note-text").val("");
            }
            scope.ClearAndHideNoteInputForm = function () {
                scope.ClearNoteInputForm();
                scope.HideNotesInput();
            }
            scope.BuildUserNotesFromJson = function (jsonData ) {
                
                var notesListHolder = $(".notes-tabs", element);
                notesListHolder.empty();

                if (jsonData.length == 0) {
                    var noNotesFound = $("<div />");
                    noNotesFound.text("No Notes found for user.");

                    notesListHolder.append(noNotesFound);
                }
                else {
                    for (var i = 0; i < jsonData.length; i++) {
                        var noteListItem = $("<div class=\"notes-tab-item\" />");
                        var noteItem = jsonData[i];
                        var noteCheckboxString = "noteCheckbox" + noteItem.UserNoteId;
                        var noteDate = new Date(noteItem.CreatedOn).toLocaleDateString("en-US");

                        var noteHeaderText = $("<label class=\"notes-tab-label\" for=\"" + noteCheckboxString + "\" />").text(noteDate + " - Entered by " + noteItem.EnterByUserId);
                        var noteCheckbox = $("<input type=\"checkbox\" id=\"" + noteCheckboxString + "\" />");
                        var noteTextHolder = $("<div class=\"notes-tab-content\"/>");
                        noteTextHolder.text(noteItem.NoteText);

                        var noteActionsHolder = $("<div class=\"notes-tab-actions\"/>");
                        var noteActionsEditNoteItem = $("<a href=\"#\" id=\"editNote_" + noteItem.UserNoteId + "\"><i class=\"fa fa-edit\"></i> Edit Note</a>");

                        $(noteActionsEditNoteItem).on("click", function(){
                            var buttonId = this.id;
                            var noteId = buttonId.split('_')[1];
                            scope.ShowEditNote(noteId);
                        });

                        var noteActionsDeleteNoteItem = $("<a href=\"#\" id=\"deleteNote_" +  noteItem.UserNoteId + "\"><i class=\"fa fa-delete\"></i> Delete Note</a>");
                        $(noteActionsDeleteNoteItem).on("click", function(){
                            var buttonId = this.id;
                            var noteId = buttonId.split('_')[1];
                            scope.ShowDeleteNote(noteId);
                        });
                        var noteDeleteMessageItem = $("<div class=\"notes-tab-delete-message\" id=\"delete-message_" + noteItem.UserNoteId + "\"/>");
                        var noteDeleteConfirmButton = $("<a href=\"#\" class=\"btn notes-tab-delete-message-btn\" id=\"confirmDelete_" + noteItem.UserNoteId + "\">Yes, Delete it.</a>");
                        $(noteDeleteConfirmButton).on("click", function(){
                            var buttonId = this.id;
                            var noteId = buttonId.split('_')[1];
                            scope.DeleteNote(noteId, function(data){
                                scope.ShowUserNotes(null, scope.userid);
                            });
                        });


                        var noteCancelDeleteButton = $("<a href=\"#\" class=\"btn notes-tab-delete-message-btn\" id=\"cancelDelete_" + noteItem.UserNoteId + "\">Cancel</a>");
                        $(noteCancelDeleteButton).on("click", function(){
                            var buttonId = this.id;
                            var noteId = buttonId.split('_')[1];
                            scope.CancelDeleteNote(noteId);
                        });

                        noteDeleteMessageItem.append($("<p>Are you sure?<br />This action can not be undone.</p>"));
                        noteDeleteMessageItem.append(noteDeleteConfirmButton);
                        noteDeleteMessageItem.append(noteCancelDeleteButton);

                        if(legacyContainer.scope.TP1Role == "Admin" || legacyContainer.scope.TP1Username == noteItem.EnterByUserId)
                        {
                            noteActionsHolder.append(noteActionsEditNoteItem);;
                            noteActionsHolder.append(noteActionsDeleteNoteItem);
                        }

                        noteTextHolder.append(noteActionsHolder);
                        noteTextHolder.append(noteDeleteMessageItem);

                        noteListItem.append(noteCheckbox);
                        noteListItem.append(noteHeaderText);
                        noteListItem.append(noteTextHolder);
                        notesListHolder.append(noteListItem);
                    }
                }
            }
            scope.ShowEditNote = function(userNoteId){

                scope.ShowNotesInput(null, userNoteId);

            }
            scope.DeleteNote = function(userNoteId, callback){
                a$.ajax({
                    type: "POST",
                    service: "C#",
                    async: false,
                    data: {
                        lib: "userprofile",
                        cmd: "deleteUserNote",
                        userNoteId: userNoteId
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: DeleteNoteSuccess
                });

                function DeleteNoteSuccess(data)
                {
                    if(data.errormessage != null && data.errormessage == "true")
                    {
                        a$.jsonerror(data);
                        return;
                    }
                    else
                    {
                        if(callback != null)
                        {
                            callback(data);
                        }    
                    }
                }
            };
            scope.CancelDeleteNote = function(userNoteId){
                scope.HideDeleteNote(userNoteId);
            };
            scope.HideDeleteNote = function(userNoteId){
                var deleteBox = $("#delete-message_" + userNoteId, element);
                $(deleteBox).removeClass("active");
            };
            scope.ShowDeleteNote = function(userNoteId){
                var deleteBox = $("#delete-message_" + userNoteId, element);
                $(deleteBox).addClass("active");
            }
            scope.HideNotesInput = function (profileHolder) {
                if (profileHolder == null) {
                    profileHolder = element;
                }
                $(".agent-profile-panel-notebox", profileHolder).hide();
            }
            scope.ShowNotesInput = function (profileHolder, userNoteId) {
                if (profileHolder == null) {
                    profileHolder = element;
                }

                if(userNoteId != null)
                {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: false,
                        data: {
                            lib: "userprofile",
                            cmd: "getUserNoteById",
                            userNoteId: userNoteId
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: LoadUserNoteData
                    });
                }

                $(".agent-profile-panel-notebox", profileHolder).show();

                function LoadUserNoteData(data)
                {
                    if(data.errormessage != null && data.errormessage == "true")
                    {
                        a$.jsonerror(data);
                        return;
                    }
                    else
                    {
                        var noteData = $.parseJSON(data.userNote);
                        if(noteData.length > 0)
                        {
                            var userNote = noteData[0];
    
                            if(userNote != null)
                            {
                                $("#user-profile-note-text", profileHolder).val(userNote.NoteText)
                                $(".user-profile-note-text", profileHolder).text(userNote.NoteText)
                                $(".user-profile-note-id", profileHolder).val(userNote.UserNoteId);
                                $(".user-profile-note-enterby-userid", profileHolder).val(userNote.EnterByUserId);
                            }
    
                        }
    
                    }
                }

            }
            scope.HideUserNotes = function (profileHolder) {
                //$(".agent-notes-panel", element).hide();
                scope.AnimateFrame(".acuity-user-profile-framebox", "430px");

            }
            scope.ShowUserNotes = function (profileHolder, userId) {
                if (profileHolder == null) {
                    profileHolder = element;
                }
                scope.LoadUserNotes(userId);
                scope.AnimateFrame(".acuity-user-profile-framebox", "900px");
            }
            scope.BuildUserProfileFromJson = function (jsonData, profileHolder) {
                if (profileHolder == null) {
                    profileHolder = element;
                }

                if (jsonData.userinfo != null) {
                    var userProfile = jsonData.userinfo;
                    var avatarFile = a$.debugPrefix() + "/jq/avatars/empty_headshot.png";
                    $(".user-profile-userName", profileHolder).html(userProfile.UserId);
                    if (userProfile.LOGIN_USER_ID != null && userProfile.LOGIN_USER_ID != "") {
                        var currentHtml = $(".user-profile-userName", profileHolder).html();
                        currentHtml += "<br />";
                        currentHtml += userProfile.LOGIN_USER_ID;
                        $(".user-profile-userName", profileHolder).html(currentHtml);
                    }
                    if (userProfile.AvatarImageFile != null && userProfile.AvatarImageFile != "") {
                        avatarFile = a$.debugPrefix() + "/jq/avatars/" + userProfile.AvatarImageFile;
                    }
                    $(".user-profile-img-avatar", element).attr("src", avatarFile);

                    $(".user-profile-fullName", element).text(userProfile.FullName);
                    let userIdInfo = "( " + userProfile.UserId + " )";
                    $(".user-profile-userid", element).empty();
                    $(".user-profile-userid", element).append(userIdInfo);

                    $(".user-profile-userRoleName", profileHolder).text(userProfile.UserRole);
                    $(".user-profile-userRole", profileHolder).val(userProfile.UserRole);
                    $(".user-profile-userStatus", profileHolder).text(userProfile.UserStatusName);
                    if (userProfile.HireDT != null && userProfile.HireDT != "") {
                        $(".user-profile-hireDate", profileHolder).text(new Date(userProfile.HireDT).toLocaleDateString("en-US"));
                    }
                    if (userProfile.TeamName != null) {
                        $(".user-profile-user-team", profileHolder).text(userProfile.TeamName);
                    }

                    if (userProfile.GroupName != null) {
                        $(".user-profile-user-group", profileHolder).text(userProfile.GroupName);
                    }
                    if (userProfile.LocationName != null) {
                        $(".user-profile-user-location", profileHolder).text(userProfile.LocationName);
                    }

                    //button handling
                    $(".user-profile-btn-show-notes", profileHolder).off("click").on("click", function () {

                        //Expand the panel Example.  Turns out jquery works find for the parent.
                        //Basic:
                        //$(".acuity-user-profile-framebox", window.parent.document.body).css("width","900px");
                        //Fancy:
                        //scope.AnimateFrame(".acuity-user-profile-framebox", "900px");

                        //NOTE: Clint, I still want to do a "frametrigger" module for complex interactions, but this is with your own frame so this way is probably best.

                        scope.ShowUserNotes(profileHolder, userProfile.UserId);
                    });

                    $(".agent-notes-panel_close", element).off("click").on("click", function () {
                        scope.ClearAndHideNoteInputForm();
                        scope.HideUserNotes(profileHolder);
                    });

                    $(".user-profile-btn-save-note", profileHolder).off("click").on("click", function () {
                        scope.SaveUserNote(scope.userid);
                    });

                    $("#save-profile-note", profileHolder).off("click").on("click", function () {
                        scope.SaveUserNote(scope.userid);
                    });
                    $("#add-profile-note", profileHolder).off("click").on("click", function () {
                        scope.ShowNotesInput(profileHolder);
                    });
                    // $(".close-profile-btn", profileHolder).off("click").on("click", function () {
                    //     scope.ClearAndHideNoteInputForm();
                    //     scope.HideUserNotes(element);
                    //     scope.HideProfilePanel(element);
                    // });

                    scope.HideUserNotes(profileHolder);
                    scope.HideNotesInput(profileHolder);
                }
                else {
                    //scope.findandload();
                }

            }
            scope.SaveUserProfile = function (userid) {
                scope.userid = userid;
                var userProfile = GetUserProfileForSave(userid);

                if (userProfile != null) {
                    a$.ajax({
                        type: "POST",
                        service: "C#",
                        async: true,
                        data: {
                            lib: "userprofile",
                            cmd: "saveUserInformation",
                            userinfo: JSON.stringify(userProfile)
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (jsonData) {
                            if(jsonData.errormessage != null && jsonData.errormessage == "true")
                            {
                                a$.jsonerror(jsonData);
                                return;
                            }
                            else
                            {
                                alert('User Profile save successful.');
                            }
                        }
                    });
                }
                // else
                // {
                //     alert("You must enter something in the text of the note in order to save.");
                // }

                function GetUserProfileForSave(userid) {
                    var userProfileObject = new Object();

                    userProfileObject.UserId = userid;
                    userProfileObject.FirstName = $(".user-profile-firstName", element).val();
                    userProfileObject.LastName = $(".user-profile-lastName", element).val();
                    userProfileObject.UserRole = $(".user-profile-userRole", element).val();

                    return userProfileObject;
                }

            }
            scope.AddNoteSpaceToUI = function () {
                scope.AnimateFrame(".acuity-user-profile-framebox", "900px");
            };
            scope.RemoveUserPanelSpaceFromUI = function () {
                scope.AnimateFrame(".acuity-user-profile-framebox", "0px");
            };

            scope.AnimateFrame = function(frameclass, newFrameWidth)
            {
                $(frameclass, window.parent.document.body).animate({
                    width: newFrameWidth
                }, 100);
            }
        //     scope.HideProfilePanel = function()
        //     {
        //         scope.RemoveUserPanelSpaceFromUI();
        // //     scope.AnimateFrame(".acuity-user-profile-framebox", "0px");
        //     }
            scope.findandload = function () {
                var userid = legacyContainer.scope.TP1Username;

                if (a$.exists(legacyContainer.scope.filters.Selected.CSR) && (legacyContainer.scope.filters.Selected.CSR != "")) {
                    userid = legacyContainer.scope.filters.Selected.CSR;
                }
                else if (a$.exists(legacyContainer.scope.filters.CSR) && (legacyContainer.scope.filters.CSR != "") && (legacyContainer.scope.filters.CSR != "each")) {
                    userid = legacyContainer.scope.filters.CSR;
                }                
                scope.loaduser(userid);
            }

            scope.LoadAndShow = function (userid) {
                if (scope.currentCsrValue == null || scope.currentCsrValue != userid) {
                    scope.currentCsrValue = userid;                    
                    scope.findandload(userid);
                }
            }

            ko.postbox.subscribe("Filters", function (newValue) {
                scope.LoadAndShow(newValue.Selected.CSR);
            });

            if(scope.currentCsrValue == null)
            {
                scope.findandload();                
            }
            appLib.HandleResourceTexts(null);
        }
    }
} ]);

function GetUserProfileLink(displayName, userId, serviceClassName, avatarImageFile, departmentCode)
{
    if(serviceClassName == null || serviceClassName == "")
    {
        serviceClassName = "report-click-service";
    }
    var returnProfileLink = $("<div class=\"" + serviceClassName + " app-user-link\" service=\"SelectUser\" userid=\"" + userId + "\" />");
    
    var avatarFile = a$.debugPrefix() + "/jq/avatars/empty_headshot.png";
    var avatarImageHolder = $("<img class=\"user-profile-img-avatar-list\" />");    
    if(avatarImageFile != null && avatarImageFile != "")
    {
        avatarFile = a$.debugPrefix() + "/jq/avatars/" + avatarImageFile;        
    }
    $(avatarImageHolder).attr("src", avatarFile);
    returnProfileLink.append(avatarImageHolder);
    returnProfileLink.append("&nbsp;&nbsp;&nbsp;");
    if(departmentCode != null && departmentCode != "")
    {
        displayName += " - " + departmentCode;
    }
    returnProfileLink.append("<span>" + displayName + "</span>");

    return returnProfileLink;
}
