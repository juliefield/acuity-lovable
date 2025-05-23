/* global Raphael, userProfile, a$, ko, LoginViewModel, InitViewModel */

window.userProfile = (window.userProfile || {});

$(document).ready(function () {
    "use strict";

    $.AcuityLogoAnimate({ canvas: Raphael(0, 0, 500, 70), offset: [4, 1] });
    
    userProfile.loginfmt = function() {
        if (($.cookie("username") !== null) && ($.cookie("username") !== "")) {
            $(".login-form,.auth-hide").hide();
            $(".login-username").html($.cookie("username"));
            $(".login-welcome,.auth-show").show();
            // getLists();
            launchApp();
        }
    };
    
    userProfile.loginfmt();
    // TODO: refactor these bindings (if possible) to use knockout
    $('.err-icon').qtip({ content: 'Error (Click for details)' }).bind("click", function () {
        if ($(".err-container").first().is(":visible")) $(".err-container").hide();
        else $(".err-container").show();
    });
    $('.err-hide').bind("click", function () { $(".err-container,.err-icon").hide(); });
    $("#errsubmit").bind("click", function () {
        a$.submiterror($("#errinput").val());
        $(".err-container,.err-icon").hide();
    });

   ko.applyBindings(new LoginViewModel(), document.getElementById("loginForm"));
});

function getLists() {
    "use strict";

    $(".loading").show();

    a$.ajax({
        type: "GET", 
        service: "JScript", 
        async: true, 
        data: { lib: "userprofile", cmd: "getlistuser" }, 
        dataType: "json", 
        cache: false, 
        error: function() {
            a$.ajaxerror;
            $(".loading").hide();
        },
        success: function(json) { 
            ko.applyBindings( new InitViewModel( json ), document.getElementById("userSelection"));
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
        error: function() {
            a$.ajaxerror();
        },
        success: function(json) { 
            // store lists as a property on parent object
            userProfile.lists = json;

        }
    });
}
   
// global: does it need to be?
function launchApp() {
    "use strict";
    var u = a$.gup("userid");
    if (u === "") u=$.cookie("username");

    a$.ajax({
        type: "GET", service: "JScript", async: true, data: { lib: "userprofile", cmd: "getname", user: u }, dataType: "json", cache: false, error: a$.ajaxerror,
        success: loaded });

    function loaded() {
        var u = a$.gup("userid"); // i.e. ?userid=jeffgack
        if (u === "") {
            u=$.cookie("username");
        }

        getLists();
    }

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