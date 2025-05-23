/* global Raphael, userProfile, a$, ko, LoginViewModel, InitViewModel */

window.acuityApp = (window.acuityApp || {});

$(document).ready(function() {
    "use strict";

    acuityApp.canvas = Raphael(0, 0, 280, 70)
    $(window).resize(function() {
        var x;
        if ($(window).width() < 500) {
            x = -164;
            $(".app-logo").addClass("app-logo-mobile");
            $(".app-heading").addClass("app-heading-mobile");
        } else {
            $(".app-logo").removeClass("app-logo-mobile");
            $(".app-heading").removeClass("app-heading-mobile");
            x = 4;
        }
        $.AcuityLogoAnimate({
            canvas: acuityApp.canvas,
            offset: [x, 1]
        });
        ko.postbox.publish("ResizeWindow", true);
    });
    $(window).trigger("resize");

    //    $.AcuityLogoAnimate({ canvas: acuityApp.canvas, offset: [4, 1] });

    ko.applyBindings(new LoginViewModel({
            launch: function() {
                acuityApp.launchApp();
            },
            reload: true
        }),
        $(".login-wrapper")[0]);

});

acuityApp.launchApp = function() {
    "use strict";

    var u = a$.gup("userid");
    if (u === "") u = $.cookie("TP1Username");

    document.CONFIG = "Popup";

    ko.cleanNode($(".agent-wrapper")[0]);

    ko.applyBindings(AgentViewModel({}), $(".agent-wrapper")[0]);

    ko.postbox.publish("Role", $.cookie("TP1Role"));

    //TODO: the general login "control" doesn't set TP1Role.  I wonder if it sets TP1Username?

    ko.postbox.publish("CSR", "");
    if ($.cookie("TP1Role") == "CSR") {
        ko.postbox.publish("CSR", u);
    } else if ($.cookie("TP1Role") == "Team Leader") {
        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "filters",
                cmd: "gethierarchy",
                role: $.cookie("TP1Role"),
                user: u
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: tmhiloaded
        });

        function tmhiloaded(json) {
            if (a$.jsonerror(json)) {} else if (!a$.exists(json.teams)) {
                alert("No Team Found");
                neuter();
            } else {
                if (json.teams.length > 0) {
                    ko.postbox.publish("Team", json.teams[0].id);
                } else {
                    neuter();
                }
            }
        }
    }
}

function neuter() {
    ko.postbox.publish("Role", "CSR");
    ko.postbox.publish("CSR", $.cookie("TP1Username")); //Effectively locks a team leader to lower privilege settings.
}

window.onerror = function() {
    // protect against an error during loading show (stale session, ko binding errors)
    $(".loading").hide();
};
