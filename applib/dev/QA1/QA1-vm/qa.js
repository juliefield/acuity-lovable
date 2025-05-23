angularApp.directive("ngAcuityQaPopup", ['api', '$compile', '$rootScope', function (api, $compile, $rootScope) {
    return {
        template: '<div class="acuity-qa-popup"></div>',
        scope: {
            test: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            var tbld = '<ng-acuity-qa text="My Monitor" details="My Details" framepage="' + a$.gup("framepage") + '" formid="' + a$.gup("formid") + '" dataview="' + a$.gup("dataview") + '" masterid="' + a$.gup("masterid") + '" examinee="' + a$.gup("examinee") + '" examiner="' + a$.gup("examiner") + '"></ng-acuity-qa>';
            var ele = $compile(tbld)(scope);
            angular.element($(" .acuity-qa-popup", element)).empty().append(ele);

        }
    }
} ]);

angularApp.directive("ngAcuityQa", ['api', '$compile', '$rootScope', function (api, $compile, $rootScope) {
    return {
        templateUrl: a$.debugPrefix() + '/applib/dev/QA1/QA1-view/qa.htm?' + Date.now(),
        /*

        template: '<div class="">' +
        '<div class="dev-bug dev-bug-collapsed" ng-show="devshowing()"></div>' +
        '<div class="dev-bug-verbose" style="display:none;">' +
        '<div class="dev-display-reports-controls">' +
        '	<label>cid:</label><span class="dev-display-reports-cid"></span>' +
        '</div>' +
        '<div class="dev-display-reports">' +
        '    Developer Panels' +
        '</div>' +
        '<div class="dev-display-reports-controls">' +
        '    <input type="button" class="dev-display-reports-test" value="Test Query" />' +
        '    <input type="button" class="dev-display-reports-save" value="Save Query" />' +
        '     <label> Usage:</label><select class="dev-display-reports-usage"></select>' +
        '     <label> Render As:</label><select class="dev-display-reports-render"></select>' +
        '    <input type="button" class="dev-display-format" value="Format SQL" />' +

        '</div>' +
        '</div>' +
        '<div class="progressindicator" style="z-index:10; position:absolute; top: 50%; left: 50%;display:none;">Loading...</div>' +
        '<div class="ThisReport" style="height:inherit;" <!-- ng-bind-html="reporthtml()" -->></div>' +
        '</div>' +
        '<div class="modal1-shadow" ng-show="detailsshowing()">' +
        '<div class="modal1-base">' +
        '{{detailstext}}' +
        '<div class="link report-details-link" ng-click="showdetails(false)">hide details</div>' +
        '</div>' +
        '</div>',
        */
        scope: {
            text: "@",
            details: "@",
            formid: "@",
            examinee: "@",
            examiner: "@",
            dataview: "@",
            masterid: "@",
            framepage: "@",
            temprefid: "@",
            parentmasterid: "@",
            entdt: "@"
        },
        require: '^ngLegacyContainer',
        link: function (scope, element, attrs, legacyContainer) {
            //Test
            if ((!a$.exists(scope.framepage)) || (scope.framepage == "")) {
                scope.framepage = "jq/monitors/V3/Subform_base_1.aspx";
            }
            if (a$.exists(scope.formid)) {
                //alert("debug: 2-a$.urlprefix(true)=" + a$.urlprefix(true));
                //alert("debug: 2-a$.debugPrefix()=" + a$.debugPrefix());
                var filters = "";
                filters += legacyContainer.scope.filters.CSR ? "&CSR=" + legacyContainer.scope.filters.CSR : "";
                filters += legacyContainer.scope.filters.Team ? "&Team=" + legacyContainer.scope.filters.Team : "";
                filters += legacyContainer.scope.filters.Group ? "&Group=" + legacyContainer.scope.filters.Group : "";
                filters += legacyContainer.scope.filters.Location ? "&Location=" + legacyContainer.scope.filters.Location : "";
                filters += legacyContainer.scope.filters.Project ? "&Project=" + legacyContainer.scope.filters.Project : "";
                filters += legacyContainer.scope.filters.StartDate ? "&StartDate=" + legacyContainer.scope.filters.StartDate : "";
                filters += legacyContainer.scope.filters.EndDate ? "&EndDate=" + legacyContainer.scope.filters.EndDate : "";
                filters += legacyContainer.scope.filters.Qualityform ? "&Qualityform=" + legacyContainer.scope.filters.Qualityform : "";
                filters += legacyContainer.scope.filters.scorecard ? "&scorecard=" + legacyContainer.scope.filters.scorecard : "";
                
                var myteam = legacyContainer.scope.filters.Team;
                var mygroup = legacyContainer.scope.filters.Group;
                var mylocation = legacyContainer.scope.filters.Location;
                var myproject = legacyContainer.scope.filters.Project;
                var mystartdate = legacyContainer.scope.filters.StartDate;
                var myenddate = legacyContainer.scope.filters.EndDate;
                var myqualityform = legacyContainer.scope.filters.Qualityform;
                var mycid = legacyContainer.scope.filters.cid;
                var myscorecard = legacyContainer.scope.filters.scorecard; //toppertext here duck

                //$("iframe", element).attr("src", "https://" + a$.urlprefix(true) + "acuityapmr.com/" + scope.framepage + "?formid=" + scope.formid + "&dataview=" + (a$.exists(scope.dataview) ? scope.dataview : "") + "&masterid=" + (a$.exists(scope.masterid) ? scope.masterid : "") + "&temprefid=" + (a$.exists(scope.temprefid) ? scope.temprefid : "") + "&examinee=" + (a$.exists(scope.examinee) ? scope.examinee : "") + "&examiner=" + (a$.exists(scope.examiner) ? scope.examiner : "") + "&prefix=" + a$.urlprefix().split(".")[0] + "&cache=" + Date.now());
                $("iframe", element).attr("src", "");
                $("iframe", element).attr("id", "SidekickSubformID").attr("src", a$.debugPrefix() + "/" + scope.framepage + "?formid=" + scope.formid + "&dataview=" + (a$.exists(scope.dataview) ? scope.dataview : "") + "&masterid=" + (a$.exists(scope.masterid) ? scope.masterid : "") + "&entdt=" + (a$.exists(scope.entdt) ? scope.entdt : "") + "&parentmasterid=" + (a$.exists(scope.parentmasterid) ? scope.parentmasterid : "") + "&temprefid=" + (a$.exists(scope.temprefid) ? scope.temprefid : "") + "&examinee=" + (a$.exists(scope.examinee) ? scope.examinee : "") + "&examiner=" + (a$.exists(scope.examiner) ? scope.examiner : "") + "&prefix=" + a$.urlprefix().split(".")[0] + filters + "&cache=" + Date.now());
            }
            else {
                alert("debug: no formid");
            }

            scope.donewaiting = true;

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
                scope.checkfilters();
            };
        }
    }
} ]);