//************************************
//***** NOTE - DO NOT MODIFY, THIS IS BEING DISCONTINUED WHEN SIDEKICK PROJECT IS MERGED.
//
//  Old includes:
//    applib/js/controllers/main.js
//
//  New includes:
//    applib/js/modules/mainModule.js
//    applib/js/controllers/legacyController.js
//    applib/js/services/mainServices.js
//

// MODULE
var angularApp = angular.module('angularApp', ['ngSanitize']);

// CONTROLLERS
angularApp.controller('legacyController', ['$scope', '$interval', '$http', function ($scope, $interval, $http) {

    $scope.readyFilterSet = false;

    //Cookies
    $scope.TP1Username = $.cookie("TP1Username");
    $scope.TP1Role = $.cookie("TP1Role");

    //PubSubs (used for Knockout communication, standardized to allow changes to be reflected in scope).
    $scope.filters = {};
    $scope.filters.Team = "";
    $scope.filters.CSR = $.cookie("CSR"); //Will be blank unless it was a parameter in a credentialed app.

    try { //Knockout may not be present, that's ok.
        ko.postbox.subscribe("Team", function (newValue) {
            if ($scope.filters.Team != newValue) {
                $scope.$apply(function () {
                    $scope.filters.Team = newValue;
                });
            }
        });
        ko.postbox.subscribe("CSR", function (newValue) {
            if ($scope.filters.CSR != newValue) {
                $scope.$apply(function () {
                    $scope.filters.CSR = newValue;
                });

            }
        });
    } catch (e) { }

    //jquery .ready late call
    if (a$.exists(document.legacyReady)) {
        var stop = $interval(function () {
            if ($scope.readyFilterSet) { //List all legacy-tethered directives
                $interval.cancel(stop);
                document.legacyReady();
                ShowHideNV(window.location.hash); //Hash needs set on initial load as well as when it changes.

            }
        }, 100);
    } else { //Native V3 may be getting passover parameters, but won't have to wait.
        if ($.cookie("CSR") != "") {
            $scope.filters.CSR = $.cookie("CSR");
        }
        ShowHideNV(window.location.hash); //Hash needs set on initial load as well as when it changes.
    }

    //---- HASHTAG NAVIGATION ------------------------------------------------------------------------------
    window.addEventListener('hashchange', function () {
        ShowHideNV(window.location.hash);
    });
    function ShowHideNV(hashtag) {
        hashtag = hashtag.substring(1).toLowerCase(); //Remove the # for easy comparison
        $(".nv").hide();
        $(".nv").each(function () {
            var nv = $(this).attr("nv");
            if (nv != null) {
                nvs = nv.split(";");
                for (var h in nvs) {
                    //If the nv string begins with the same as the entire hashtag, then it get's shown.
                    //if (nvs[h].indexOf(hashtag) == 0) {
                    if (nvs[h] == hashtag) {
                        $(this).show();
                        break;
                    }
                    //hashtag = sidekick/summary/performance, nv = default:sidekick/summary   - Should not match (exact required).
                    //hashtag = sidekick/summary, nv = default:sidekick/summary   - Should match.
                    else if (nvs[h].indexOf("default:") == 0) {
                        var tnv = nvs[h].substring("default:".length);
                        if (tnv == hashtag) {
                            $(this).show();
                            break;
                        }
                    }
                    //hashtag = sidekick/summary/performance, nv = sidekick/summary - Should match, upstream match.
                    else if (hashtag.length > nvs[h].length) {
                        if (hashtag.indexOf(nv[h]) == 0) {
                            $(this).show();
                            break;
                        }
                    }
                }
            }
        });
    }
    // Create Review Tabs
    $( function() {
        $( "#createReview" ).tabs();
    } );

    // Agents Filter and Search
    $('.tab_contents').hide();

    $('.tab').click(function(e) {
        var target = $(this.rel);          
        $('.tab_contents').not(target).hide();
        target.toggle();

        $('.tab').not($(this)).removeClass('active');
        if ($(this).hasClass('active')){
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }        

        e.stopPropagation();
        return false;
    });

} ]);

