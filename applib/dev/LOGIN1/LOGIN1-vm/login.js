// dynamically add ngCookies to the app requirements, this should likely be moved to main.js though
angularApp.requires.push('ngCookies', 'ngSanitize');

angularApp.service('auth', ['api', '$cookies', '$rootScope', function (api, $cookies, $rootScope) {
  var settings = {
    path: '/'
  };

  var vm = this;

  this.login = function (username, email, password, opts) {
    // TODO: login via email address?

    opts || (opts = {});
    opts.product || (opts.product = 'Acuity');
    opts.service || (opts.service = 'JScript'); // alternatively, C#

    var data = {
      lib: 'login',
      cmd: 'loginkey',
      username: username,
      product: opts.product
    };

    // first fetch a key for encyphering password
    return api.postJS(data).then(function (res) {
      if (res.errormessage) {
        vm.clearLogin();
        throw res.msg;
      }

      var data = {
        lib: 'login',
        cmd: 'login',
        username: username,
        pcypher: a$.encypher(password, res.pkey), // still using appLib, for now ( TODO? )
        product: opts.product
      };

      return api.postJS(data).then(function (json) {
        if (json.errormessage) {
          vm.clearLogin();
          throw { message: json.msg };
        }

        if (json.passwordage >= json.expirationdays) {
          throw {
            name: "passwordChangeRequired",
            username: username,
            uid: json.uid
          };
        }

        if (json.expirationdays - json.passwordage <= json.warningdays) { // testing: || username === '...'
          throw {
            name: "passwordChangeRecommended",
            username: username,
            uid: json.uid,
            days: json.expirationdays - json.passwordage
          };
        }

        var roleName = null;
        if(json.role != null)
        {
          roleName = json.role;
        }
        //$cookies.put('uid', json.uid, settings);
        //$cookies.put('username', username, settings);
        //json.role ? $cookies.put('role', json.role, settings) : null;
        vm.loginRedirect(username, json.uid, roleName);
      });
    });
  };

  this.loginRedirect = function (username, uid, roleName) {
    username = username || $rootScope.username;
    uid = uid || $rootScope.uid;

    if ($rootScope.embedded == "Y") {
        $.cookie("username", username);
        $.cookie("uid", uid);
        $.cookie("TP1Username", username);
        if(roleName == null)
        {
          $.cookie("TP1Role", "unknown"); //Need to call something to determine this.
        }
        else{
          $.cookie("TP1Role", roleName); 
        }
        
        window.location.reload(false);
        return;
    }
    
    //url is really the rest of the 
    var u;
    //Old Way
    //u = a$.gup("url");
    //New Way
    if (window.location.href.indexOf("?url=") > 0) {
    	u = window.location.href.substring(window.location.href.indexOf("?url=")+5);
    }
    var defu = !a$.exists(u);
    if (!defu) {
    	if ((u === "") || (u.lastIndexOf("/") < 0)) defu = true;
    }
    if (defu) u = "/jq/dashboardasync.aspx"; //Default Page
    
    /*
    if (window.location.href.indexOf("performant") >= 0) {
    	u = "/3/ComplianceFormPerformant.aspx";
    }
    */

    var folder = a$.debugPrefix() + u.substring(0, u.lastIndexOf("/"));
    if (u.length > 0) {
        if (u[0] == "/") {
            u = a$.debugPrefix() + u;
        }
    }
    window.location = folder + "/pageauth.aspx?username=" + username + "&uid=" + uid + "&url=" + u;
  };

  this.clearLogin = function () {
    //$cookies.remove('uid', settings);
    //$cookies.remove('username', settings);
    //$cookies.remove('role', settings);
  };

  this.changePassword = function (username, uid, oldPassword, newPassword, opts) {
    opts || (opts = {});
    opts.product || (opts.product = 'Acuity');
    opts.service || (opts.service = 'JScript'); // alternatively, C#

    var data = {
      lib: 'login',
      cmd: 'changepassword',
      current: oldPassword,
      change: newPassword,
      username: username,
      product: opts.product
    };

    return api.postJS(data).then(function (json) {
      if (json.errormessage) {
        throw {
          message: json.msg
        }
      }
      // password was updated, log the user in
      vm.loginRedirect(username, uid);
    }).catch(function (res) {
      throw res;
    });
  };
}]);

