angularApp.directive("ngThumb", ['api', function (api) {
  return {
    templateUrl: "../applib/dev/SOCIAL1/SOCIAL1-view/thumb.htm?" + Date.now(),
    scope: {
      context: "@",
      uid: "@",
      thumbupOn: "<", // one-time binding
      message: "@",
    },
    require: '^ngLegacyContainer',
    link: function (scope, element, attrs, legacyContainer) {
      scope.editing = false;

      // angularjs is not able to correctly update a String primitive when used with ng-model
      // so our message text would be lost; instead we copy it to an object property here which we use in the template
      scope.msg = {
        'text': scope.message,
      };

      scope.edit = function () {
        scope.editing = true;
        scope.msg.origText = scope.msg.text;
      }

      scope.save = function () {
        // this is separate from toggleThumbsUp so we can separate the saving of the comment message
        // from the giving of a thumbs up (i.e. saving comment always implies a thumbs up)
        scope.toggleThumbsUp(true).then(function () {
          scope.$apply(function (scope) {
            scope.msg.origText = null;
            scope.editing = false;
          });
        });
      }

      scope.cancel = function () {
        scope.editing = false;
        scope.msg.text = scope.msg.origText;
        scope.msg.origText = null;
      }

      scope.toggleThumbsUp = function (force) {
        // allow for forcing the thumbs up, otherwise if not set we just toggle
        thumbupOn = force ? true : !scope.thumbupOn;

        return api.getJS({
          lib: "fan",
          cmd: "saveThumb",
          context: "teammate-performance", /* Necessary, as all contexts behave differently */
          /* there's an optional fromuid member (the person giving the thumbsup).  When omitted, it makes it from the person logged in */
          touid: scope.uid, /* uid of the csr */
          up: thumbupOn, /* true if thumbs up, false if undoing a thumbsup */
          comment: scope.msg.text,
        }).then(function (json) {
          scope.$apply(function (scope) {
            scope.thumbupOn = thumbupOn;
          });
        });
      };
    }
  }
}]);

angularApp.service('thumbs', ['api', '$filter', function (api, $filter) {
  this.all = {};
  this.unseenGiven = null;
  this.unseenReceived = null;
  this.received = 0;
  this.given = 0;
  this._who; // we're going to save this on the initial get call so we can use it later if needed

  this.liveThumbFilter = function (startdate, enddate, today) {
    return new Date(startdate) <= today && new Date(enddate) >= today;
  };

  this.updateThumbCounts = function () {
    // the dates we get from the server for thumbs will default to "midnight"
    // so we use 'today' at midnight (i.e. the previous occuring midnight)
    // this ensures thumbs will be shown ON their startdate and enddate, inclusive
    var _self = this;
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var received = $filter('filter')(this.all.received, function (val) {
      return _self.liveThumbFilter(val.startdate, val.enddate, today);
    });

    var given = $filter('filter')(this.all.given, function (val) {
      return _self.liveThumbFilter(val.startdate, val.enddate, today);
    });

    // updates the indicator if there are new thumbs to be seen or not
    this.unseenGiven = $filter('filter')(given, {'seen': 'N'}).length;
    this.unseenReceived = $filter('filter')(received, {'seen': 'N'}).length;

    this.received = received.length;
    this.given = given.length;
  };

  this.markThumbsSeen = function (thumbs) {
    if (!thumbs || thumbs.length === 0) return;
    var _self = this;

    //Parameter "ids" contains a list of IDs for the seen thumbs (There's now an id member for each thumb.given and .received).
    var thumbIds = [];
    for (var thumb in thumbs) {
      thumbIds.push(thumbs[thumb].id);
    }

    api.getJS({
      lib: "fan",
      cmd: "markThumbsSeen",
      ids: thumbIds,
    }).then(function (json) {
      //json.saved comes back as true.
      _self.get(this._who);
    });
  };

  this.get = function (who) {
    this._who = who;
    var _self = this;

    api.getMe({who: who, members: ["person", "thumbs"]}).then(function (json) {
      if (json.me.thumbs) {
        _self.all = json.me.thumbs;
        _self.updateThumbCounts();
      }
    });
  };
}]);

