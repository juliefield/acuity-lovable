/************
appMMP
************/
(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    //TODO: Move this to lib - or should it go to "site" or something - REVIEW.
    function setmobiledivs() {
        var mobilesim = false;
        if (appLib.gup("mobile") != "") {
            mobilesim = true;
        }
        var mobclass = (jQuery.browser.mobile || mobilesim) ? ".mobile-show" : ".mobile-hide";
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; i++) {
            var rules = ss[i].cssRules || ss[i].rules;
            for (var j = 0; j < rules.length; j++) {
                if (rules[j].selectorText === mobclass) {
                    rules[j].style.display = "block";
                    return;
                }
            }
        }
    }
    window.onload = function () {
        setmobiledivs();
    }
    /*
    $(document).ready(function () {
    });
    */
    var global_aldiv = "";
    var global_redirect = "";
    var global_uid = "";

    function login(me, redirect, aldiv, uid, pid) {
        global_aldiv = aldiv;
        global_redirect = redirect;
        global_uid = uid;
        var urlbld = "ajaxxml.ashx";
        $.ajax({
            type: "GET",
            url: urlbld,
            async: false,
            data: "login=1&username=" + $("#" + uid).val() + "&password=" + $("#" + pid).val(),
            dataType: "xml",
            cache: false,
            error: function (request, textStatus, errorThrown) {
                alert('Login Communication Error:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
            },
            success: loadLoginXML
        });
    }

    function logout() {
        $.cookie("MMP-uid", null);
        $.cookie("MMP-username", null);
        window.location = "../"; //TODO: mobile is different
    }

    var myguid = "FAILURE";
    function loadLoginXML(xml) {
        $(xml).find('Authentication').each(function () {
            $(this).find('AccessKey').each(function () {
                myguid = $(this).find("UID").text();
                if (myguid != "FAILURE") {
                    //alert("Login Successful!  Uid=" + myguid);
                    $.cookie("MMP-uid", myguid);
                    $.cookie("MMP-username", $("#" + global_uid).val());
                    if (global_redirect != "") {
                        if (jQuery.browser.mobile) {
                            window.location = global_redirect + "m/"; //this isn't very good.
                        }
                        else {
                            window.location = global_redirect + "/";
                        }
                    }
                }
                else {
                    $.cookie("MMP-uid", "");
                    appLib.outputerror(global_aldiv, "Invalid Username/Password");
                }
            });
        });
    }

    function getclientsettings() {
        var urlbld = "../ajaxjson.ashx";
        $.ajax({
            type: "GET",
            url: urlbld,
            async: true,
            data: "clientsettings=1&username=" + $.cookie("MMP-username") + "&uid=" + $.cookie("MMP-uid"),
            dataType: "json",
            cache: false,
            error: function (request, textStatus, errorThrown) {
                alert('ClientSettings Communication Error:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
            },
            success: loadClientSettingsJSON
        });
    }

    var client;
    function loadClientSettingsJSON(json) {
        client = json;
        if (client.errormessage) {
            alert(client.msg);
            window.location = "../"; //TODO: mobile is different
        }
    }

    function ExampleOfExtend(options) {
        alert("we are in the extend example function");
        var opts = $.extend({}, EXAMPLEdefaultOptions, options);
        alert(dumpObj(opts, "DUMP", "", 0));
    }


    // global variables
    window.appMMP = {
        ExampleOfExtend: ExampleOfExtend,
        login: login,
        logout: logout,
        getclientsettings: getclientsettings,
        client: client
    };
})();