// custom validation for username or email field
angularApp.directive('usernameOrEmail', function () {
  // copied from Angular
  var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

  return {
    require: '?ngModel',
    link: function (scope, el, attrs, ctrl) {
      // only apply the validator if ngModel is present and AngularJS has added the email validator
      if (ctrl && ctrl.$validators.email) {

        // this will overwrite the default AngularJS email validator
        ctrl.$validators.email = function (modelValue) {
          // we assume if there's no @ then this is not an email address and simply return true
          return ctrl.$isEmpty(modelValue) || (modelValue.indexOf('@') === -1) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };
});

// new password and repeat password must match
angularApp.directive('passwordVerify', function () {
  return {
    require: '?ngModel',
    link: function (scope, el, attrs, ctrl) {
      ctrl.$validators.passwordMismatch = function (modelValue, viewValue) {
        return viewValue === scope.$eval(attrs.passwordVerify);
      };

      // watch the initial password field as well so we can rerun validation when it is changed
      scope.$watch(
        function () {
          return scope.$eval(attrs.passwordVerify);
        },
        function () {
          ctrl.$validate();
        }
      )
    }
  };
});

angularApp.directive('passwordStrength', function () {
  return {
    require: '?ngModel',
    link: function (scope, el, attrs, ctrl) {
      var strength = {
        0: "Worst 🙁",
        1: "Bad 🙁",
        2: "Weak 🙁",
        3: "Good 🙂",
        4: "Strong 🙂"
      };

      ctrl.$validators.passwordStrength = function (modelValue) {
        if (!modelValue) return;

        var result = zxcvbn(modelValue);

        scope.score = result.score;
        scope.scoreText = 'Strength: <strong>' + strength[result.score] +
          '</strong> <span class="feedback">' + result.feedback.warning +
          ' ' + result.feedback.suggestions + '</span>';

        return result.score >= 3;
      }
    }
  };
});

// new password must not be the same as old (current) password
angularApp.directive('originalPassword', function () {
  return {
    require: '?ngModel',
    link: function (scope, el, attrs, ctrl) {
      ctrl.$validators.originalPassword = function (modelValue, viewValue) {
        return viewValue !== scope.$eval(attrs.originalPassword);
      }
    }
  };
});

angularApp.directive('ngLogin', ['auth', '$rootScope', function (auth, $rootScope) {
  return {
    templateUrl: a$.debugPrefix() + '/applib/dev/LOGIN1/LOGIN1-view/login.htm?' + Date.now(), //TODO: This needs to detect localhost and adjust accordingly.
    //templateUrl: '../LOGIN1-view/login.htm?' + Date.now(),
    require: '^ngLegacyContainer',
    scope: {
        embedded: "@"
    },
    link: function (scope, element, attrs, legacyContainer) {
      scope.error = false;
      $rootScope.loginMode = 'login';
      $rootScope.embedded = scope.embedded;

      scope.submitLogin = function (isValid) {
        if (!isValid) {
          scope.error = "Please correct the errors below.";
        } else {
          auth.login(
            scope.creds.email, // just sending as username for now
            null,
            scope.creds.password
          ).then(function (res) {
            // display errors or redirect
            var myres = res;
          }).catch(function (res) {
            if (res.name === 'passwordChangeRequired') {
              scope.$apply(function () {
                scope.error = "Your password is expired and must be changed before continuing.";
                scope.forcePasswordChange(res.username, res.uid);
              });

              return;
            }

            if (res.name === 'passwordChangeRecommended') {
              scope.$apply(function() {
                scope.error = "Your password expires in " + res.days + " days. We recommend you change it now before it expires.";
                scope.forcePasswordChange(res.username, res.uid, true);
              });

              return;
            }

            scope.$apply(function () {
              scope.error = res.message;
            });
          });
        }
      };

      scope.isEmail = function (val) {
        // if username contains an @ sign we assume it's an email
        return !val || (val && val.indexOf('@') > -1);
      }

      scope.forcePasswordChange = function (username, uid, skippable) {
        // put username and uid in root scope so password change directive can log in with them
        $rootScope.username = username;
        $rootScope.uid = uid;
        $rootScope.loginMode = 'changePassword';
        $rootScope.canSkipPasswordReset = !!skippable;
      }
    }
  };
}]);

angularApp.directive('ngChangePassword', ['auth', '$rootScope', function (auth, $rootScope) {
  return {
    //templateUrl: '../LOGIN1-view/changePassword.htm?' + Date.now(),
    templateUrl: a$.debugPrefix() + '/applib/dev/LOGIN1/LOGIN1-view/changePassword.htm?' + Date.now(), //TODO: This needs to detect localhost and adjust accordingly.
    require: '^ngLegacyContainer',
    link: function (scope, element, attrs, legacyContainer) {
      scope.error = false;
      scope.score = undefined;
      scope.scoreText;

      scope.submitPasswordChange = function (isValid) {
        if (!isValid) {
          scope.error = 'Please correct the errors below.';
        } else {
          auth.changePassword($rootScope.username, $rootScope.uid, scope.creds.currentPassword, scope.creds.newPassword1);
        }
      }

      scope.skipPasswordChange = function () {
        auth.loginRedirect();
      };
    }
  }
}]);

angularApp.directive('ngEmbeddedLogin', ['auth', '$rootScope', function (auth, $rootScope) {
  return {
    //templateUrl: '../LOGIN1-view/changePassword.htm?' + Date.now(),
    templateUrl: a$.debugPrefix() + '/applib/dev/LOGIN1/LOGIN1-view/embeddedLogin.htm?' + Date.now(), //TODO: This needs to detect localhost and adjust accordingly.
    require: '^ngLegacyContainer',
    link: function (scope, element, attrs, legacyContainer) {
        scope.LOGGED_IN = function() {
            return ((scope.TP1Username != null) && (scope.TP1Username != ""));
        }
        scope.LOG_OUT = function() {
            scope.TP1Username = "";
            //DONE: Really log out, as in wipe out your uid.
            $.cookie("TP1Username", "");
            $.cookie("TP1Role", "");
            $.cookie("username", "");
            $.cookie("uid", "");
        }
    }
  }
}]);


angularApp.directive('ngEmbeddedHeader', ['auth', '$rootScope', function (auth, $rootScope) {
  return {
    //templateUrl: '../LOGIN1-view/changePassword.htm?' + Date.now(),
    templateUrl: a$.debugPrefix() + '/applib/dev/LOGIN1/LOGIN1-view/embeddedHeader.htm?' + Date.now(), //TODO: This needs to detect localhost and adjust accordingly.
    require: '^ngLegacyContainer',
    scope: {
        iframehide: "@",
        cidreload: "@"
    },
    link: function (scope, element, attrs, legacyContainer) {


        if (a$.gup("nocidreload") != "") {
            legacyContainer.scope.cidreload = "false";  //Allow an override of the header attribute by parameter.  nocidreload=true
        }
        else {
            legacyContainer.scope.cidreload = scope.cidreload; //Best place to tuck this (smh).
        }

        if (scope.iframehide == "true") {
            //alert("debug: hide this in the iframe...");
            if (window.location !== window.parent.location)  { //In an iframe
                $(element).hide();
            }
        }
        scope.showname = legacyContainer.scope.TP1Username;

        scope.LOG_OUT = function() {
            legacyContainer.scope.LOG_OUT();
        }

        scope.SHOW_ERROR = function() {
            if (!$(".err-container").is(":visible")) {
                $(".err-container").show();
            }
            else {
                $(".err-container").hide();
            }            
        }
        scope.HIDE_ERROR = function() {
            $(".err-icon").hide();
            $(".err-container").hide();            
        }
    }
  }
}]);