// SERVICES
angularApp.service('api', function () {
    this.getJS = function (data) {
        return this.doJS(data, "GET");
    }
    this.postJS = function (data) {
        return this.doJS(data, "POST");
    }

    this.doJS = function (data, sendtype, notasync, params) { //getJS, postJS, getCP, postCP ?  Truly haven't decided yet.
        var a = {
            type: sendtype,
            service: "JScript",
            async: true,
            data: data,
            dataType: "json",
            cache: false,
            params: params
        };
        if (notasync) {
        	a.async = false;
        }
        var loc = window.location.host;
        if (loc.indexOf("localhost", 0) < 0) {
            loc = window.location.protocol + '//' + window.location.host + "/";
        } else {
            loc = window.location.protocol + '//' + window.location.host;
            loc += a$.xss(window.location.pathname).substr(0, a$.xss(window.location.pathname).indexOf(".com") + 5);
        }
        a.url = loc;

        if (!a.service) {
            //alert("debug: No Service Specified - calling C#");
            a.service = "C#";
        }
        if (a.service == "C#") {
            a.url += "ajaxjson.ashx";
        } else if (a.service == "JScript") {
            a.url += "jshandler.ashx";
        } else {
            alert("Invalid Service: " + a.service);
            a.url += "ajaxjson.ashx";
        }
        if (a$.exists(a.params)) {
            a.url += "?" + a.params;
        }
        if (!a.data.uname) {
            if (!a.data.auth) a.data.auth = { username: a$.xss($.cookie("username")), uid: a$.xss($.cookie("uid")) }; //was: appLib.secobj();
        }
        var prefixfound = false;
        if (exists(a.params)) {
            prefixfound = (a.params.indexOf("prefix=") >= 0);
        }
        if (exists(a.data.prefix)) prefixfound = true;
        if (!prefixfound) {
            a.data.prefix = a$.urlprefix().split(".")[0];
        }

        return new Promise(function (resolve) {
            a.success = function (json) {
                resolve(json);
            };
            a.error = a$.ajaxerror;
            $.ajax(a);
        });
    }

		var me = this;

		//NEW WAY - The ME object.  This is in the 'api' for now, should it be it's own service?

    var gettingme = false;
    var meready = false;
    this.getMe = function (o) {
    		if (typeof o != "object") {
    			alert("No object passed to getMe");
    		}
    		if (!o.who) o.who = "ME";
    		if (!o.members) o.members = [];

        if (!gettingme) {
            gettingme = true;
            return new Promise(function (resolve) {
                me.getJS({
                    lib: "spine",
                    cmd: "getMe", //TODO: Can split out into separate calls.
                    members: o.members,
                    idtype: o.who
                }).then(function (json) {
                    me.me = json.me;
                    meready = true;
                    resolve(me);
                });
            });
        }
        else {
            return new Promise(function (resolve) {
                function readytest() {
                    if (!meready) {
                        setTimeout(readytest, 100);
                    }
                    else {
                        resolve(me);
                    }
                }
                readytest();
            });
        }
    }

		//Similarly, the client object.
		
    var gettingclient = false;
    var clientready = false;
    this.getClient = function (o) {
    		if (typeof o != "object") {
    			alert("No object passed to getClient");
    		}
    		if (!o.who) o.who = "ME";
    		if (!o.members) o.members = [];

        if (!gettingclient) {
            gettingclient = true;
            var data = {
                    lib: "spine",
                    cmd: "getClient", //TODO: Can split out into separate calls.
                    members: o.members,
                    idtype: o.who
                };
            if (a$.exists(o.restrictusers)) {
            	data.restrictusers = o.restrictusers;
            }
            return new Promise(function (resolve) {
                me.getJS(data).then(function (json) {
                    me.client = json.client;
                    clientready = true;
                    resolve(me);
                });
            });
        }
        else {
            return new Promise(function (resolve) {
                function readytest() {
                    if (!clientready) {
                        setTimeout(readytest, 100);
                    }
                    else {
                        resolve(me);
                    }
                }
                readytest();
            });
        }
    }

});

// DIRECTIVES

//All directives that need access to the legacy scope need to be inside this directive.
angularApp.directive("ngLegacyContainer", function () {
    return {
        //template: '<div style="height:600px;width:600px;"></div>',
        controller: function ($scope) {
            this.scope = $scope;
        }
    };
});

angularApp.directive("ngFilterSet", function () {
    return {
        templateUrl: "/applib/html/directives/filterset.htm",
        link: function ($scope, element, attrs) {
            // Trigger when number of children changes, including by directives like ng-repeat
            var watch = $scope.$watch(function () {
                return element.children().length;
            }, function () {
                // Wait for templates to render
                $scope.$evalAsync(function () {
                    // Finally, directives are evaluated
                    $scope.readyFilterSet = true; //LEGACY
                });
            });
        }
    }
});

// TESTS (Leave these in, there's markup in the app that requires these).

angularApp.controller('helloworldController', ['$scope', function ($scope) {
    $scope.name = 'Jeff Gack';
} ]);


angularApp.controller('headerController', ['$scope', function ($scope) {

    //$scope.name = 'Chat test';


} ]);


angularApp.controller('subtestController', ['$scope', function ($scope) {

    $scope.name = 'My Subname';


} ]);