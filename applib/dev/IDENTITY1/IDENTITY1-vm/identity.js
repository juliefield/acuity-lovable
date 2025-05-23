angularApp.directive("ngIdentity", ['api', function(api) {
  return {
    templateUrl: "../applib/dev/IDENTITY1/IDENTITY1-view/identity.htm?" + Date.now(),
    scope: {
      who: "@"
    },
    require: '^ngLegacyContainer',
    link: function(scope, element, attrs, legacyContainer) {
      var Team = "";
      var CSR = "";

      var origObj; // used to preserve original data when editing
      scope.obj = {};
      
      scope.obj.prebuiltAvatar = false;
      scope.uploadedImage = '';

      scope.colors = [
        { value: 'red', name: 'Red' },
        { value: 'orange', name: 'Orange' },
        { value: 'Yellow', name: 'Yellow' },
        { value: 'blue', name: 'Blue' },
        { value: 'green', name: 'Green' },
        { value: 'purple', name: 'Purple' },
        { value: 'aquamarine', name: 'Aquamarine' },
        { value: 'darkslategray', name: 'Dark Slate Gray' },
        { value: 'dodgerblue', name: 'Dodger Blue' },
      ];

      scope.musicGenres = [
        { value: 'jazz', name: 'Jazz' },
        { value: 'blues', name: 'Blues' },
        { value: 'classical', name: 'Classical' },
        { value: 'folk', name: 'Folk' },
        { value: 'hiphop', name: 'Hip Hop / Rap' },
        { value: 'pop', name: 'Pop' },
        { value: 'rock', name: 'Rock' },
        { value: 'country', name: 'Country' },
        { value: 'electronic', name: 'Electronic' },
      ];

      scope.hobbies = [
        { value: 'reading', name: 'Reading' },
        { value: 'traveling', name: 'Traveling' },
        { value: 'fishing', name: 'Fishing' },
        { value: 'crafts', name: 'Crafts' },
        { value: 'collecting', name: 'Collecting' },
        { value: 'music', name: 'Music' },
        { value: 'gardening', name: 'Gardening' },
        { value: 'videogames', name: 'Video Games' },
        { value: 'sports', name: 'Sports' },
        { value: 'shopping', name: 'Shopping' },
        { value: 'cooking', name: 'Cooking' },
      ];

      //Setup box show/hide
      scope.insetup = false;
      scope.setupshowing = function() {
        return scope.insetup;
      }

      scope.showsetup = function(tf) {
        scope.insetup = tf;

        if (tf) {
          // preserve the scope for if the user cancels editing
          origObj = angular.copy(scope.obj);
        }
      }

      scope.cancelEditing = function() {
        scope.obj = angular.copy(origObj);
        origObj = {};
        scope.showsetup(false);
      };

      scope.setPrebuiltAvatar = function(avatarFilename) {
        scope.obj.prebuiltAvatar = true;
        scope.obj.avatarFilename = avatarFilename;
      };

      function getitems() {
        return api.getJS({
          lib: "fan",
          cmd: "getIdentity",
          role: legacyContainer.scope.TP1Role,
          idtype: scope.who,
          Team: Team,
          CSR: CSR
        }).then(function(json) {
          scope.$apply(function() {
            if (a$.exists(json.identity.person)) {
              if (a$.exists(json.identity.person.stg)) {
                scope.obj = angular.copy(json.identity.person.stg);
              } else {
                scope.obj.jersey = "##";
              }
              
              //The ../jq allows the avatars to be defined for any root-level folder (so I can put apps in acuityapm.com/3)
              if (!scope.obj.prebuiltAvatar) {
              	scope.obj.avatarFilename = '../jq/avatars/' + (json.identity.person.avatarfilename || 'empty_headshot.png');
              }
            }

            if (a$.exists(json.identity.team)) {
              scope.myfanname = json.identity.team.fanname;
              if (a$.exists(json.identity.team.stg)) {
                scope.mybackgroundcolor = json.identity.team.stg.colors[0];
                scope.mycolor = json.identity.team.stg.colors[1];
              }
            }
          });
        });
      };

      //TODO: This needs testing server-side, please hook up and if it doesn't work I'll fix.
      scope.saveitems = function(closeSetup) {
        closeSetup = typeof closeSetup === 'undefined' ? true : closeSetup;

        var stg = angular.copy(scope.obj);

        // TODO: still possibly save colors here since they go with the team

        if (stg.prebuiltAvatar) {
          stg.prebuiltAvatar = 1; // sending 'true' was giving errors so we explicitly set to 1
        } else {
          stg.prebuiltAvatar = 0;
        }

        api.postJS({
          lib: "fan",
          cmd: "saveIdentity", // saveplayerstg?
          role: legacyContainer.scope.TP1Role,
          stg: stg,
          idtype: scope.who,
          Team: Team,
          CSR: CSR
        }).then(function(json) {
          if (json.errormessage) throw json.msg;
          getitems().then(function() {
            scope.$apply(function() {
              alert("Saved");
              if (closeSetup) scope.showsetup(false);
            });
          });
        }).catch(function(error) {
          console.log(error);
          alert('There was an error while saving.');
        });
      };

      
      scope.uploadAvatar = function() {
        //Stuff for uploading an image (placeholder for Jeff)
        //Works with html element:  <input id="fileIdentityUpload" name="fileIdentityUpload" type="file" accept=".bmp,.gif,.jpg,.jpeg,.png" />

        if (!scope.uploadedImage) {
          alert('You must first select an image to upload as your avatar.');
          return;
        }
        
        var data = new FormData();
        data.append("UploadedImage", scope.uploadedImage);

        //Special .ajax requirements when sending a document.
        var loc = window.location.host;
        if (loc.indexOf("localhost", 0) < 0) {
          loc = window.location.protocol + '//' + window.location.host + "/";
        } else {
          loc = window.location.protocol + '//' + window.location.host;
          loc += a$.xss(window.location.pathname).substr(0, a$.xss(window.location.pathname).indexOf(".com") + 5);
        }

        var cs = legacyContainer.scope.TP1Username; //Jeff changed this
        if (scope.who == "CSR") {
          cs = CSR; //The user id of the CSR - For future hookup.
        }

        var url = loc + "jshandler.ashx?username=" + a$.xss($.cookie("username")) + "&uid=" + a$.xss($.cookie("uid")) + "&lib=fan&cmd=uploadPlayerImage&role=" + $.cookie("TP1Role") + "&CSR=" + cs;

        var uploadRequest = $.ajax({
          type: "POST",
          url: url,
          contentType: false,
          processData: false,
          data: data,
          dataType: "text json",
          error: function(xhr, status, error) {
            alert(xhr.responseText);
          }
        });
        uploadRequest.done(function(json, textStatus) {
          if (json.errormessage) {
            alert(json.msg);
            return;
          }

          scope.$apply(function(scope) {
            // we're saving the avatar on upload so we update the origObj as well
            scope.obj.prebuiltAvatar = origObj.prebuiltAvatar = false;
            scope.obj.avatarFilename = origObj.avatarFilename =  json.avatarFilename;
            scope.saveitems(false);
          });
        });
      }


      switch (scope.who) {
        case "ME":
          scope.obj.name = legacyContainer.scope.TP1Username;
          getitems();
          break;
        case "CSR":
          // who="CSR" is for use in games, where managers might need to display/edit the identity of CSRs
          // These are explicit watchers on changing the Team or CSR box (not necessary in "ME" mode).
          legacyContainer.scope.$watch("filters.Team",
            function(newValue, oldValue) {
              if (Team != newValue) {
                Team = newValue;
                getitems();
              }
            }
          );
          legacyContainer.scope.$watch("filters.CSR",
            function(newValue, oldValue) {
              if (CSR != newValue) {
                CSR = newValue;
                scope.obj.name = newValue;
                getitems();
              }
            }
          );
          break;
      }
    }
  }
}]);


angularApp.directive("avatarUpload", function() {
  return {
    scope: {
      imageSrc: '=avatarUpload'
    },

    link: function(scope, el) {
      el.bind('change', function(evt) {
        if (evt.target.files.length > 0) {
          scope.$apply(function(scope) {
            scope.imageSrc = evt.target.files[0];
          });
        }
      });
    }
  };
});