function rankItems(items, rankBy, rankProperty, reverse) {
  // ranks all the items in items according to their rankBy property
  // ties are attributed as equal and ranked the same
  // rankProperty is the key the rank will be stored in
  // setting reverse to true will rank from lowest to highest rankBy

  reverse = reverse || false;
  rankProperty = rankProperty || 'rank';
  rankBy = rankBy || 'score';

  items.sort(function(a, b) {
    return b[rankBy] - a[rankBy];
  });

  var rank = 1;

  for (var i = 0; i < items.length; i++) {
    if (i > 0 && items[i][rankBy] < items[i - 1][rankBy]) {
      rank = i + 1;
    }

    items[i][rankProperty] = rank;
  }
}

angularApp.directive("ngMyTeam", ['api', '$filter', function(api, $filter) {
  return {
    templateUrl: "../applib/dev/MYTEAM1/MYTEAM1-view/myteam.htm?" + Date.now(),
    scope: {
      who: "@"
    },
    require: '^ngLegacyContainer',
    link: function(scope, element, attrs, legacyContainer) {

			//Only one "who" I can think of for now, but keeping.
      switch (scope.who) {
        case "ME":
          scope.myname = legacyContainer.scope.TP1Username;
          //getitems();
          break;
      }

      api.getMe({ who: scope.who, members: ["person","teams","csrs","thumbs"] }).then(function (json) {
      	scope.$apply(function () {
      		scope.me = json.me;
      		
          if (a$.exists(json.me.teams)) {
            scope.team = $filter('filter')(json.me.teams, {mine: 'Y'})[0];
          }

          if (a$.exists(json.me.csrs)) {
            scope.teammates = $filter('filter')(json.me.csrs, {myteam: 'Y'});
          }

          // load correct avatar file paths
          for (var i = 0; i < scope.teammates.length; i++) {
            scope.teammates[i]['avatarfilename'] =
              scope.teammates[i]['stg']['avatarFilename'] ? scope.teammates[i]['stg']['avatarFilename'] :
              scope.teammates[i]['avatarfilename'] ? '../jq/avatars/' + scope.teammates[i]['avatarfilename'] :
              '../jq/avatars/' + 'empty_headshot.png';
          }

          rankItems(scope.teammates, 'score');
        });
      });

    }
  }
}]);