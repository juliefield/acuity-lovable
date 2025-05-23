angularApp.directive("ngUserMessages", ['api', '$rootScope', function (api, $rootScope) {
   return {
      templateUrl: a$.debugPrefix() + '/applib/dev/USERDASHBOARD1/view/userMessages.htm?' + Date.now(),
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
         var userId = legacyContainer.scope.TP1Username;
         var gUserMessages = [];
         var gUsers = [];

         function Initalize() {
            gUsers.length = 0;
         }

         function GetMyMessages(isAsyncCall, callback) {
            if (isAsyncCall == null) {
               isAsyncCall = true;
            }
            a$.ajax({
               type: "GET",
               service: "C#",
               async: isAsyncCall,
               data: {
                  cmd: "getmessages",
                  seedinbox: 10,
                  brief: true
               },
               dataType: "json",
               cache: false,
               error: a$.ajaxerror,
               success: function (jsonData) {
                  if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                     a$.jsonerror(jsonData);
                     return;
                  }
                  else {

                     gUserMessages.length = 0;
                     if (jsonData.messages != null) {
                        gUserMessages = jsonData.messages;
                     }
                     if (callback != null) {
                        callback();
                     }
                     else {
                        return userMessages;
                     }
                  }
               }
            });
         }
         function GetUserForMessage(userId) {
            let returnUser = gUsers.find(u => u != null && u.UserId != null && u.UserId == userId);
            if (returnUser == null) {
               a$.ajax({
                  type: "GET",
                  service: "C#",
                  async: false,
                  data: {
                     lib: "userprofile",
                     cmd: "getUserData",
                     userid: userId
                  },
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: function (jsonData) {
                     if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                        a$.jsonerror(jsonData);
                        return;
                     }
                     else {
                        returnUser = jsonData.userinfo;
                        gUsers.push(returnUser);
                     }
                  }
               });
            }

            return returnUser;
         }

         function GoToAcuityDirectUrl() {
            let baseUrl = window.location.protocol + "//" + window.location.hostname + "/jq/dashboardasync.aspx";
            let prefixInfo = a$.gup("prefix");
            let tabsUrlTag = "#MessagingNav ";
            if (prefixInfo != null && prefixInfo != "") {
               baseUrl += "?prefix=" + prefixInfo;
            }
            baseUrl += tabsUrlTag;
            a$.WindowTop().location = baseUrl;
            return;
         }

         function RenderMessagesInformation() {

            $(".messages-list", element).empty();
            if (gUserMessages != null && gUserMessages.length > 0) {

               for (let messageCounter = 0; messageCounter < gUserMessages.length; messageCounter++) {
                  let message = gUserMessages[messageCounter];
                  let isRead = false;
                  //let messageItemToRenderHolder = $("<a onclick=\"javascript: GoToAcuityDirectUrl('" + baseUrl + "');\" />");
                  let messageItemToRenderHolder = $("<a style=\"cursor:pointer;\"/>");
                  $(messageItemToRenderHolder).off("click").on("click", function () {
                     GoToAcuityDirectUrl();
                  });

                  let messageItemToRender = $("<li />");

                  isRead = (message.read == "Y");
                  let subjectLine = message.subject;
                  let messageFromUser = message.from;
                  let messageFromUserObject = GetUserForMessage(messageFromUser);

                  let messageDate = new Date(message.date).toLocaleDateString();
                  //let messageText = message.body;


                  let messageStatusHolder = $("<div class=\"message-status\"/>");
                  if (isRead) {
                     let greencheckmarkUrl = a$.debugPrefix() + "/appLib/css/images/green-checkmark.png";
                     messageStatusHolder.append("<img src=\"" + greencheckmarkUrl + "\" />");
                  }
                  else {
                     messageStatusHolder.append("UNREAD");
                  }

                  let messageDateHolder = $("<div class=\"message-date\"/>");
                  messageDateHolder.append(messageDate);
                  let messageAvatarHolder = $("<div class=\"message-avatar\">");
                  let userAvatar = a$.debugPrefix() + "/jq/avatars/empty_headshot.png";
                  if (messageFromUserObject != null) {
                     if (messageFromUserObject.AvatarImageFile != null && messageFromUserObject.AvatarImageFile != "") {
                        userAvatar = a$.debugPrefix() + "/jq/avatars/" + messageFromUserObject.AvatarImageFile;
                     }
                     messageFromUser = messageFromUserObject.FullName;
                  }
                  messageAvatarHolder.append("<img src=\"" + userAvatar + "\" />");

                  let messageCopyHolder = $("<div class=\"message-copy\"/>");

                  let messageFromHolder = $("<h2 />");
                  messageFromHolder.append(messageFromUser);
                  let messageInfoHolder = $("<p />");
                  messageInfoHolder.append(subjectLine);

                  messageCopyHolder.append(messageFromHolder);
                  messageCopyHolder.append(messageInfoHolder);

                  messageItemToRender.append(messageStatusHolder);
                  messageItemToRender.append(messageDateHolder);
                  messageItemToRender.append(messageAvatarHolder);
                  messageItemToRender.append(messageCopyHolder);

                  messageItemToRenderHolder.append(messageItemToRender);

                  $(".messages-list", element).append(messageItemToRenderHolder);
               }
            }
            else {
               $(".messages-list", element).append("<div class=\"empty-state messages\"><p>Sorry, No Messages Found to Display.</p></div>");
            }
         }

         scope.load = function (callback) {
            console.log("Directive: UserMessages Load()");
            Initalize();
            GetMyMessages(false, function () {
               RenderMessagesInformation();
            });
         }

         //scope.load();

         ko.postbox.subscribe("UserMessagesLoad", function () {
            scope.load();
         });
         ko.postbox.subscribe("MessageReceived", function () {
            GetMyMessages(true, function () {
               RenderMessagesInformation();
            });
         });
         ko.postbox.subscribe("MessageRead", function (messageId) {
            GetMyMessages(true, function () {
               RenderMessagesInformation();
            });
         });

         scope.$on("userDashboardLoad", function () {
            //TODO: Put in some logic here to cut down on the number of calls to the database...how long do we let the information stay cached before we reload it.
            scope.load();
         });
      }
   }
}]);
