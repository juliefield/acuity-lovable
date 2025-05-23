/* global Raphael, userProfile, a$, ko, LoginViewModel, InitViewModel */

window.acuityApp = (window.acuityApp || {});

$(document).ready(function () {
    "use strict";

    acuityApp.canvas = Raphael(0, 0, 280, 70)
    $(window).resize(function () {
        var x;
        if ($(window).width() < 500) {
            x = -164;
            $(".app-logo").addClass("app-logo-mobile");
            $(".app-heading").addClass("app-heading-mobile");
        }
        else {
            $(".app-logo").removeClass("app-logo-mobile");
            $(".app-heading").removeClass("app-heading-mobile");
            x = 4;
        }
        $.AcuityLogoAnimate({ canvas: acuityApp.canvas, offset: [x, 1] });
        ko.postbox.publish("ResizeWindow", true);
    });
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

    //Examples for of establishing a viewmodel
    ko.cleanNode($(".io-wrapper")[0]);
    ko.applyBindings(IoWrapperViewModel(), $(".io-wrapper")[0]);
    //ko.postbox.publish("Role", $.cookie("role"));
}

window.onerror = function() {
    // protect against an error during loading show (stale session, ko binding errors)
    $(".loading").hide();
};