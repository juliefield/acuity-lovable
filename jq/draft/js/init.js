/* global Raphael, userProfile, a$, ko, LoginViewModel, InitViewModel */

window.acuityApp = (window.acuityApp || {});

$(document).ready(function () {
    "use strict";

    acuityApp.canvas = Raphael(0, 0, 280, 70)
  
    $(window).trigger("resize");

    //    $.AcuityLogoAnimate({ canvas: acuityApp.canvas, offset: [4, 1] });

    ko.applyBindings(new LoginViewModel({
        launch: function () {
            acuityApp.launchApp();
        },
        reload: true
    }),
    $(".login-wrapper")[0]);

});

acuityApp.launchApp = function () {
    "use strict";

    var u = a$.gup("userid");
    if (u === "") u = $.cookie("username");

    document.CONFIG = "Dashboard";

    ko.cleanNode($(".draft-wrapper")[0]);

    ko.applyBindings(DraftViewModel({ mock: true, test: true, testdateoffset: 0, theme: "football", leagueid: 0 }), $(".draft-wrapper")[0]);

    ko.postbox.publish("uid", u);
    ko.postbox.publish("Role", $.cookie("role"));
    ko.postbox.publish("CSR", "");
    ko.postbox.publish("Team", "");

}

window.onerror = function() {
    // protect against an error during loading show (stale session, ko binding errors)
    $(".loading").hide();
};