angularApp.directive('thumbprint', ['thumbs', function (thumbs) {
  return {
    restrict: 'E',
    require: '^ngLegacyContainer',
    templateUrl: "../applib/dev/SOCIAL1/SOCIAL1-view/thumbprint.htm?" + Date.now(),
    scope: {
      dir: '@', // given, received, or both
      small: '<',
      activeDir: '=',
      contexts: "@",
      lookback: "@",
      who: "@"
    },

    controller: function ($scope) {
      $scope.thumbs = thumbs;

      $scope.thumbclick = function (dir) {
        if ($scope.activeDir === dir) {
          $scope.activeDir = '';
        } else {
          $scope.activeDir = dir;
        }
      };

      $scope.isGivenVisible = function () {
        return 'given' === $scope.dir || 'both' === $scope.dir;
      };

      $scope.isReceivedVisible = function () {
        return 'received' === $scope.dir || 'both' === $scope.dir;
      };
    },


    link: {
      pre: function (scope, element, attrs, legacyContainer) {
        if (!attrs.dir) attrs.dir = 'both';
        if (!attrs.small) attrs.small = false;

        switch (scope.who) {
          case "ME":
            scope.myname = legacyContainer.scope.TP1Username;
            thumbs.get(scope.who);
            break;
          case "CSR":
            legacyContainer.scope.$watch("filters.CSR",
              function (newValue, oldValue) {
                if (CSR != newValue) {
                  CSR = newValue;
                  scope.myname = newValue;
                  thumbs.get(scope.who);
                }
              }
            );
            break;
        }
      }
    }
  }
    ;
}]);

// TODO: thumbpanel probably works better if it doesn't know about given/received and just receives a list and a name
// i.e. much fewer ng-if statements in the template and less tight binding
angularApp.directive('thumbpanel', ['thumbs', function (thumbs) {
  return {
    restrict: 'E',
    templateUrl: "../applib/dev/SOCIAL1/SOCIAL1-view/thumbpanel.htm?" + Date.now(),
    scope: {
      activeDir: '=', // two way so panel can close itself by setting to empty str
      thumbsList: '<',
      isActive: '<' // allows one-way binding as a bool
    },
    controller: function ($scope) {
      // TODO: allow to close panel?
      $scope.thumbs = thumbs;
    }
  };
}]);

angularApp.directive("ngThumbset", ['api', 'thumbs', '$filter', function (api, thumbs, $filter) {
  return {
    templateUrl: "../applib/dev/SOCIAL1/SOCIAL1-view/thumbset.htm?" + Date.now(),
    scope: {
      contexts: "@",
      lookback: "@",
      who: "@"
    },
    require: '^ngLegacyContainer',
    link: function (scope, element, attrs, legacyContainer) {
      scope.thumbs = thumbs; // expose the thumbs service directly to scope
      scope.listready = false;
      scope.dir = "";
      scope.thumbsList = [];
      var CSR = "";

      scope.$watch('dir', function (dir) {
        if (dir === '') {
          scope.listready = false;
          return;
        }

        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dir === 'given') {
          scope.thumbsList = $filter('filter')(thumbs.all.given, function (val) {
            return thumbs.liveThumbFilter(val.startdate, val.enddate, today);
          });
        } else if (dir === 'received') {
          scope.thumbsList = $filter('filter')(thumbs.all.received, function (val) {
            return thumbs.liveThumbFilter(val.startdate, val.enddate, today);
          });
        }

        scope.listready = true;
        thumbs.markThumbsSeen($filter('filter')(scope.thumbsList, {'seen': 'N'})); // only send unseen thumbs
      });
    }
  }
}]);
