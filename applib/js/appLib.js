//appLib - Common JS Library Functions
/**
* jQuery.browser.mobile (http://detectmobilebrowser.com/)
*
* jQuery.browser.mobile will be true if the browser is a mobile device
*
**/

if (typeof jQuery.browser == 'undefined') {
    jQuery.browser = {};
}
(function (a) { jQuery.browser.mobile = /android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)) })(navigator.userAgent || navigator.vendor || window.opera);

var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

//alert("debug:ua=" + ua);
//alert("debug:isandroid=" + isAndroid + " SETTING TO TRUE");
isAndroid = false;
var myFlexGames = [];
var allTextResources = [];
var gScoringType = null;

function setmobiledivs(disallowmobile) {
    //TODO: Automatic Mobile is defeated for now (the site is going live and mobile is not complete).
    if (disallowmobile) jQuery.browser.mobile = false;

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

(function () {
    var $ = window.jQuery;
    var myguid = "FAILURE";

    var timediff = 0;

    var ajaxTrace = { active: false, outdiv: '', indiv: '', defeatCallback: false };

    function settimediff(td) {
        timediff = td;
    }

    function WindowTop() {
        var win = window.self;
        while (win != window.top) {
            if (win.document.AcuityMainFrame) break;
            win = win.parent;
        }
        return win;
    }

    function ajax(a, xd) {
        if (exists(xd)) {
            a.url = xd + "/";
            //a.crossDomain = true;
        }
        else {
            var loc = window.location.host;
            if (loc.indexOf("localhost", 0) < 0) {
                loc = window.location.protocol + '//' + window.location.host + "/";
            }
            else {
                loc = window.location.protocol + '//' + window.location.host;
                loc += xss(window.location.pathname).substr(0, xss(window.location.pathname).indexOf(".com") + 5);
            }
            a.url = loc;
        }
        if (!a.service) {
            //alert("debug: No Service Specified - calling C#");
            a.service = "C#";
        }
        if (a.CORS) {
            a.data.acuitytoken = "F7D9DFCB832B77EBF91A256823999";
            if (a.service == "C#") {
                a.url += "ajaxjsonExt.ashx";
            }
            else if (a.service == "JScript") {
                a.url += "jshandlerExt.ashx";
            }
            else {
                alert("Invalid Service: " + a.service);
                a.url += "ajaxjson.ashx";
            }
        }
        else {
            if (a.service == "C#") {
                a.url += "ajaxjson.ashx";
            }
            else if (a.service == "JScript") {
                a.url += "jshandler.ashx";
            }
            else {
                alert("Invalid Service: " + a.service);
                a.url += "ajaxjson.ashx";
            }
        }
        if (exists(a.params)) {
            if (a.type != "POST") {
                a.url += "?" + a.params;
            }
            else {
                //The params have to go into the data structure, which will be placed in the body (can't mix params and body).
                var p = a.params.split('&');
                for (var i in p) {
                    if (p[i] != "") {
                        var ps = p[i].split("=");
                        var val = "";
                        if (ps.length > 1) val = ps[1];
                        a.data[ps[0]] = val;
                    }
                }
            }
        }

        if (exists(a.browsercache_minutes)) {
            if (!a.browsercache_minutes) {
                a.cache = false; //Let the standard cache-buster handle it.
            }
            else {
                a.cache = true;
                a.url += ((a.url.indexOf("?") < 0) ? "?" : "&") + perfdate("Minutes",a.browsercache_minutes);
            }
        }

        if (!a.data.uname) {
            if (!a.data.auth) a.data.auth = secobj();
        }
        var continuesuccess;
        var poptrace = "";
        if (!a.data.trace) { } else poptrace = a.data.trace;

        if (ajaxTrace.active || (poptrace != "")) {
            continuesuccess = a.success;
            var outdiv = ajaxTrace.outdiv;
            if ((poptrace == "out") || (poptrace == "both")) outdiv = "";
            if (ajaxTrace.active || (poptrace == "out") || (poptrace == "both")) {
                $.dump({ object: a, targetDiv: outdiv });
                $("#" + outdiv).append(a.url + "?");
            }
            var indiv = ajaxTrace.indiv;
            if ((poptrace == "in") || (poptrace == "both")) indiv = "";
            if ((poptrace != "in") && (poptrace != "both") && ajaxTrace.active && ajaxTrace.defeatCallback) {
                a.success = function (json) {
                    $.dump({ object: json, targetDiv: indiv });
                };
            }
            else {
                a.success = function (json) {
                    $.dump({ object: json, targetDiv: indiv });
                    continuesuccess(json);
                };
            }
        }
        a.error = function (xhr, status, error) {
            if (ajaxTrace.active || (poptrace != "")) {
                var indiv = ajaxTrace.indiv;
                $("#" + indiv).append(xhr.responseText);
            }
            else {
                //TODO: Add a robust error handling system.
                //alert("AJAX ERROR: " + xhr.responseText);
                //TEMP: 2022-11-14 - Hide bubble-up errors for now (they were not visible before).
                //$(".err-content",WindowTop().document).html("NETWORK ERROR (Please Report): " + xhr.responseText);
                //$(".err-icon",WindowTop().document).show();
            }
        }
        var prefixfound = false;
        if (exists(a.params)) {
            prefixfound = (a.params.indexOf("prefix=") >= 0);
        }
        if (exists(a.data.prefix)) prefixfound = true;
        if (!prefixfound) {
            a.data.prefix = urlprefix().split(".")[0];
        }
        $.ajax(a);
    }
    function login(a, xd) {
        /* {
            uid: //ID of username-containing form element
            errdiv: //error div (optional)
            pid: //ID of password-containing form element
            product: //product name i.e. "Acuity" or "Fetch"
            service: 'C#' or 'JScript'.  C# by default for now.
            version: //product version - if blank, defaults to 1.0
            succeeded: Callback function for successful login,
            failed: Callback function for failed login
            redirect: //url for redirect if successful (not used of succeeded function exists)
        } */
        if (!a.product) alert("Login functionality has changed");
        var cbhold = appLib.ajaxTrace.defeatCallback; //Can't defeat this callback, or the user won't be logged in :)
        appLib.ajaxTrace.defeatCallback = false;
        var databld = { cmd: 'loginkey', username: ((exists(a.uid)) ? $("#" + a.uid).val() : a.username), product: a.product };
        ajax({
            type: "POST", async: false, data: databld, dataType: "json", cache: false, service: a.service, CORS: a.CORS, error: ajaxerror,
            success: gotkey
        }, xd);
        function gotkey(json) {
            if (a.errdiv && json.errormessage) {
                $.cookie("uid", "");
                $(normselect(a.errdiv)).css("display", "inline");
                $(normselect(a.errdiv)).html(json.msg);
            }
            else if (jsonerror(json)) {
                $.cookie("uid", "");
            }
            else {
                var key = json.pkey;
                var databld = { cmd: 'login', username: ((exists(a.uid)) ? $("#" + a.uid).val() : a.username), pcypher: encypher(((exists(a.pid)) ? $("#" + a.pid).val() : a.password), key), product: a.product };
                //REFERENCE:,testobject:{id:1,val:"a"},testarray:[{ id: 1, name: "amit" }, { id: 2, name: "ankit" }]
                ajax({
                    type: "POST", async: false, data: databld, dataType: "json", cache: false, service: a.service, CORS: a.CORS, error: ajaxerror,
                    success: loaded
                }, xd);
                appLib.ajaxTrace.defeatCallback = cbhold;

                function loaded(json) {
                    if (a.errdiv && json.errormessage) {
                        if (a.failed) {
                            a.failed({ msg: json.msg });
                            return;
                        }
                        $.cookie("uid", "");
                        $(normselect(a.errdiv)).css("display", "inline");
                        $(normselect(a.errdiv)).html(json.msg);
                    }
                    else if (jsonerror(json)) {
                        if (a.failed) {
                            a.failed({ msg: json.msg });
                            return;
                        }
                        $.cookie("uid", "");
                    }
                    else {
                        myguid = json.uid;
                        $.cookie("uid", myguid);
                        $.cookie("username", ((exists(a.uid)) ? $("#" + a.uid).val() : a.username));
                        if (exists(json.role)) {
                            $.cookie("role", json.role);
                        }
                        if (a.redirect) {
                            if (jQuery.browser.mobile) {
                                window.location = a.redirect + "m/"; //this isn't very good.
                            }
                            else {
                                window.location = a.redirect + "/";
                            }
                        }
                        if (a.succeeded) {
                            a.succeeded({ uid: json.uid, role: json.role });
                            return;
                        }
                    }
                }
            }
        }
    }

    function cdtest() {
        var urlbld = "http://demo.goldendatasolutions.com/ajaxjson.ashx?callback=?"; //TODO:  Make this json like everything else, then push it down into the library server-side.
        //var urlbld = "ajaxjson.ashx?callback=?"; //TODO:  Make this json like everything else, then push it down into the library server-side.
        var databld = "ping=1";
        $.ajax({
            type: "GET", url: urlbld, async: false, data: databld, dataType: "jsonp", jsonp: 'callback', jsonpCallback: 'jsonpCallback',
            cache: false, error: ajaxerror,
            success: function () { alert("success"); }
        });
        function jsonpCallback(json) {
            alert(json);
            if (jsonerror(json)) {
            }
        }
    }

    function setmobiledivs() {
        var mobilesim = false;
        if (gup("mobile") != "") {
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

    function validateclass(classname, errdiv) {
        return validate('class', classname, errdiv);
    }

    function validatepiers(me, errdiv) {
        for (var i = 0; i < 10; i++) {
            me = $(me).parent();
            if ($(me).is("form")) {
                var id;
                if ($(me).attr('id')) {
                    id = $(me).attr('id');
                }
                else {
                    var newDate = new Date;
                    id = newDate.getTime(); //unique id
                    $(me).attr('id', id);
                }
                return validate('form', id, errdiv);
            }
        }
        alert("No form found in validatepiers function (appLib)");
    }

    function validateform(a) {
        return validate('form', a.formid, a.errdiv);
    }

    function validate(type, id, errdiv) {
        var r = new Array();
        var valid = true;
        var selector;
        if (type == 'form') {
            selector = "#" + id + " :input";
        }
        else if (type == 'class') {
            selector = "." + id;
        }
        else {
            alert("invalid validation type");
        }
        //expecting like:  /R:nonblank:0    a simple /R is valid and means the same is /R:nonblank:0
        //If group is zero, they are compared individually.
        //If greater than zero, they are checked as a group for a single match.
        $(selector).each(function (index) {
            var required = false;
            if ($(this).attr("name")) {
                var nspl = $(this).attr("name").split("/");
                for (var i in nspl) {
                    var vspl = nspl[i].split(":");
                    if (vspl[0] == "R") {
                        var n = 0;
                        if (vspl.length > 2) n = parseInt(vspl[2]);
                        if (r[n]) {
                            r[n].count += 1;
                        }
                        else {
                            r[n] = new Object();
                            r[n].count = 1;
                            r[n].nonblankcount = 0;
                        }
                        if ($(this).val() != "") {
                            r[n].nonblankcount += 1;
                        }
                    }
                }
            }
        });

        $(selector).each(function (index) {
            if ($(this).attr("name")) {
                var required = false;
                var nspl = $(this).attr("name").split("/");
                for (var i in nspl) {
                    var vspl = nspl[i].split(":");
                    if (vspl[0] == "R") {
                        var n = 0;
                        if (vspl.length > 2) n = parseInt(vspl[2]);
                        var color = "";
                        if ((r[n].count == 1) && (r[n].nonblankcount == 0)) {
                            valid = false;
                            color = "Red";
                        }
                        else if ((r[n].count > 1) && (r[n].nonblankcount == 0)) {
                            valid = false;
                            color = "Green";
                        }
                        if (color != "") {
                            //TODO:  If radio buttons or checkbox, draw a border around the parent?
                            $(this).css("border", "3px solid " + color);
                        }
                        else {
                            $(this).removeAttr("style");
                        }
                    }
                }
            }
        });
        if (!valid) {
            $(normselect(errdiv)).css("display", "block");
        }
        return valid;
        //    if ($(this).attr("type") == "checkbox") {
        //        databld += "&" + this.name + "=";
        //        databld += ($(this).attr('checked')) ? "YES" : "no";
        //    }
        //    else {
        //        databld += "&" + this.name + "=" + $(this).val(); //TODO: Will need to watch out for "&"s
        //    }
    }
    function ajaxerror(request, textStatus, errorThrown) {
        //alert('Communication Error:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
        //TEMP: 2022-11-14 - Hide bubble-up errors for now (they were not visible before).
        //$(".err-content",WindowTop().document).html('Communication Error:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
        //$(".err-icon",WindowTop().document).show();
    }
    function jsonerror(json) {
        if (exists(json.forcelogin)) {
            if (json.forcelogin == "Y") {
                alert("Credentials expired, please log in again.");
            }
        }
        if (json.errormessage) {
            //alert(json.msg);
            //TEMP: 2022-11-14 - Hide bubble-up errors for now (they were not visible before).
            //$(".err-content",WindowTop().document).html(json.msg + '<br />Page: ' + window.location.href);
            //$(".err-icon",WindowTop().document).show();
            return true;
        }
    }

    function debugPrefix() {
        if (window.location.href.indexOf("localhost") >= 0) {
            var us = window.location.href.split("/");
            for (i = 0; i < us.length - 1; i++) {
                if (us[i].indexOf("localhost") >= 0) {
                    return "/" + us[i + 1];
                }
            }
        }
        return "";
    }

    function xss(str) {
        if(str == null)
        {
            return "";
        }
        if (str.toString().indexOf("<") >= 0) return ""; //Markup refusal
        return str.toString().replace(/\;\"\(\)/g, ""); //XSS refusal.
    }

    function gup(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null) return "";
        else {
            //alert("debug:results[1]="+results[1]);
            return xss(decodeURI(results[1]));
        }
    }
    function addOption(elSel, text, val) {
        elSel.options[elSel.options.length] = new Option(text, val);
    }

    function setOption(sb, val) {
        for (i = 0; i < sb.options.length; i++) {
            if (sb.options[i].value == val) {
                sb.options[i].selected = true;
                return;
            }
        }
        return "";
    }

    function submitform(formid, otherfields) {
        //TODO: Add callback function (default to loadSubmitFormJSON).
        //TODO: Allow overridable path to the web service.
        var databld = { cmd: "submitform", formid: formid };

        if (otherfields) {
            for (var key in otherfields) {
                databld[key] = encodeURIComponent(otherfields[key]);
            }
        }
        $("#" + formid + " :input").each(function (index) {
            if ($(this).attr("type") == "checkbox") {
                databld[this.name] = ($(this).attr('checked')) ? "YES" : "no";
            }
            else if ($(this).attr("type") == "button") {
            }
            else {
                databld[this.name] = encodeURIComponent($(this).val());
            }
        });
        ajax({
            type: "GET", async: true, data: databld, dataType: "json", cache: false, error: ajaxerror,
            success: loadSubmitFormJSON
        });
        function loadSubmitFormJSON(json) {
            if (json.errormessage) {
                alert(json.msg);
            }
        }
    }
    function getallparams() {
        var results = window.location.href.split("?");
        if (results.length < 2) return "";
        else return results[1];
    }
    function fv(me, aldiv, msgdiv) {
        alert("fv deprecated");
    }

    //
    // examples
    var EXAMPLEdefaultOptions = {
        chartxy: {
            renderTo: 'containersmother',
            anotherthing: 'to add',
            defaultSeriesType: 'column'
        }
    }

    function ExampleOfExtend(options) {
        alert("we are in the extend example function");
        var opts = $.extend({}, EXAMPLEdefaultOptions, options);
        alert(dumpObj(opts, "DUMP", "", 0));
    }

    // utilities
    String.prototype.trim = function () { return this.replace(/^\s+|\s+$/, ''); };
    function dumpObj(obj, name, indent, depth) { if (depth > 20) { return indent + name + ": <Maximum Depth Reached>\n"; } if (typeof obj == "object") { var child = null; var output = indent + name + "\n"; indent += "  "; for (var item in obj) { try { child = obj[item]; } catch (e) { child = "<Unable to Evaluate>"; } if (typeof child == "object") { output += dumpObj(child, item, indent, depth + 1); } else { output += indent + item + ": " + child + "\n"; } } return output; } else { return obj; } }
    function IsObject(obj) {
        return obj ? true : false;
    }

    //Tests
    function setcookie(val) {
        $.cookie("testcookie", val);
    }
    function getcookie(val) {
        alert($.cookie("testcookie"));
    }

    function logout(redirect) {
        $.cookie("uid", null);
        $.cookie("username", null);
        if (redirect) {
            window.location = redirect; //"../"; //TODO: mobile is different
        }
    }

    /*
    function secparams() {
        return "username=" + $.cookie("username") + "&uid=" + $.cookie("uid");
    }
    */

    function secobj() {
        return { username: xss($.cookie("username")), uid: xss($.cookie("uid")) };
    }

    function changehash() {
        scroll(0, 0);
        showsection(location.hash);

        $("#leftpanel ul li a").each(function () {
            if ($(this).attr("href") == location.hash) {
                $(this).addClass("menu-active");
                $(this).removeClass("menu-inactive");
            }
            else {
                $(this).removeClass("menu-active");
                $(this).addClass("menu-inactive");
            }
        });
        //var hash = (location.hash.replace(/^#/, '') || 'blank') + '.';
    }

    function showsection(id) {
        hidemenu('ALL');
        hidesection('ALL');
        if (id != "#") {
            $(id + "," + id + " div").css("display", "");
        }
        else {
            $("#home,#home div").css("display", "");
        }
    }

    function hidemenu(id) {
        if (id == 'ALL') {
            $("#submenus div").each(function () {
                $(this).css("display", "none");
            });
        }
        else {
            $("#" + id).css("display", "none");
        }
    }

    function showmenu(id, me) {
        hidemenu('ALL');
        var ofs = $(window).width() - ($(me).offset().left + $(me).width() + parseInt($(me).css("padding-right")));
        //alert("ofs=" + ofs);
        $("#" + id).css("right", ofs + "px");
        $("#" + id).css("display", "block");
    }

    function hidesection(id) {
        if (id == 'ALL') {
            $("#sections div").each(function () {
                $(this).css("display", "none");
            });
        }
        else {
            $("#" + id).css("display", "none");
        }
    }

    function encypher(val, key) {
        var bld = "";
        if (!key.length) key = "1";
        while (key.length < val.length) key += key;
        for (var i = 0; i < val.length; i++) {
            var a = val.charCodeAt(i) + key.charCodeAt(i);
            if (a > 256) a -= 256;
            bld += String.fromCharCode(a);
        }
        return bld;
    }
    function decypher(val, key) {
        var bld = "";
        if (!key.length) key = "1";
        while (key.length < val.length) key += key;
        for (var i = 0; i < val.length; i++) {
            var a = val.charCodeAt(i) - key.charCodeAt(i);
            if (a < 0) a += 256;
            bld += String.fromCharCode(a);
        }
        return bld;
    }

    function addCommas(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    function isIE() {
        return /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
    }

    function isFirefox() {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    }

    function urlprefix(BypassParam) {
        if (!BypassParam) {
            var par = gup("prefix");
            if (par != "") {
                return par + ".";
            }
        }
        var p = window.location.hostname + xss(window.location.pathname);
        var ix = p.indexOf(".acuityapm");
        if (ix >= 0) {
            p = p.substr(0, ix);
            var ps = p.split("/");
            p = ps[ps.length - 1];
            if (!BypassParam) {
                if (p == "km2-ext") p = "km2";
                if (p == "km2-history") p = "km2";
            }
            return p + ".";
        }
        return "";
    }

    function prefixhref(me) {
        var up = urlprefix(true);

        if (up == "km2.DISABLED") {
            var href = $(me).attr("href");
            if (href.indexOf("login.aspx") >= 0) {
                $(me).attr('href', "http://acuity.km2solutions.net");
                return true;
            }
        }

        if (up != "") {
            var href = $(me).attr("href");
            // Changed: 2016-05-23 to allow for non- http prefixed urls.
            if (href.indexOf("://") >= 0) {
                if (href.indexOf("://" + up) < 0) {
                    var url = $(me).attr('href').replace('://', '://' + up);
                    if (gup("prefix") != "") {
                        url += (url.indexOf("?") < 0) ? "?" : "&";
                        url += "prefix=" + gup("prefix");
                    }
                    $(me).attr('href', url);
                    //window.open(url, '_blank');
                    //window.focus();
                }
            }
            else if (href.indexOf("//" + up) < 0) {
                var url = $(me).attr('href').replace('//', '//' + up);
                if (gup("prefix") != "") {
                    url += (url.indexOf("?") < 0) ? "?" : "&";
                    url += "prefix=" + gup("prefix");
                }
                $(me).attr('href', url);
                //window.open(url, '_blank');
                //window.focus();
            }
            return true;
        }
        return false;
    }

    function preview() {
        if (gup("preview") == "false") return false;
        if (gup("preview") == "true") return true;
        var up = urlprefix();
        if ((up == "dev.") || (up == "demo.")) return true;
        return false;
    }

    function showprogress(id, label) {
        //if (!a$.isIE()) {
        //$("#" + id).html('<img src="./ajax-loader.gif" />');
        try {
            $("#" + id).spin("large", "#EF4521");
            $("#" + id).show();
        }
        catch (e) { };
        //}
        $("#loadingprompt").html(exists(label) ? label : "Loading...");
        $("#loadingprompt").show();
    }

    function hideprogress(id) {
        //if (!a$.isIE()) {
        try {
            $("#" + id).spin(false);
            $("#" + id).hide();
        }
        catch (e) { };
        //}
        $("#loadingprompt").hide();
    }

    var currenttablabel = "";
    function settablabel(lab) {
        currenttablabel = lab;
    }
    function gettablabel() {
        return currenttablabel;
    }

    function perfdate(perflevel,minutes) {
        var d = new Date();
        var akey = "111";


        d.setTime(d.getTime() - timediff);

        if (perflevel == "Normal") {
            return akey + "/" + d.getMonth() + "-" + d.getDate() + ":" + ((parseInt(d.getHours()) * 2) + parseInt(d.getMinutes() / 30));
        }
        else if (perflevel == "Express") {
            return akey + "/" + d.getMonth() + "-" + d.getDate();
        }
        else if (perflevel == "Minimum") {
            return akey;
        }
        else if (perflevel == "Minutes") {
            if (!minutes) minutes = 30;
            return akey + "/" + d.getMonth() + "-" + d.getDate() + ":" + Math.floor(((d.getHours() * 60) + d.getMinutes()) / minutes);
        }
        else {
            return "";
        }
    }

    function generatechart(op) {
        //TRY: Create a clone, then send the clone only to create the chart (leaving the originals intact).

        //CHANGED: To make it work with jquery 2.3.3.
        var opchart = $.extend(true, {}, op);

        var parentEL = $("#" + opchart.renderTo).parent();
        $("#" + opchart.renderTo).remove();
        parentEL.html('<div id="' + opchart.renderTo + '"></div>');
        opchart.mychart = new Highcharts.Chart(opchart);
        window.lastchart = op;
        if (exists(opchart.chart)) {
            if (exists(opchart.chart.renderTo)) {
                $("#" + opchart.chart.renderTo).removeClass("defaultSeriesType-column");
                $("#" + opchart.chart.renderTo).removeClass("defaultSeriesType-line");
                if (exists(opchart.chart.defaultSeriesType)) {
                    $("#" + opchart.chart.renderTo).addClass("defaultSeriesType-" + opchart.chart.defaultSeriesType);
                }
            }
        }
    }

    function exists(me) {
        return (typeof me != 'undefined');
    }

    function guid() {
        var tguid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return tguid;
    }

    function normselect(sel) {
        if (sel.length > 0) if ((sel.substring(0, 1) != "#") && (sel.substring(0, 1) != ".")) sel = "#" + sel;
        return sel;
    }

    function beautify(format, input) {
        if (format.toLowerCase() == "sql") {
            return new Promise(function (resolve) {
                $.ajax({
                    url: 'https://sqlformat.org/api/v1/format',
                    type: 'POST',
                    dataType: 'json',
                    crossDomain: true,
                    data: { sql: input, reindent: 1 },
                    success: function (data) {
                        resolve(data.result);
                    },
                    statusCode: {
                        200: function () {
                            //alert('everything is fine');
                        },
                        400: function () {
                            alert('SQL Beautify: bad request');
                        },
                        429: function () {
                            alert('SQL Beautify: usage limit exceeded');
                        },
                        500: function () {
                            alert('SQL Beautify: something went horribly wrong');
                        }
                    }
                });
            });

        }
    }


    function scrubAvatarLocation(inputToScrub, validatePreceedingSlash) {
        let scrubbedValue = inputToScrub;
        scrubbedValue = scrubbedValue.replace(/\.\.\/avatars\//g, "");
        scrubbedValue = scrubbedValue.replace(/\.\.\//g, "");
        if (scrubbedValue == null || scrubbedValue == "" || scrubbedValue == "empty_headshot.png") {
            scrubbedValue = "/jq/avatars/empty_headshot.png";
        }
        if ((validatePreceedingSlash != null && validatePreceedingSlash == true) && scrubbedValue[0] != "/") {
            scrubbedValue = "/" + scrubbedValue;
        }
        return scrubbedValue;
    }
    function getConfigParameters(forceReload, callback) {
        a$.ajax({
            type: "POST",
            service: "C#",
            async: true,
            dataType: "json",
            crossDomain: false,
            data: {
                lib: "selfserve",
                cmd: "getConfigParameters",
                forcereload: forceReload
            },
            error: a$.ajaxerror,
            success: function (data) {
                if (data.errormessage != null && data.errormessage == "true") {
                    a$.jsonerror(data);
                    return;
                }
                else {
                    if (callback != null) {
                        callback(JSON.parse(data.configParameters));
                    }
                    else {
                        return JSON.parse(data.configParameters);
                    }

                }
            }
        });
    }
    function getConfigParameterByName(name, callback) {
        a$.ajax({
            type: "POST",
            service: "C#",
            async: false,
            dataType: "json",
            crossDomain: false,
            data: {
                lib: "selfserve",
                cmd: "getConfigParameterByName",
                name: name
            },
            error: a$.ajaxerror,
            success: function (data) {
                if (data.errormessage != null && data.errormessage == "true") {
                    a$.jsonerror(data);
                    return;
                }
                else {

                    if (callback != null) {
                        callback(JSON.parse(data.parameter));
                    }
                    else {
                        return JSON.parse(data.parameter);
                    }
                }
            }
        });
    }
    function canAccessAGameLeague() {
        let returnValue = false;
        getConfigParameterByName("MODULE_AGAME", function (parameter) {
            if (parameter != null) {
                returnValue = (parameter.ParamValue.toUpperCase() == "ON".toUpperCase() ||
                    parameter.ParamValue.toUpperCase() == "YES".toUpperCase() ||
                    parameter.ParamValue.toUpperCase() == "true".toUpperCase());
            }
        });
        return returnValue;
    }
    function canAccessFlexModule() {
        let returnValue = false;
        getConfigParameterByName("MODULE_FLEX", function (parameter) {
            if (parameter != null) {
                returnValue = (parameter.ParamValue.toUpperCase() == "ON".toUpperCase() ||
                    parameter.ParamValue.toUpperCase() == "YES".toUpperCase() ||
                    parameter.ParamValue.toUpperCase() == "true".toUpperCase());
            }
        });
        return returnValue;
    }
    function canAccessChatModule() {
        let returnValue = false;
        getConfigParameterByName("MODULE_CHAT", function (parameter) {
            if (parameter != null) {
                returnValue = (parameter.ParamValue.toUpperCase() == "ON".toUpperCase() ||
                    parameter.ParamValue.toUpperCase() == "YES".toUpperCase() ||
                    parameter.ParamValue.toUpperCase() == "true".toUpperCase());
            }
        });
        return returnValue;
    }
    function canAccessSidekickModule() {
        let returnValue = false;
        getConfigParameterByName("MODULE_SIDEKICK", function (parameter) {
            if (parameter != null) {
                returnValue = (parameter.ParamValue.toUpperCase() == "ON".toUpperCase() ||
                    parameter.ParamValue.toUpperCase() == "YES".toUpperCase() ||
                    parameter.ParamValue.toUpperCase() == "true".toUpperCase());
            }
        });
        return returnValue;
    }
    
    function canAccessAGameWager() {
        let returnValue = false;
        getConfigParameterByName("MODULE_AGAME_WAGER", function (parameter) {
            if (parameter != null) {
                returnValue = (parameter.ParamValue.toUpperCase() == "ON".toUpperCase() ||
                    parameter.ParamValue.toUpperCase() == "YES".toUpperCase() ||
                    parameter.ParamValue.toUpperCase() == "true".toUpperCase());
            }
        });
        return returnValue;
    }
    function canAccessOverviewTab() {
        let returnValue = false;
        getConfigParameterByName("MODULE_OVERVIEW", function (parameter) {
            if (parameter != null) {
                returnValue = (parameter.ParamValue.toUpperCase() == "ON".toUpperCase() ||
                    parameter.ParamValue.toUpperCase() == "YES".toUpperCase() ||
                    parameter.ParamValue.toUpperCase() == "true".toUpperCase());
            }
        });
        return returnValue;
    }

    /*
    const ical = new datebook.ICalendar({
      title: 'Happy Hour',
      location: 'The Bar, New York, NY',
      description: 'Let\'s blow off some steam with a tall cold one!',
      start: new Date('2022-07-08T19:00:00'),
      end: new Date('2022-07-08T23:30:00'),
      // an event that recurs every two weeks:
      recurrence: {
        frequency: 'WEEKLY',
        interval: 2
      }
    })
    ical.download()
    */
    function showCalendarMenu(sel, callback, top, left) {
        if (!top) top = $(sel).offset().top;
        if (!left) left = $(sel).offset().left;
        //alert("debug: clicked on calendar menu, top:" + top + ",left:" + left);
        //Changed to subordinate menu instead of fixed.  WAS: style="top:' + (top) + 'px;left:' + left + 'px;"
        top = 0;
        left = 0;
        var html = '<div class="cal-menu"><div><ul><li class="ac-cal-outlook">Outlook</li><li class="ac-cal-google">Google</li><li class="ac-cal-ical">iCal File</li><li class="ac-cal-ms365">Microsoft 365</li></ul></div></div>';

        $(".cal-menu").parent().removeClass("cal-link-active");
        $(".cal-menu").remove();

        $(sel).append(html);
        $(sel).addClass("cal-link-active");

        $(".cal-menu").on("mouseleave", function () {
            $(this).parent().removeClass("cal-link-active");
            $(".cal-menu").remove();
        });
        $(".cal-menu li").on("click", function () {
            var e = callback();
            if ($(this).hasClass("ac-cal-ms365")) {
                const outlookCalendar = new datebook.OutlookCalendar({
                    title: e.title,
                    //location: 'The Bar, New York, NY',
                    description: e.description,
                    start: e.start,
                    end: e.end
                });
                if ($(this).hasClass("ac-cal-ms365")) {
                    outlookCalendar.setHost('office');
                }
                // else {
                //     outlookCalendar.setHost('live');
                // }
                var url = outlookCalendar.render();
                window.open(url);
            }
            else if ($(this).hasClass("ac-cal-google")) {
                const googleCalendar = new datebook.GoogleCalendar({
                    title: e.title,
                    //location: 'The Bar, New York, NY',
                    description: e.description,
                    start: e.start,
                    end: e.end
                });
                var url = googleCalendar.render();
                window.open(url);
            }
          else if ($(this).hasClass("ac-cal-ical") || $(this).hasClass("ac-cal-outlook")) {
                const iCalendar = new datebook.ICalendar({
                    title: e.title,
                    //location: 'The Bar, New York, NY',
                    description: e.description,
                    start: e.start,
                    end: e.end
                });
                const ics = iCalendar.render()
                console.log(ics);
                var form = document.createElement("form");
                form.setAttribute("method", "POST");
                form.setAttribute("action", "/jq/DownloadGrid.ashx");
                form.setAttribute("target", "_blank");
                var hf = document.createElement("input");
                hf.setAttribute("type", "hidden");
                hf.setAttribute("name", "downloadtype");
                hf.setAttribute("value", "ics");
                form.appendChild(hf);
                hf = document.createElement("input");
                hf.setAttribute("type", "hidden");
                hf.setAttribute("name", "downloadfilename");
                hf.setAttribute("value", "event");
                form.appendChild(hf);
                hf = document.createElement("input");
                hf.setAttribute("type", "hidden");
                hf.setAttribute("name", "csvBuffer");
                hf.setAttribute("value", ics);
                form.appendChild(hf);
                document.body.appendChild(form);
                form.submit();

            }
            else if ($(this).hasClass("ac-cal-yahoo")) {
                const yahooCalendar = new datebook.YahooCalendar({
                    title: e.title,
                    //location: 'The Bar, New York, NY',
                    description: e.description,
                    start: e.start,
                    end: e.end
                });
                var url = yahooCalendar.render();
                window.open(url);
            }
            else {
                alert("Calendar type not recognized.");
            }
            $(".cal-menu").remove();
        });
    }
    /*
    const googleCalendar = new datebook.GoogleCalendar({
      title: 'Happy Hour',
      //location: 'The Bar, New York, NY',
      description: 'Let\'s blow off some steam with a tall cold one!',
      start: new Date('2022-07-08T19:00:00'),
      end: new Date('2022-07-08T23:30:00'),
      // an event that recurs every two weeks:
      //recurrence: {
      //  frequency: 'WEEKLY',
      //  interval: 2
      //}
    });
    var url = googleCalendar.render();
    window.open(url);
    */

    function LoadResourceText(forceReload, isAsyncCall, callback) {
        if (isAsyncCall == null) {
            isAsyncCall = false;
        }
        if (forceReload == null) {
            forceReload = false;
        }
        if (allTextResources == null || allTextResources.length == 0 || forceReload == true) {
            a$.ajax({
                type: "GET",
                service: "C#",
                async: isAsyncCall,
                data: {
                    lib: "selfserve",
                    cmd: "getAllResourcesForClient"
                },
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: function (jsonData) {
                    if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                        a$.jsonerror(jsonData);
                        return;
                    }
                    else {
                        let resourceList = JSON.parse(jsonData.clientResourceList);
                        allTextResources.length = 0;
                        allTextResources = resourceList;
                        if (callback != null) {
                            callback(allTextResources);
                        }
                        else
                        {
                            return allTextResources;
                        }
                    }
                }
            });
        }
        return allTextResources;
    }
    function GetResourceText(key, language, defaultText) {
        if (language == null) {
            language = "en";
        }
        let resourceText = key;
         //Check that we have some resources.
         //no resource information foundl, force the load of the resource data array;
        if(allTextResources == null || allTextResources.length == 0)
        {
            LoadResourceText(true, false);
        }
        if(allTextResources != null && allTextResources.length >= 0)
        {
            let resourcesFiltered = allTextResources.filter(r => r.ResourceKey == key && r.ResourceLanguage == language);
            if (resourcesFiltered != null && resourcesFiltered.length > 0) {
                resourcesFiltered = resourcesFiltered.sort((a, b) => {
                    if (a.Client > b.Client) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                })
                resourceObject = resourcesFiltered[0];
                if (resourceObject != null) {
                    resourceText = resourceObject.ResourceText || "";
                }
            }
        }

        if (resourceText == key && defaultText != null) {
            resourceText = defaultText;
        }

        return resourceText;
    }
    function HandleResourceTexts(language) {
        //TODO: Determine if there are other HTML objects that have resource text
        //DIV/SPAN/P tags, etc.
        $("label").each(function () {
            let labelObject = $(this);
            let defaultText = null;
            if(labelObject.attr("defaultText") != null)
            {
                defaultText = labelObject.attr("defaultText");                
            }
            if(defaultText == null && labelObject.attr("defaulttext")  != null)
            {
                defaultText = labelObject.attr("defaulttext");
            }
            if (labelObject.attr("resource") != null) {
                let resourceKey = labelObject.attr("resource");
                if (resourceKey != null && resourceKey != "") {
                    let text = GetResourceText(resourceKey, language, defaultText);
                    if (text != null && text != "") {
                        labelObject.text(text);
                        labelObject.html(text);
                    }
                }
            }
        });
    }
    function FormatScore(scoreToFormat, formatType)
    {
        let returnValue = scoreToFormat;
        if(formatType == null)
        {
            formatType = "base";
            if(gScoringType == null)
            {
                gScoringType = "base";
                this.getConfigParameterByName("CLIENT_SCORING_CALC_TYPE", function(returnParam){
                    if(returnParam != null)
                    {
                        gScoringType = returnParam.ParamValue;
                    }
                });
            }
            formatType = gScoringType;
        }
        switch(formatType.toLowerCase())
        {
            case "stddev":
                returnValue = scoreToFormat.toFixed(4);
                break;
            default:
                returnValue = scoreToFormat.toFixed(2);
                break;
        }

        return returnValue;
    }

    window.appLib = {
        beautify: beautify,
        preview: preview,
        urlprefix: urlprefix,
        prefixhref: prefixhref,
        validateform: validateform,
        validateclass: validateclass,
        validatepiers: validatepiers,
        validate: validate,
        submitform: submitform,
        setmobiledivs: setmobiledivs,
        showprogress: showprogress,
        hideprogress: hideprogress,

        gettablabel: gettablabel,
        settablabel: settablabel,

        changehash: changehash,
        showsection: showsection,
        hidemenu: hidemenu,
        hidesection: hidesection,
        showmenu: showmenu,
        addCommas: addCommas,
        debugPrefix: debugPrefix,

        gup: gup,
        getallparams: getallparams,
        setmobiledivs: setmobiledivs,

        login: login,
        logout: logout,
        /* secobj: secobj, //Do not expose */
        ajaxerror: ajaxerror,
        jsonerror: jsonerror,
        settimediff: settimediff,
        perfdate: perfdate,
        encypher: encypher,

        addOption: addOption,
        setOption: setOption,
        fv: fv,
        setcookie: setcookie,
        getcookie: getcookie,
        exists: exists,

        cdtest: cdtest,
        WindowTop: WindowTop,
        ajax: ajax,
        xss: xss,
        ajaxTrace: ajaxTrace,
        isIE: isIE,
        isFirefox: isFirefox,
        isAndroid: isAndroid,
        dumpObj: dumpObj,
        generatechart: generatechart,
        guid: guid,
        scrubAvatarLocation: scrubAvatarLocation,
        getConfigParameters: getConfigParameters,
        getConfigParameterByName: getConfigParameterByName,
        canAccessAGameLeague: canAccessAGameLeague,
        canAccessAGameWager: canAccessAGameWager,
        canAccessFlexModule: canAccessFlexModule,
        canAccessChatModule: canAccessChatModule,
        canAccessSidekickModule: canAccessSidekickModule,
        canAccessOverviewTab: canAccessOverviewTab,
        showCalendarMenu: showCalendarMenu,
        LoadResourceText: LoadResourceText,
        GetResourceText: GetResourceText,
        HandleResourceTexts: HandleResourceTexts,
        FormatScore: FormatScore
    };
})();

var a$ = appLib;


//Experimenting with element-based utilities expressed as jquery controls being defined here.

// Prerequisites:  applib, chosen, ko.postbox


(function ($) {
    $.fn.downloadContents = function (o) {
        var me = this;
        if (!a$.exists(o)) { o = {}; };
        if (!a$.exists(o.format)) { o.format = "csv" }; //o.format  = "csv" or "doublepipe"

        //Until proven otherwise, use this rule.
        //Do NOT show content inside ANY tag UNLESS it's immediate parent is a span.
        function cleanContent(c) {
            return $(c).text().replace(/\xa0/g, " ").replace(/\n|\r/g, "");
            /*
            $(c).find("*").each(function() {
                var girl = 1;
 
            });*/

        }


        if ($(me).prop("tagName").toLowerCase() != "table") {
            //search fhr a table as a parent.
            var foundtable = false;
            while ($(me).prop("tagName").toLowerCase() != "body") {
                me = $(me).parent();
                if ($(me).prop("tagName").toLowerCase() == "table") {
                    foundtable = true;
                    break;
                }
            }
            if (!foundtable) {
                alert("downloadContents currently works only on tables");
                return;
            }
        }

        var html = "";
        var first = true;
        //Make column names the LAST row of the thead.
        $("thead tr:last-child th", me).each(function () {
            if ($(this).is(":visible")) {
                if (!first) html += "\t";
                first = false;
                html += cleanContent($(this));
                if (a$.exists($(this).attr("colspan"))) {
                    var cs = parseInt($(this).attr("colspan"));
                    for (var i = 1; i < cs; i++) {
                        html += "\t";
                    }
                }
            }
        });
        html = html + "\n";  // output each row with end of line
        $("tbody tr", me).each(function () {
            var first = true;
            $("td", this).each(function () {
                if ($(this).is(":visible")) {
                    if (!first) html += "\t";
                    first = false;
                    html += cleanContent($(this));
                }
            });
            html = html + "\n";  // output each row with end of line
        });
        var form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", "DownloadGrid.ashx");
        form.setAttribute("target", "_blank");
        var hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "downloadtype");
        hf.setAttribute("value", o.format);
        form.appendChild(hf);
        hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "downloadfilename");
        hf.setAttribute("value", "myfile");
        form.appendChild(hf);
        hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "csvBuffer");
        hf.setAttribute("value", html);
        form.appendChild(hf);
        document.body.appendChild(form);
        form.submit();

    };
}(jQuery));





//function table_download(o) {
//o.format  = "csv" or "doublepipe"

/*
var mya = new Array();
mya = $('#' + opt.apmTableId).getDataIDs();  // Get All IDs
var data = $('#' + opt.apmTableId).getRowData(mya[0]);     // Get First row to get the labels
var colNames = new Array();
var ii = 0;
for (var i in data) { colNames[ii++] = i; }    // capture col names
var html = "";
var first = true;
for (i = 0; i < colNames.length; i++) {
    if (!first) html += "\t";
    html += colNames[i];
    first = false;
}
html = html + "\n";  // output each row with end of line
for (i = 0; i < opt.data.length; i++) {
    data = opt.data[i];
    first = true;
    for (j = 0; j < colNames.length; j++) {
        if (!first) html += "\t";
        html += data[colNames[j]]; // output each column as tab delimited
        first = false;
    }
    html = html + "\n";  // output each row with end of line
}
*/

/*
var html = "";
var first = true;
//Make column names the LAST row of the thead.
$("thead tr:last-child th",tele).each(function() {
    if (!first) html += ",";
    first = false;
    html += $(this).html();
});
alert("debug: header line is:" + html);
*/

/*
//Try this instead of:
var form = document.createElement("form");
form.setAttribute("method", "POST");
form.setAttribute("action", "DownloadGrid.ashx");
form.setAttribute("target", "_blank");
var hf = document.createElement("input");
hf.setAttribute("type", "hidden");
hf.setAttribute("name", "downloadtype");
hf.setAttribute("value", downloadtype);
form.appendChild(hf);
hf = document.createElement("input");
hf.setAttribute("type", "hidden");
hf.setAttribute("name", "downloadfilename");
hf.setAttribute("value", "myfile");
form.appendChild(hf);
hf = document.createElement("input");
hf.setAttribute("type", "hidden");
hf.setAttribute("name", "csvBuffer");
hf.setAttribute("value", html);
form.appendChild(hf);
document.body.appendChild(form);
form.submit();
}
*/

(function ($) {
    /**
    * Auto-growing textareas; technique ripped from Facebook
    *
    *
    * http://github.com/jaz303/jquery-grab-bag/tree/master/javascripts/jquery.autogrow-textarea.js
    */
    $.fn.autogrow = function (options) {
        return this.filter('textarea').each(function () {
            var self = this;
            var $self = $(self);
            var minHeight = $self.height();
            var noFlickerPad = $self.hasClass('autogrow-short') ? 0 : parseInt($self.css('lineHeight')) || 0;
            var settings = $.extend({
                preGrowCallback: null,
                postGrowCallback: null
            }, options);

            var shadow = $('<div></div>').css({
                position: 'absolute',
                top: -10000,
                left: -10000,
                width: $self.width(),
                fontSize: $self.css('fontSize'),
                fontFamily: $self.css('fontFamily'),
                fontWeight: $self.css('fontWeight'),
                lineHeight: $self.css('lineHeight'),
                resize: 'none',
                'word-wrap': 'break-word'
            }).appendTo(document.body);

            var update = function (event) {
                var times = function (string, number) {
                    for (var i = 0, r = ''; i < number; i++) r += string;
                    return r;
                };

                var val = self.value.replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\n$/, '<br/>&nbsp;')
                    .replace(/\n/g, '<br/>')
                    .replace(/ {2,}/g, function (space) { return times('&nbsp;', space.length - 1) + ' ' });

                // Did enter get pressed?  Resize in this keydown event so that the flicker doesn't occur.
                if (event && event.data && event.data.event === 'keydown' && event.keyCode === 13) {
                    val += '<br />';
                }

                shadow.css('width', $self.width());
                shadow.html(val + (noFlickerPad === 0 ? '...' : '')); // Append '...' to resize pre-emptively.

                var newHeight = Math.max(shadow.height() + noFlickerPad, minHeight);
                if (settings.preGrowCallback != null) {
                    newHeight = settings.preGrowCallback($self, shadow, newHeight, minHeight);
                }

                $self.height(newHeight);

                if (settings.postGrowCallback != null) {
                    settings.postGrowCallback($self);
                }
            }

            $self.change(update).keyup(update).keydown({ event: 'keydown' }, update);
            $(window).resize(update);

            update();
        });
    };
})(jQuery);

function Global_CleanAvatarUrl(urlToClean) {
    let returnUrl = urlToClean;
    returnUrl.replace("../", "");
    returnUrl.replace("./", "");    
    if(returnUrl.indexOf("/avatars/") < 0 || returnUrl.startsWith("AV_"))
    {
        returnUrl = `${a$.debugPrefix()}/jq/avatars/${returnUrl}`;
    }
    else if (!returnUrl.startsWith("/")) {
        returnUrl = "/" + returnUrl;
        returnUrl = a$.debugPrefix() + returnUrl;
    }
    else
    {
        returnUrl = a$.debugPrefix() + returnUrl;
    }

    return returnUrl;
}
function Global_GetFlexGameInformation(gameId, callback) {
    let game = myFlexGames.find(g => g.FlexGameId == gameId);
    if (game == null) {
        game = Global_LoadFlexGameDataFromDatabase(gameId);
    }
    if (callback != null) {
        callback(game);
    }
    return game;

}
function Global_LoadFlexGameDataFromDatabase(gameId) {
    let returnData = null;
    a$.ajax({
        type: "GET",
        service: "C#",
        async: false,
        data: {
            lib: "flex",
            cmd: "getGameById",
            gameid: gameId
        },
        dataType: "json",
        cache: false,
        error: a$.ajaxerror,
        success: function (jsonData) {
            if (jsonData.errormessage != null && jsonData.errormessage == "true") {
                a$.jsonerror(jsonData0);
                return;
            }
            else {

                if (jsonData.gameList != null) {
                    returnData = JSON.parse(jsonData.gameList);
                    myFlexGames.push(returnData);
                }
            }
        }
    });
    return returnData;
}