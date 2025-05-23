angularApp.directive("ngAcuityDiscussion", ['api', '$compile', '$rootScope', function (api, $compile, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/MESSAGING1/MESSAGING1-view/messaging.htm?' + Date.now(),
        scope: {
            context: "@",
            userid: "@",
            gameid: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {

            //console.log("Discussion hello world, context=" + scope.context);
            if (!a$.exists(scope.userid)) {
                scope.userid = legacyContainer.scope.TP1Username;
            }

            //console.log("Discussion userid=" + scope.userid);

            scope.numsessions = 0;
            scope.mates = [];
            scope.contextRoomId = -1;
            scope.lastid = 0;

            if (scope.context == "PerfectAttendanceGame") {
                a$.ajax({
                    type: "POST", service: "JScript", async: true, data: { lib: "chat", cmd: "getGameMates" }, dataType: "json", cache: false, error: a$.ajaxerror,
                    success: gotGameMates
                });
            }
            else if(scope.context == "FlexGame")
            {
                scope.contextRoomId = scope.gameid;
                a$.ajax({
                    type: "POST", service: "C#", async: true, data: { lib: "flex", cmd: "getGameMates", gameid:scope.gameid }, dataType: "json", cache: false, error: a$.ajaxerror, success: function(data) {

                        let gameMates = JSON.parse(data.gameMates);
                        data.mates = gameMates;
                        if(gameMates != null && gameMates.length > 0)
                        {
                            gotGameMates(data);
                        }
                        
                    }
                });
            }
            function displaypost(post) {
                if (post.uid.toLowerCase() == $.cookie("TP1Username").toLowerCase()) {
                    let currentUserDisplayName = post.uid.toLowerCase();
                    let currentUserAvatar = "/jq/avatars/empty_headshot.png";

                    if (a$.exists(post.avatar) && (post.avatar != "")) {
                        currentUserAvatar = "/jq/avatars/" + post.avatar;
                    }

                    if(scope.myidx >= 0)
                    {
                        currentUserDisplayName = scope.mates[scope.myidx].name;
                        currentUserAvatar = scope.mates[scope.myidx].avatar;
                    }
                    $(".discussion-messages", element).append('<div class="discussion-you"><div class="discussion-textblock"><div class="discussion-message">' + post.message + '</div><div class="discussion-timestamp">' + currentUserDisplayName + ', ' + post.timestamp + '</div></div><div class="discussion_img"><img src="' + currentUserAvatar + '" title="' + currentUserDisplayName + '" /></div>');
                }
                else {
                    var oidx = -1; //Index of other person
                    for (var p in scope.mates) {
                        if (scope.mates[p].uid.toLowerCase() == post.uid.toLowerCase()) {
                            oidx = p;
                        }
                    }
                    if (oidx >= 0) { //Don't show posts of someone not in the group
                        $(".discussion-messages", element).append('<div class="discussion-others"><div class="discussion_img"><img src="' + ((scope.mates[oidx].avatar == "") ? "/jq/avatars/empty_headshot.png" : scope.mates[oidx].avatar /*.replace(/\.\.\//g, "") */) + '" title="' + scope.mates[oidx].name + '" /></div><div class="discussion-textblock"><div class="discussion-message">' + post.message + '</div><div class="discussion-timestamp">' + scope.mates[oidx].name + ', ' + post.timestamp + '</div></div>');
                    }
                    else {
                        $(".discussion-messages", element).append('<div class="discussion-others"><div class="discussion_img"><img src="' + ((a$.exists(post.avatar) && (post.avatar != "")) ? "/jq/avatars/" + post.avatar /*.replace(/\.\.\//g, "") */ : "/jq/avatars/empty_headshot.png")  + '" title="' + post.fromname + '" /></div><div class="discussion-textblock"><div class="discussion-message">' + post.message + '</div><div class="discussion-timestamp">' + post.fromname + ', ' + post.timestamp + '</div></div>');
                    }
                }
                $(".discussion-messages", element).scrollTop($(".discussion-messages", element)[0].scrollHeight); //review
            }
            function displayposts() {
                a$.ajax({
                    type: "POST", service: "JScript", async: true, data: { lib: "chat", cmd: "getDiscussionPosts", context: scope.context, contextRoomId: scope.contextRoomId, lastid: scope.lastid }, dataType: "json", cache: false, error: a$.ajaxerror,
                    success: gotDiscussion
                });
                function gotDiscussion(json) {
                    if (a$.jsonerror(json)) {
                        //alert("debug:get chatee json error?");
                    }
                    else {
                        for (var i in json.posts) {
                            if (json.posts[i].id > scope.lastid) {
                                scope.lastid = json.posts[i].id;
                            }
                            displaypost(json.posts[i]);
                        }
                    }
                }
            }

            function gotGameMates(json) {
                if (a$.jsonerror(json)) {
                    //alert("debug:get chatee json error?");
                }
                else {
                    var foundone = false;
                    scope.mates = json.mates;
                    for (var i in scope.mates) {
                        scope.mates[i].avatar = scope.mates[i].avatar.replace(/\.\.\/avatars\//g, ""); //Path problems
                        scope.mates[i].avatar = scope.mates[i].avatar.replace(/\.\.\//g, "");
                        if (scope.mates[i].avatar == "") {
                            scope.mates[i].avatar = "/jq/avatars/empty_headshot.png";
                        }
                        else if (scope.mates[i].avatar.indexOf("/") != 0) {
                            scope.mates[i].avatar = "/" + scope.mates[i].avatar;
                        }
                    }
                    scope.contextRoomId = json.teamid || scope.gameid;
                    scope.myidx = -1;

                    for (var i in scope.mates) {
                        if (scope.mates[i].uid.toLowerCase() == $.cookie("TP1Username").toLowerCase()) {
                            scope.myidx = i;
                        }
                        else {  //(scope.mates[i].uid.toLowerCase() != $.cookie("TP1Username").toLowerCase()) {
                            foundone = true;
                            scope.numsessions += 1;
                            var online = false;
                            //var bld = bldChatWindow({ chatWith: { text: scope.mates[i].name + " (" + scope.mates[i].role + ")", val: scope.mates[i].uid, online: online, select: true} });
                            //var bld = scope.mates[i].name + " (" + scope.mates[i].role + ") - " + scope.mates[i].uid + ' avatar:' + '<div class="discussion_img"><img src="' + ((scope.mates[i].avatar=="")?"/jq/avatars/empty_headshot.png":scope.mates[i].avatar.replace(/\.\.\//g,"")) + '" /></div>';
                            bld = '<div class="discussion_img"><img src="' + ((scope.mates[i].avatar == "") ? "/jq/avatars/empty_headshot.png" : scope.mates[i].avatar /*.replace(/\.\.\//g, "") */) + '" title="' + scope.mates[i].name + ' - ' + scope.mates[i].role + '" /></div>';

                            if (bld != "") {
                                $(".discussion-participants", element).append(bld);
                                //$(".chat-sessions").prepend(bld);
                                //chatlistinit(false);
                                //bindchatsession(true);
                            }
                        }
                    }
                    $(".discussion-messages", element).html("");
                    if (foundone) {
                        displayposts();
                    }
                    else {
                        $(".discussion-messages", element).html("No Room Found");
                    }
                    let myMate = null;
                    if(scope.myidx >= 0)
                    {
                        myMate = scope.mates[scope.myidx];
                    }

                    if(myMate != null)
                    {
                        $(".discussion-entry", element).html('<input placeholder="Write a message in the chat..." type="text" /><div class="discussion_img"><img src="' + ((myMate.avatar == "") ? "/jq/avatars/empty_headshot.png" : myMate.avatar /*.replace(/\.\.\//g, "") */) + '" title="' + myMate.name + '" /></div>');
                    }
                    else
                    {
                        $(".discussion-entry", element).html('<input placeholder="Write a message in the chat..." type="text" /><div class="discussion_img"><img src="/jq/avatars/empty_headshot.png" title="' + scope.userid + '" /></div>');

                    }

                    $(".discussion-entry input", element).unbind().bind("focus", function () {
                        //??setchatindex($(this).parent().parent());
                    }).bind("keypress", function (ev) {
                        if (window.event && window.event.keyCode == 13) {
                            $(this).trigger("change");
                        } else if (ev && ev.keyCode == 13) {
                            $(this).trigger("change");
                        }
                    }).bind("change", function (event) {
                        event.stopPropagation();
                        if ($(this).val() != "") {
                            var value = $(this).val();
                            $(this).val("");
                            a$.ajax({
                                type: "POST", service: "JScript", async: true, data: { lib: "chat", cmd: "saveDiscussionPost", context: scope.context, contextRoomId: scope.contextRoomId, message: value }, dataType: "json", cache: false, error: a$.ajaxerror,
                                success: postsaved
                            });
                            function postsaved(json) {
                                if (a$.jsonerror(json)) {
                                    //alert("debug:get chatee json error?");
                                }
                                else {
                                    displayposts();
                                    scope.indiscussion_timer = 20; //After a post, poll faster for a while.
                                }
                            }
                            //alert("debug: record message: " + value);
                        }
                    }).focus();


                    scope.indiscussion_timer = 0;

                    function pingdiscussion() {
                        var delay = 1; //Short delay if not visible since no ajax is called.
                        if ($(".header-tab_chat").eq(0).hasClass("active") || $(".card-tab_chat").eq(0).hasClass("active")) {
                            //console.log("ping " + new Date());
                            delay = 10; //Reasonable short delay if visible.
                            displayposts();
                        }
                        if (scope.indiscussion_timer-- > 0) delay = 3; //Shorter delay if you've recently posted.
                        setTimeout(pingdiscussion, delay * 1000);
                    }
                    pingdiscussion();


                }
            }
        

            //Unifyme
            try {
                //TODO: Test this.  The timeout loop may be preferable if this gets false positives.
                ko.postbox.subscribe("Filters", function (newValue) {
                });
            }
            catch (e) {
                //If pubsub isn't available (I'm getting rid of "event by cookie", so this may stop working).
                function checkfilters() {
                }
                checkfilters();
            };
        }
    }
} ]);