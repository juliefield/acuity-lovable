/* global Raphael, userProfile, a$, ko, LoginViewModel, InitViewModel */

window.acuityApp = (window.acuityApp || {});
window.userProfile = (window.userProfile || {});

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
    });
    $(window).trigger("resize");

    //    $.AcuityLogoAnimate({ canvas: acuityApp.canvas, offset: [4, 1] });

    ko.applyBindings(new LoginViewModel({ launch: function () {
        acuityApp.launchApp();
    }, reload: false
    }),
    $(".login-wrapper")[0]);

});

acuityApp.launchApp = function () {
    "use strict";
    var u = a$.gup("userid");
    if (u === "") u = $.cookie("username");

    a$.ajax({
        type: "GET", service: "JScript", async: true, data: { lib: "userprofile", cmd: "getname", user: u }, dataType: "json", cache: false, error: a$.ajaxerror,
        success: loaded
    });

    function loaded() {
        var u = a$.gup("userid"); // i.e. ?userid=jeffgack
        if (u === "") {
            u = $.cookie("username");
        }

        userProfile.getLists();
    }

}

userProfile.getLists = function () {
    "use strict";

    $(".loading").show();

    a$.ajax({
        type: "GET",
        service: "JScript",
        async: true,
        data: { lib: "userprofile", cmd: "getlistuser" },
        dataType: "json",
        cache: false,
        error: function () {
            a$.ajaxerror;
            $(".loading").hide();
        },
        success: function (json) {
            ko.cleanNode(document.getElementById("userSelection"));
            ko.applyBindings(new InitViewModel(json), document.getElementById("userSelection"));
            $(".loading").hide();
        }
    });


    a$.ajax({
        type: "GET",
        service: "JScript",
        async: true,
        data: { lib: "userprofile", cmd: "getlistproject" },
        dataType: "json",
        cache: false,
        error: function () {
            a$.ajaxerror();
        },
        success: function (json) {
            // store lists as a property on parent object
            userProfile.lists = json;

        }
    });
}

userProfile.moveProgressBar = function() {
    var getPercent = ($('.progress-wrap').data('progress-percent') / 10);
    var getProgressWrapWidth = $('.progress-wrap').width();
    var progressTotal = getPercent * getProgressWrapWidth;
    var animationLength = 2500;
    
    // on page load, animate percentage bar to data percentage length
    // .stop() used to prevent animation queueing
    $('.progress-bar').stop().animate({
        left: progressTotal
    }, animationLength);
};

window.onerror = function() {
    // protect against an error during loading show (stale session, ko binding errors)
    $(".loading").hide();
};