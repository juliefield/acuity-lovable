angularApp.directive("ngAssistTables","$rootscope", [function ($rootscope) {
    return {
        //templateUrl: "../applib/dev/REPORT1/REPORT1-view/editor.htm?" + Date.now(),
        templateUrl: "/applib/dev/SidePerfShell1/SKPERF_REPORTS-view/assisttables.htm?" + Date.now(), //TODO: DEVPAGELOC
        scope: {
            text: "@"
        },
				compile: function(tElem, tAttrs) {
        	console.log(name + ': compile');
        	
        	return {
          	pre: function(scope, iElem, iAttrs){
            	console.log(name + ': pre link');
          	},
          	post: function(scope, iElem, iAttrs){
            	console.log(name + ': post link');
          	}
        	}
      	},
        link: function (scope, element, attrs, legacyContainer) {
        	scope.tablerows = 0;
        }
    }
} ]);